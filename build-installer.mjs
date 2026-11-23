/**
 * TRÌNH ĐÓNG GÓI BỘ CÀI ĐẶT .EXE 1-CLICK CHO AI LÀ TRẠNG NGUYÊN (LIVE-TRANGNGUYEN · Port 3007)
 * Xuất bản:
 *  1) Ai-La-Trang-Nguyen.exe                            --> File chạy trực tiếp không hiện CMD đen
 *  2) release/Ai-La-Trang-Nguyen-Setup-v1.0.exe         --> 1 FILE CÀI ĐẶT .EXE DUY NHẤT (nhúng sẵn Node.js + node_modules + dist + tạo icon Desktop)
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));
const RELEASE_ROOT = path.join(ROOT_DIR, 'release');
const STAGE_DIR = path.join(RELEASE_ROOT, 'Ai-La-Trang-Nguyen-Package');
const SETUP_EXE_PATH = path.join(RELEASE_ROOT, 'Ai-La-Trang-Nguyen-Setup-v1.0.exe');

function findCscExe() {
  const candidates = [
    'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe',
    'C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\csc.exe',
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error('Không tìm thấy trình biên dịch C# (csc.exe) của Windows .NET Framework.');
}

function copyDirectorySync(src, dest, exclude = new Set()) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      if (exclude.has(child)) continue;
      copyDirectorySync(path.join(src, child), path.join(dest, child), exclude);
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function compileAppLauncherExe(cscPath, outputExePath) {
  const csSource = `
using System;
using System.Diagnostics;
using System.IO;
using System.Net.Sockets;
using System.Threading;
using System.Windows.Forms;

class AiLaTrangNguyenLauncher
{
    static bool IsPortListening(int port)
    {
        try
        {
            using (TcpClient client = new TcpClient())
            {
                var result = client.BeginConnect("127.0.0.1", port, null, null);
                bool success = result.AsyncWaitHandle.WaitOne(TimeSpan.FromMilliseconds(350));
                if (!success) return false;
                client.EndConnect(result);
                return true;
            }
        }
        catch
        {
            return false;
        }
    }

    static string ResolveNodeExe(string appDir)
    {
        string bundledNode = Path.Combine(appDir, "runtime", "node.exe");
        if (File.Exists(bundledNode)) return bundledNode;
        string progNode = @"C:\\Program Files\\nodejs\\node.exe";
        if (File.Exists(progNode)) return progNode;
        return "node";
    }

    static void OpenAppWindow(string url)
    {
        string[] browserPaths = new string[]
        {
            @"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
            @"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
            @"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
            @"C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"
        };

        foreach (string bp in browserPaths)
        {
            if (File.Exists(bp))
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = bp,
                    Arguments = "--app=\\"" + url + "\\" --start-maximized",
                    UseShellExecute = true
                });
                return;
            }
        }

        Process.Start(new ProcessStartInfo
        {
            FileName = url,
            UseShellExecute = true
        });
    }

    [STAThread]
    static void Main()
    {
        string appDir = AppDomain.CurrentDomain.BaseDirectory;
        string serverTs = Path.Combine(appDir, "server.ts");
        string tsxCli = Path.Combine(appDir, "node_modules", "tsx", "dist", "cli.mjs");

        if (!File.Exists(serverTs))
        {
            MessageBox.Show("Không tìm thấy file server.ts tại: " + appDir, "Ai Là Trạng Nguyên - LIVE-TRANGNGUYEN", MessageBoxButtons.OK, MessageBoxIcon.Error);
            return;
        }

        if (!IsPortListening(3007))
        {
            string nodeExe = ResolveNodeExe(appDir);
            string args = File.Exists(tsxCli)
                ? "\\"" + tsxCli + "\\" \\"server.ts\\""
                : "\\"server.ts\\"";

            try
            {
                ProcessStartInfo psi = new ProcessStartInfo
                {
                    FileName = nodeExe,
                    Arguments = args,
                    WorkingDirectory = appDir,
                    CreateNoWindow = true,
                    UseShellExecute = false,
                    WindowStyle = ProcessWindowStyle.Hidden
                };
                psi.EnvironmentVariables["PORT"] = "3007";
                psi.EnvironmentVariables["NODE_ENV"] = "production";
                psi.EnvironmentVariables["LIVE_MODE"] = "1";
                Process.Start(psi);
            }
            catch (Exception ex)
            {
                MessageBox.Show("Không thể khởi động Node Runtime: " + ex.Message, "Ai Là Trạng Nguyên", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            for (int i = 0; i < 30; i++)
            {
                if (IsPortListening(3007)) break;
                Thread.Sleep(200);
            }
        }

        OpenAppWindow("http://localhost:3007");
    }
}
`;
  const tempCs = path.join(RELEASE_ROOT, '_TempTrangNguyenLauncher.cs');
  fs.writeFileSync(tempCs, csSource, 'utf8');
  execFileSync(cscPath, [
    '/target:winexe',
    '/optimize+',
    `/out:${outputExePath}`,
    '/r:System.dll',
    '/r:System.Windows.Forms.dll',
    tempCs,
  ]);
  fs.unlinkSync(tempCs);
}

function compileSetupStubExe(cscPath, outputStubPath) {
  const csSource = `
using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.IO.Compression;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Windows.Forms;

public class SubStream : Stream
{
    private readonly Stream _baseStream;
    private readonly long _baseOffset;
    private readonly long _length;
    private long _position;

    public SubStream(Stream baseStream, long baseOffset, long length)
    {
        _baseStream = baseStream;
        _baseOffset = baseOffset;
        _length = length;
        _position = 0;
        _baseStream.Seek(_baseOffset, SeekOrigin.Begin);
    }

    public override bool CanRead { get { return true; } }
    public override bool CanSeek { get { return true; } }
    public override bool CanWrite { get { return false; } }
    public override long Length { get { return _length; } }

    public override long Position
    {
        get { return _position; }
        set { Seek(value, SeekOrigin.Begin); }
    }

    public override void Flush() { }

    public override int Read(byte[] buffer, int offset, int count)
    {
        long remaining = _length - _position;
        if (remaining <= 0) return 0;
        if (count > remaining) count = (int)remaining;
        _baseStream.Seek(_baseOffset + _position, SeekOrigin.Begin);
        int read = _baseStream.Read(buffer, offset, count);
        _position += read;
        return read;
    }

    public override long Seek(long offset, SeekOrigin origin)
    {
        long newPos = _position;
        if (origin == SeekOrigin.Begin) newPos = offset;
        else if (origin == SeekOrigin.Current) newPos = _position + offset;
        else if (origin == SeekOrigin.End) newPos = _length + offset;

        if (newPos < 0) newPos = 0;
        if (newPos > _length) newPos = _length;
        _position = newPos;
        _baseStream.Seek(_baseOffset + _position, SeekOrigin.Begin);
        return _position;
    }

    public override void SetLength(long value) { throw new NotSupportedException(); }
    public override void Write(byte[] buffer, int offset, int count) { throw new NotSupportedException(); }
}

public class SetupForm : Form
{
    private Label lblTitle;
    private Label lblSub;
    private Label lblStatus;
    private ProgressBar progressBar;
    private Button btnInstall;
    private Button btnClose;
    private TextBox txtInstallPath;
    private CheckBox chkDesktopShortcut;
    private CheckBox chkLaunchNow;

    public SetupForm()
    {
        this.Text = "Cài Đặt Ai Là Trạng Nguyên (LIVE-TRANGNGUYEN v1.0) - Duong Birken";
        this.Size = new Size(585, 410);
        this.FormBorderStyle = FormBorderStyle.FixedDialog;
        this.MaximizeBox = false;
        this.StartPosition = FormStartPosition.CenterScreen;
        this.BackColor = Color.FromArgb(15, 23, 42);
        this.ForeColor = Color.White;
        this.Font = new Font("Segoe UI", 9.5f, FontStyle.Regular);

        lblTitle = new Label();
        lblTitle.Text = "📜 AI LÀ TRẠNG NGUYÊN — LIVE-TRANGNGUYEN v1.0";
        lblTitle.Font = new Font("Segoe UI", 14.5f, FontStyle.Bold);
        lblTitle.ForeColor = Color.FromArgb(251, 191, 36);
        lblTitle.Location = new Point(28, 20);
        lblTitle.Size = new Size(525, 34);
        this.Controls.Add(lblTitle);

        lblSub = new Label();
        lblSub.Text = "Game Show Khoa Cử Tương Tác TikTok LIVE 24/7 (~5.000 Câu Hỏi · 14 Chủ Đề · 31 Bàn Sĩ Tử)\\nTích hợp sẵn Node.js Runtime, Giọng Ông Đồ AI & Nhạc Ngũ Cung 0% Bản Quyền (Miễn Phí 0đ).";
        lblSub.Font = new Font("Segoe UI", 9.5f, FontStyle.Regular);
        lblSub.ForeColor = Color.FromArgb(203, 213, 225);
        lblSub.Location = new Point(30, 58);
        lblSub.Size = new Size(525, 44);
        this.Controls.Add(lblSub);

        Label lblDir = new Label();
        lblDir.Text = "Thư mục cài đặt trên máy của bạn:";
        lblDir.ForeColor = Color.FromArgb(148, 163, 184);
        lblDir.Location = new Point(30, 114);
        lblDir.Size = new Size(300, 20);
        this.Controls.Add(lblDir);

        string defaultDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Programs", "Ai-La-Trang-Nguyen");
        txtInstallPath = new TextBox();
        txtInstallPath.Text = defaultDir;
        txtInstallPath.BackColor = Color.FromArgb(30, 41, 59);
        txtInstallPath.ForeColor = Color.White;
        txtInstallPath.BorderStyle = BorderStyle.FixedSingle;
        txtInstallPath.Location = new Point(30, 136);
        txtInstallPath.Size = new Size(510, 26);
        this.Controls.Add(txtInstallPath);

        chkDesktopShortcut = new CheckBox();
        chkDesktopShortcut.Text = "Tạo biểu tượng 'Ai Là Trạng Nguyên - TikTok LIVE' ngoài màn hình Desktop";
        chkDesktopShortcut.Checked = true;
        chkDesktopShortcut.ForeColor = Color.FromArgb(226, 232, 240);
        chkDesktopShortcut.Location = new Point(30, 174);
        chkDesktopShortcut.Size = new Size(510, 24);
        this.Controls.Add(chkDesktopShortcut);

        chkLaunchNow = new CheckBox();
        chkLaunchNow.Text = "Mở ngay Ai Là Trạng Nguyên (Port 3007) sau khi cài đặt xong";
        chkLaunchNow.Checked = true;
        chkLaunchNow.ForeColor = Color.FromArgb(226, 232, 240);
        chkLaunchNow.Location = new Point(30, 200);
        chkLaunchNow.Size = new Size(510, 24);
        this.Controls.Add(chkLaunchNow);

        lblStatus = new Label();
        lblStatus.Text = "Sẵn sàng cài đặt (Đã nhúng sẵn toàn bộ thư viện, không cần cài Node.js).";
        lblStatus.ForeColor = Color.FromArgb(52, 211, 153);
        lblStatus.Location = new Point(30, 236);
        lblStatus.Size = new Size(510, 22);
        this.Controls.Add(lblStatus);

        progressBar = new ProgressBar();
        progressBar.Location = new Point(30, 262);
        progressBar.Size = new Size(510, 22);
        progressBar.Minimum = 0;
        progressBar.Maximum = 100;
        progressBar.Value = 0;
        this.Controls.Add(progressBar);

        btnInstall = new Button();
        btnInstall.Text = "🚀 CÀI ĐẶT NGAY (1-CLICK · 0Đ)";
        btnInstall.Font = new Font("Segoe UI", 10.5f, FontStyle.Bold);
        btnInstall.BackColor = Color.FromArgb(27, 94, 67);
        btnInstall.ForeColor = Color.White;
        btnInstall.FlatStyle = FlatStyle.Flat;
        btnInstall.FlatAppearance.BorderSize = 0;
        btnInstall.Location = new Point(30, 302);
        btnInstall.Size = new Size(385, 42);
        btnInstall.Cursor = Cursors.Hand;
        btnInstall.Click += BtnInstall_Click;
        this.Controls.Add(btnInstall);

        btnClose = new Button();
        btnClose.Text = "Đóng";
        btnClose.BackColor = Color.FromArgb(51, 65, 85);
        btnClose.ForeColor = Color.White;
        btnClose.FlatStyle = FlatStyle.Flat;
        btnClose.FlatAppearance.BorderSize = 0;
        btnClose.Location = new Point(425, 302);
        btnClose.Size = new Size(115, 42);
        btnClose.Cursor = Cursors.Hand;
        btnClose.Click += (s, e) => this.Close();
        this.Controls.Add(btnClose);
    }

    private void BtnInstall_Click(object sender, EventArgs e)
    {
        string targetDir = txtInstallPath.Text.Trim();
        if (string.IsNullOrEmpty(targetDir)) return;
        btnInstall.Enabled = false;
        txtInstallPath.Enabled = false;
        chkDesktopShortcut.Enabled = false;
        chkLaunchNow.Enabled = false;
        bool createShortcut = chkDesktopShortcut.Checked;
        bool launchAfter = chkLaunchNow.Checked;
        Thread worker = new Thread(() => RunInstallation(targetDir, createShortcut, launchAfter));
        worker.IsBackground = true;
        worker.Start();
    }

    private void UpdateUi(string status, int progress)
    {
        if (this.InvokeRequired)
        {
            this.BeginInvoke(new Action(() => UpdateUi(status, progress)));
            return;
        }
        lblStatus.Text = status;
        if (progress >= 0 && progress <= 100) progressBar.Value = progress;
    }

    private static void CreateShortcut(string shortcutPath, string targetExe, string workingDir, string description)
    {
        try
        {
            Type shellType = Type.GetTypeFromProgID("WScript.Shell");
            object shell = Activator.CreateInstance(shellType);
            object shortcut = shellType.InvokeMember("CreateShortcut", BindingFlags.InvokeMethod, null, shell, new object[] { shortcutPath });
            Type scType = shortcut.GetType();
            scType.InvokeMember("TargetPath", BindingFlags.SetProperty, null, shortcut, new object[] { targetExe });
            scType.InvokeMember("WorkingDirectory", BindingFlags.SetProperty, null, shortcut, new object[] { workingDir });
            scType.InvokeMember("Description", BindingFlags.SetProperty, null, shortcut, new object[] { description });
            scType.InvokeMember("IconLocation", BindingFlags.SetProperty, null, shortcut, new object[] { targetExe + ",0" });
            scType.InvokeMember("Save", BindingFlags.InvokeMethod, null, shortcut, null);
        }
        catch { }
    }

    private void RunInstallation(string targetDir, bool createShortcut, bool launchAfter)
    {
        try
        {
            UpdateUi("Đang giải nén bộ cài đặt...", 5);
            string selfExe = Application.ExecutablePath;
            using (FileStream fs = new FileStream(selfExe, FileMode.Open, FileAccess.Read, FileShare.Read))
            {
                fs.Seek(fs.Length - 24, SeekOrigin.Begin);
                byte[] footer = new byte[24];
                fs.Read(footer, 0, 24);
                long zipOffset = BitConverter.ToInt64(footer, 0);
                long zipLength = BitConverter.ToInt64(footer, 8);
                string magic = Encoding.ASCII.GetString(footer, 16, 8);
                if (magic != "TRANGNG1" || zipOffset <= 0 || zipLength <= 0)
                    throw new Exception("Không tìm thấy gói dữ liệu nén bên trong bộ cài đặt.");

                Directory.CreateDirectory(targetDir);
                using (SubStream sub = new SubStream(fs, zipOffset, zipLength))
                using (ZipArchive archive = new ZipArchive(sub, ZipArchiveMode.Read))
                {
                    int total = archive.Entries.Count;
                    int current = 0;
                    foreach (ZipArchiveEntry entry in archive.Entries)
                    {
                        current++;
                        int pct = (int)((current * 95L) / Math.Max(1, total));
                        if (current % 25 == 0 || current == total)
                            UpdateUi(string.Format("Đang cài đặt ({0}/{1}): {2}", current, total, entry.Name), pct);

                        string fullPath = Path.Combine(targetDir, entry.FullName.Replace('/', Path.DirectorySeparatorChar));
                        if (string.IsNullOrEmpty(entry.Name))
                        {
                            Directory.CreateDirectory(fullPath);
                            continue;
                        }
                        string parentDir = Path.GetDirectoryName(fullPath);
                        if (!string.IsNullOrEmpty(parentDir)) Directory.CreateDirectory(parentDir);
                        try
                        {
                            using (Stream inStream = entry.Open())
                            using (FileStream outStream = new FileStream(fullPath, FileMode.Create, FileAccess.Write, FileShare.ReadWrite))
                            {
                                inStream.CopyTo(outStream);
                            }
                        }
                        catch { if (!File.Exists(fullPath)) throw; }
                    }
                }
            }

            string launcherExe = Path.Combine(targetDir, "Ai-La-Trang-Nguyen.exe");
            if (createShortcut && File.Exists(launcherExe))
            {
                UpdateUi("Đang tạo biểu tượng ngoài màn hình Desktop...", 97);
                string desktopDir = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
                CreateShortcut(Path.Combine(desktopDir, "Ai Là Trạng Nguyên - TikTok LIVE.lnk"), launcherExe, targetDir, "Game Show Khoa Cử TikTok LIVE (Port 3007)");
            }

            UpdateUi("✅ Cài đặt hoàn tất 100%!", 100);
            if (launchAfter && File.Exists(launcherExe))
            {
                Process.Start(new ProcessStartInfo { FileName = launcherExe, WorkingDirectory = targetDir, UseShellExecute = true });
            }

            this.BeginInvoke(new Action(() =>
            {
                MessageBox.Show(
                    "🎉 Đã cài đặt thành công Ai Là Trạng Nguyên (v1.0)!\\n\\n" +
                    "👉 Link gắn vào TikTok LIVE Studio (1080x1920): http://lvh.me:3007/?view=stage",
                    "Cài Đặt Hoàn Tất",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Information
                );
                this.Close();
            }));
        }
        catch (Exception ex)
        {
            this.BeginInvoke(new Action(() =>
            {
                btnInstall.Enabled = true;
                UpdateUi("❌ Lỗi cài đặt: " + ex.Message, 0);
            }));
        }
    }

    [STAThread]
    public static void Main()
    {
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        Application.Run(new SetupForm());
    }
}
`;
  const tempCs = path.join(RELEASE_ROOT, '_TempTrangNguyenSetupStub.cs');
  fs.writeFileSync(tempCs, csSource, 'utf8');
  execFileSync(cscPath, [
    '/target:winexe',
    '/optimize+',
    `/out:${outputStubPath}`,
    '/r:System.dll',
    '/r:System.Drawing.dll',
    '/r:System.Windows.Forms.dll',
    '/r:System.IO.Compression.dll',
    '/r:System.IO.Compression.FileSystem.dll',
    tempCs,
  ]);
  fs.unlinkSync(tempCs);
}

function main() {
  console.log('  📜 ĐANG ĐÓNG GÓI BỘ CÀI ĐẶT .EXE 1-CLICK: AI LÀ TRẠNG NGUYÊN (Port 3007)');
  fs.mkdirSync(RELEASE_ROOT, { recursive: true });
  const cscPath = findCscExe();
  const rootLauncherExe = path.join(ROOT_DIR, 'Ai-La-Trang-Nguyen.exe');
  const payloadZipPath = path.join(RELEASE_ROOT, '_trangnguyen_payload.zip');

  if (!fs.existsSync(payloadZipPath) || fs.statSync(payloadZipPath).size < 1024 * 1024) {
    if (fs.existsSync(STAGE_DIR)) fs.rmSync(STAGE_DIR, { recursive: true, force: true });
    fs.mkdirSync(STAGE_DIR, { recursive: true });

    execSync('npm run build', { cwd: ROOT_DIR, stdio: 'inherit' });
    compileAppLauncherExe(cscPath, rootLauncherExe);
    fs.copyFileSync(rootLauncherExe, path.join(STAGE_DIR, 'Ai-La-Trang-Nguyen.exe'));

    for (const dirName of ['dist', 'public', 'src', 'node_modules']) {
      const srcPath = path.join(ROOT_DIR, dirName);
      if (fs.existsSync(srcPath)) {
        copyDirectorySync(srcPath, path.join(STAGE_DIR, dirName), new Set(['.vite', '.cache']));
      }
    }

    const systemNodeExe = process.execPath;
    if (systemNodeExe && fs.existsSync(systemNodeExe)) {
      const runtimeDir = path.join(STAGE_DIR, 'runtime');
      fs.mkdirSync(runtimeDir, { recursive: true });
      fs.copyFileSync(systemNodeExe, path.join(runtimeDir, 'node.exe'));
    }

    for (const file of ['server.ts', 'package.json', 'tsconfig.json', 'vite.config.ts', 'index.html', 'BAT-LIVE.bat', 'README.md']) {
      const src = path.join(ROOT_DIR, file);
      if (fs.existsSync(src)) fs.copyFileSync(src, path.join(STAGE_DIR, file));
    }

    if (fs.existsSync(payloadZipPath)) fs.unlinkSync(payloadZipPath);
    execSync(
      `powershell -NoProfile -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('${STAGE_DIR.replace(/'/g, "''")}', '${payloadZipPath.replace(/'/g, "''")}', [System.IO.Compression.CompressionLevel]::Optimal, $false)"`,
      { stdio: 'inherit' }
    );
  } else if (!fs.existsSync(rootLauncherExe)) {
    compileAppLauncherExe(cscPath, rootLauncherExe);
  }

  const stubExePath = path.join(RELEASE_ROOT, '_TrangNguyenSetupStub.exe');
  compileSetupStubExe(cscPath, stubExePath);

  const stubBuf = fs.readFileSync(stubExePath);
  const zipStat = fs.statSync(payloadZipPath);
  const footerBuf = Buffer.alloc(24);
  footerBuf.writeBigInt64LE(BigInt(stubBuf.length), 0);
  footerBuf.writeBigInt64LE(BigInt(zipStat.size), 8);
  footerBuf.write('TRANGNG1', 16, 8, 'ascii');

  const outFd = fs.openSync(SETUP_EXE_PATH, 'w');
  fs.writeSync(outFd, stubBuf);
  const zipFd = fs.openSync(payloadZipPath, 'r');
  const chunkBuf = Buffer.alloc(4 * 1024 * 1024);
  let bytesRead = 0;
  while ((bytesRead = fs.readSync(zipFd, chunkBuf, 0, chunkBuf.length, null)) > 0) {
    fs.writeSync(outFd, chunkBuf, 0, bytesRead);
  }
  fs.closeSync(zipFd);
  fs.writeSync(outFd, footerBuf);
  fs.closeSync(outFd);

  fs.unlinkSync(stubExePath);
  fs.unlinkSync(payloadZipPath);
  fs.rmSync(STAGE_DIR, { recursive: true, force: true });

  const finalSizeMb = (fs.statSync(SETUP_EXE_PATH).size / (1024 * 1024)).toFixed(2);
  console.log(`  🎉 HOÀN TẤT! File bộ cài .EXE: ${SETUP_EXE_PATH} (${finalSizeMb} MB)`);
}

main();
