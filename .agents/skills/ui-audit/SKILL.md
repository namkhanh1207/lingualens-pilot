---
name: ui-audit
description: Kiểm toán UI/UX LinguaLens trên giao diện đang chạy — ảnh, luồng pilot, tiếp cận, chuyển động — và xuất danh sách vấn đề xếp hạng. Dùng ở giai đoạn kiểm toán hoặc trước một đợt cải thiện.
---
# Kiểm toán UI/UX

1. Chụp toàn bộ: `npm run ui:snapshot -- --label audit-<ngày>` và một lượt `--reduced-motion`.
2. Với mỗi trang × kích thước, đánh giá theo `docs/design/frontend-aesthetics.md`:
   phân cấp chữ, khoảng cách, màu (token), trạng thái rỗng/lỗi, vùng chạm, tràn ngang ở 375 px, độ tương phản.
3. Đi luồng pilot (đăng nhập → hồ sơ → đọc → gợi ý → trả lời → lưu từ → ôn → góp ý): đếm số thao tác, ghi chỗ vướng.
4. Tiếp cận: điều hướng bằng Tab, focus-visible, nhãn nút icon, đúng/sai không chỉ bằng màu.
5. Chuyển động: liệt kê animation đang có, cái nào thiếu bản reduced-motion, cái nào tự phát trong vùng đọc.
6. Xuất `docs/audit/ui-audit-<ngày>.md`: bảng (trang, kích thước, vấn đề, mức độ 1–3, nguyên tắc, đề xuất, ảnh)
   và mục "Đề xuất ưu tiên" xếp theo ảnh hưởng tới buổi pilot × công sức.
