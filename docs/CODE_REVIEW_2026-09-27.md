# Rà soát chuẩn bị pilot Cloudflare — 27/09/2026

## Phạm vi

Rà soát mã ứng dụng React, API pilot, quyền truy cập, lưu dữ liệu D1, lịch sử học và xuất nghiên cứu, mô-đun từ vựng/kỹ năng, Companion, camera/micro, cấu hình build/deploy và dependency. Đây là rà soát kỹ thuật phục vụ pilot 5 người, không phải kiểm thử xâm nhập độc lập hoặc chứng nhận toàn bộ hệ thống không có lỗi.

## Vấn đề đã sửa

| Mức | Phát hiện | Bản sửa |
| --- | --- | --- |
| Cao | Header `oai-authenticated-user-*` chỉ đáng tin sau proxy Sites; Worker riêng có thể bị giả mạo danh tính và email quản trị | Mặc định xác minh JWT Cloudflare Access bằng `jose`; không fallback về header khi token sai/thiếu. Giới hạn chữ ký RS256, đúng issuer/AUD, token app có email/sub/exp/iat |
| Cao | Build có thể qua dù kiểm tra TypeScript lỗi do ép binding D1 sang `any` | Khai báo cả hai binding có kiểu `D1Database`, bỏ ép `any`; thêm lệnh typecheck |
| Vừa | Giao diện mới khóa tất cả câu đã nộp, mất chức năng gửi lại/gợi ý trong buổi đọc | Cho phép sửa và gửi lại trước khi hoàn thành; giữ kết quả/lịch sử lần đầu và nhãn đúng/sai |
| Vừa | Hai tab bắt đầu cùng bài có thể tạo hai buổi chưa hoàn thành | INSERT có điều kiện nguyên tử trong D1; các request đồng thời lấy cùng một phiên |
| Cao với triển khai | Cấu hình Vite ghép mảng D1 với wrangler.toml gây lặp binding | Gán cấu hình mảng thay vì nối mảng; kiểm tra cấu hình build chỉ có hai tên binding duy nhất |
| Vừa | `baseline-browser-mapping` gián tiếp có cảnh báo DoS từ npm | Cập nhật riêng package này; không nâng hàng loạt framework |
| Vận hành | Thiếu quy trình Cloudflare riêng, nguy cơ dùng nhầm Sites login/migration | Tài liệu triển khai, scripts migration/deploy, pipeline CI; bỏ file credential local/backup Git khỏi phạm vi theo dõi |

Lockfile npm 10/Linux được sửa trong commit trước (`b9e592b`); lần rà soát này giữ thay đổi đó và bổ sung dependency xác thực.

## Bằng chứng kiểm tra cục bộ

- TypeScript: `npm run typecheck` qua.
- Build Worker: `npm run build` qua.
- API tích hợp: pilot 43 + phase 1 32 + phase 2 21 + phase 4 22 + completion 9 = **127 kiểm tra** qua.
- Regression: 6 request khởi tạo bài đọc đồng thời trả cùng ID; bản xuất chỉ có một phiên.
- Xác thực: **19 kiểm tra RSA/JWT** qua, gồm sai khóa, sai audience/issuer, hết hạn, chưa đến hạn, thiếu claims, token không chữ ký và thiếu cấu hình.
- Built Worker với cấu hình production mặc định: header Sites giả admin, JWT giả và không token đều trả 401; danh mục bài đọc công khai trả 200.
- Migration: kiểm tra bảo toàn phiên cũ, backfill mã nghiên cứu và revision qua; áp dụng đủ 4 migration trên D1 local mới thành công.
- Companion: lưu vị trí, giới hạn viewport, docking và hướng dẫn qua.
- `npm audit --omit=dev`: 0 lỗ hổng được npm báo tại lần kiểm tra; không đồng nghĩa kiểm toán mọi dependency build.
- Browser: thực hiện sai → sửa → nộp lại trên preview; chụp và kiểm tra 1280px/375px. Câu hỏi và phản hồi không tràn ngang ở hai kích thước này.

## Còn hạn chế và việc cần theo dõi

1. **Host thực tế:** chưa xác nhận đăng nhập Access, biến runtime và schema D1 trên tài khoản Cloudflare của chủ dự án. Cần dashboard/URL và phiên đăng nhập hợp lệ để hoàn tất. Không coi bản build local là bản production đã hoạt động.
2. **Chuyển danh tính:** Access tạo tài khoản riêng; chưa chuyển dữ liệu Sites. Phải thông báo cho nhóm khi bắt đầu pilot mới.
3. **Đồng thời ở hội thoại/ghi chú:** lịch sử chat hiện đọc–ghi cả object; gửi cùng một hội thoại từ nhiều tab có thể ghi đè. Ghi chú cùng phiên là lần lưu sau thắng. Các phép đo câu trả lời/từ vựng/kỹ năng đã có cơ chế revision/idempotency riêng. Pilot nên dùng một tab cho một tài khoản; cần CAS/revision cho chat và ghi chú trước triển khai rộng.
4. **Tự động lưu:** có khoảng thời gian request đang bay; đóng tab/thiết bị mất mạng lúc đó có thể chưa lưu xong. Nhóm nên chờ trạng thái “Đã lưu trên máy chủ”; cần cải thiện hàng đợi bền/offline trước dùng rộng.
5. **Quy mô:** bootstrap lấy toàn bộ hồ sơ học của người dùng; diễn đàn và console có giới hạn số dòng. Chấp nhận được cho pilot nhỏ, chưa phù hợp dữ liệu lớn. Cần phân trang và chính sách giữ/xóa dữ liệu vận hành.
6. **Chất lượng học liệu:** 5 bài, CEFR ước lượng; chưa chuẩn hóa hoặc được giảng viên thẩm định. Chưa nên dùng kết quả như đo năng lực độc lập.
7. **AI:** khóa Gemini chưa đặt theo yêu cầu; tutor/hội thoại dùng kịch bản soạn sẵn. Chưa kiểm chứng chi phí, độ trễ hoặc chất lượng AI thật.
8. **Nói/gaze:** camera/micro có opt-in, dừng khi rời màn hình/ẩn tab; không lưu audio/video thô. Nhận dạng chữ và sơ đồ không phải chấm phát âm; gaze chưa đo ánh nhìn.
9. **Bảo trì:** còn `Record<string, any>` và component workspace lớn. Nên tách module + schema dữ liệu thống nhất sau khi ổn định pilot, tránh refactor lớn sát thời điểm thử nghiệm.
10. **Framework:** dùng Vinext beta. Giữ lockfile, CI và khả năng quay lại commit đã kiểm chứng; không nâng framework hàng loạt ngay trước buổi thử.

Không ghi API key hoặc dữ liệu người thử thật vào báo cáo/test. Các kiểm tra header giả chỉ chạy trên localhost.
