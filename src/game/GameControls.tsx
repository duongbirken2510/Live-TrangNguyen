import { useEffect, useState } from 'react';
import { emitTest, sendControl } from '../live/page';
import { GAME } from './config';

const HO = ['Minh', 'Lan', 'Tuấn', 'Hoa', 'Long', 'Thảo', 'Nam', 'Vy', 'Khánh', 'An', 'Bình', 'Trang', 'Hùng', 'My', 'Phúc'];

/** Giả lập n người gõ đáp án trong vài giây (chỉ để thử, không cần live) */
function giaLap(n: number, trongMs: number) {
  for (let i = 0; i < n; i++) {
    const id = Math.floor(Math.random() * 100_000);
    setTimeout(() => {
      emitTest('chat', {
        username: `situ${id}`,
        nickname: `${HO[id % HO.length]}_${id % 1000}`,
        comment: 'ABCD'[Math.floor(Math.random() * 4)],
        createTime: Date.now() - 300 - Math.random() * 800, // trễ mạng giả
      });
    }, Math.random() * trongMs);
  }
}

/** Nút riêng của game trên trang điều khiển */
export function GameControls() {
  const btn = 'rounded-xl px-4 py-2 font-semibold';
  const [tieuDe, setTieuDe] = useState('');
  const [tenOngDo, setTenOngDo] = useState('');
  const [daLuu, setDaLuu] = useState('');
  const [stopAt, setStopAt] = useState<number | null>(null);
  const [remainSec, setRemainSec] = useState(0);

  useEffect(() => {
    fetch('/api/cai-dat').then((r) => r.json()).then((c) => {
      setTieuDe(c.tieuDe ?? '');
      setTenOngDo(c.tenOngDo ?? '');
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!stopAt) {
      setRemainSec(0);
      return;
    }
    const tick = () => {
      const left = Math.max(0, Math.ceil((stopAt - Date.now()) / 1000));
      setRemainSec(left);
      if (left <= 0) {
        setStopAt(null);
        void sendControl('custom', 'tatlive');
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [stopAt]);

  const fmtTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const luu = async () => {
    const r = await fetch('/api/cai-dat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tieuDe, tenOngDo }) });
    setDaLuu(r.ok ? 'Đã lưu, màn hình đổi ngay' : 'Lưu không được');
  };
  const o = 'w-full rounded-lg bg-black/40 px-3 py-2 text-white outline-none ring-1 ring-white/15 focus:ring-amber-400';
  return (
    <div className="space-y-3 rounded-2xl bg-white/5 p-4">
      <div className="font-bold text-amber-300">Ai Là Trạng Nguyên</div>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-sm text-white/70">
          Chữ trên mái tranh (tối đa 30 ký tự)
          <input className={o} value={tieuDe} maxLength={30} placeholder={GAME.tieuDeMacDinh} onChange={(e) => setTieuDe(e.target.value)} />
        </label>
        <label className="text-sm text-white/70">
          Tên ông đồ (bảng tên trên đầu)
          <input className={o} value={tenOngDo} maxLength={30} placeholder={GAME.tenOngDoMacDinh} onChange={(e) => setTenOngDo(e.target.value)} />
        </label>
      </div>
      <div className="flex items-center gap-3">
        <button className={`${btn} bg-emerald-700 text-white`} onClick={luu}>💾 Lưu tên</button>
        <span className="text-sm text-white/60">{daLuu || 'Để trống là dùng tên mặc định'}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          className={`${btn} bg-amber-600 text-white hover:bg-amber-500`}
          onClick={() => {
            setStopAt(null);
            void sendControl('custom', 'batdau');
          }}
        >
          ▶ Bắt đầu ván mới ngay
        </button>
        <button className={`${btn} bg-red-800 text-white hover:bg-red-700`} onClick={() => sendControl('custom', 'bocau')}>
          🚫 Bỏ câu này
        </button>
        <button
          className={`${btn} bg-rose-600 text-white ring-1 ring-rose-400/50 hover:bg-rose-500`}
          onClick={() => {
            setStopAt(null);
            void sendControl('custom', 'tatlive');
          }}
        >
          🛑 Tắt Live (Ông Đồ chào tạm biệt)
        </button>
      </div>
      <div className="rounded-xl bg-black/30 p-3 ring-1 ring-white/10">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-white/75">
          <span>⏰ Hẹn giờ tự động dừng game & Ông Đồ đọc lời chào tắt Live:</span>
          {stopAt ? (
            <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 font-bold text-rose-300">
              ⏳ Tự kết thúc sau {fmtTime(remainSec)}
            </span>
          ) : (
            <span className="text-white/40">Chưa hẹn giờ</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {[15, 30, 60, 90, 120].map((phut) => (
            <button
              key={phut}
              className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
              onClick={() => setStopAt(Date.now() + phut * 60_000)}
            >
              +{phut} phút
            </button>
          ))}
          {stopAt && (
            <button
              className="rounded-lg bg-rose-900/60 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-800"
              onClick={() => setStopAt(null)}
            >
              ✖ Hủy hẹn giờ
            </button>
          )}
        </div>
      </div>
      <div className="text-sm text-white/60">Chuyển nhanh kỳ thi (đổi bối cảnh sân thi):</div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {GAME.vong.map((v, i) => (
          <button
            key={i}
            className="rounded-xl bg-amber-500/15 px-3 py-2 text-xs font-bold text-amber-200 ring-1 ring-amber-400/30 hover:bg-amber-500/30"
            onClick={() => sendControl('custom', `vong:${i}`)}
          >
            Kỳ {i + 1}: {v.nhan}
          </button>
        ))}
      </div>
      <div className="text-sm text-white/60">Giả lập (bấm lúc đang hiện 4 đáp án):</div>
      <div className="flex flex-wrap gap-2">
        <button className={`${btn} bg-white/10 text-white`} onClick={() => giaLap(1, 500)}>1 người</button>
        <button className={`${btn} bg-white/10 text-white`} onClick={() => giaLap(60, 6000)}>60 người</button>
        <button className={`${btn} bg-white/10 text-white`} onClick={() => giaLap(500, 8000)}>500 người</button>
      </div>
    </div>
  );
}
