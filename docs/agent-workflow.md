# Quy trình làm việc nhiều AI agent — LinguaLens

Cập nhật: 01/10/2026. Áp dụng cho Claude (Cowork + Claude Code), Codex, Antigravity và agent khác đọc AGENTS.md.

## 1. Vai trò (vai trò ≠ nhà cung cấp)

| Vai trò | Mặc định | Thay thế | Quyền | Đầu ra |
|---|---|---|---|---|
| Điều phối / kiến trúc | Claude | Codex | Đọc toàn repo; ghi `docs/`, `.agent-system/` | Spec, task YAML, tổng hợp |
| Thực thi logic & test | Codex | Claude Code | Ghi `allowed_paths`, worktree riêng | Commit trên nhánh task + handoff |
| Thực thi UI & kiểm tra trình duyệt | Antigravity | Claude Code + `npm run ui:snapshot` | Ghi `app/**`, `components/**` theo task | Commit + ảnh 375/1280 |
| Reviewer độc lập | Nhà cung cấp khác người viết | — | Chỉ đọc | `.agent-system/reviews/T###-<agent>.md` |
| Cổng kiểm tra | Script, không dùng LLM | — | Chạy lệnh | Pass/fail |
| Quyết định & merge | Chủ dự án | — | Merge vào `pilot-simple-login` | — |

Có 2 công cụ vẫn chạy được: một bên viết, bên kia review. Chỉ có 1 công cụ: dùng subagent `code-reviewer`
trong ngữ cảnh sạch thay cho reviewer khác hãng (yếu hơn, ghi rõ trong handoff).

## 2. Chọn đường theo độ phức tạp

| Mức | Ví dụ | Quy trình |
|---|---|---|
| Đơn giản | Đổi màu, sửa chữ, 1 file | 1 agent → `npm run check` → xong. Không cần task YAML. |
| Vừa | 1 component / 1 trang | Task YAML → worktree → code → acceptance → review chéo → sửa → merge |
| Phức tạp | Nhiều trang, đổi luồng, chạm dữ liệu | Spec ngắn trong `docs/plans/` → nhiều task có `depends_on` → song song theo worktree → review từng task → merge tuần tự |

Giới hạn: tối đa 2 vòng review cho một task; tối đa 3 agent ghi code song song.

## 3. Vòng đời task

```text
ready → claimed → running → verifying → reviewing → (changes_requested → running) → approved → merged
lỗi: blocked · failed · conflict · cancelled
```
- Chỉ chuyển `reviewing → approved` khi acceptance đạt VÀ reviewer không còn mục "Nghiêm trọng".
- Trạng thái ghi trong trường `status` của task YAML. Mỗi task chỉ một agent ghi file đó (single writer).

## 4. Worktree trên Windows (PowerShell)

Dùng script thay cho lệnh tay (chi tiết: `docs/agent-setup.md`): `new-task.ps1` tạo worktree + nhánh + database + cổng,
`review-task.ps1` chạy review chéo chỉ đọc (chặn tự review, tối đa 2 vòng), `finish-task.ps1` dọn sau khi merge,
`status.ps1` xem trạng thái. Lệnh tay tương đương:


```powershell
cd D:\WorkSpace\NCKH\Me\lingualens-lockfile-publish
git switch pilot-simple-login; git pull
git worktree add ..\ll-T002-codex -b agent/T002-codex
cd ..\ll-T002-codex; npm ci          # mỗi worktree cài node_modules riêng
# xong việc, sau khi merge:
git worktree remove ..\ll-T002-codex
```
Mỗi worktree dùng database file riêng (`TURSO_DATABASE_URL=file:T002.db`) và cổng dev riêng (8787, 8788, 8789…).

## 5. Giao tiếp giữa agent

Chỉ truyền: task YAML, diff/commit, handoff JSON, file review. Không chuyển nguyên transcript.
Handoff phải đủ để reviewer làm việc mà không cần hỏi lại (mẫu `.agent-system/handoffs/_template.json`).

## 6. Lệnh gọi agent khác (kiểm tra lại tài liệu chính thức trước khi dùng, CLI đổi nhanh)

| Mục đích | Lệnh |
|---|---|
| Codex review thay đổi chưa commit | `codex exec review --uncommitted` |
| Codex review so với nhánh gốc (trong Claude Code) | `/codex:review --base pilot-simple-login` |
| Codex làm một task không tương tác | `codex exec "Đọc .agent-system/tasks/T002.yaml và làm theo AGENTS.md"` |
| Claude không tương tác | `claude -p "Review theo .agents/skills/review-checklist/SKILL.md cho nhánh agent/T002-codex"` |
| Antigravity không tương tác | `agy -p "…" --output-format json` |

## 7. Ghi phiên bản công cụ khi bắt đầu dùng
Ghi vào bảng này để biết lệnh nào còn chạy:

| Công cụ | Phiên bản | Ngày kiểm |
|---|---|---|
| Claude Code | | |
| Codex CLI | | |
| Antigravity CLI | | |

## 8. Chưa dùng ở giai đoạn này
Router đa model (OmniRoute, claude-code-router), orchestrator tự động (Orkestra, oh-my-claudecode, agent-triforge),
plugin memory. Chỉ cân nhắc khi quy trình trên đã chạy ổn vài tuần; ghi quyết định vào `docs/decisions/`.
