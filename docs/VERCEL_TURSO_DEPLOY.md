# LinguaLens — Vercel + Turso cho 5 người thử

## Phạm vi

Chỉ người tổ chức cần tài khoản Vercel và Turso. Người thử mở link, nhập tên tài khoản và mật khẩu riêng, rồi học. Bản này không dùng đăng nhập Google, ChatGPT hay Cloudflare Access.

Hosting: Vercel Hobby cho dự án nghiên cứu phi thương mại. Dữ liệu: Turso Free. Không chọn Pro/Blaze hoặc bật trả phí theo mức sử dụng. Giữ Gemini API key trống. Hạn mức và chính sách cần xem tại https://vercel.com/pricing và https://turso.tech/pricing; gói miễn phí có giới hạn, không đảm bảo vận hành không giới hạn.

## 1. Tạo tài khoản (người tổ chức)

1. Mở https://vercel.com/signup, chọn Hobby/Personal và đăng ký bằng GitHub.
2. Mở https://app.turso.tech/, đăng ký bằng GitHub, chọn Free.
3. Khi cài GitHub App cho Vercel, chỉ cấp repository `namkhanh1207/lingualens-pilot` nếu giao diện cho phép chọn từng repo.

## 2. Tạo database Turso

Tạo database tên `lingualens-pilot`, dùng dịch vụ tương thích libSQL và URL `libsql://...` cho SDK `@libsql/client`. Chọn vùng gần người thử nếu có. Lấy Database URL và database token có quyền đọc/ghi (không dùng organization/platform token).

Lưu riêng vào `.env.local` trên máy (không gửi token trong chat):

```dotenv
TURSO_DATABASE_URL=libsql://URL_TU_DASHBOARD
TURSO_AUTH_TOKEN=TOKEN_RIENG
ADMIN_EMAILS=donamkhanh127@gmail.com
APP_ORIGIN=
```

Chạy tại thư mục có package.json:

```powershell
npm ci
npm run db:migrate
npm run pilot:accounts
```

Migration chạy một lần theo checksum, dùng giao dịch; chạy lại không xóa dữ liệu. Script tài khoản tạo `admin` và `pilot01` đến `pilot05`. Mỗi mật khẩu ngẫu nhiên khác nhau; bản rõ chỉ nằm trong file `.pilot-private/accounts-*.json` trên máy, database lưu bản băm scrypt. Chạy lại bỏ qua tài khoản đã có. Nếu một lệnh báo lỗi, không chia sẻ file mật khẩu của lần chạy đó trước khi xác nhận thành công.

## 3. Import dự án lên Vercel

- Repository: `namkhanh1207/lingualens-pilot`.
- Nhánh code: `pilot-simple-login` (không dùng main Cloudflare cũ). Chọn nhánh này làm Production Branch cho dự án Vercel trước khi đưa nhóm dùng.
- Root Directory: `./`, chính thư mục có package.json; không nhập đường dẫn trên máy Windows.
- Framework: Next.js. Install: `npm ci`. Build: `npm run build`. Output Directory để mặc định.
- Node.js: 22.x.
- Thêm `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `ADMIN_EMAILS` vào Environment Variables của Production. Không thêm tiền tố `NEXT_PUBLIC_`.
- Deploy lần đầu để có tên miền. Thêm `APP_ORIGIN=https://TEN_DU_AN.vercel.app` đúng link cuối cùng (không thêm `/`), sau đó Redeploy. Khi thiếu biến này, API đăng nhập production sẽ từ chối xử lý thay vì bỏ kiểm tra nguồn.
- Giữ `GEMINI_API_KEY` trống. Không đặt `AUTH_MODE=local-test` trên Vercel.

Không dùng SQLite file trên Vercel: filesystem serverless không phải nơi lưu dữ liệu bền. Code từ chối URL `file:` khi chạy trên Vercel.

Không chia sẻ database và tài khoản production cho deployment preview. Nếu cần preview, dùng database riêng và APP_ORIGIN đúng preview. Người thử không cần đăng nhập Vercel: kiểm tra cấu hình Deployment Protection của production trước khi phát link.

## 4. Kiểm tra trước khi mời nhóm

- Mở link bằng cửa sổ riêng tư: không được xem dữ liệu người khác khi chưa đăng nhập.
- Đăng nhập `pilot01`, làm một bài, lưu từ và gửi góp ý; tải lại vẫn còn dữ liệu.
- Đăng nhập `pilot02`: dữ liệu riêng của pilot01 không xuất hiện.
- Đăng nhập `admin`: xem phản hồi, xuất nghiên cứu; người học không có quyền này.
- Đăng xuất rồi mở lại trang riêng phải yêu cầu đăng nhập.
- Chỉ gửi từng người tài khoản của họ; không gửi cả file chứa tài khoản admin.

## 5. Quản lý tài khoản

Phiên kéo dài tối đa 7 ngày. Đăng xuất thu hồi phiên phía máy chủ. Mật khẩu sai bị giới hạn theo tài khoản và IP; hết cửa sổ 15 phút có thể thử lại. Không có đăng ký công khai hay email khôi phục tự động.

Để cấp lại mật khẩu một tài khoản:

```powershell
npm run pilot:reset -- pilot01
```

Mật khẩu mới được lưu trong `.pilot-private/reset-*.json`. Tất cả phiên cũ của tài khoản bị thu hồi; tiến trình học vẫn giữ nguyên. Có thể vô hiệu hóa tài khoản bằng `disabled=1` trong bảng `pilot_accounts`.

Email quản trị dùng để phân quyền phía server, không phải địa chỉ nhận OTP. Tài khoản học dùng email nội bộ `.invalid`, không gửi email ra ngoài. Xóa dữ liệu học trong giao diện không xóa thông tin đăng nhập; người tổ chức phải xóa tài khoản riêng khi kết thúc pilot nếu cần xóa toàn bộ thông tin.

## 6. Dữ liệu Cloudflare cũ và quay lại

Việc deploy nhánh này không tự sao chép dữ liệu D1. Database Turso mới bắt đầu trống. Chưa xóa hoặc chỉnh sửa database/website Cloudflare; nếu đã có dữ liệu thật cần giữ, xuất và đối chiếu trước khi chuyển người dùng. Tài khoản Access cũ và tài khoản pilot mới có mã khác nhau; không tự ghép người dùng bằng tên hiển thị.

Các file cấu hình Vinext/Wrangler còn lại là cấu hình lịch sử, không dùng để build nhánh mới. Nếu cần phục hồi Cloudflare, dùng commit `cfeb287`, không chạy lệnh Wrangler với code nhánh mới.

## 7. Kiểm thử

`npm run build`, `npm run typecheck`, `npm run test:unit`. CI chạy sáu suite học tập trên Next dev ở localhost với header giả lập, sau đó chạy `tests/pilot-auth.integration.mjs` trên Next production bằng cookie thật. Suite auth thử giả mạo header, chặn khác nguồn, quyền admin, phiên hết hạn/thu hồi, khóa tài khoản và giới hạn thử sai. Tất cả test ghi dữ liệu đều bị giới hạn vào localhost/database file; không chạy vào database của nhóm.

Migration mới được quản lý bằng các file SQL đánh số và `scripts/migrate-turso.mjs`. Các migration pilot viết tay sau snapshot Drizzle nên cần xem lại SQL do `db:generate` sinh ra trước khi áp dụng; tuyệt đối không chạy `drizzle-kit push` thẳng vào database nhóm.
