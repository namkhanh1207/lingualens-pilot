# Bàn giao đợt hoàn thiện pilot — 26/09/2026

## Phạm vi thực tế

Bản này phục vụ 5 người thử từ xa, khoảng 30–40 phút/người. Đây là đánh giá khả năng sử dụng, chưa phải nghiên cứu chứng minh cải thiện năng lực. Không bật Gemini hoặc thêm dịch vụ trả phí trong đợt này.

| Hạng mục | Trạng thái |
| --- | --- |
| Đăng nhập, dữ liệu riêng, hồ sơ và lựa chọn đồng ý | Đã triển khai |
| Đọc, gợi ý, dẫn chứng, lịch sử từng lần trả lời | Đã triển khai; nội dung demo cần GVHD duyệt |
| Từ vựng theo ngữ cảnh, flashcard, lịch ôn | Đã triển khai; lịch ôn đơn giản, không phải FSRS |
| Người đồng hành, hướng dẫn, ẩn/khôi phục | Đã triển khai; cần thử kéo trên điện thoại thật |
| Nghe–nói–viết | Một hành trình mẫu; nói/viết tự đối chiếu, không có AI chấm |
| Thư viện | Tìm ghi chú, từ, hội thoại và bản viết hiện tại của tài khoản |
| Phản hồi, quản trị, báo cáo nghiên cứu | Đã triển khai; bản xuất v3 thêm ôn từ và hành trình |
| AI hội thoại/gợi ý thật | Chờ cấu hình khóa và đánh giá chất lượng, ngân sách |
| Nhóm học, mentor, portfolio đầy đủ | Chưa hoàn thiện theo toàn bộ đặc tả; forum hiện có chỉ là nền tảng |
| Gaze thật, chấm âm vị, mô hình phát âm 3D | Chưa triển khai đo lường; giao diện hiện tại là minh họa |

Ma trận 143 yêu cầu là danh mục mục tiêu, không phải xác nhận tất cả đã hoàn thành. Các tài liệu Phase 1–4 và bảng trên mô tả phạm vi đã làm; không thay thế yêu cầu gốc.

## Kịch bản cho 5 người

1. Mở link, đăng nhập ChatGPT bằng tài khoản riêng; đặt biệt danh và tự chọn đồng ý nghiên cứu. Không bắt buộc đồng ý để học.
2. Làm một bài đọc, thử gợi ý, thêm ghi chú và hoàn thành.
3. Lưu một từ theo ngữ cảnh, lật thẻ và chọn mức nhớ.
4. Thử hành trình kỹ năng: gửi ba câu nghe, ghi ý nói, viết và tự đối chiếu. Sửa bản viết, lưu nháp rồi tải lại để kiểm tra nội dung còn nguyên.
5. Mở Người đồng hành, thử hướng dẫn, ẩn rồi khôi phục. Tìm lại một từ hoặc ghi chú trong Thư viện.
6. Gửi phản hồi: mức dễ dùng, hữu ích, muốn dùng lại; nêu thao tác gây khó khăn. Camera/micro không bắt buộc; khi âm thanh trình duyệt không hoạt động, dùng transcript và báo lại.

Người tổ chức ghi thiết bị/trình duyệt, bước bị kẹt, thời gian ước lượng và mức nghiêm trọng của lỗi. Tránh ghi mật khẩu, token hoặc nội dung riêng không cần thiết. Không cần yêu cầu người thử gửi API key.

## Sau buổi thử

Tài khoản quản trị mở báo cáo nghiên cứu, tải đủ dữ liệu rồi xuất JSON. Schema `pilot-research-v3` có hoạt động ôn từ và tóm tắt hành trình; loại nguyên văn nói/viết, từ vựng riêng và danh tính. Chỉ người hiện đồng ý nghiên cứu có trong báo cáo. Bản xuất cá nhân vẫn chứa dữ liệu riêng và lịch sử để chính người học tải về.

Nếu có thay đổi dữ liệu trong lúc xuất, tải lại báo cáo từ đầu theo thông báo. Tổng hợp số người hoàn thành, điểm góp ý nội bộ, ba vấn đề khó dùng nhất và hướng sửa để trao đổi GVHD. Không suy diễn tự đối chiếu thành điểm năng lực, hoặc năm người thành bằng chứng hiệu quả.

## Kiểm chứng đợt này

- TypeScript và production build đạt.
- 127 kiểm tra tích hợp: pilot 43, Phase 1 32, Phase 2 21, Phase 4 22, hoàn thiện 9. Kiểm tra Companion riêng đạt.
- Migration 0003 thêm bộ đếm thay đổi khi cập nhật hành trình/ôn từ để ngăn trộn các phiên dữ liệu khi xuất nhiều trang; đã áp dụng trên dữ liệu local.
- Chưa thay thế thử nghiệm trên năm tài khoản, thiết bị và trình duyệt thật; phát âm bằng trình duyệt và thao tác kéo cảm ứng vẫn cần kiểm tra thực tế.

## Việc cần chủ dự án làm

Mời năm người, thống nhất thời gian thử, tổng hợp phản hồi và nhờ GVHD duyệt nội dung cùng thiết kế nghiên cứu. Chỉ khi quyết định bật AI mới cần cấu hình khóa riêng và chốt hạn mức; khóa không gửi trong cuộc trò chuyện. Những hạng mục chuyên sâu trong bảng còn lại cần một đợt triển khai và kiểm chứng riêng.
