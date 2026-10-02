@AGENTS.md

# Riêng cho Claude Code

- Luật chung nằm trong AGENTS.md (import ở trên). File này chỉ chứa phần riêng của Claude; không chép lại luật chung.
- Skill dùng chung nằm ở `.agents/skills/` (Codex và Antigravity đọc trực tiếp). Claude không đọc `.agents/`,
  nên `.claude/skills/` là bản copy sinh ra (gitignore) bởi `node scripts/sync-agent-skills.mjs`;
  `setup.ps1` và `new-task.ps1` tự chạy lệnh này.
- Subagent trong `.claude/agents/`: `code-reviewer` (chỉ đọc), `ui-auditor` (chỉ đọc + chụp ảnh), `test-runner`.
  Dùng subagent cho việc tách biệt để giữ ngữ cảnh chính gọn.
- Review chéo bằng Codex (nếu đã cài plugin `openai/codex-plugin-cc`): `/codex:review --base pilot-simple-login`.
  Không bật review gate tự động; tối đa 2 vòng.
- Việc nhiều file: dùng plan mode, ghi kế hoạch vào task YAML trước khi sửa.
- Trả lời người dùng bằng tiếng Việt; code, tên biến, commit message bằng tiếng Anh.
