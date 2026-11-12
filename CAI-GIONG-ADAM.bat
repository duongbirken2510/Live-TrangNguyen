@echo off
chcp 65001 >nul
title Cai dat Giong AI Adam Bua (VieNeu-TTS) - Ai La Trang Nguyen
cd /d "%~dp0"

echo ==============================================================
echo   CAI DAT GIONG DOC AI "ADAM BUA" ^& 25 GIONG VIET (VieNeu-TTS)
echo ==============================================================
echo.

where python >nul 2>nul
if errorlevel 1 (
    echo [LOI] May tinh chua cai Python!
    echo Vui long tai va cai Python 3.11 hoac 3.12 tai:
    echo   https://www.python.org/downloads/
    echo ^(Luu y: Nho tich chon "Add python.exe to PATH" luc cai dat^)
    echo.
    pause
    exit /b 1
)

if not exist "VieNeu-TTS\src\vieneu" (
    echo [1/4] Dang tai ma nguon VieNeu-TTS...
    where git >nul 2>nul
    if errorlevel 1 (
        echo [LOI] May chua cai Git. Dang tai ban ZIP tu GitHub...
        powershell -Command "Invoke-WebRequest -Uri 'https://github.com/pnnbao97/VieNeu-TTS/archive/refs/heads/main.zip' -OutFile 'vieneu.zip'; Expand-Archive -Path 'vieneu.zip' -DestinationPath '.' -Force; if (Test-Path 'VieNeu-TTS') { Remove-Item -Recurse -Force 'VieNeu-TTS' }; Rename-Item 'VieNeu-TTS-main' 'VieNeu-TTS'; Remove-Item 'vieneu.zip'"
    ) else (
        git clone --depth 1 https://github.com/pnnbao97/VieNeu-TTS.git VieNeu-TTS
    )
) else (
    echo [1/4] Da co thu muc VieNeu-TTS.
)

if not exist "VieNeu-TTS\.venv\Scripts\python.exe" (
    echo [2/4] Dang tao moi truong ao Python ^(VieNeu-TTS\.venv^)...
    python -m venv "VieNeu-TTS\.venv"
) else (
    echo [2/4] Da co moi truong ao VieNeu-TTS\.venv.
)

echo [3/4] Dang cai dat thu vien AI VieNeu-TTS ^(ONNX Runtime CPU^)...
"VieNeu-TTS\.venv\Scripts\python.exe" -m pip install --upgrade pip
"VieNeu-TTS\.venv\Scripts\python.exe" -m pip install -e "VieNeu-TTS" onnxruntime sea-g2p kaldi-native-fbank tokenizers huggingface_hub soundfile soxr librosa numpy

echo [4/4] Dang tai truoc model giong "Adam bua" ^(VieNeu-TTS v3 Turbo INT8 - ~250MB^)...
set VIENEU_PRECISION=int8
set VIENEU_WATERMARK=0
"VieNeu-TTS\.venv\Scripts\python.exe" -c "from vieneu import Vieneu; tts = Vieneu(mode='v3turbo', precision='int8'); list(tts.infer_stream('Xin chào các sĩ tử đến với Ai Là Trạng Nguyên.', voice='Adam bựa', apply_watermark=False)); print('\n=== CAI DAT THANH CONG GIONG ADAM BUA VA 25 GIONG VIET! ===')"

echo.
echo Hoan tat! Bay gio ban chi can bam dup BAT-LIVE.bat de chay game voi giong Adam bua.
pause
