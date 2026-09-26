# Giao diện và chuyển động — căn cứ thiết kế

Nguồn: tài liệu nghiên cứu mục 6; thông số là đề xuất cần thử trên UI thật. Bổ sung Companion xem ../product/companion.md.

## 6. UI và chuyển động: áp dụng ở mức sản phẩm

### 6.1. Quy tắc thiết kế đề xuất

Các con số sau là điểm bắt đầu để thử, không phải chuẩn bắt buộc hay kết quả nghiên cứu:

- Một bảng token cho màu, khoảng cách, bo góc, typography; component từ nhiều repo phải quy về token này.
- Chuyển động thao tác nhỏ khoảng 120–200 ms; chuyển panel khoảng 180–280 ms rồi đánh giá thực tế.
- Thay đổi trạng thái cần hiểu được cả khi tắt chuyển động.
- Không dùng animation vòng lặp gây tranh chú ý trong vùng đọc; không tự cuộn làm mất vị trí đọc.
- Tôn trọng reduced motion, focus bàn phím và nhãn trạng thái; không truyền đạt đúng/sai chỉ bằng màu.
- Tải Rive/3D khi người dùng mở tính năng; giữ phương án tĩnh khi thiết bị hoặc trình duyệt không đáp ứng.

### 6.2. Bảng chức năng–giao diện–thư viện

| Trải nghiệm | Thành phần đề xuất | Công cụ | Bằng chứng nghiệm thu |
|---|---|---|---|
| Trang Hôm nay | Một nhiệm vụ chính, lịch ôn, tiếp tục phiên trước | shadcn + Motion | Tiếp tục đúng phiên sau tải lại; không chỉ hiển thị thẻ đẹp |
| Kho bài đọc | Bộ lọc, trạng thái đã đọc, bộ sưu tập | UI nền, học pattern Lute | Bộ lọc và vị trí điều hướng được giữ hợp lý |
| Tra từ tại chỗ | Popover/panel trên desktop, sheet trên mobile | UI nền + Motion | Không che đoạn đang học; đóng trả focus đúng |
| Ôn từ | Lật đáp án, tự đánh giá, lịch ôn | ts-fsrs + UI | Lịch cập nhật đúng, không tăng hai lần khi double click |
| Voice chat | Trạng thái mic, lượt nói, transcript, nút dừng | LiveKit hoặc Pipecat | Dừng thật, reconnect rõ, không còn thu mic khi kết thúc |
| Luyện nghe | Lặp đoạn, tốc độ, waveform | wavesurfer.js | Mốc thời gian đúng; vẫn dùng được bằng bàn phím |
| Bài viết | Editor, góp ý bên cạnh, chấp nhận/từ chối sửa | Tiptap | Góp ý không gắn nhầm đoạn sau khi bài thay đổi |
| Bạn đồng hành | Idle, listening, thinking, encouraging | Rive | Phản ứng từ trạng thái thật; cho phép tắt |
| Tổng kết | Thành quả có nguồn từ phiên học | UI nền + điểm nhấn Magic UI | Không tạo số liệu thành tích từ dữ liệu giả |
| Cấu âm 3D | Góc nhìn, play/pause, chú thích cơ quan | R3F | Có bản 2D thay thế và nội dung được chuyên môn duyệt |

### 6.3. Cách dùng kho design skills

UI UX Pro Max có thể giúp tạo phương án; các skill web/React của Vercel hỗ trợ review. Đầu vào cần gồm người dùng, nội dung thật, thao tác chính, trạng thái lỗi và token. Yêu cầu AI giải thích vì sao lựa chọn phù hợp với reader hoặc speaking room. Không dùng một mẫu landing page nhiều gradient cho toàn bộ màn hình học tập.

Một design review nên chỉ ra cụ thể: CTA cạnh tranh ở đâu, độ dài dòng có khó đọc không, trạng thái lưu có gây hiểu nhầm không, thao tác bằng bàn phím có bị kẹt không. “Đẹp hơn” cần được chuyển thành thay đổi quan sát được.

