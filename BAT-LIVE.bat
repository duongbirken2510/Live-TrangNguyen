@echo off
chcp 65001 >nul
cd /d "%~dp0"
if not exist node_modules (
  echo [1/2] Lan dau chay: dang cai thu vien Node.js, doi 1-2 phut...
  call npm install
)
if not exist "VieNeu-TTS\.venv\Scripts\python.exe" (
  where python >nul 2>nul
  if not errorlevel 1 (
    echo [2/2] Lan dau chay: dang cai dat moi truong giong doc AI "Adam bua" ^(VieNeu-TTS^)...
    python -m venv "VieNeu-TTS\.venv"
    "VieNeu-TTS\.venv\Scripts\python.exe" -m pip install --upgrade pip
    "VieNeu-TTS\.venv\Scripts\python.exe" -m pip install -e "VieNeu-TTS" onnxruntime sea-g2p kaldi-native-fbank tokenizers huggingface_hub soundfile soxr librosa numpy
  )
)
echo Dang bat game + giong doc AI VieNeu (Adam bua) tich hop ngam...
echo Dong cua so nay la tat toan bo game va giong doc.
echo Link cho TikTok LIVE Studio: http://lvh.me:3007/?view=stage  (1080 x 1920)
rem Che do live: trang stage khong tu tai lai khi sua code
set LIVE_MODE=1
set PORT=3007
start "" cmd /c "timeout /t 8 >nul & start http://localhost:3007"
npm run dev
pause
