# Tham chiếu UI/UX & chuyển động — LinguaLens

Cập nhật 02/10/2026. Bản đầy đủ (kèm ảnh hiện trạng, sơ đồ ưu tiên, nguồn): tài liệu "LinguaLens — Tham chiếu & đề xuất
nâng cấp UI/UX, chuyển động" của chủ dự án. File này là bản rút gọn cho agent; đọc cùng `frontend-aesthetics.md`.

## Nguyên tắc: yên khi đọc, sống động khi đạt được
Chuyển động phản ứng với việc người học vừa làm (trả lời, lưu từ, chuyển trang, lật thẻ, xong buổi). Vùng đọc luôn yên.
Khoảnh khắc trọng tâm của app: màn hoàn thành buổi đọc (Peak-End).

## Con số chung (Emil Kowalski, NN/g)
- Nhấn nút 100–160 ms; popover/tooltip 125–200 ms; dropdown 150–250 ms; drawer/modal 200–500 ms; giao diện nói chung < 300 ms.
- Ease-out cho vào; ra nhanh hơn vào; không dùng ease-in; không scale từ 0 (bắt đầu 0.95 + opacity 0).
- Nhấn: `transform: scale(0.97)` ở `:active`. Hover chỉ trong `@media (hover: hover) and (pointer: fine)`.
- Thao tác lặp rất nhiều lần hoặc bằng bàn phím: không animate.
- Chỉ animate `transform`/`opacity`. Reduced motion: bỏ chuyển động, có thể giữ đổi màu/opacity.

## Sản phẩm tham chiếu → áp vào đâu
| Sản phẩm | Mượn | Màn hình |
|---|---|---|
| Duolingo (Rive state machine, mừng streak) | Nhân vật phản ứng đúng/sai, màn mừng hoàn thành | Câu hỏi, Companion, hoàn thành buổi |
| Brilliant | Lộ trình dạng nút nối đường; số chạy theo hoạt ảnh | Hành trình kỹ năng, Tổng quan |
| CapWords (ADA 2025 Delight) | Từ vựng như bộ sưu tập; vi hoạt ảnh khi chờ | Từ vựng, trạng thái tải |
| Readwise Reader | Bôi đen → popover hành động; phím tắt; chế độ tập trung | Reader |
| Linear | Ít nhiễu, tương phản rõ, token màu từ vài biến gốc | Khung app, design system |
| Material 3 Expressive | Nhấn mạnh MỘT hành động chính; spring | Mọi màn |
Không làm: chữ trên nền kính mờ (Liquid Glass), nền 3D/parallax/scroll-jacking trong màn học, confetti mỗi câu đúng,
streak dùng nỗi sợ mất, số liệu "trông như thật", cài thêm bộ component thứ hai cạnh shadcn, thư viện chuyển động thứ hai.

## Công cụ
| Công cụ | Trạng thái | Dùng cho |
|---|---|---|
| Motion (`motion/react`) | Đã cài | Layout animation, AnimatePresence, spring. Dùng `LazyMotion` + `m` (4,6 kb + 15 kb) thay `motion` (34 kb); `MotionConfig reducedMotion="user"` |
| React `<ViewTransition>` | Có sẵn (Next 16 App Router) | Chuyển trang: bọc đổi trang trong `startTransition`. Đọc `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md` |
| Vaul, Sonner, Embla, tw-animate-css | Đã cài | Drawer câu hỏi mobile, toast "Đã lưu từ", thẻ tổng kết trượt, vi tương tác CSS |
| NumberFlow (MIT) | Đề xuất thêm | Số liệu chạy (màn tổng kết, Tổng quan) |
| canvas-confetti (ISC) | Đề xuất thêm | Chỉ khi hoàn thành buổi; bật `disableForReducedMotion` |
| Rive (`rive-react`, MIT) | Để sau | Companion có state machine; cần file `.riv` |
Thư viện mới phải có quyết định trong `docs/decisions/` trước khi cài.

## Đề xuất (mã dùng trong task)
U1 khung app + tab bar mobile · U2 chuyển trang View Transitions · U3 Reader mobile (drawer câu hỏi, popover bôi đen) ·
U4 phản hồi đúng/sai · U5 màn hoàn thành buổi · U6 sắp lại Tổng quan ("Đọc tiếp" lên đầu) · U7 con đường kỹ năng ·
U8 thẻ từ vựng sưu tập + lật thẻ + phím 1–4 · U9 ảnh bìa Khám phá · U10 trạng thái Companion · U11 chất liệu "giấy & bút dạ quang"
+ chế độ tối · U12 tổng kết tuần (giai đoạn D) · U13 sơ đồ phát âm mượt · U14 skeleton tải.
Làm trước: U2, U4, U5, U6 (tác động cao, công sức nhỏ).

## Nguồn để agent tự tra
- Skill: github.com/emilkowalski/skills (MIT) — emil-design-eng, review-animations, find-animation-opportunities
- Mẫu: github.com/vercel-labs/react-view-transitions-demo
- Component tham khảo: magicui (MIT), motion-primitives (MIT), react-bits (MIT + Commons Clause — chỉ lấy ý tưởng)
- Cảm hứng chuyển động: 60fps.design (lọc Education); luồng màn hình: Mobbin
