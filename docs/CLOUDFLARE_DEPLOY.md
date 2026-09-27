# Triển khai LinguaLens trên Cloudflare riêng

Bản này dùng **Cloudflare Workers + D1 + Cloudflare Access**. Không triển khai như một website tĩnh trên Pages: ứng dụng cần máy chủ để lưu dữ liệu và phân quyền.

## GitHub và build

- Repository: `namkhanh1207/lingualens-pilot`, nhánh `main`.
- Root directory: `/` (thư mục có `package.json`).
- Node: 22.13 trở lên; dùng npm 10.9.2 để khớp môi trường đã kiểm chứng.
- Install: `npm ci`.
- Build: `npm run typecheck && npm run build`.
- Deploy: `npm run deploy` (dùng `dist/server/wrangler.json`).
- Worker: `lingualens-pilot`. Giữ tên trong dashboard khớp tên này.
- D1: `lingualens-db`, ID `70f36036-84a3-4fba-b7ba-c27e69feb30e`; hai tên binding tương thích `DB` và `LINGUALENS_DB` trỏ cùng DB. Đây là ID tài nguyên, không phải khóa bí mật.
- `keep_vars=true` giữ biến runtime đã đặt trên dashboard khi deploy. `AUTH_MODE` được source chốt về `cloudflare-access` khi build.

Không dùng `dist/client` làm toàn bộ ứng dụng: đó chỉ là tài nguyên tĩnh. Không chạy test tích hợp lên URL production.

## Đăng nhập và quyền quản trị

Đăng nhập ChatGPT của Sites không tự có trên `workers.dev` hoặc tên miền riêng. Bản này nhận JWT của **Cloudflare Access**, kiểm tra chữ ký RSA, issuer, audience, thời hạn và loại token. Header email tự gửi không được coi là chứng minh danh tính.

1. Trong Cloudflare, bật Access cho hostname Worker hoặc tạo self-hosted application bảo vệ **toàn bộ hostname**, bao gồm `/api/pilot`.
2. Chọn phương thức xác thực email One-time PIN hoặc nhà cung cấp danh tính đã có. Dùng chính sách cho nhóm pilot; nếu muốn mọi người có email xác thực vào được thì dùng chính sách Allow tương ứng, không dùng Bypass.
3. Đặt các biến runtime ở Worker > Settings > Variables and Secrets:

| Biến | Giá trị |
| --- | --- |
| `AUTH_MODE` | `cloudflare-access` |
| `ACCESS_TEAM_DOMAIN` | `https://<team>.cloudflareaccess.com` |
| `ACCESS_AUD` | Application Audience (AUD) của đúng Access application |
| `ADMIN_EMAILS` | `donamkhanh127@gmail.com` |
| `RESEARCHER_EMAILS`, `MODERATOR_EMAILS` | Để trống nếu chưa phân công |
| `GEMINI_API_KEY` | Chưa đặt: ứng dụng dùng nội dung soạn sẵn, không gọi API trả phí |

Team domain, AUD và email quản trị không phải secret đăng nhập; khóa Gemini/API token Cloudflare phải dùng cơ chế secret của Cloudflare, tuyệt đối không commit. Có thể cung cấp ba biến không bí mật `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`, `ADMIN_EMAILS` cho build nếu muốn quản lý qua CI; nếu đã quản lý runtime trên dashboard thì không cần lặp lại.

`AUTH_MODE=local-test` chỉ dùng trên máy, lắng nghe localhost. `AUTH_MODE=sites` chỉ dành cho proxy xác thực của Sites; **không đặt hai giá trị này trên Cloudflare riêng**. Bản build thông thường tự chọn `cloudflare-access`; khi thiếu cấu hình hoặc token sai, API riêng tư trả 401.

Danh tính Access khác danh tính ChatGPT/Sites: dữ liệu cũ không tự chuyển hoặc tự ghép theo email. Không chép dữ liệu nghiên cứu giữa hai hệ thống khi chưa có kế hoạch chuyển đổi và đối chiếu đồng ý.

## Migration D1

Với cơ sở dữ liệu mới/trống:

```sh
npm run db:migrate:remote
```

Với DB đã dùng, trước tiên kiểm tra danh sách bảng và lịch sử `d1_migrations`. Nếu Antigravity hoặc Sites đã tạo bảng bằng cách khác mà chưa có ledger Wrangler, không áp dụng lại toàn bộ SQL: đối chiếu schema và đánh dấu/bổ sung đúng migration còn thiếu. Lưu bản sao bằng D1 export trước thay đổi schema. Các migration hiện có không có lệnh xóa dữ liệu học.

## Kiểm tra trước khi gửi nhóm

- Mở bằng cửa sổ riêng tư: phải qua bước xác thực Access.
- Admin đăng nhập đúng email: thấy Nghiên cứu và Quản trị.
- Tài khoản học viên khác: không được đọc hoặc xuất dữ liệu của admin.
- Làm một câu, gửi lại, lưu từ, tải lại trang: dữ liệu vẫn còn.
- Gửi góp ý; admin thấy được góp ý.
- Thử đăng xuất, đăng nhập lại; kiểm tra trên điện thoại.
- Không công bố hoàn tất chỉ vì build xanh: cần kiểm tra đăng nhập và D1 trên URL thật.

## Chạy thử và test trên máy

```sh
npm ci
npm run typecheck
npm run test:unit
npm run build
npm run db:migrate:local
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js dev --config dist/server/wrangler.json --local --persist-to .wrangler/state --ip 127.0.0.1 --port 8787 --inspector-port 0 --var AUTH_MODE:local-test --var ADMIN_EMAILS:test-admin@sites.test
```

Trong terminal khác, chạy tuần tự `node tests/pilot.integration.mjs`, `phase1.integration.mjs`, `phase2.integration.mjs`, `phase4.integration.mjs`, `completion.integration.mjs`, `review.integration.mjs` (đều trong `tests/`). Các test tạo và xóa dữ liệu QA cục bộ.

`npm run dev` mở preview localhost với người dùng mô phỏng. Test chữ ký ở `tests/access-auth.test.mjs` dùng khóa RSA tạm trong bộ nhớ, không dùng thông tin đăng nhập thật.

Tham khảo chính thức: [xác minh JWT Access](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/), [Access cho Workers](https://developers.cloudflare.com/workers/configuration/cloudflare-access/).
