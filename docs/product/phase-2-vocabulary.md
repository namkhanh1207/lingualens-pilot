# Phase 2 — Đọc và từ vựng trong ngữ cảnh

Triển khai lát cắt R1-B, tiếp nối Phase 1. Ngày 25/09/2026.

## Đã có
- Chọn cụm từ trong một đoạn hoặc nhập bằng bàn phím; xác nhận nghĩa trước khi lưu.
- Thẻ giữ đoạn gốc, tiêu đề, số đoạn, buổi học và contentVersion. Máy chủ xác thực cụm từ thuộc đoạn trong phiên bản buổi học của chính tài khoản.
- Cùng từ khác nghĩa hoặc khác đoạn/phiên bản tạo thẻ riêng. Lưu lại cùng thẻ không đặt lại tiến độ.
- Ôn thẻ đến hạn, ôn thêm tự chọn, xem ngữ cảnh và mở buổi đọc gốc.
- Lịch sử ôn cá nhân, xuất đầy đủ qua xuất dữ liệu cá nhân. Xóa toàn bộ dữ liệu cá nhân xóa cả lịch sử; xóa riêng thẻ giữ lịch sử.
- Mã yêu cầu chống ghi trùng và kiểm tra số lần ôn trước cập nhật để ngăn hai tab ghi đè nhau. Thẻ cũ vẫn đọc/ôn được, không tự tạo ngữ cảnh giả.

## Hợp đồng và giới hạn
- Dùng records với kind vocab và vocab_review, khóa đã gồm owner/kind/id; không đổi schema hoặc migration cũ.
- Lịch pilot theo quy tắc 10 phút hoặc 1–60 ngày, chưa phải FSRS. Nghĩa nhập tay chưa được từ điển/AI kiểm chứng. Gemini vẫn chưa bật.
- Ngữ cảnh lưu nguyên đoạn, giới hạn cụm từ 80 ký tự. Chưa có tọa độ ký tự phân biệt hai lần xuất hiện trong cùng đoạn.
- Form ngữ cảnh hiện nằm trong trang đọc và dùng được trên màn hình nhỏ; sheet/popover nâng cao chưa nằm trong bản này.
- Lịch sử mới đầy đủ từ lần cập nhật này; không tái dựng lịch sử các thẻ cũ. Giao diện hiện 50 lần ôn mới nhất, xuất cá nhân lấy tất cả.
- Lịch sử ôn chưa đưa vào export nghiên cứu. Bootstrap vẫn tải records cá nhân đầy đủ, phù hợp pilot 5 người; cần phân trang khi mở rộng.
- Client giữ mã retry trong tab; sau reload đọc trạng thái máy chủ. API cũ không gửi requestId vẫn được hỗ trợ nhưng không có đảm bảo retry tương đương client mới.

## Kiểm chứng
- 43 kiểm tra pilot + 32 kiểm tra Phase 1 + 21 kiểm tra Phase 2: đạt.
- Kiểm tra Phase 2 bao gồm lưu trùng đồng thời, khác nghĩa, nguồn không hợp lệ, cách ly tài khoản, retry ôn, xung đột hai tab, xuất và xóa dữ liệu.
- TypeScript và build production đã kiểm tra; không phát sinh gọi API AI có phí.

## Thử nhanh
1. Mở một bài đọc, chọn cụm từ hoặc nhập vào form Lưu từ trong ngữ cảnh.
2. Nhập nghĩa, lưu, chuyển sang Từ vựng.
3. Lật thẻ, chọn mức nhớ, tải lại và kiểm tra lịch sử.
4. Mở sổ từ, chọn Mở ngữ cảnh gốc để quay về buổi đọc.
