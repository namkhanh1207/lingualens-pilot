# Phase 4 — Một chủ đề xuyên kỹ năng

Ngày 26/09/2026. Bản thử của lát cắt R2, chưa phải toàn bộ R2 hoặc bộ đánh giá năng lực được chuẩn hóa.

## Hành trình đã triển khai
Chủ đề Một chiếc cốc, nhiều góc nhìn nối bài đọc campus-cups với một hội thoại quán cà phê, ba câu nghe, ba lời hỏi luyện nói, email 100–140 từ và liên kết sổ từ Phase 2.

- Nghe: TTS của trình duyệt, tốc độ 0.8/1, dừng, transcript dự phòng; câu hỏi chấm theo khóa ở máy chủ, giữ lần đầu và lần làm lại.
- Nói: lời hỏi soạn sẵn; nói thành tiếng hoặc dùng nhận dạng giọng nói tùy chọn đã có. Lưu ý chính và tự đối chiếu. Không lưu audio thô, không đánh giá phát âm.
- Viết: lưu từng phiên bản nháp, tiêu chí tự đối chiếu gắn nguyên văn và revision của bản viết. Khi sửa, hiển thị rõ bản đối chiếu cũ không thuộc nội dung mới.
- Dữ liệu riêng từng tài khoản, tiếp tục sau reload, lịch sử 30 mục trên UI và toàn bộ trong export cá nhân. Có cảnh báo trước khi điều hướng hoặc đóng trang với thay đổi chưa lưu.
- Revision/CAS và request ID chống lưu trùng, không ghi đè âm thầm giữa hai tab. Xung đột giữ nội dung trong form, cho sao chép trước khi tải bản mới.

## Lưu trữ
Dùng records kind skill_path và skill_path_event, khóa owner/kind/id đã có. Không đổi migration. Học liệu và khóa đáp án đóng băng trong content_versions; API chỉ trả unit đã loại khóa đáp án trước khi nộp. Sự kiện giữ snapshot để truy xuất và retry.

Hành trình hiện có một unit cố định. Bootstrap/historical records chưa phân trang, phù hợp pilot nhỏ; phải bổ sung khi mở rộng. Export nghiên cứu chưa thêm bảng kết quả đa kỹ năng; export cá nhân có đủ. Không suy ra sự cải thiện năng lực từ việc hoàn thành/self-review.

## Kiểm tra
- 22 kiểm tra API Phase 4 + 96 kiểm tra hồi quy: đạt; bộ Companion vẫn đạt.
- TypeScript/build đã kiểm tra.
- UI cục bộ: bắt đầu, gửi nghe, lưu viết/tự đối chiếu, sửa và nhận nhãn đối chiếu cũ, hủy rời trang để giữ nháp, lưu phiên bản mới, lưu tự đối chiếu nói, reload giữ đủ tiến độ/lịch sử.
- Chưa xác minh chất lượng audio trên từng trình duyệt/điện thoại hoặc microphone thực tế. Có timeout khởi động TTS 8 giây, giới hạn lượt phát 3 phút và transcript dự phòng. Bấm nghe không bảo đảm đã nghe hết; audioPlayed chỉ phản ánh sự kiện bắt đầu do trình duyệt báo. TranscriptViewed là trạng thái trong phiên, không dùng như đo exposure nghiên cứu chuẩn hóa.

## Nhóm/GVHD cần làm
Duyệt hội thoại, đáp án, yêu cầu viết và tiêu chí trước khi dùng để đo hiệu quả. Nội dung là bản mẫu hư cấu do AI biên soạn, chưa được người có chuyên môn duyệt. Nhóm 5 người có thể dùng để kiểm tra trải nghiệm và báo lỗi trước.

Gemini tiếp tục tắt. Chưa triển khai phản hồi AI, voice realtime, audio thu sẵn chuẩn hóa hoặc chấm nói/viết tự động. Không có chi phí API AI mới trong lần triển khai này.
