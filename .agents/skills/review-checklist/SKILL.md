---
name: review-checklist
description: Checklist review chéo cho LinguaLens — phạm vi, vùng cấm, đúng đắn, tiếp cận, chuyển động, trung thực, test. Dùng khi review nhánh task của agent khác.
---
# Checklist review (chỉ đọc)

## Phạm vi
- [ ] Mọi file đổi khớp `allowed_paths` của task; không chạm vùng cấm trong AGENTS.md.
- [ ] Không thêm dependency khi task không cho phép; `package-lock.json` không đổi ngoài ý muốn.
- [ ] Không có bí mật, `.env`, file `.db`, dữ liệu `.pilot-private` trong diff.

## Đúng đắn
- [ ] Logic, trạng thái rỗng/đang tải/lỗi, điều kiện biên; không làm mất dữ liệu người học đang nhập.
- [ ] Không đổi hành vi đo lường, nhãn "kịch bản soạn sẵn / chưa kết nối API", sự kiện nghiên cứu.

## Giao diện
- [ ] Dùng token CSS (màu, motion), không mã màu/thời lượng viết cứng.
- [ ] Đúng/sai có icon hoặc chữ, không chỉ màu; focus-visible còn; vùng chạm ≥ 44 px trên mobile.
- [ ] Mọi animation tắt hẳn khi reduced-motion; không animation tự phát trong vùng đọc; không fade-slide-up hàng loạt.
- [ ] Ảnh before/after 375 + 1280 có trong handoff và khớp mô tả; không lỗi console mới.
- [ ] Phần minh họa vẫn có nhãn minh họa nhìn thấy được.

## Test
- [ ] Acceptance của task đã chạy và đạt (đối chiếu handoff `verification`).
- [ ] Không xóa/nới test; test đổi có lý do.

## Kết luận
Ghi `.agent-system/reviews/T###-<reviewer>.md`: Nghiêm trọng / Nên sửa / Gợi ý (file:dòng, vấn đề, đề xuất),
dòng cuối `APPROVED` hoặc `CHANGES_REQUESTED`.
