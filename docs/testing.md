# Kiểm thử LinguaLens

Mọi lệnh chạy ở gốc repo. CI (`.github/workflows/check.yml`) là chuẩn cuối cùng; các lệnh dưới đây tái hiện CI trên máy.

## 1. Kiểm tra nhanh (mọi task)
```bash
npm run check        # typecheck + lint + unit (access-auth, companion, portable-db)
npm run build
```

## 2. Database và dev server cho test (chỉ dữ liệu giả, không dùng Turso thật)

Bash / WSL:
```bash
export TURSO_DATABASE_URL=file:local-test.db
npm run db:migrate
AUTH_MODE=local-test ADMIN_EMAILS=test-admin@sites.test npm run dev -- --hostname 127.0.0.1 --port 8787
```
PowerShell:
```powershell
$env:TURSO_DATABASE_URL = 'file:local-test.db'
npm run db:migrate
$env:AUTH_MODE = 'local-test'; $env:ADMIN_EMAILS = 'test-admin@sites.test'
npm run dev -- --hostname 127.0.0.1 --port 8787
```
`AUTH_MODE=local-test` chỉ có hiệu lực khi `NODE_ENV=development`, host là localhost và không chạy trên Vercel:
request mang header `oai-authenticated-user-id` + `oai-authenticated-user-email` được coi là đã đăng nhập.
Bản build production không bao giờ nhận header này.

## 3. Test tích hợp (dev server ở mục 2 phải đang chạy)
```bash
for s in pilot phase1 phase2 phase4 completion review; do node tests/$s.integration.mjs || break; done
```
Test chỉ được ghi vào `localhost`/`127.0.0.1` (script tự chặn). Đổi cổng bằng `PILOT_TEST_URL=http://127.0.0.1:8788`.

## 4. Test đăng nhập thật trên bản build production
```bash
export TURSO_DATABASE_URL=file:ci-auth.db ADMIN_EMAILS=test-admin@sites.test AUTH_MODE=local-test APP_ORIGIN=http://127.0.0.1:5182
npm run db:migrate && npm run build && npm run start -- --hostname 127.0.0.1 --port 5182 &
node tests/pilot-auth.integration.mjs
```

## 5. Ảnh giao diện (cổng kiểm tra cho task UI)
Dev server ở mục 2 đang chạy, rồi:
```bash
npm run ui:snapshot -- --label before-T002            # 15 trang × 375/1280 px
npm run ui:snapshot -- --label after-T002 --reduced-motion
npm run ui:snapshot -- --label quick --pages dashboard,reading --widths 375
```
Ảnh lưu ở `artifacts/ui-snapshots/<label>/` (đã gitignore). Script ghi `report.json` gồm lỗi console và
lỗi trang cho từng ảnh; lỗi console mới so với ảnh "before" là lý do trả task về.
Lần đầu trên máy: `npx playwright install chromium`.

## 6. Ghi kết quả vào handoff
Ghi đúng lệnh đã chạy và kết quả (số PASS, exit code). Không ghi "đã test" nếu không chạy.
