# Cài đặt và dùng hệ thống nhiều agent — LinguaLens (Windows)

Cập nhật 02/10/2026. Quy trình và vai trò: `docs/agent-workflow.md`. Luật chung: `AGENTS.md`.

## 0. Cần có
- Windows 10/11, Git for Windows, Node.js 22.13+ (npm của máy có thể là 11; script tự dùng npm 10.9.2).
- Ít nhất 2 trong 3 tài khoản: Claude (gói có Claude Code), ChatGPT (Codex), Google (Antigravity).
- Chạy mọi lệnh dưới đây trong PowerShell, tại thư mục repo `D:\WorkSpace\NCKH\Me\lingualens-lockfile-publish`.

## 1. Đưa cấu hình agent vào nhánh gốc (một lần)
```powershell
git switch chore/agent-system
git push -u origin chore/agent-system        # đợi GitHub Actions "Pilot checks" xanh
git switch pilot-simple-login
git merge --no-ff chore/agent-system
git push
```

## 2. Chạy script cài đặt (một lần, ~5 phút)
Tắt dev server đang chạy (nếu có), rồi:
```powershell
powershell -ExecutionPolicy Bypass -File scripts\agents\setup.ps1 -Install
```
Script kiểm tra Git/Node; tìm `claude`, `codex`, `agy` và hỏi trước khi cài cái còn thiếu; chạy `npm ci`,
cài trình duyệt Playwright, đồng bộ skill, tạo database thử `local-test.db`, chạy `npm run check`;
ghi phiên bản công cụ vào `.agent-system/tool-versions.json`.

Nguồn lệnh cài: Claude Code `irm https://claude.ai/install.ps1 | iex`; Codex `npm install -g @openai/codex`;
Antigravity `irm https://antigravity.google/cli/install.ps1 | iex`. Kiểm tra lại tài liệu chính thức nếu lệnh lỗi.

## 3. Đăng nhập (một lần, cần bạn bấm trên trình duyệt)
| Công cụ | Lệnh | Ghi chú |
|---|---|---|
| Claude Code | `claude` | Đăng nhập; rồi trong Claude Code chạy 4 lệnh ở dưới |
| Codex | `codex login` | Dùng tài khoản ChatGPT |
| Antigravity | `agy` | Chọn Google OAuth, dán mã vào terminal |

Trong Claude Code, cài plugin Codex chính thức (để gọi `/codex:review`):
```text
/plugin marketplace add openai/codex-plugin-cc
/plugin install codex@openai-codex
/reload-plugins
/codex:setup
```
KHÔNG bật `--enable-review-gate` (README của plugin cảnh báo vòng lặp Claude/Codex làm cạn hạn mức).

Lỗi `'claude' is not recognized`: thêm `%USERPROFILE%\.local\bin` vào PATH người dùng rồi mở lại PowerShell.

## 4. Vòng làm việc cho mỗi task
```powershell
# a) Xem các task
powershell -ExecutionPolicy Bypass -File scripts\agents\status.ps1

# b) Giao task cho một agent: tạo worktree ..\ll-T001-codex, nhánh agent/T001-codex,
#    database riêng T001.db, cổng dev riêng, rồi in sẵn câu lệnh giao việc
powershell -ExecutionPolicy Bypass -File scripts\agents\new-task.ps1 -Task T001 -Agent codex -Start

# c) Agent làm xong (đã commit + ghi handoff) -> review chéo bởi agent KHÁC, chỉ đọc
powershell -ExecutionPolicy Bypass -File scripts\agents\review-task.ps1 -Task T001 -Reviewer claude
#    CHANGES_REQUESTED -> đưa câu lệnh script in ra cho agent đã làm, rồi review lại (tối đa 2 vòng)

# d) APPROVED -> bạn xem diff và merge
git switch pilot-simple-login
git diff pilot-simple-login...agent/T001-codex --stat
git merge --no-ff agent/T001-codex
npm run check
git push

# e) Dọn worktree và nhánh đã merge
powershell -ExecutionPolicy Bypass -File scripts\agents\finish-task.ps1 -Task T001
```

Script tự chặn những lỗi hay gặp: task chưa có trên nhánh gốc, một task hai worktree, agent tự review code của mình,
review quá 2 vòng, review khi agent chưa commit, xóa worktree chưa merge hoặc còn file đang sửa dở.

## 5. Chạy song song
Mỗi task một worktree nên 2–3 agent làm cùng lúc được, miễn là các task không sửa chung file (xem `allowed_paths`
và `depends_on`). Mỗi worktree có cổng dev riêng (8788, 8789…) và database riêng. Merge từng nhánh một,
chạy lại `npm run check` sau mỗi lần merge.

## 6. Chỉ có một công cụ?
Vẫn dùng được: agent đó làm task, rồi review bằng một phiên mới của chính nó:
`review-task.ps1 -Task T001 -Reviewer claude -AllowSameVendor`. Review này yếu hơn review khác hãng và được ghi chú trong file review.

## 7. Sự cố thường gặp
| Hiện tượng | Cách xử lý |
|---|---|
| `npm ci` báo EPERM/EBUSY | Tắt dev server và VS Code terminal đang giữ `node_modules`, chạy lại |
| Git báo `index.lock` tồn tại | Đảm bảo không còn lệnh git nào chạy, rồi xóa `.git\index.lock` |
| Script không chạy được vì ExecutionPolicy | Luôn gọi bằng `powershell -ExecutionPolicy Bypass -File …` |
| Sợ agent chạm database thật | Luôn giao task qua `new-task.ps1`: `.env.local` trong worktree chỉ trỏ tới file `T###.db`. Không cho agent làm việc trực tiếp trong thư mục repo chính |
