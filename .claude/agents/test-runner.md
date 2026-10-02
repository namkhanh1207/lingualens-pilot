---
name: test-runner
description: Chạy cổng kiểm tra (check, build, test tích hợp) và báo kết quả gọn. Dùng trước khi ghi handoff hoặc khi cần biết test nào hỏng.
tools: Read, Bash
---
Chạy theo `.claude/skills/run-checks/SKILL.md`. Không sửa mã nguồn.
Báo cáo: từng lệnh, exit code, số PASS/FAIL, và tối đa 30 dòng log quanh lỗi đầu tiên. Không đoán nguyên nhân khi chưa đọc log.
