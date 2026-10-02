---
name: ui-snapshot
description: Chụp ảnh 15 trang LinguaLens ở 375 và 1280 px để so trước/sau một thay đổi giao diện. Dùng cho mọi task UI.
---
# Ảnh trước/sau

1. Trước khi sửa: chạy dev server theo `docs/testing.md` mục 2, rồi
   `npm run ui:snapshot -- --label before-T### [--pages <các trang task chạm>]`.
2. Sau khi sửa: `npm run ui:snapshot -- --label after-T### [--pages …]` và thêm một lượt `--reduced-motion`.
3. Mở `artifacts/ui-snapshots/<label>/report.json`: so lỗi console/lỗi trang giữa before và after.
4. Xem từng cặp ảnh; ghi vào handoff `artifacts` đường dẫn thư mục ảnh và 1–3 dòng mô tả thay đổi nhìn thấy.

Ghi chú: ảnh nằm trong `artifacts/` (gitignore), không commit. Lần đầu: `npx playwright install chromium`.
Antigravity có thể kiểm tra thêm bằng trình duyệt tích hợp, nhưng ảnh từ script là bằng chứng chung cho reviewer.
