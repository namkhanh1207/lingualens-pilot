# LinguaLens AI — Remote pilot

Web học tiếng Anh dùng thử cho 5 người. Bản Cloudflare riêng đăng nhập bằng Cloudflare Access; bản Sites cũ dùng ChatGPT. Chọn một bài đọc, lưu từ mới và gửi góp ý.

**Triển khai hiện tại:** [Hướng dẫn Cloudflare](docs/CLOUDFLARE_DEPLOY.md) · [Kết quả rà soát mã nguồn 27/09/2026](docs/CODE_REVIEW_2026-09-27.md).

Định hướng mở rộng mới nhất: [Đặc tả và kế hoạch tiếp nhận ngày 24/09/2026](docs/README.md). Bao gồm 135 yêu cầu sản phẩm, 8 yêu cầu Companion, đối chiếu pilot, thiết kế và danh mục repo tham khảo; không đồng nghĩa toàn bộ đã triển khai.

## Bắt đầu

1. Mở đường link triển khai và xác thực theo hướng dẫn đăng nhập của bản đang dùng.
2. Vào **Hồ sơ & riêng tư** để đặt biệt danh, mục tiêu và chọn có tham gia nghiên cứu hay không.
3. Đọc một bài, trả lời đủ 4 câu, xem dẫn chứng và hoàn thành buổi đọc.
4. Lưu từ vào sổ tay, ôn flashcard, thử hội thoại/phát âm.
5. Vào **Hỗ trợ & góp ý** để gửi đánh giá cuối buổi.

Quản trị dùng tài khoản đã được cấu hình ở ADMIN_EMAILS. Không có nút đổi vai trò dành cho người học.

## Chạy trên máy

Yêu cầu Node.js 22.13 trở lên. Cài thư viện từ package-lock.json, build, áp dụng migration local rồi chạy preview theo [IMPLEMENTATION.md](IMPLEMENTATION.md).

- `npm ci`: cài thư viện.
- `node scripts/run-framework.mjs build`: tạo bản triển khai.
- `node scripts/run-framework.mjs dev`: xem thử trên localhost:5173.
- `node node_modules/typescript/bin/tsc --noEmit`: kiểm tra TypeScript.
- `node tests/pilot.integration.mjs`: 43 kiểm tra trên built Worker localhost:8787 (xem cấu hình trong IMPLEMENTATION.md).

Trên local, đăng nhập được mô phỏng thành Seedy; đây không phải cơ chế đăng nhập của đường link triển khai.

## Trạng thái tính năng

Xem [bàn giao pilot và kịch bản cho 5 người](docs/product/pilot-handoff.md) để biết phạm vi hiện tại, kiểm chứng và những hạng mục còn lại. Bản xuất nghiên cứu hiện dùng schema `pilot-research-v3`.

Dữ liệu bài làm, từ vựng, bài đăng, hỗ trợ và phản hồi lưu thật trên cơ sở dữ liệu. Chưa cấu hình khóa API nên tutor/hội thoại mặc định dùng nội dung soạn sẵn và được ghi nhãn. Gaze là diễn tập camera/hiệu chỉnh; phát âm là sơ đồ giảng dạy và nhận dạng chữ, chưa có chấm điểm âm vị. Xem đầy đủ giới hạn và ma trận yêu cầu trong [IMPLEMENTATION.md](IMPLEMENTATION.md).

Không đưa khóa API vào frontend, mã nguồn hoặc Git. Runtime secrets của bản Cloudflare riêng được quản lý tại Cloudflare Workers; không dùng header ChatGPT làm đăng nhập trực tiếp.

## Phase 1 về dữ liệu nghiên cứu

Đã thêm mã nghiên cứu bền, lịch sử từng lần trả lời/gợi ý và xuất đầy đủ có phân trang. Xem [phạm vi, chuyển đổi và kiểm chứng](docs/product/phase-1-data.md). Chạy thêm `node tests/phase1.integration.mjs` (32 kiểm tra) sau suite pilot, không chạy đồng thời hai suite.
