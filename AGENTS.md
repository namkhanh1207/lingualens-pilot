# AGENTS.md — LinguaLens

## Bối cảnh dự án
- Sản phẩm: LinguaLens — nền tảng học tiếng Anh (đọc hiểu có dẫn chứng, từ vựng theo
  ngữ cảnh, hành trình nghe-nói-viết, phát âm minh họa, người đồng hành, cộng đồng).
  Đang ở giai đoạn pilot bản 8 → nâng cấp UI/UX lên v9.
- Stack trên nhánh `pilot-simple-login`: React 19 + Next.js + TypeScript,
  deploy Vercel, SQLite qua Turso/libSQL. Bản Cloudflare cũ giữ ở commit cfeb287.
  Vai trò/quyền xác định phía máy chủ, đăng nhập bằng phiên cookie và tài khoản pilot.
- Cách viết style: **Tailwind CSS 4** (`@import "tailwindcss"`) + shadcn/ui
  (`vendor/shadcn-tailwind-4.13.0.css`) + tw-animate-css. CSS variable token khai
  báo tại `app/globals.css` trong `:root`.
- Animation: **Motion** (`motion/react`) — đã cài. GSAP cho scroll-linked ở
  `skill-path`. Không dùng Three.js trừ trang `#pronunciation` (lazy-load).

## Đọc tài liệu thẩm mỹ trước khi làm UI
Trước khi làm bất kỳ việc gì liên quan giao diện, đọc
`docs/design/frontend-aesthetics.md` nếu file đó tồn tại trong repo.

## Giới hạn bắt buộc cho MỌI task UI/animation
- Đây là task THUẦN GIAO DIỆN. Không sửa `app/api/pilot/route.ts`, `db/schema.ts`,
  `drizzle/`, `research-export.ts`, hoặc bất kỳ logic chấm điểm/chống trùng
  (requestId)/revision nào, trừ khi prompt yêu cầu rõ.
- Không đổi hành vi đo lường đã có (ví dụ audioPlayed, trạng thái đã mở transcript,
  nhãn "Đang dùng kịch bản soạn sẵn / Chưa kết nối API") — chỉ được làm cho các
  trạng thái đó *hiển thị đẹp hơn*, không che hoặc làm mất chúng.
- Trang Phòng phát âm (#pronunciation) và Phòng gaze (#eye) là mô hình minh họa —
  animation thêm vào không được tạo cảm giác hệ thống đang "đo" chính xác hơn
  thực tế đang có.

## Nguyên tắc thẩm mỹ (Anthropic Frontend Aesthetics Cookbook)
- Không dùng Inter/Roboto/Arial/system-ui mặc định cho phần hiển thị chính — font
  đã chọn: **Literata** (bài đọc/serif) + **DM Sans** (UI). Khai báo qua CSS custom
  property `--font-display` và `--font-body`. Không chọn lại Space Grotesk.
- Đúng MỘT bảng màu nhất quán khai báo bằng CSS variable (--color-*). Màu chủ đạo
  đã có: `--primary: #2855d9`. Màu nhấn sắc bổ sung: `--color-accent: #e8821a`.
  Không thêm gradient tím→xanh trang trí vô nghĩa.
- Chuyển động chỉ phục vụ: (a) phản hồi thao tác của người dùng (mở/đóng/xác nhận/
  đúng-sai), hoặc (b) MỘT khoảnh khắc trọng tâm mỗi màn hình. Không thêm hiệu ứng
  fade-slide-up hàng loạt cho mọi thẻ/section — đây là dấu hiệu "AI slop".
- MỌI animation phải tôn trọng `prefers-reduced-motion: reduce` — luôn có bản tắt
  hiệu ứng hoàn toàn (không chỉ làm chậm lại).
- Ưu tiên animate `transform`/`opacity`; màn hình đọc dài (Reader, Tutor, Voice)
  phải giữ animation nhẹ, không tự phát (auto-play) gây xao nhãng khi đang đọc/gõ.
- Giữ khả năng tiếp cận đã có: focus-visible rõ ràng, không dùng màu là tín hiệu
  DUY NHẤT cho đúng/sai (luôn kèm icon/text), contrast đạt WCAG AA, giữ nguyên các
  điều khiển bàn phím thay thế cho thao tác kéo-thả ở Companion.
- Trước khi báo một task UI là xong: tự chụp ảnh màn hình (dùng khả năng
  browser-in-loop của Antigravity) ở hai kích thước 375px và 1280px, đối chiếu với
  yêu cầu rồi mới báo hoàn thành.

## Motion tokens chuẩn (dùng chung toàn app)
```css
--motion-duration-fast:   150ms;
--motion-duration-normal: 300ms;
--motion-duration-slow:   500ms;
--motion-easing-default:  cubic-bezier(0.4, 0, 0.2, 1);
--motion-easing-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);
--motion-easing-out:      cubic-bezier(0, 0, 0.2, 1);
```

## Companion — 2 cơ chế PHẢI giữ nguyên
- `prefers-reduced-motion` đã xử lý trong `.companion-avatar` — không ghi đè.
- Dừng idle animation khi tab ẩn (`companion-shell.paused`) — không ghi đè.

## Quy ước làm việc
- Việc nhỏ (đổi 1 màu, 1 easing) → làm thẳng, không cần kế hoạch.
- Việc đụng >1 file hoặc thêm dependency mới → viết kế hoạch ngắn (những file sẽ
  sửa, thư viện sẽ thêm) trước khi code.
- Sau mỗi thay đổi: chạy `npm run build` và test tích hợp hiện có
  (`tests/*.integration.mjs`) — không được để bộ test tích hợp hiện tại bị fail vì
  lý do UI.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
