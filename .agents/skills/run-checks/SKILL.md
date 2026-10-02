---
name: run-checks
description: Chạy cổng kiểm tra tất định của LinguaLens (check, build, test tích hợp) và ghi kết quả. Dùng trước khi báo xong một task hoặc ghi handoff.
---
# Chạy cổng kiểm tra

1. `npm run check` — typecheck + lint + unit. Dừng nếu lỗi.
2. `npm run build`.
3. Nếu task chạm `app/**` hoặc `app/lib/**`: chạy test tích hợp theo `docs/testing.md` mục 2–3
   (dev server với `AUTH_MODE=local-test`, database file riêng của worktree).
4. Nếu task chạm đăng nhập/phiên: thêm `docs/testing.md` mục 4.
5. Ghi vào handoff `verification`: mỗi lệnh → `pass`/`fail` + số PASS hoặc exit code.

Quy tắc: không xóa, bỏ qua hay nới điều kiện test để cho qua. Nếu thay đổi hành vi mà test đang kiểm,
sửa test và ghi lý do trong handoff `decisions`.
