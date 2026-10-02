# LinguaLens AI — Remote pilot

Web học tiếng Anh dùng thử cho 5 người. Nhánh `pilot-simple-login` chạy Next.js trên Vercel và lưu dữ liệu SQLite trên Turso; mỗi người đăng nhập bằng tài khoản riêng được người tổ chức cấp.

**Hướng triển khai mới:** [Vercel + Turso và tài khoản thử](docs/VERCEL_TURSO_DEPLOY.md). Việc chuyển code không tự chuyển dữ liệu hoặc thay thế website Cloudflare cũ. [Kết quả rà soát trước khi chuyển](docs/CODE_REVIEW_2026-09-27.md).

Định hướng mở rộng mới nhất: [Đặc tả và kế hoạch tiếp nhận ngày 24/09/2026](docs/README.md). Bao gồm 135 yêu cầu sản phẩm, 8 yêu cầu Companion, đối chiếu pilot, thiết kế và danh mục repo tham khảo; không đồng nghĩa toàn bộ đã triển khai.

## Bắt đầu

1. Mở đường link triển khai và xác thực theo hướng dẫn đăng nhập của bản đang dùng.
2. Vào **Hồ sơ & riêng tư** để đặt biệt danh, mục tiêu và chọn có tham gia nghiên cứu hay không.
3. Đọc một bài, trả lời đủ 4 câu, xem dẫn chứng và hoàn thành buổi đọc.
4. Lưu từ vào sổ tay, ôn flashcard, thử hội thoại/phát âm.
5. Vào **Hỗ trợ & góp ý** để gửi đánh giá cuối buổi.

Quản trị dùng tài khoản đã được cấu hình ở ADMIN_EMAILS. Không có nút đổi vai trò dành cho người học.

## Chạy trên máy

Yêu cầu Node.js 22.13 trở lên. Sao chép `.env.example` thành `.env.local`; dùng `TURSO_DATABASE_URL=file:pilot-local.db` để dữ liệu thử chỉ nằm trên máy.

- `npm ci`: cài thư viện.
- `npm run db:migrate`: tạo/cập nhật bảng dữ liệu.
- `npm run pilot:accounts`: tạo 5 tài khoản học và 1 quản trị; thông tin riêng nằm trong `.pilot-private/` (không vào Git).
- `npm run dev`: chạy trên localhost:3000.
- `npm run build`: tạo bản Next.js triển khai Vercel.
- `npm run typecheck` và `npm run test:unit`: kiểm tra TypeScript, dữ liệu và xác thực.

Mặc định trên local cũng dùng đăng nhập thật. Chế độ giả lập header chỉ dành cho integration test trên localhost ở `NODE_ENV=development` và `AUTH_MODE=local-test`; production luôn từ chối header giả mạo.

## Trạng thái tính năng

Xem [bàn giao pilot và kịch bản cho 5 người](docs/product/pilot-handoff.md) để biết phạm vi hiện tại, kiểm chứng và những hạng mục còn lại. Bản xuất nghiên cứu hiện dùng schema `pilot-research-v3`.

Dữ liệu bài làm, từ vựng, bài đăng, hỗ trợ và phản hồi lưu thật trên cơ sở dữ liệu. Chưa cấu hình khóa API nên tutor/hội thoại mặc định dùng nội dung soạn sẵn và được ghi nhãn. Gaze là diễn tập camera/hiệu chỉnh; phát âm là sơ đồ giảng dạy và nhận dạng chữ, chưa có chấm điểm âm vị. Xem đầy đủ giới hạn và ma trận yêu cầu trong [IMPLEMENTATION.md](IMPLEMENTATION.md).

Không đưa mật khẩu, token Turso hoặc khóa AI vào frontend, mã nguồn hay Git. Cấu hình bí mật trên Vercel và `.env.local`. Giữ `GEMINI_API_KEY` trống để dùng bài tập soạn sẵn.

## Phase 1 về dữ liệu nghiên cứu

Đã thêm mã nghiên cứu bền, lịch sử từng lần trả lời/gợi ý và xuất đầy đủ có phân trang. Xem [phạm vi, chuyển đổi và kiểm chứng](docs/product/phase-1-data.md). Chạy thêm `node tests/phase1.integration.mjs` (32 kiểm tra) sau suite pilot, không chạy đồng thời hai suite.
