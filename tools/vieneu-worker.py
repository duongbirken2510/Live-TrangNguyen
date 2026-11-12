"""
Embedded VieNeu-TTS stdio worker for 'Ai Là Trạng Nguyên'.
Communicates with server.ts via binary frames on stdout (fd duplicated before redirecting stdout->stderr)
and JSON lines on stdin. Zero TCP ports required.
"""
from __future__ import annotations

import os
import sys

# Duplicate original stdout fd (1) for binary framing protocol, then redirect fd 1 -> stderr (fd 2)
# so no library print() or C++ stdout log can ever corrupt the binary stream.
_proto_fd = os.dup(1)
os.dup2(2, 1)
sys.stdout = sys.stderr
_proto_out = os.fdopen(_proto_fd, "wb", buffering=0)
_stdin = sys.stdin.buffer

import io
import json
import struct
import threading
import time
import wave
import numpy as np

os.environ.setdefault("HF_HUB_DISABLE_SYMLINKS_WARNING", "1")
os.environ.setdefault("VIENEU_PRECISION", "int8")
os.environ.setdefault("VIENEU_WATERMARK", "0")

# Nếu có sẵn thư mục model đóng gói offline (VieNeu-TTS/hf_cache) thì ưu tiên dùng ngay không cần tải mạng
_local_hf_cache = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "VieNeu-TTS", "hf_cache")
if os.path.isdir(_local_hf_cache):
    os.environ.setdefault("HF_HUB_CACHE", _local_hf_cache)

SAMPLE_RATE = 48_000
FRAME_READY = 1
FRAME_CHUNK = 2
FRAME_DONE = 3
FRAME_ERROR = 4

_write_lock = threading.Lock()


def send_frame(frame_type: int, req_id: int, payload: bytes = b"") -> None:
    header = struct.pack(">BII", frame_type, req_id, len(payload))
    with _write_lock:
        _proto_out.write(header)
        if payload:
            _proto_out.write(payload)


def make_wav_header(rate: int = SAMPLE_RATE) -> bytes:
    h = io.BytesIO()
    with wave.open(h, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.setnframes(0)
    b = bytearray(h.getvalue())
    struct.pack_into("<I", b, 4, 0xFFFFFFFF)
    struct.pack_into("<I", b, len(b) - 4, 0xFFFFFFFF)
    return bytes(b)


def pcm16(x: np.ndarray) -> bytes:
    return (np.asarray(x, dtype=np.float32) * 32767.0).clip(-32768, 32767).astype("<i2").tobytes()


def main() -> None:
    t0 = time.perf_counter()
    print("[VieNeu Worker] Đang nạp model VieNeu-TTS v3 Turbo (ONNX INT8)...", flush=True)
    from vieneu import Vieneu

    try:
        tts = Vieneu(
            mode="v3turbo",
            backend=os.environ.get("VIENEU_BACKEND", "auto"),
            device=os.environ.get("VIENEU_DEVICE", "auto"),
            precision=os.environ.get("VIENEU_PRECISION", "int8"),
        )
    except Exception:
        # Nếu bật HF_HUB_OFFLINE=1 mà thiếu cache thì thử tải lại có mạng
        os.environ.pop("HF_HUB_OFFLINE", None)
        tts = Vieneu(
            mode="v3turbo",
            backend=os.environ.get("VIENEU_BACKEND", "auto"),
            device=os.environ.get("VIENEU_DEVICE", "auto"),
            precision=os.environ.get("VIENEU_PRECISION", "int8"),
        )

    # Warm-up
    for _ in tts.infer_stream("Xin chào.", apply_watermark=False):
        pass

    voices = []
    for name, v in tts._preset_voices.items():
        voices.append({
            "id": name,
            "name": name,
            "description": v.get("description", ""),
            "gender": v.get("gender", ""),
        })

    elapsed = time.perf_counter() - t0
    print(f"[VieNeu Worker] ✅ Sẵn sàng sau {elapsed:.1f}s ({len(voices)} giọng đọc)", flush=True)
    send_frame(FRAME_READY, 0, json.dumps({"voices": voices}, ensure_ascii=False).encode("utf-8"))

    wav_hdr = make_wav_header(SAMPLE_RATE)

    for raw_line in _stdin:
        line = raw_line.strip()
        if not line:
            continue
        try:
            req = json.loads(line.decode("utf-8"))
            req_id = int(req.get("id", 0))
            text = str(req.get("text", "")).strip()
            voice = str(req.get("voice", "Adam bựa")).strip() or "Adam bựa"
        except Exception as e:
            print(f"[VieNeu Worker] Lỗi đọc JSON request: {e}", flush=True)
            continue

        if not text:
            send_frame(FRAME_DONE, req_id)
            continue

        try:
            first = True
            for chunk in tts.infer_stream(text, voice=voice, apply_watermark=False):
                pcm = pcm16(chunk)
                if not pcm:
                    continue
                if first:
                    send_frame(FRAME_CHUNK, req_id, wav_hdr + pcm)
                    first = False
                else:
                    send_frame(FRAME_CHUNK, req_id, pcm)
            if first:
                send_frame(FRAME_ERROR, req_id, "Không tạo được âm thanh".encode("utf-8"))
            else:
                send_frame(FRAME_DONE, req_id)
        except Exception as e:
            send_frame(FRAME_ERROR, req_id, str(e).encode("utf-8"))


if __name__ == "__main__":
    main()
