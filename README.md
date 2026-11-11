# 🏮 AI LÀ TRẠNG NGUYÊN — Live-TrangNguyen

<div align="center">
  <img src="ai-la-trang-nguyen.png" alt="Ai Là Trạng Nguyên — Game Show Khoa Cử Tương Tác TikTok LIVE" width="420" />
  <p><b>Game Show Đố Vui Khoa Cử Tương Tác Thời Gian Thực Dành Cho TikTok LIVE</b></p>
  <p>
    <i>Hành trình từ Trường Làng đến Sân Rồng Hoàng Cung · Tích hợp sẵn giọng đọc AI VieNeu-TTS ("Adam bựa" & 25 giọng Việt) · Chấm điểm chuẩn từng mili-giây</i>
  </p>
</div>

---

## 📖 Mục Lục

1. [Giới Thiệu Dự Án](#-1-giới-thiệu-dự-án)
2. [Hình Ảnh Minh Họa & 4 Bối Cảnh Khoa Cử](#-2-hình-ảnh-minh-họa--4-bối-cảnh-khoa-cử)
3. [Các Chức Năng Nổi Bật Của Dự Án](#-3-các-chức-năng-nổi-bật-của-dự-án)
4. [Quy Tắc Chơi, Cách Tính Điểm & Xếp Chỗ Ngồi](#-4-quy-tắc-chơi-cách-tính-điểm--xếp-chỗ-ngồi)
5. [Bảng Điều Khiển Dành Cho Chủ Kênh (Dashboard)](#-5-bảng-điều-khiển-dành-cho-chủ-kênh-dashboard)
6. [Hướng Dẫn Cài Đặt & Phát Trực Tiếp (TikTok LIVE Studio)](#-6-hướng-dẫn-cài-đặt--phát-trực-tiếp-tiktok-live-studio)
7. [Kiến Trúc Kỹ Thuật & Tự Tùy Chỉnh](#-7-kiến-trúc-kỹ-thuật--tự-tùy-chỉnh)
8. [Xử Lý Sự Cố Thường Gặp (FAQ)](#-8-xử-lý-sự-cố-thường-gặp-faq)

---

## 🎯 1. Giới Thiệu Dự Án

**Ai Là Trạng Nguyên (`Live-TrangNguyen`)** là nền tảng game show đố vui tương tác tự động 100% dành cho **TikTok LIVE**, lấy cảm hứng từ truyền thống khoa cử Việt Nam xưa.

Trên màn hình dọc chuẩn `1080 × 1920`, **Ông Đồ** cầm micro trực tiếp đọc câu hỏi, dẫn chuyện, trêu đùa khán giả, cảm ơn quà tặng và xướng tên vinh danh bằng giọng AI tự nhiên. Khán giả xem live tham gia thi tài chỉ bằng cách **gõ bình luận `A`, `B`, `C`, `D`**, chọn phe **Bắc - Trung - Nam**, hoặc **thả tim cứu trợ** ngay trên luồng phát trực tiếp.

Mỗi ván thi gồm **20 câu hỏi** đi qua **4 kỳ khoa cử** có bối cảnh kiến trúc, nhân vật và hiệu ứng thăng cấp dần từ mộc mạc đến uy nghiêm:
1. **Kỳ 1 — Khảo Hạch Trường Làng** *(Câu 1 – 5)*
2. **Kỳ 2 — Thi Hương** *(Câu 6 – 10)*
3. **Kỳ 3 — Thi Hội — Văn Miếu Quốc Tử Giám** *(Câu 11 – 15)*
4. **Kỳ 4 — Thi Đình — Sân Rồng Hoàng Cung** *(Câu 16 – 20)*

Kết thúc 20 câu, 3 sĩ tử xuất sắc nhất được sắc phong **Tam Khôi** (**Trạng Nguyên – Bảng Nhãn – Thám Hoa**) trong màn **Vinh Quy Bái Tổ** rợp pháo giấy và ghi danh vào **Bảng Vàng Tuần**.

---

## 🖼️ 2. Hình Ảnh Minh Họa & 4 Bối Cảnh Khoa Cử

### 🏛️ Bốn Cấp Độ Trường Thi (Giữ Nguyên 100% Tọa Độ Bảng Đen & 31 Bàn Sĩ Tử)

Giao diện sân thi tự động chuyển đổi mượt mà (crossfade) qua 4 cấp độ kiến trúc cổ truyền Việt Nam theo từng vòng thi, đi kèm sự thay đổi của hiệu ứng thiên nhiên và nhân vật trên sân:

| Kỳ 1: Khảo Hạch Trường Làng | Kỳ 2: Thi Hương | Kỳ 3: Thi Hội (Văn Miếu) | Kỳ 4: Thi Đình (Hoàng Cung) |
| :---: | :---: | :---: | :---: |
| <img src="public/assets/bg/nen2.jpg" width="210" alt="Kỳ 1 - Khảo Hạch Trường Làng" /> | <img src="public/assets/bg/nen-huong.jpg" width="210" alt="Kỳ 2 - Thi Hương" /> | <img src="public/assets/bg/nen-hoi.jpg" width="210" alt="Kỳ 3 - Thi Hội Văn Miếu" /> | <img src="public/assets/bg/nen-dinh.jpg" width="210" alt="Kỳ 4 - Thi Đình Hoàng Cung" /> |
| **Sân đất đầu làng**, mái tranh vách nứa, bàn gỗ mộc dưới gốc đa cổ thụ | **Trường thi hàng tổng**, sân gạch Bát Tràng đỏ, mái ngói âm dương, đèn lồng đỏ | **Văn Miếu Quốc Tử Giám**, sân đá xanh, thảm đỏ thêu kim tuyến, bàn gỗ gụ sơn son | **Sân Rồng Điện Thái Hòa**, mái ngói Hoàng Lưu Ly, rồng chầu thềm ngọc, bàn thếp vàng |
| 🍃 *Lá đa xanh rơi · 6 cụ già & dân làng ngồi xem · Trẻ mục đồng chạy nhảy* | 🍂 *Lá thu vàng rơi · 2 bậc trưởng lão quan sát · Sĩ tử áo dài khăn đóng đi thi* | 🌸 *Cánh hoa trạng nguyên bay · Sĩ tử nho sinh bước đi điềm đạm trên thảm đỏ* | ✨ *Kim diệp & đom đóm hoàng kim lấp lánh · Sân rồng tôn nghiêm* |

---

### 👨‍🏫 Hệ Thống Nhân Vật & Biểu Cảm Động Trên Sân Thi

| Quan Chủ Khảo (Ông Đồ) | Tam Khôi Vinh Quy (Nam & Nữ) | Sĩ Tử Dự Thi & Trẻ Làng |
| :---: | :---: | :---: |
| <img src="public/assets/nv/mc/vui.webp" height="130" alt="Ông Đồ Vui" /> <img src="public/assets/nv/mc/ngac-nhien.webp" height="130" alt="Ông Đồ Ngạc Nhiên" /> | <img src="public/assets/nv/top/trang-nam.webp" height="130" alt="Trạng Nguyên Nam" /> <img src="public/assets/nv/top/trang-nu.webp" height="130" alt="Trạng Nguyên Nữ" /> | <img src="public/assets/nv/lang/si-tu-nam.webp" height="120" alt="Sĩ Tử Nam" /> <img src="public/assets/nv/lang/si-tu-nu.webp" height="120" alt="Sĩ Tử Nữ" /> <img src="public/assets/nv/lang/tre-nam.webp" height="100" alt="Trẻ Làng" /> |
| **4 trạng thái cảm xúc:** Bình thường, Vui cười, Ngạc nhiên, Thở dài tiếc nuối theo kết quả từng câu | **Đủ bộ trang phục:** Trạng Nguyên, Bảng Nhãn, Thám Hoa cho cả **Nam** và **Nữ** | **31 bàn sĩ tử** quay lưng hướng lên bảng đen + nhân vật bước đi ở lối giữa |

---

## 🌟 3. Các Chức Năng Nổi Bật Của Dự Án

### 🎙️ 3.1. Nhúng Trực Tiếp AI Voice VieNeu-TTS ("Adam bựa" & 25 Giọng Việt)
- **Chạy gọn trong 1 cửa sổ duy nhất:** Dự án nhúng trực tiếp mô hình **VieNeu-TTS v3 Turbo (`onnx_int8`)** qua tiến trình con giao tiếp nhị phân `stdio` (`tools/vieneu-worker.py`), **không cần mở cửa sổ CMD thứ 2**, không chiếm cổng mạng (`8000`) và không xung đột với phần mềm khác trên máy.
- **Mặc định giọng "Adam bựa" + 25 giọng đọc chọn ngay trên Dashboard:** Hỗ trợ đổi nóng giữa 25 giọng AI tiếng Việt (Bắc / Trung / Nam, Nam / Nữ, giọng kể chuyện, giọng hài hước) hoặc chuyển sang giọng **Microsoft Edge (`vi-VN-NamMinhNeural`)** bất cứ lúc nào.
- **Kiến trúc 2 làn giọng đọc (Priority & Prefetch Queue):**
  - Tự động **tạo sẵn âm thanh (Prefetch)** cho đáp án trong lúc khán giả đang suy nghĩ và tạo sẵn đề câu tiếp theo ngay khi vừa công bố đáp án, giúp Ông Đồ đọc tức thì với độ trễ gần bằng `0`.
  - Làn đọc ưu tiên (`priority`) dành cho đề thi, hết giờ, công bố đáp án; làn phụ dành cho lời chào người mới và trêu đùa khán giả vào khoảng nghỉ.
  - Cơ chế **3 tầng dự phòng tự động**: `VieNeu-TTS (Local AI)` ➔ `Microsoft Edge TTS` ➔ `Google Translate TTS`, đảm bảo Ông Đồ không bao giờ bị mất tiếng giữa buổi live.

### 📚 3.2. Ngân Hàng Gần 5.000 Câu Hỏi 14 Chủ Đề + Sinh Toán Nhẩm Tự Động
- **14 chủ đề phong phú** trong `src/game/cau-hoi/*.txt`:
  1. *Lịch sử Việt Nam* (`lich-su-vn.txt`)
  2. *Địa lý Việt Nam & Thế giới* (`dia-ly.txt`)
  3. *Văn học Việt Nam* (`van-hoc.txt`)
  4. *Ca dao, tục ngữ & thành ngữ* (`ca-dao-tuc-ngu.txt`)
  5. *Khoa cử & Danh nhân* (`khoa-cu-danh-nhan.txt`)
  6. *Văn hóa & Ẩm thực* (`van-hoa-am-thuc.txt`)
  7. *Đố mẹo dân gian* (`do-meo.txt`)
  8. *Khoa học tự nhiên* (`khoa-hoc.txt`)
  9. *Động vật & Thực vật* (`dong-thuc-vat.txt`)
  10. *Sức khỏe & Đời sống* (`suc-khoe.txt`)
  11. *Phát minh & Công nghệ* (`phat-minh.txt`)
  12. *Nghệ thuật & Âm nhạc* (`nghe-thuat.txt`)
  13. *Thế giới muôn nơi* (`the-gioi.txt`)
  14. *Thể thao* (`the-thao.txt`)
- **Thuật toán chống lặp câu hỏi (`data/da-hoi.json`):** Ghi nhớ thời điểm từng câu hỏi đã xuất hiện qua các buổi live, luôn ưu tiên bốc những câu lâu chưa hỏi nhất.
- **Máy tự ra đề toán nhẩm (`sinhToan`):** Ở vị trí câu số 3 của mỗi kỳ thi, hệ thống tự động sinh câu toán nhẩm theo cấp độ khó tăng dần (cộng trừ 2 số ➔ nhân cộng ➔ hai phép nhân ➔ bình phương & chia lấy nguyên), không bao giờ trùng lặp.

### 🪑 3.3. Cơ Chế Xếp Chỗ Ngồi 31 Bàn Thi & Tự Động Lọc Người Rời Phòng
- **Vào bàn ngay lập tức:** Bất kỳ người xem nào **vào phòng** (`member`), **bình luận** (`chat`), **thả tim** (`like`), **tặng quà** (`gift`) hoặc **follow** kênh đều được hệ thống xếp vào 1 trong **31 bàn thi** trên sân (hoặc đi lại ở lối giữa nếu 31 bàn đã kín).
- **Quy tắc 1 — Tự động nhường ghế sau 5 câu treo máy (In-match Idle Eviction):**
  - Trong ván đang thi, nếu một người ngồi bàn đang có **`0 điểm`** mà suốt **5 câu hỏi liên tiếp** (~1 vòng thi / 3 phút) không trả lời câu nào và không tương tác (không bình luận, không thả tim, không tặng quà), hệ thống hiểu là họ đã lướt sang live khác và **tự động cho rời khỏi bàn** để nhường ghế cho người xem mới.
- **Quy tắc 2 — Dọn sạch bàn ghế khi bắt đầu ván mới ở Vòng 1 (Match Reset Cleanup):**
  - Ngay khi kết thúc màn Vinh Quy Bái Tổ và bước vào **Vòng 1 (Khảo Hạch Trường Làng)** của ván mới (hoặc khi chủ kênh bấm **▶ Bắt đầu ván mới ngay** / **Reset game**), hệ thống tự động gọi `xoaChoNgoi()` để làm trống toàn bộ 31 bàn và lối đi.
  - Những người đã thoát từ ván trước tự động biến mất; khán giả đang xem trực tiếp chỉ cần thả tim hoặc gõ 1 bình luận/đáp án là ngồi vào bàn mới ngay!

### ⚡ 3.4. Chấm Điểm Công Bằng Tuyệt Đối & Tương Tác Đa Chiều
- **Đồng bộ thời gian gốc từ máy chủ TikTok (`createTime` + `skew`):** Tốc độ trả lời được tính bằng dấu thời gian lúc khán giả bấm nút gửi trên ứng dụng TikTok (đã tự động bù độ lệch đồng hồ `skew`), giúp người xem mạng 4G yếu không bị thiệt thòi so với người mạng cáp quang.
- **Bảo vệ an toàn nội dung TikTok LIVE 100%:**
  - Bộ lọc từ cấm nhiều lớp (`src/live/bannedWords.ts`) tự động ẩn biệt danh nhạy cảm.
  - **Ông Đồ tuyệt đối không bao giờ đọc nguyên văn nội dung bình luận của người xem**, chỉ nhận diện chủ đề (than khó, khen dễ, chào hỏi, xin lời chúc thi cử/sức khỏe/tài lộc) để phản hồi bằng kho câu thoại chuẩn mực có sẵn.
- **Nhạc cụ dân tộc & Hiệu ứng âm thanh tự tổng hợp (`Web Audio API`):** Tự tạo tiếng đàn tranh ngũ cung, tiếng trống dồn 5 giây cuối, tiếng chiêng đồng công bố đáp án, pháo nổ Vinh Quy Bái Tổ trực tiếp bằng `AudioContext` (`src/game/sfx.ts`) — hoàn toàn **không dính bản quyền âm nhạc**.

---

## 📜 4. Quy Tắc Chơi, Cách Tính Điểm & Xếp Chỗ Ngồi

### 4.1. Cấu Trúc 4 Kỳ Khoa Cử Trong 1 Ván Thi (20 Câu)

Mỗi ván kéo dài khoảng **12 – 15 phút** qua **4 kỳ thi** liên hoàn. Điểm của sĩ tử được cộng dồn xuyên suốt cả 4 kỳ:

| Kỳ Thi | Số Câu | Thời Gian / Câu | Điểm Cơ Bản Tối Đa | Phạt Trả Lời Sai | Đặc Quyền & Sự Kiện Trong Kỳ |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Kỳ 1: Khảo Hạch Trường Làng** | Câu 1 – 5 *(5 câu)* | **15 giây** | **+100 điểm** *(tối thiểu +60)* | **−10 điểm** | Câu dễ & đố mẹo nhập môn; làm quen luật thi |
| **Kỳ 2: Thi Hương** | Câu 6 – 10 *(5 câu)* | **15 giây** | **+150 điểm** *(tối thiểu +90)* | **−20 điểm** | Độ khó trung bình; đổi sang trường thi hàng tổng |
| **Kỳ 3: Thi Hội** | Câu 11 – 15 *(5 câu)* | **18 giây** | **+220 điểm** *(tối thiểu +132)* | **−35 điểm** | Câu hỏi vận dụng tại Văn Miếu Quốc Tử Giám |
| **Kỳ 4: Thi Đình** | Câu 16 – 20 *(5 câu)* | **20 giây** | **+320 điểm** *(tối thiểu +192)* | **−50 điểm** | **Thả đủ 200 tim ❤️ cứu trợ cả phòng (loại 2 đáp án sai)** · **Câu 20 Nước Rút ×2 điểm!** |

> **📌 Lưu ý:** Điểm của mỗi sĩ tử không bao giờ bị trừ xuống dưới `0` (`Math.max(0, diem - tru)`).

---

### 4.2. Công Thức Tính Điểm Tốc Độ, Chuỗi Đúng & Câu Lật Kèo

1. **Điểm tốc độ trả lời đúng:**
   - Trả lời đúng ngay giây đầu tiên nhận **100% điểm tối đa của kỳ** (`D`).
   - Trả lời đúng ở giây cuối cùng vẫn nhận được **60% điểm tối đa** (`0.6 × D`).
   - Công thức chính xác trong [`src/game/thi.ts`](src/game/thi.ts):
     $$\text{Điểm câu} = \text{round}\!\left(D \times \left(1 - 0.4 \times \frac{\text{ms phản hồi}}{\text{Tổng thời gian câu}}\right)\right)$$
2. **Thưởng chuỗi trả lời đúng liên tiếp (`Streak 🔥`):**
   - Từ câu đúng liên tiếp thứ 2 trở đi, mỗi câu được cộng thêm **`+10 × (chuỗi − 1)`**, tối đa **`+50 điểm/câu`**.
   - Trả lời đúng từ 3 câu liên tiếp trở lên sẽ có biểu tượng ngọn lửa **🔥** cạnh bảng tên.
3. **Câu 20 cuối ván — Nước Rút Lật Kèo (`×2`):**
   - Ở câu thứ 20 (câu cuối cùng của kỳ Thi Đình), cả **điểm thưởng khi đúng** (tối đa lên tới **+640 điểm**) lẫn **điểm phạt khi sai** (**−100 điểm**) đều được **nhân đôi (`×2`)**, giúp các sĩ tử bám đuổi có cơ hội lật ngược thế cờ vào phút chót.

---

### 4.3. Bảng Lệnh Bình Luận Dành Cho Người Xem

Khán giả tham gia tương tác trực tiếp bằng khung chat và nút thả tim của TikTok:

| Thao Tác Của Người Xem | Cú Pháp Hợp Lệ | Tác Dụng Trong Game |
| :--- | :--- | :--- |
| **Chọn đáp án** | `A`, `b`, `C.`, `d)`, `đáp án A`, `chọn B`, `câu C` | Nộp bài thi cho câu đang hỏi. Mỗi câu chỉ tính **lần gõ hợp lệ đầu tiên** của mỗi người. |
| **Chọn phe 3 miền** | `Bắc`, `Trung`, `Nam` *(hoặc `miền Bắc`, `miền Trung`, `miền Nam`, `Bắc Bộ`, `Nam Bộ`)* | Gia nhập đội tuyển miền. Điểm mỗi câu trả lời đúng của bạn sẽ cộng thêm vào tổng điểm miền đó. |
| **Chọn nhân vật Nam / Nữ** | `trai`, `nam`, `con trai` hoặc `gái`, `nữ`, `con gái` | Đổi hình dáng nhân vật sĩ tử ngồi bàn và trang phục **Tam Khôi** lúc Vinh Quy Bái Tổ (nếu không gõ, hệ thống tự nhận diện thông minh qua tên). |
| **Thả tim cứu trợ (Thi Đình)** | Bấm thả tim ❤️ trên màn hình LIVE | Ở **Kỳ 4 (Thi Đình)**, khi cả phòng gom đủ **200 tim** trong một câu hỏi, Ông Đồ sẽ **gạch bỏ 2 đáp án sai (50/50)** cho toàn bộ trường thi. |
| **Trò chuyện & Xin lời chúc** | `khó quá`, `dễ ợt`, `chào ông đồ`, `haha`, hoặc xin chúc *thi cử, sức khỏe, tài lộc, tình duyên* | Ông Đồ tự động đối đáp, trêu lại vui vẻ hoặc đọc tặng một lời chúc may mắn vào khoảng nghỉ. |

> **⏳ Quy tắc chống lộ đề sớm:** Nếu người xem gõ `A/B/C/D` khi Ông Đồ **vẫn đang đọc đề** (4 ô đáp án chưa mở đồng hồ đếm ngược), bình luận đó chưa tính là nộp bài nhưng người xem vẫn được vào ngồi bàn và **không bị mất lượt** — chỉ cần gõ lại khi 4 đáp án hiện lên.

---

### 4.4. Quy Tắc Xếp Hạng, Bảng Vàng & Huy Hiệu Danh Dự

- **Thứ tự ưu tiên xếp hạng:**
  1. Tổng điểm cao hơn (`diem` giảm dần)
  2. Nếu bằng điểm: Tổng thời gian trả lời đúng ngắn hơn (`msDung` tăng dần)
  3. Nếu vẫn bằng nhau: Vào phòng thi sớm hơn (`vaoLuc` tăng dần)
- **Ưu tiên vị trí bàn ngồi trên sân:**
  - **31 sĩ tử dẫn đầu** được ngồi tại 31 bàn gỗ trên sân; những người điểm cao nhất được xếp ngồi **các dãy bàn trung tâm** (hình nhân vật to, bảng tên vàng rực, không bị giao diện TikTok che khuất).
  - **Top 1, Top 2, Top 3** đang có điểm trên sân được gắn vương miện **👑, 🥈, 🥉** ngay trên bảng tên đầu nhân vật.
- **Các huy hiệu danh dự trên Bảng Vàng:**
  - 🏆 **Đầu Bảng Vàng Tuần:** Người đang giữ tổng điểm tích lũy cao nhất trong tuần hiện tại (từ Thứ Hai đến Chủ Nhật).
  - 🎓 **Đương Kim Trạng Nguyên:** Người vừa đỗ Trạng Nguyên ở ván liền trước.
  - 🔥 **Chuỗi Thắng Liên Tiếp:** Đang trả lời đúng từ 3 câu liên tiếp trở lên.
  - 🔴 **B** / 🟡 **T** / 🟢 **N**: Huy hiệu đại diện cho sĩ tử thuộc phe **Miền Bắc – Miền Trung – Miền Nam**.

---

## 🎛️ 5. Bảng Điều Khiển Dành Cho Chủ Kênh (Dashboard)

Khi chạy game, trang điều khiển mở tại **`http://localhost:3007`** cung cấp đầy đủ công cụ quản lý phiên Live cùng màn hình xem trước thời gian thực (im lặng để không vọng tiếng):

- **Kết nối TikTok LIVE:** Nhập `username` TikTok (không cần `@`), bấm **Kết nối**. Hệ thống tự động nhớ tài khoản và tự động kết nối lại nếu mạng chập chờn.
- **Bộ chọn giọng đọc AI VieNeu-TTS (25 giọng) & Microsoft Edge:**
  - Hiển thị trạng thái nạp mô hình AI trực tiếp (`🟢 VieNeu AI sẵn sàng (Adam bựa)`).
  - Cho phép đổi nóng giữa **25 giọng AI VieNeu** hoặc chuyển sang giọng **Microsoft Edge (`NamMinh`)** chỉ bằng 1 cú nhấp chuột.
- **Tùy biến thương hiệu kênh:**
  - **Chữ trên mái tranh:** Thay đổi tiêu đề đại tự treo giữa mái trường thi (mặc định: `AI LÀ TRẠNG NGUYÊN`).
  - **Tên Ông Đồ:** Thay đổi bảng tên trên đầu nhân vật dẫn chương trình (mặc định: `Ông Đồ`).
  - **Tên kênh xưng hô:** Đổi tên kênh để Ông Đồ nhắc tới khi cảm ơn quà tặng, lượt follow và nhắc chia sẻ phiên live.
- **Điều khiển trực tiếp ván thi:**
  - `▶ Bắt đầu ván mới ngay`: Bỏ qua đếm ngược, dọn sạch bàn ghế cũ và bắt đầu ngay Câu 1/20.
  - `🚫 Bỏ câu này`: Bỏ qua ngay câu hỏi hiện tại (và đánh dấu không bao giờ hỏi lại câu đó nữa).
  - `Kỳ 1: KHẢO HẠCH` · `Kỳ 2: THI HƯƠNG` · `Kỳ 3: THI HỘI` · `Kỳ 4: THI ĐÌNH`: Chuyển nhanh tới bất kỳ kỳ thi nào để đổi bối cảnh sân thi ngay lập tức.
  - `Reset game`: Đưa phòng thi về trạng thái đếm ngược chờ ván mới và làm trống toàn bộ chỗ ngồi.
- **Bộ công cụ giả lập (Test khi chưa bật LIVE):**
  - Giả lập `1 người`, `60 người`, `500 người` trả lời câu hỏi cùng lúc, hoặc giả lập người vào phòng, thả tim, tặng Hoa hồng / Sư tử để kiểm tra hiệu ứng và âm thanh trước khi lên sóng.

---

## 🚀 6. Hướng Dẫn Cài Đặt & Phát Trực Tiếp (TikTok LIVE Studio)

### 6.1. Yêu Cầu Hệ Thống
- Hệ điều hành: **Windows 10 / Windows 11 (64-bit)**.
- **Node.js LTS** (khuyến nghị bản 20 trở lên — tải tại [nodejs.org](https://nodejs.org)).
- **Python 3.10 – 3.12** (nếu sử dụng bộ giọng AI local `VieNeu-TTS` nhúng sẵn trong thư mục `VieNeu-TTS/.venv`).
- Phần mềm **TikTok LIVE Studio** đã cấp quyền phát trực tiếp.

### 6.2. Khởi Chạy Chỉ Với 1 Cú Nhấp Đúp
1. Tải hoặc clone dự án về máy:
   ```bash
   git clone https://github.com/duongbirken2510/Live-TrangNguyen.git
   cd Live-TrangNguyen
   ```
2. Nhấp đúp vào file **`BAT-LIVE.bat`** ở thư mục gốc:
   - Lần đầu tiên chạy, script sẽ tự động kiểm tra và cài đặt `node_modules` nếu chưa có.
   - Server Express + Vite và tiến trình ngầm **VieNeu-TTS Worker** sẽ tự động khởi động trong **cùng một cửa sổ duy nhất**.
   - Sau vài giây, trình duyệt tự động mở Bảng điều khiển tại `http://localhost:3007`.

### 6.3. Đưa Màn Hình Game Lên TikTok LIVE Studio
1. Mở **TikTok LIVE Studio**, chọn khung hình **Dọc (9:16 — 1080 × 1920)**.
2. Bấm **Thêm nguồn (Add Source)** ➔ chọn **Liên kết (Link / Browser Source)**.
3. Nhập địa chỉ:
   ```text
   http://lvh.me:3007/?view=stage
   ```
   *(Lưu ý: Dùng tên miền `lvh.me` thay cho `localhost` vì TikTok LIVE Studio chặn từ khóa `localhost`; `lvh.me` luôn phân giải trực tiếp về `127.0.0.1` trên máy của bạn).*
4. Đặt độ phân giải nguồn là **`1080 × 1920`** và căn vừa khít khung hình live.
5. Bấm **Phát trực tiếp (Go LIVE)** trên TikTok LIVE Studio, sau đó quay lại trang `http://localhost:3007` bấm **Kết nối**.

---

## 🛠️ 7. Kiến Trúc Kỹ Thuật & Tự Tùy Chỉnh

### Cấu Trúc Thư Mục Chính
```text
LIVE-TRANGNGUYEN/
├── BAT-LIVE.bat                 # File khởi chạy tất cả trong 1 (Server + VieNeu AI Worker)
├── server.ts                    # Backend Express, kết nối TikTok LIVE, SSE, nhúng VieNeu stdio worker
├── tools/
│   ├── vieneu-worker.py         # Tiến trình Python chạy VieNeu-TTS v3 Turbo (ONNX INT8) qua đường ống nhị phân
│   ├── kiem-tra-cau-hoi.mjs     # Công cụ kiểm tra cú pháp và trùng lặp ngân hàng câu hỏi
│   ├── tach-nen.mjs             # Công cụ tách nền nhân vật Ông Đồ & Tam Khôi
│   └── cat-nhan-vat.mjs         # Công cụ cắt sprite nhân vật sân thi
├── public/assets/
│   ├── bg/                      # 4 ảnh nền 1080x1920: nen2.jpg, nen-huong.jpg, nen-hoi.jpg, nen-dinh.jpg
│   └── nv/                      # Sprite Ông Đồ (mc/), Tam Khôi (top/), Sĩ tử & Dân làng (lang/)
├── src/
│   ├── game/
│   │   ├── thi.ts               # Lõi máy trạng thái (State Machine) của kỳ thi, chấm điểm & xếp ghế
│   │   ├── thi.check.ts         # Bộ kiểm thử tự động (Unit Tests) cho toàn bộ luật chơi & chỗ ngồi
│   │   ├── GameStage.tsx        # Giao diện sân khấu 1080x1920, 4 bối cảnh, hiệu ứng lá/hoa/sao & nhân vật
│   │   ├── GameControls.tsx     # Các nút điều khiển chuyên biệt của game trên Dashboard
│   │   ├── useGame.ts           # Hook kết nối sự kiện TikTok LIVE với lõi KyThi & điều phối giọng đọc
│   │   ├── config.ts            # Toàn bộ cấu hình điểm số, thời gian, lời thoại Ông Đồ & menu quà tặng
│   │   ├── sfx.ts               # Bộ tổng hợp nhạc cụ dân tộc & hiệu ứng âm thanh bằng Web Audio API
│   │   └── cau-hoi/*.txt        # 14 file ngân hàng câu hỏi chia theo chủ đề và 5 cấp độ khó
│   └── live/
│       ├── Dashboard.tsx        # Giao diện trang điều khiển trung tâm & chọn 25 giọng VieNeu AI
│       ├── voice.ts             # Hàng đợi phát âm thanh 2 làn ưu tiên & cơ chế prefetch trước
│       └── bannedWords.ts       # Bộ lọc từ ngữ vi phạm tiêu chuẩn cộng đồng
└── data/                        # Lưu trữ tự động cài đặt kênh, câu hỏi đã dùng và Bảng Vàng Tuần
```

### Các Lệnh Kiểm Tra Dành Cho Lập Trình Viên
```bash
# Chạy server phát triển (kèm VieNeu-TTS Worker)
npm run dev

# Chạy bộ kiểm thử tự động lõi luật chơi & quy tắc xếp ghế
npx tsx src/game/thi.check.ts

# Kiểm tra ngân hàng gần 5.000 câu hỏi
node tools/kiem-tra-cau-hoi.mjs

# Kiểm tra kiểu dữ liệu TypeScript
npm run lint
```

---

## ❓ 8. Xử Lý Sự Cố Thường Gặp (FAQ)

- **Mở trang stage trên trình duyệt Chrome mà chưa nghe tiếng Ông Đồ?**
  - Trình duyệt Chrome chặn tự phát âm thanh cho tới khi bạn nhấp chuột 1 lần vào trang. Khi gắn vào **TikTok LIVE Studio**, âm thanh tự động phát ngay mà không cần nhấp.
- **Không kết nối được tài khoản TikTok?**
  - Hãy đảm bảo bạn đã bấm **Phát trực tiếp** trong TikTok LIVE Studio trước khi bấm nút **Kết nối** trên Dashboard. Nếu mất mạng tạm thời, server sẽ tự động kết nối lại sau mỗi `15s ➔ 30s ➔ 60s`.
- **Muốn thêm hoặc sửa câu hỏi thì làm thế nào?**
  - Mở bất kỳ file `.txt` nào trong `src/game/cau-hoi/` bằng Notepad. Mỗi dòng viết theo cú pháp:
    `Câu hỏi | ĐÁP ÁN ĐÚNG | Đáp án sai 1 | Đáp án sai 2 | Đáp án sai 3`
    (Đáp án đúng luôn đặt ở cột thứ 2; game sẽ tự động trộn ngẫu nhiên vị trí A, B, C, D khi lên hình).

---

## 📄 Giấy Phép & Liên Hệ

- Dự án được phát triển và nâng cấp bởi **Duong Birken** — [https://duongbirken.deta.vn](https://duongbirken.deta.vn)
- Kho mã nguồn: [https://github.com/duongbirken2510/Live-TrangNguyen](https://github.com/duongbirken2510/Live-TrangNguyen)
- Giấy phép mã nguồn: [MIT License](LICENSE).
