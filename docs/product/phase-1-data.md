# Phase 1 — Dữ liệu nghiên cứu đáng tin cậy

Phạm vi của lượt triển khai: R1-A trong kế hoạch tích hợp ngày 24/09/2026. Đây là phần dữ liệu nghiên cứu được chọn trong danh sách ưu tiên; chưa gồm R1-B lưu cụm từ/ngữ cảnh hoặc R1-C Companion.

## Thay đổi

- Mỗi tài khoản có mã nghiên cứu ngẫu nhiên và bền trong bảng ánh xạ riêng. Rút rồi đồng ý lại không đổi mã; xóa dữ liệu xóa ánh xạ. Mã không dựa trên thứ tự danh sách hoặc email.
- Buổi mới đóng băng nội dung bài đọc theo SHA-256. Bản snapshot dành cho client không chứa đáp án; snapshot máy chủ dùng cho chấm và xuất nghiên cứu có quyền.
- Mỗi lần gửi đáp án/mở gợi ý được ghi trong `learning_history`, đồng thời cập nhật kết quả gần nhất bằng transaction và so sánh trạng thái cũ. Không ghi đè lịch sử.
- `firstResults` chỉ tạo cho lần đầu của buổi mới có lịch sử đầy đủ. Ghi mức hint trước khi trả lời, việc đã có đáp án trước đó, số lần, skill, timestamp và contentVersion.
- Tổng quan tách đúng lần đầu chưa dùng trợ giúp khỏi kết quả luyện tập gần nhất. Đây là lần đầu trong buổi, không đảm bảo người học chưa từng thấy câu hỏi ở nơi khác.
- Gửi lại cùng request ID trả lại đúng phản hồi cũ; cùng ID nhưng nội dung khác bị từ chối. UI gộp yêu cầu trùng đang chạy, tự thử lại một lần khi lỗi mạng/server và giữ mã cho lần thử lại trong tab. Sau khi đóng/tải lại tab, bộ nhớ mã yêu cầu phía client không được giữ; người học cần kiểm tra kết quả đã tải trước khi chủ động gửi lại.
- Event hành vi có mã chống gửi trùng. Nhãn điều kiện mới là `shared-staged-hints`, tránh gọi dữ liệu của một cơ chế gợi ý chung là thử nghiệm thích ứng.
- Người học xem lịch sử buổi đọc của mình và xuất lịch sử cùng dữ liệu cá nhân. Khi xóa dữ liệu, ledger và ánh xạ nghiên cứu được xóa cùng dữ liệu liên quan.

## Xuất nghiên cứu v2

`GET /api/pilot?view=research&pageSize=100` yêu cầu quyền admin/researcher. Mỗi trang gồm participants, events, responses, history, experiments và contentVersions. `pagination` trả revision, offset, pageSize, totals, hasMore, nextCursor và complete. Cursor chỉ là con trỏ đã kiểm tra cấu trúc, không cấp quyền truy cập.

Mỗi trang được đọc trong một transaction. Trigger tăng revision khi dữ liệu liên quan thay đổi, gồm lựa chọn consent. Trang sau dùng revision cũ nhận HTTP 409 và phải bắt đầu lại; không âm thầm trộn dữ liệu hai thời điểm. Giao diện tải tất cả các trang, kiểm tra tổng số và kiểm tra revision lại trước khi hiển thị/tải JSON. Nút tải lấy bản mới thay vì dùng bản đang hiển thị có thể đã cũ.

Không còn cắt ngầm ở 500/5.000 bản ghi. Giao diện có ngưỡng bảo vệ 10.000 trang và báo lỗi nếu vượt; không tải file thiếu. Đây là giải pháp cho pilot nhỏ: dữ liệu thay đổi liên tục có thể khiến xuất bị hủy nhiều lần. Với quy mô lớn cần background export/snapshot có cơ chế thu hồi riêng.

Nội dung nghiên cứu không chứa tên, email, mã tài khoản gốc, câu trả lời tự do hoặc ghi chú. Thời gian/mã buổi vẫn có khả năng liên kết; dữ liệu chưa ẩn danh tuyệt đối. Bản đã tải không tự bị thu hồi khi người tham gia rút đồng ý sau đó. Lựa chọn đồng ý hiện tại tiếp tục quyết định dữ liệu buổi học được xuất; lịch sử học là dữ liệu vận hành riêng của người học kể cả khi không tham gia nghiên cứu.

## Dữ liệu cũ và chuyển đổi

Migration `0001_dashing_epoch.sql` tạo bảng; `0002_brief_the_hunter.sql` bổ sung unique key, ánh xạ ban đầu và revision triggers. Không sửa migration đã triển khai `0000_safe_blue_marvel.sql`.

Buổi cũ được giữ nguyên; không tạo giả các lần trả lời hay trợ giúp bị thiếu. Các thao tác mới trên buổi cũ được gắn `legacy-session-current-content`, `firstAttemptKnown=false`; snapshot lúc bắt đầu buổi cũ không thể khôi phục. Bản xuất ghi `legacy-history-incomplete`. Buổi mới ghi `since-start` và `versioned-session`.

Không tự nối P01/P02 trong các file xuất trước Phase 1 với mã ngẫu nhiên mới; thứ tự cũ không phải định danh bền. Khi phân tích cần giữ riêng đợt/phiên bản schema. Tự động backup/purge, nghiên cứu phân nhóm, mức tự tin và lựa chọn dẫn chứng của người học chưa thuộc phần đã hoàn thành.

## Kiểm chứng

- TypeScript và bản dựng Worker đạt.
- 43 kiểm tra hồi quy pilot đạt.
- 32 kiểm tra Phase 1 đạt: đồng thời, chống trùng, giữ lần đầu, history ownership, consent/rút/xóa, mã bền, export đủ trang/tổng, cursor và content version.
- Dry-run migration SQLite đạt: giữ nguyên session cũ, không tạo lịch sử giả, tạo mã bền và tăng revision khi đổi consent.
- Trình duyệt local: đăng nhập mô phỏng, bài mới, sai → sửa đúng, lịch sử hai lần riêng, reload khôi phục buổi và đáp án.
- Chưa kiểm thử đăng nhập bằng nhiều tài khoản ChatGPT thật, mobile/assistive technology hoặc tải lớn trong lượt này. Kiểm thử API dùng danh tính giả chỉ trên localhost; không tạo cơ chế bypass auth trên bản hosting.

## Cách kiểm tra lại

Chạy migration bổ sung trên database cục bộ trước khi chạy built Worker (README có lệnh khởi động). Sau đó:

```text
node node_modules/typescript/bin/tsc --noEmit
python tests/migration-phase1.py
node tests/pilot.integration.mjs
node tests/phase1.integration.mjs
```

Hai suite API phải chạy nối tiếp: bài kiểm tra consent/revision chủ động thay đổi dữ liệu và sẽ làm mất hiệu lực export của một suite chạy đồng thời. Dữ liệu test có mã riêng và được dọn cuối suite. Không trỏ suite tới production.
