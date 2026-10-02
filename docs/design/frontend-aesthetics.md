# Thẩm mỹ frontend — LinguaLens

Đọc trước mọi task giao diện. Diễn giải nguyên tắc của Anthropic Frontend Aesthetics Cookbook cho LinguaLens,
kết hợp `ui-motion.md`. Token cụ thể (số đo, thang chữ) sẽ chốt trong `design-system.md` sau đợt kiểm toán UI.

## Tinh thần
Một công cụ học tập yên tĩnh, rõ ràng, đáng tin — gần một cuốn sách in tốt hơn là một landing page SaaS.
Người học đọc lâu và gõ nhiều: giao diện phải nhường sự chú ý cho nội dung bài đọc và câu hỏi.

## Typography
- Bài đọc: Literata (`--font-reading`), cỡ ≥ 18 px trên desktop, line-height ~1.65, độ dài dòng 60–75 ký tự.
- Giao diện: DM Sans (`--font-body`). Phân cấp bằng cỡ + độ đậm, không bằng màu.
- Không dùng Inter, Roboto, Arial, system-ui làm font hiển thị chính; không Space Grotesk.

## Màu
- Một bảng màu duy nhất trong `:root` của `app/globals.css`. Không viết mã màu cứng trong component.
- Chủ đạo `--primary #2855d9`; nhấn ấm `--color-accent #e8821a` dùng tiết kiệm (một điểm nhấn mỗi màn hình).
- Phản hồi: `--color-success*`, `--color-error*` — luôn kèm icon và chữ ("Đúng", "Chưa đúng"), không chỉ màu.
- Không gradient tím→xanh trang trí, không nền "glassmorphism" vô cớ.

## Chuyển động
- Chỉ hai lý do: phản hồi thao tác (mở/đóng, xác nhận, đúng/sai, lật thẻ) hoặc một khoảnh khắc trọng tâm mỗi màn hình.
- Thời lượng: thao tác nhỏ 120–200 ms, chuyển panel 180–280 ms; dùng `--motion-duration-*`, `--motion-easing-*`.
- Animate `transform`/`opacity`. Không animation vòng lặp trong vùng đọc; không tự cuộn làm mất vị trí đọc.
- `prefers-reduced-motion: reduce` → tắt hẳn (trạng thái vẫn hiểu được khi không có chuyển động).
- Với Motion (`motion/react`): dùng `useReducedMotion()` hoặc `MotionConfig reducedMotion="user"`.

## Bố cục và nền
- Mobile 375 px là kích thước kiểm tra bắt buộc; vùng chạm ≥ 44 px; thao tác chính trong tầm ngón cái.
- Nền phẳng, phân vùng bằng khoảng trắng và đường viền nhẹ (`--border`), bóng đổ tối thiểu.
- Trạng thái rỗng, đang tải, lỗi phải được thiết kế, không để trang trắng.

## Dấu hiệu "AI slop" cần tránh
Fade-slide-up cho mọi thẻ; card lồng card; icon trang trí ở mọi tiêu đề; gradient chữ; badge "AI" lấp lánh;
nhiều màu nhấn cạnh tranh; số liệu giả trông như thật.

## Trung thực
Phần minh họa (phát âm, gaze, chấm điểm giả, hội thoại soạn sẵn) phải có nhãn minh họa nhìn thấy được.
Giao diện đẹp hơn không được làm người dùng tưởng hệ thống đo chính xác hơn thực tế.
