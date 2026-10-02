# .agent-system — trạng thái làm việc giữa các agent

| Thư mục | Nội dung | Ai ghi |
|---|---|---|
| `tasks/T###.yaml` | Một task: phạm vi, phụ thuộc, file được sửa, tiêu chí nghiệm thu, trạng thái | Điều phối tạo; agent đang làm cập nhật `status` |
| `handoffs/T###.json` | Kết quả có cấu trúc khi agent làm xong | Agent thực thi |
| `reviews/T###-<agent>.md` | Kết quả review chéo | Reviewer |

Quy tắc: một task một file (không dùng một TASKS.md chung), mỗi file chỉ một agent ghi tại một thời điểm.
Mẫu: `tasks/_template.yaml`, `handoffs/_template.json`. Quy trình đầy đủ: `docs/agent-workflow.md`.
