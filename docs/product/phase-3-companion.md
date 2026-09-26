# Phase 3 — Companion cơ bản

Ngày 25/09/2026. Lát cắt R1-C: người đồng hành trong web, dùng hướng dẫn xác định sẵn, không gọi LLM.

## Triển khai
- Nhân vật SVG nhẹ, vùng nắm riêng để kéo bằng Pointer Events; nút mở trợ giúp tách khỏi vùng kéo.
- Tọa độ chuẩn hóa, ghim cạnh tùy chọn, đặt góc/reset bằng nút và phím mũi tên.
- localStorage lưu sau khi thả/chọn vị trí, key gồm mã băm tài khoản và desktop/mobile. Dữ liệu vị trí không gửi vào nghiên cứu. Storage hỏng dùng mặc định; bị chặn vẫn hoạt động trong phiên.
- Bounds dựa vào visualViewport, xử lý resize/scroll viewport; dự phòng khoảng cách trên/dưới. Panel dùng Sheet có focus trap, Escape và trả focus. Mobile mở từ dưới, desktop chọn phía đối diện.
- Thu gọn, ẩn, khôi phục bằng Người đồng hành ở thanh đầu trang.
- Hướng dẫn 3–4 bước theo reader, từ vựng hoặc hướng dẫn chung; có trước/tiếp/bỏ qua/xem lại, đưa focus tới mục thật. Target mất thì bỏ bước thay vì làm kẹt trang.
- Số buổi hoàn thành và thẻ đến hạn lấy từ records cá nhân. Chỉ điều hướng tới các trang được định sẵn, không tự gửi đáp án hoặc bật thiết bị.
- Trạng thái panel/hiển thị, kéo và tác vụ tách riêng. Hoạt ảnh dừng khi tab ẩn, reduced motion không chạy animation.

## Phạm vi chưa bật
Chỉ có chế độ yên lặng. Chưa có chat riêng/AI, voice Companion, nhắc chủ động, snooze, giờ yên lặng, thông báo khi đóng trang, skin hoặc Rive. Không có thinking/listening/speaking giả. Mục nghiệm thu liên quan các tính năng này chưa áp dụng, không coi toàn bộ đặc tả mục 18 là đã hoàn thành.

## Kiểm tra
- TypeScript và production build đạt.
- 96 kiểm tra API của các giai đoạn trước đạt; kiểm tra bổ sung scope tài khoản ổn định và khác nhau giữa hai tài khoản đạt.
- tests/companion.test.mjs kiểm tra dữ liệu vị trí hỏng/khác phiên bản, clamp, ghim cạnh, viewport desktop/mobile/keyboard offset và số bước hướng dẫn.
- UI cục bộ đã thử mở panel, đặt góc, ẩn, tải lại vẫn ẩn, khôi phục, focus khi đóng, di chuyển bằng bàn phím, hướng dẫn reader và đưa focus tới bài thật; đổi breakpoint rồi mở lại panel hoạt động.
- Chưa xác nhận end-to-end kéo bằng cảm ứng trên điện thoại thật, bàn phím ảo thực tế, screen reader và reduced-motion của hệ điều hành. Thử kéo qua công cụ tự động gặp sai lệch tọa độ; không dùng kết quả đó làm bằng chứng đạt drag. Cần thử trực tiếp trong pilot; luôn có đặt góc/phím mũi tên thay thế.

## Thử với nhóm 5 người
Mở Người đồng hành → Hướng dẫn trang này → Xem vùng này. Sau đó thử thu gọn/ẩn, tải lại, khôi phục và đặt vị trí bằng nút. Ghi nhận có che nút học hay làm phiền không; số lần bấm nhân vật không chứng minh hiệu quả học tập.
