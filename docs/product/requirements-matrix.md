# Ma trận yêu cầu LinguaLens ngày 24/09/2026

135 mã sản phẩm từ DOCX và 8 mã CP từ tài liệu Companion. Các yêu cầu đã được tiếp nhận vào phạm vi sản phẩm; phân kỳ là đề xuất triển khai, không bỏ yêu cầu và không cam kết hoàn thành toàn bộ ngay.

Trạng thái đối chiếu bằng mã hiện tại, không phải nghiệm thu trình duyệt mới. “Một phần” không có nghĩa đạt toàn bộ chức năng. 43 kiểm tra trước đây chỉ bao phủ pilot cũ. Tiêu chí theo nhóm/chương và 12 tiêu chí Companion vẫn phải đọc từ tài liệu gốc. Không gán một tỷ lệ hoàn thành tổng thể từ số dòng này.

## UX01 — Tiếp tục liền mạch

**Yêu cầu nguồn:** Tiếp tục liền mạch: lưu vị trí bài, bản nháp, đoạn nghe và lượt luyện; báo trạng thái đã lưu, đang đồng bộ hoặc chưa lưu. Không hiển thị đã lưu nếu máy chủ chưa xác nhận.

- Nguồn: DOCX 04 Cấu trúc giao diện và khả năng tiếp cận
- Hiện trạng: Một phần
- Đối chiếu: Có lưu draft/note/highlight và session URL; thiếu vị trí cuộn, audio và đồng bộ chống xung đột.
- Mã liên quan: app/workspace.tsx
- Phân kỳ: R1

## UX02 — Trợ lý cạnh nhiệm vụ

**Yêu cầu nguồn:** Trợ lý cạnh nhiệm vụ: câu hỏi gửi kèm vùng văn bản được chọn, mục tiêu và phần trợ giúp đã xem; người học thấy ngữ cảnh đang dùng và có thể bỏ bớt.

- Nguồn: DOCX 04 Cấu trúc giao diện và khả năng tiếp cận
- Hiện trạng: Một phần
- Đối chiếu: Chat theo bài có sẵn; chưa có selection context và cho người học loại bỏ ngữ cảnh.
- Mã liên quan: app/workspace.tsx
- Phân kỳ: R1

## UX03 — Nhiều mức giao diện

**Yêu cầu nguồn:** Nhiều mức giao diện: chế độ tập trung ít thành phần, chế độ khám phá trực quan; bật/tắt mascot, hiệu ứng, nhạc và thông báo.

- Nguồn: DOCX 04 Cấu trúc giao diện và khả năng tiếp cận
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1

## UX04 — Khả năng tiếp cận

**Yêu cầu nguồn:** Khả năng tiếp cận: bàn phím, focus rõ, độ tương phản, cỡ chữ, khoảng dòng, phụ đề, transcript; không chỉ dùng màu để chỉ lỗi. Hỗ trợ giảm chuyển động và thay thế thao tác kéo bằng nút bấm.

- Nguồn: DOCX 04 Cấu trúc giao diện và khả năng tiếp cận
- Hiện trạng: Một phần
- Đối chiếu: Có nhãn, nút, responsive cơ bản; chưa có bằng chứng kiểm tra toàn bộ focus/zoom/reduced motion.
- Mã liên quan: app/workspace.tsx
- Phân kỳ: R1

## UX05 — Thiết bị và kết nối

**Yêu cầu nguồn:** Thiết bị và kết nối: giao diện điện thoại, tablet, máy tính; kiểm tra microphone; xử lý mạng yếu, tải lại và gián đoạn. Chế độ offline chỉ hứa cho phần thực sự lưu cục bộ, không hứa AI ngoại tuyến khi vẫn cần dịch vụ ngoài.

- Nguồn: DOCX 04 Cấu trúc giao diện và khả năng tiếp cận
- Hiện trạng: Một phần
- Đối chiếu: Có CSS mobile và fallback nhập chữ; chưa kiểm thử thiết bị thật/mạng yếu đầy đủ.
- Mã liên quan: app/workspace.tsx
- Phân kỳ: R1

## UX06 — Đường dẫn rõ

**Yêu cầu nguồn:** Đường dẫn rõ: mỗi buổi học và sản phẩm có trang riêng, tìm lại được. Tìm kiếm trong ghi chú, từ, hội thoại và bài viết theo quyền của chủ sở hữu.

- Nguồn: DOCX 04 Cấu trúc giao diện và khả năng tiếp cận
- Hiện trạng: Một phần
- Đối chiếu: Có URL buổi đọc và thư viện; chưa có tìm kiếm xuyên ghi chú/chat/viết.
- Mã liên quan: app/workspace.tsx
- Phân kỳ: R1

## PF01 — Onboarding ngắn

**Yêu cầu nguồn:** Onboarding ngắn: mục tiêu, sở thích, thời gian, mức tự đánh giá, điều kiện học và cách muốn được sửa. Thông tin nâng cao được bổ sung dần; không buộc điền hết trước buổi học đầu.

- Nguồn: DOCX 05 Hồ sơ năng lực và lộ trình cá nhân
- Hiện trạng: Một phần
- Đối chiếu: Có tên, mục tiêu, CEFR tự đánh giá; thiếu sở thích, thời gian và kiểu sửa.
- Mã liên quan: app/workspace.tsx; db/schema.ts
- Phân kỳ: R1/R2

## PF02 — Nhiệm vụ chẩn đoán

**Yêu cầu nguồn:** Nhiệm vụ chẩn đoán: bài ngắn theo kỹ năng, có lựa chọn bỏ qua. Kết quả ghi là ước lượng nội bộ, kèm phạm vi và mức chắc chắn; không cấp chứng nhận CEFR tự động [S15].

- Nguồn: DOCX 05 Hồ sơ năng lực và lộ trình cá nhân
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1/R2

## PF03 — Hồ sơ theo kỹ năng

**Yêu cầu nguồn:** Hồ sơ theo kỹ năng: đọc ý chính, chi tiết, suy luận; nghe nhận diện và hiểu; nói tương tác, diễn đạt; viết tổ chức và chính xác. Ngữ pháp, từ và phát âm là các lớp hỗ trợ liên kết.

- Nguồn: DOCX 05 Hồ sơ năng lực và lộ trình cá nhân
- Hiện trạng: Một phần
- Đối chiếu: Tổng quan có tỷ lệ đúng theo kỹ năng trắc nghiệm; chưa có hồ sơ bốn kỹ năng.
- Mã liên quan: app/workspace.tsx; db/schema.ts
- Phân kỳ: R1/R2

## PF04 — Mục tiêu thực tế

**Yêu cầu nguồn:** Mục tiêu thực tế: ví dụ thuyết trình dự án sau tám tuần. Chia thành mốc và nhiệm vụ; người học chọn hoặc sửa. Kế hoạch là đề xuất, không cam kết đạt trình độ sau số ngày cố định.

- Nguồn: DOCX 05 Hồ sơ năng lực và lộ trình cá nhân
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1/R2

## PF05 — Điều chỉnh theo lịch

**Yêu cầu nguồn:** Điều chỉnh theo lịch: buổi 5, 15 hoặc 30 phút; gợi ý nhiệm vụ không cần mic; hoãn lịch có chủ đích; phân bổ lại sau thời gian nghỉ.

- Nguồn: DOCX 05 Hồ sơ năng lực và lộ trình cá nhân
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1/R2

## PF06 — Quyền sửa hồ sơ

**Yêu cầu nguồn:** Quyền sửa hồ sơ: xem AI đang nhận định gì, căn cứ ở đâu, sửa sở thích hoặc phản đối suy luận. Ghi nhận tác động của thiết bị, tiếng ồn và sự cố.

- Nguồn: DOCX 05 Hồ sơ năng lực và lộ trình cá nhân
- Hiện trạng: Một phần
- Đối chiếu: Sửa được hồ sơ cơ bản; chưa có trang nhận định AI và phản đối suy luận.
- Mã liên quan: app/workspace.tsx; db/schema.ts
- Phân kỳ: R1/R2

## CT01 — Kho đa định dạng

**Yêu cầu nguồn:** Kho đa định dạng: bài đọc, hội thoại, audio, video, hình có chú thích và dự án. Tìm theo chủ đề, thời lượng, kỹ năng, độ khó dự kiến, giọng mẫu và mục tiêu.

- Nguồn: DOCX 06 Kho học liệu và tìm kiếm nội dung
- Hiện trạng: Một phần
- Đối chiếu: Có 5 bài text, lọc trình độ và tên/chủ đề; chưa có audio/video và bộ lọc đa chiều.
- Mã liên quan: app/readings.json; app/lib/content.ts
- Phân kỳ: R1/R2

## CT02 — Nguồn rõ

**Yêu cầu nguồn:** Nguồn rõ: tên, tác giả, URL, ngày truy cập, điều kiện sử dụng, phiên bản và người duyệt. Tài liệu tự viết hoặc AI hỗ trợ có nhãn phù hợp; tránh trình bày nội dung hư cấu như tin tức thật.

- Nguồn: DOCX 06 Kho học liệu và tìm kiếm nội dung
- Hiện trạng: Một phần
- Đối chiếu: Có provenance chung cho seed; chưa có nguồn/giấy phép/người duyệt theo phiên bản từng bài.
- Mã liên quan: app/readings.json; app/lib/content.ts
- Phân kỳ: R1/R2

## CT03 — Nhập tài liệu cá nhân

**Yêu cầu nguồn:** Nhập tài liệu cá nhân: văn bản, tài liệu hoặc đường dẫn khi có quyền sử dụng. Xem lại nội dung trích xuất, sửa lỗi OCR, chọn đoạn học; không mặc định mọi trang có thể nhập hoặc công khai lại.

- Nguồn: DOCX 06 Kho học liệu và tìm kiếm nội dung
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1/R2

## CT04 — Thích ứng học liệu

**Yêu cầu nguồn:** Thích ứng học liệu: bản đơn giản hơn hoặc chú giải thêm phải bảo toàn ý chính, đánh dấu phần chuyển thể và được kiểm tra. Có nút xem bản gốc để người học đối chiếu.

- Nguồn: DOCX 06 Kho học liệu và tìm kiếm nội dung
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1/R2

## CT05 — Đề xuất theo sở thích

**Yêu cầu nguồn:** Đề xuất theo sở thích: kết hợp chủ đề yêu thích, độ khó, nội dung đã học và mục tiêu; có nút ít nội dung này hơn, đổi chủ đề và giải thích đề xuất.

- Nguồn: DOCX 06 Kho học liệu và tìm kiếm nội dung
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1/R2

## CT06 — Biên soạn câu hỏi

**Yêu cầu nguồn:** Biên soạn câu hỏi: phân đoạn → sinh ứng viên → gắn bằng chứng → kiểm tra đáp án/phương án nhiễu → duyệt → xuất bản. Việc trích đoạn tồn tại không đủ xác nhận đáp án đúng.

- Nguồn: DOCX 06 Kho học liệu và tìm kiếm nội dung
- Hiện trạng: Một phần
- Đối chiếu: Có đáp án/dẫn chứng seed; chưa có pipeline biên tập/sinh/duyệt/xuất bản.
- Mã liên quan: app/readings.json; app/lib/content.ts
- Phân kỳ: R1/R2

## CT07 — Bộ sưu tập và tìm kiếm

**Yêu cầu nguồn:** Bộ sưu tập và tìm kiếm: lưu bài, playlist nghe, chủ đề theo tuần; tìm cả nội dung cá nhân. Nội dung nghiên cứu cần đóng băng phiên bản trong một đợt đo.

- Nguồn: DOCX 06 Kho học liệu và tìm kiếm nội dung
- Hiện trạng: Một phần
- Đối chiếu: Có bookmark; thiếu playlist, bộ sưu tập và đóng băng phiên bản nghiên cứu.
- Mã liên quan: app/readings.json; app/lib/content.ts
- Phân kỳ: R1/R2

## RD01 — Đọc thuận tiện

**Yêu cầu nguồn:** Đọc thuận tiện: đổi cỡ chữ, khoảng dòng, nền; đánh số đoạn; lưu vị trí; đọc thành tiếng tùy chọn và đồng bộ câu nếu có dữ liệu thời gian phù hợp.

- Nguồn: DOCX 07 Không gian đọc hiểu chuyên sâu
- Hiện trạng: Một phần
- Đối chiếu: Có đoạn đánh số và hiển thị bài; chưa có tùy chỉnh đọc/lưu vị trí/đồng bộ câu.
- Mã liên quan: app/workspace.tsx; app/api/pilot/route.ts
- Phân kỳ: R1/R2

## RD02 — Tra cứu tại chỗ

**Yêu cầu nguồn:** Tra cứu tại chỗ: từ, cụm từ, nghĩa trong câu, từ loại, ví dụ và phát âm; giải thích tiếng Việt hoặc tiếng Anh đơn giản; lưu kèm câu gốc.

- Nguồn: DOCX 07 Không gian đọc hiểu chuyên sâu
- Hiện trạng: Một phần
- Đối chiếu: Có lookup từ seed và lưu từ; chưa tra cụm chọn tự do, câu gốc và nghĩa theo ngữ cảnh.
- Mã liên quan: app/workspace.tsx; app/api/pilot/route.ts
- Phân kỳ: R1/R2

## RD03 — Hiểu cấu trúc

**Yêu cầu nguồn:** Hiểu cấu trúc: phân tách mệnh đề, từ nối, đối chiếu đại từ với đối tượng tham chiếu, quan hệ nguyên nhân và đối lập. Sơ đồ ý cần đối chiếu được với văn bản.

- Nguồn: DOCX 07 Không gian đọc hiểu chuyên sâu
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1/R2

## RD04 — Đa dạng câu hỏi

**Yêu cầu nguồn:** Đa dạng câu hỏi: ý chính, chi tiết, suy luận, quan điểm, bằng chứng, từ trong ngữ cảnh, tóm tắt và câu mở. Chọn độ khó và kỹ năng theo mục tiêu đã duyệt.

- Nguồn: DOCX 07 Không gian đọc hiểu chuyên sâu
- Hiện trạng: Một phần
- Đối chiếu: Có 20 câu với một số kỹ năng; chưa chọn mục tiêu/độ khó hoặc tóm tắt đầy đủ.
- Mã liên quan: app/workspace.tsx; app/api/pilot/route.ts
- Phân kỳ: R1/R2

## RD05 — Đáp án cùng căn cứ

**Yêu cầu nguồn:** Đáp án cùng căn cứ: người học chọn đáp án, đoạn chứng minh và mức tự tin tùy chọn. Lưu riêng để phân biệt đúng do suy luận có căn cứ với kết quả cần kiểm tra thêm.

- Nguồn: DOCX 07 Không gian đọc hiểu chuyên sâu
- Hiện trạng: Một phần
- Đối chiếu: Có đáp án nhưng chưa lưu lựa chọn bằng chứng và mức tự tin.
- Mã liên quan: app/workspace.tsx; app/api/pilot/route.ts
- Phân kỳ: R1/R2

## RD06 — Gợi ý nhiều mức

**Yêu cầu nguồn:** Gợi ý nhiều mức: chỉ vùng → gợi quan hệ → câu hỏi dẫn dắt → giải thích đầy đủ; cho thử lại giữa các bước. Có chế độ yêu cầu chưa tiết lộ đáp án.

- Nguồn: DOCX 07 Không gian đọc hiểu chuyên sâu
- Hiện trạng: Một phần
- Đối chiếu: Có 3 mức hint cố định; chưa có chuỗi mức hỗ trợ đầy đủ theo yêu cầu mới.
- Mã liên quan: app/workspace.tsx; app/api/pilot/route.ts
- Phân kỳ: R1/R2

## RD07 — Thảo luận phản biện

**Yêu cầu nguồn:** Thảo luận phản biện: hỏi vì sao phương án khác không phù hợp, chứng cứ có đủ không, nội dung nào chỉ là suy đoán. AI phải thừa nhận khi câu hỏi có vấn đề.

- Nguồn: DOCX 07 Không gian đọc hiểu chuyên sâu
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1/R2

## RD08 — Tổng kết

**Yêu cầu nguồn:** Tổng kết: lưu lỗi, chiến lược đã thử, từ cần ôn và bài mới đề xuất. Tách điểm lần đầu khỏi điểm sau trợ giúp.

- Nguồn: DOCX 07 Không gian đọc hiểu chuyên sâu
- Hiện trạng: Một phần
- Đối chiếu: Có lịch sử/kết quả gần nhất; thiếu điểm lần đầu và tổng kết trợ giúp.
- Mã liên quan: app/workspace.tsx; app/api/pilot/route.ts
- Phân kỳ: R1/R2

## LS01 — Trình phát học tập

**Yêu cầu nguồn:** Trình phát học tập: tua câu, lặp đoạn A–B, điều chỉnh tốc độ, phím tắt, phụ đề/transcript bật theo mức; âm thanh rõ và phù hợp quyền sử dụng.

- Nguồn: DOCX 08 Luyện nghe và hiểu lời nói
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## LS02 — Nghe đa mục tiêu

**Yêu cầu nguồn:** Nghe đa mục tiêu: ý chính, chi tiết, thái độ, quan hệ ý; chép chính tả, điền thiếu, chọn ý, sắp xếp sự kiện và ghi chú.

- Nguồn: DOCX 08 Luyện nghe và hiểu lời nói
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## LS03 — Giảm hỗ trợ dần

**Yêu cầu nguồn:** Giảm hỗ trợ dần: nghe không chữ → gợi từ → hiện đoạn transcript → giải thích → nghe lại không chữ. Ghi lần nào đã có trợ giúp.

- Nguồn: DOCX 08 Luyện nghe và hiểu lời nói
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## LS04 — Nhận diện khó khăn

**Yêu cầu nguồn:** Nhận diện khó khăn: người học chọn không nghe ra từ, không hiểu nghĩa, mất mạch ý, tốc độ hoặc âm thanh kém. Hệ thống dùng nhiệm vụ kiểm tra ngắn để bổ sung bằng chứng.

- Nguồn: DOCX 08 Luyện nghe và hiểu lời nói
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## LS05 — Nhiều giọng và bối cảnh

**Yêu cầu nguồn:** Nhiều giọng và bối cảnh: mẫu nói rõ, hội thoại tự nhiên, học thuật và đời sống; gắn nhãn giọng mẫu, tránh coi mọi khác biệt là lỗi.

- Nguồn: DOCX 08 Luyện nghe và hiểu lời nói
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## LS06 — Nghe nối với nói

**Yêu cầu nguồn:** Nghe nối với nói: shadowing từng đoạn, ghi âm lại, nghe mẫu và bản thân; giải thích nhịp, trọng âm và cụm ý. Không dùng độ giống âm thanh tổng thể làm bằng chứng duy nhất về chất lượng.

- Nguồn: DOCX 08 Luyện nghe và hiểu lời nói
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## LS07 — Tra ví dụ đời thực

**Yêu cầu nguồn:** Tra ví dụ đời thực: tìm một cụm trong nhiều mẫu nói theo cách YouGlish cung cấp [S3]; từ được lưu cùng ngữ cảnh và có thể đưa sang hội thoại.

- Nguồn: DOCX 08 Luyện nghe và hiểu lời nói
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## SP01 — Chọn nhiệm vụ

**Yêu cầu nguồn:** Chọn nhiệm vụ: làm quen, hỏi đường, gọi món, thảo luận lớp, thuyết trình, phỏng vấn, thương lượng hoặc trình bày chuyên ngành. Nhân vật có vai trò và mục tiêu rõ.

- Nguồn: DOCX 09 Hội thoại và giao tiếp bằng giọng nói
- Hiện trạng: Một phần
- Đối chiếu: Có 3 persona mẫu; thiếu nhiệm vụ/đích giao tiếp mở rộng.
- Mã liên quan: app/media-lab.tsx; app/lib/learning.ts; app/api/pilot/route.ts
- Phân kỳ: R2

## SP02 — Voice thật

**Yêu cầu nguồn:** Voice thật: kiểm tra mic, phát hiện lượt nói, nhận dạng, phản hồi, đọc lời đáp; có chế độ nhấn để nói và phương án văn bản khi thiết bị không hỗ trợ. Người học được sửa transcript nhận sai.

- Nguồn: DOCX 09 Hội thoại và giao tiếp bằng giọng nói
- Hiện trạng: Một phần
- Đối chiếu: Có nhận dạng/đọc bằng trình duyệt; chưa voice pipeline thật đã kiểm chứng.
- Mã liên quan: app/media-lab.tsx; app/lib/learning.ts; app/api/pilot/route.ts
- Phân kỳ: R2

## SP03 — Hội thoại tiếp nối

**Yêu cầu nguồn:** Hội thoại tiếp nối: bám câu trả lời, hỏi tiếp, xin làm rõ, đổi cách diễn đạt; cho tạm dừng, nhắc lại và điều chỉnh tốc độ. Tránh chỉ lần lượt phát câu kịch bản.

- Nguồn: DOCX 09 Hội thoại và giao tiếp bằng giọng nói
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## SP04 — Cách sửa linh hoạt

**Yêu cầu nguồn:** Cách sửa linh hoạt: giao tiếp liên tục thì góp ý sau lượt hoặc cuối buổi; luyện mục tiêu hẹp thì sửa ngay theo thỏa thuận. Có lựa chọn chỉ sửa lỗi cản trở hiểu.

- Nguồn: DOCX 09 Hội thoại và giao tiếp bằng giọng nói
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## SP05 — Phản hồi theo chiều

**Yêu cầu nguồn:** Phản hồi theo chiều: nội dung, mạch lạc, ngữ pháp, từ, ngữ dụng, lưu loát và phát âm. Chỉ báo cáo chiều có đầu vào và công cụ đánh giá phù hợp.

- Nguồn: DOCX 09 Hội thoại và giao tiếp bằng giọng nói
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## SP06 — Luyện lại

**Yêu cầu nguồn:** Luyện lại: thử cùng mục tiêu với câu hỏi khác, nói lại đoạn đã sửa, đưa cụm từ mục tiêu vào tình huống mới. Có thể luyện trước với AI rồi chuyển sang bạn học.

- Nguồn: DOCX 09 Hội thoại và giao tiếp bằng giọng nói
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## SP07 — Huấn luyện ngữ dụng

**Yêu cầu nguồn:** Huấn luyện ngữ dụng: nói lịch sự, từ chối, xin lỗi, bất đồng, đổi phong cách thân mật và trang trọng. Giải thích lựa chọn theo bối cảnh thay vì một cách nói duy nhất.

- Nguồn: DOCX 09 Hội thoại và giao tiếp bằng giọng nói
- Hiện trạng: Một phần
- Đối chiếu: Có ví dụ register soạn sẵn; chưa phản hồi phù hợp ngữ cảnh động.
- Mã liên quan: app/media-lab.tsx; app/lib/learning.ts; app/api/pilot/route.ts
- Phân kỳ: R2

## SP08 — Tổng kết và bộ nhớ

**Yêu cầu nguồn:** Tổng kết và bộ nhớ: transcript, đoạn nổi bật, điểm cần luyện, bài tiếp theo; bộ nhớ dài hạn do người học kiểm soát. Phân biệt AI với người thật.

- Nguồn: DOCX 09 Hội thoại và giao tiếp bằng giọng nói
- Hiện trạng: Một phần
- Đối chiếu: Lưu hội thoại; chưa tổng kết ưu tiên/bộ nhớ người dùng kiểm soát.
- Mã liên quan: app/media-lab.tsx; app/lib/learning.ts; app/api/pilot/route.ts
- Phân kỳ: R2

## PR01 — Thư viện âm và mẫu

**Yêu cầu nguồn:** Thư viện âm và mẫu: IPA, từ, cụm, câu; chọn biến thể mục tiêu, nghe thường/chậm, so sánh cặp âm và luyện phân biệt bằng tai.

- Nguồn: DOCX 10 Phát âm trực quan bằng 2D và 3D
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2 cơ bản / R4 đo lường

## PR02 — Mô hình dạy cấu âm

**Yêu cầu nguồn:** Mô hình dạy cấu âm: mặt trước và mặt cắt bên; môi, răng, lưỡi, hàm, luồng khí và hữu thanh khi phù hợp; tạm dừng, xoay 3D, bật chú thích. Nội dung cần chuyên gia thẩm định.

- Nguồn: DOCX 10 Phát âm trực quan bằng 2D và 3D
- Hiện trạng: Một phần
- Đối chiếu: Có sơ đồ 2D minh họa; chưa thẩm định ngữ âm hoặc mô hình cấu âm đầy đủ.
- Mã liên quan: app/media-lab.tsx
- Phân kỳ: R2 cơ bản / R4 đo lường

## PR03 — Ghi âm và phân tích

**Yêu cầu nguồn:** Ghi âm và phân tích: công cụ chuyên dụng đánh giá phần âm thanh phù hợp; phản hồi cấp âm/từ/câu khi được hỗ trợ. Speechace là một nguồn tham khảo về API đánh giá [S12], không phải bảo đảm độ chính xác với nhóm đích.

- Nguồn: DOCX 10 Phát âm trực quan bằng 2D và 3D
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2 cơ bản / R4 đo lường

## PR04 — Sửa trong giao tiếp

**Yêu cầu nguồn:** Sửa trong giao tiếp: chọn khó khăn vừa xuất hiện → xem hướng dẫn → luyện ngắn → quay lại hội thoại → kiểm tra trong câu chưa luyện.

- Nguồn: DOCX 10 Phát âm trực quan bằng 2D và 3D
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2 cơ bản / R4 đo lường

## PR05 — Camera tùy chọn

**Yêu cầu nguồn:** Camera tùy chọn: hỗ trợ quan sát môi/hàm bên ngoài khi đủ điều kiện. Camera thông thường không đo được toàn bộ vị trí lưỡi bên trong; phải ghi rõ vùng không quan sát được.

- Nguồn: DOCX 10 Phát âm trực quan bằng 2D và 3D
- Hiện trạng: Một phần
- Đối chiếu: Có camera preview tùy chọn; chưa phân tích môi/hàm.
- Mã liên quan: app/media-lab.tsx
- Phân kỳ: R2 cơ bản / R4 đo lường

## PR06 — Ngữ điệu và nhịp

**Yêu cầu nguồn:** Ngữ điệu và nhịp: trọng âm từ/câu, ngắt cụm, tốc độ; nghe đối chiếu; đường biểu diễn nếu có cần giải thích dễ hiểu và có tính đến chất lượng ghi âm.

- Nguồn: DOCX 10 Phát âm trực quan bằng 2D và 3D
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2 cơ bản / R4 đo lường

## WR01 — Đa dạng nhiệm vụ

**Yêu cầu nguồn:** Đa dạng nhiệm vụ: nhật ký, mô tả, tin nhắn, email, đoạn văn, bài luận, báo cáo, CV và kịch bản thuyết trình. Chọn mục đích, người đọc và phong cách.

- Nguồn: DOCX 11 Luyện viết và tư duy diễn đạt
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## WR02 — Hỗ trợ chuẩn bị

**Yêu cầu nguồn:** Hỗ trợ chuẩn bị: hiểu đề, động não, chọn luận điểm, dàn ý và câu hỏi tự kiểm tra. Có chế độ chỉ hỏi gợi mở để người học tự phát triển ý.

- Nguồn: DOCX 11 Luyện viết và tư duy diễn đạt
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## WR03 — Góp ý nhiều lớp

**Yêu cầu nguồn:** Góp ý nhiều lớp: mức đáp ứng đề, lập luận, tổ chức, liên kết, từ vựng, ngữ pháp, chính tả và sắc thái. Tách hiểu nội dung khỏi độ chính xác ngôn ngữ.

- Nguồn: DOCX 11 Luyện viết và tư duy diễn đạt
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## WR04 — Mức can thiệp

**Yêu cầu nguồn:** Mức can thiệp: chỉ chỉ ra vùng cần xem lại; giải thích lỗi; đề xuất cách sửa; hoặc đưa bản tham khảo sau khi người học đã thử. Giữ ý định và giọng của người viết.

- Nguồn: DOCX 11 Luyện viết và tư duy diễn đạt
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## WR05 — Sửa nhiều vòng

**Yêu cầu nguồn:** Sửa nhiều vòng: lưu phiên bản, xem thay đổi, nhận xét điều đã cải thiện và điều còn tồn tại. Người học giải thích một lựa chọn sửa để tránh chỉ chấp nhận tự động.

- Nguồn: DOCX 11 Luyện viết và tư duy diễn đạt
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## WR06 — Vận dụng lại

**Yêu cầu nguồn:** Vận dụng lại: chuyển lỗi lặp vào bài tập ngắn; giao bài mới có cơ hội dùng cấu trúc đó. Không dùng cùng một bản đã được AI sửa để kết luận năng lực viết độc lập.

- Nguồn: DOCX 11 Luyện viết và tư duy diễn đạt
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## WR07 — Góp ý từ người

**Yêu cầu nguồn:** Góp ý từ người: gửi bài cho bạn/giáo viên với mục tiêu cụ thể, quyền truy cập rõ, lịch sử nhận xét và phản hồi. Đánh dấu nguồn góp ý là AI hay con người.

- Nguồn: DOCX 11 Luyện viết và tư duy diễn đạt
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## VC01 — Sổ từ theo ngữ cảnh

**Yêu cầu nguồn:** Sổ từ theo ngữ cảnh: từ/cụm, IPA, từ loại, nghĩa đang dùng, câu gốc, phát âm, từ liên quan, collocation, sắc thái và nguồn. Cho người dùng sửa hoặc gộp mục trùng.

- Nguồn: DOCX 12 Từ vựng ngữ pháp và ôn tập
- Hiện trạng: Một phần
- Đối chiếu: Lưu word/meaning/reading; thiếu đoạn trích, IPA, nghĩa theo ngữ cảnh, gộp theo nghĩa.
- Mã liên quan: app/lib/learning.ts; app/api/pilot/route.ts
- Phân kỳ: R1/R2

## VC02 — Nhiều kiểu bài

**Yêu cầu nguồn:** Nhiều kiểu bài: nhận nghĩa, nhớ từ, nghe nhận diện, điền câu, nói/viết câu mới, phân biệt từ gần nghĩa. Mỗi kiểu cung cấp bằng chứng khác nhau.

- Nguồn: DOCX 12 Từ vựng ngữ pháp và ôn tập
- Hiện trạng: Một phần
- Đối chiếu: Flashcard lật thẻ; chưa đủ bài nghe/nói/viết và recall riêng.
- Mã liên quan: app/lib/learning.ts; app/api/pilot/route.ts
- Phân kỳ: R1/R2

## VC03 — Lịch ôn

**Yêu cầu nguồn:** Lịch ôn: dùng kết quả và mức nhớ để đề xuất lần ôn tiếp; hạn mức hằng ngày, hoãn có kiểm soát, giảm bài tồn sau thời gian nghỉ. Anki là nguồn tham khảo về lịch ôn và thẻ đa phương tiện [S9].

- Nguồn: DOCX 12 Từ vựng ngữ pháp và ôn tập
- Hiện trạng: Một phần
- Đối chiếu: Lịch ôn theo quy tắc; chưa FSRS, lịch sử Review và chống gửi lặp phía server.
- Mã liên quan: app/lib/learning.ts; app/api/pilot/route.ts
- Phân kỳ: R1/R2

## VC04 — Liên kết kỹ năng

**Yêu cầu nguồn:** Liên kết kỹ năng: từ đã đọc xuất hiện trong đoạn nghe, nhiệm vụ nói và viết. Giữ riêng trạng thái nhận diện, nhớ lại và vận dụng; không đồng nhất số từ đã lưu với số từ thành thạo.

- Nguồn: DOCX 12 Từ vựng ngữ pháp và ôn tập
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1/R2

## GR01 — Ngữ pháp từ tình huống

**Yêu cầu nguồn:** Ngữ pháp từ tình huống: giải thích dựa trên câu người học vừa dùng; có ví dụ đối chiếu và câu hỏi tại sao. Điều chỉnh mức giải thích tiếng Việt/tiếng Anh.

- Nguồn: DOCX 12 Từ vựng ngữ pháp và ôn tập
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## GR02 — Bài luyện từ lỗi

**Yêu cầu nguồn:** Bài luyện từ lỗi: xác định mẫu lỗi lặp, cho tự sửa rồi dùng trong câu mới; ghi nhận nếu lỗi có thể do nhận dạng giọng nói.

- Nguồn: DOCX 12 Từ vựng ngữ pháp và ôn tập
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## GR03 — Bản đồ kiến thức

**Yêu cầu nguồn:** Bản đồ kiến thức: các chủ điểm liên quan và kiến thức tiền đề; cho học theo nhu cầu hoặc theo lộ trình. Không biến bản đồ thành chẩn đoán chắc chắn từ dữ liệu ít.

- Nguồn: DOCX 12 Từ vựng ngữ pháp và ôn tập
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## CO01 — Trợ lý theo ngữ cảnh

**Yêu cầu nguồn:** Trợ lý theo ngữ cảnh: biết nhiệm vụ đang làm, phần người học chọn và mục tiêu được phép dùng. Có thể giải thích lại, dùng ví dụ gần sở thích, đổi ngôn ngữ và mức chi tiết.

- Nguồn: DOCX 13 AI đồng hành và tư vấn học tập
- Hiện trạng: Một phần
- Đối chiếu: Chat theo bài có fallback; chưa selection context, sở thích và thay đổi độ chi tiết.
- Mã liên quan: app/workspace.tsx; app/api/pilot/route.ts
- Phân kỳ: R2

## CO02 — Tư vấn có quy trình

**Yêu cầu nguồn:** Tư vấn có quy trình: hỏi rõ khó khăn → xem bằng chứng được phép → nêu khả năng → đề xuất hoạt động kiểm tra → thống nhất một thay đổi → xem lại kết quả. Tránh chẩn đoán ngay từ một lời than phiền.

- Nguồn: DOCX 13 AI đồng hành và tư vấn học tập
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## CO03 — Lập và sửa kế hoạch

**Yêu cầu nguồn:** Lập và sửa kế hoạch: mục tiêu, thời gian, thứ tự bài, tuần bận, chuẩn bị kỳ thi hoặc thuyết trình. Người học chấp nhận và chỉnh sửa trước khi kế hoạch thay đổi lớn.

- Nguồn: DOCX 13 AI đồng hành và tư vấn học tập
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## CO04 — Đồng hành sau gián đoạn

**Yêu cầu nguồn:** Đồng hành sau gián đoạn: hỏi thời gian hiện có, đề xuất buổi ngắn, ghi nhận việc quay lại. Không dùng thông điệp gây tội lỗi hoặc nhân vật đòi hỏi sự gắn bó độc quyền.

- Nguồn: DOCX 13 AI đồng hành và tư vấn học tập
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## CO05 — Bộ nhớ có kiểm soát

**Yêu cầu nguồn:** Bộ nhớ có kiểm soát: trang xem AI nhớ gì, nguồn thông tin, sửa/xóa và tắt ghi nhớ. Tách sở thích lâu dài khỏi dữ liệu tạm thời của một phiên.

- Nguồn: DOCX 13 AI đồng hành và tư vấn học tập
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## CO06 — Cá tính tùy chọn

**Yêu cầu nguồn:** Cá tính tùy chọn: gia sư kỹ lưỡng, bạn học thân thiện, người phỏng vấn hoặc người phản biện; vẫn giữ yêu cầu đúng nội dung và thừa nhận giới hạn.

- Nguồn: DOCX 13 AI đồng hành và tư vấn học tập
- Hiện trạng: Một phần
- Đối chiếu: Có persona mẫu; chưa cá tính xuyên phiên hoặc AI thật.
- Mã liên quan: app/workspace.tsx; app/api/pilot/route.ts
- Phân kỳ: R2

## CO07 — Chuyển đến người thật

**Yêu cầu nguồn:** Chuyển đến người thật: báo nội dung sai, yêu cầu giáo viên xem bài, gửi hỗ trợ. AI không tự nhận vai trò chuyên môn vượt phạm vi gia sư ngôn ngữ.

- Nguồn: DOCX 13 AI đồng hành và tư vấn học tập
- Hiện trạng: Một phần
- Đối chiếu: Có ticket; thiếu báo sai gắn câu trả lời và giáo viên xem bài.
- Mã liên quan: app/workspace.tsx; app/api/pilot/route.ts
- Phân kỳ: R2

## AD01 — Hồ sơ bằng chứng chung

**Yêu cầu nguồn:** Hồ sơ bằng chứng chung: người học, kiến thức mục tiêu, nhiệm vụ, lần thử, mức hỗ trợ, phiên bản nội dung, thời điểm và độ chắc chắn. Lưu riêng kết quả đầu tiên và sau sửa.

- Nguồn: DOCX 14 Thích ứng và liên kết các kỹ năng
- Hiện trạng: Một phần
- Đối chiếu: Có session/results/attempt count; thiếu lịch sử Attempt, version và HintExposure đầy đủ.
- Mã liên quan: app/api/pilot/route.ts; app/workspace.tsx
- Phân kỳ: R1 dữ liệu / R2 thích ứng

## AD02 — Đề xuất giải thích được

**Yêu cầu nguồn:** Đề xuất giải thích được: vì sao bài được chọn, kỹ năng dự kiến luyện và lựa chọn thay thế. Cho phép ưu tiên sở thích hoặc mục tiêu trước mắt.

- Nguồn: DOCX 14 Thích ứng và liên kết các kỹ năng
- Hiện trạng: Một phần
- Đối chiếu: Có gợi ý theo đúng/sai đơn giản; chưa lý do truy vết tới bằng chứng đa kỹ năng.
- Mã liên quan: app/api/pilot/route.ts; app/workspace.tsx
- Phân kỳ: R1 dữ liệu / R2 thích ứng

## AD03 — Thích ứng mức trợ giúp

**Yêu cầu nguồn:** Thích ứng mức trợ giúp: chọn vùng gợi ý và độ chi tiết theo câu trả lời, yêu cầu của người dùng và lịch sử. Các quy tắc ban đầu phải kiểm tra được trước khi dùng mô hình học máy.

- Nguồn: DOCX 14 Thích ứng và liên kết các kỹ năng
- Hiện trạng: Một phần
- Đối chiếu: Có hint tăng mức khi bấm; chưa thích ứng theo bằng chứng hoặc thử nghiệm can thiệp.
- Mã liên quan: app/api/pilot/route.ts; app/workspace.tsx
- Phân kỳ: R1 dữ liệu / R2 thích ứng

## AD04 — Thích ứng nội dung

**Yêu cầu nguồn:** Thích ứng nội dung: giữ chủ đề nhưng đổi độ dài, dạng câu hỏi hoặc nhiệm vụ; không tự hạ toàn bộ trình độ chỉ vì sai một kỹ năng.

- Nguồn: DOCX 14 Thích ứng và liên kết các kỹ năng
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1 dữ liệu / R2 thích ứng

## AD05 — Giảm hỗ trợ

**Yêu cầu nguồn:** Giảm hỗ trợ: thử lại không gợi ý, nghe không transcript, viết không mẫu. Điều chỉnh khi người học yêu cầu thêm hỗ trợ.

- Nguồn: DOCX 14 Thích ứng và liên kết các kỹ năng
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1 dữ liệu / R2 thích ứng

## AD06 — Chuyển giao kỹ năng

**Yêu cầu nguồn:** Chuyển giao kỹ năng: đọc một chủ đề → nghe quan điểm khác → trao đổi → viết lập luận → ôn và dùng lại. Từ và lỗi được liên kết, không trộn điểm các kỹ năng thành một kết luận thiếu căn cứ.

- Nguồn: DOCX 14 Thích ứng và liên kết các kỹ năng
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1 dữ liệu / R2 thích ứng

## BH01 — Log tối thiểu có mục đích

**Yêu cầu nguồn:** Log tối thiểu có mục đích: mở bài, vùng hiển thị, cuộn, chọn chữ, tra từ, đánh dấu, đổi đáp án, dùng gợi ý và chuyển nhiệm vụ. Chỉ thu dữ liệu phục vụ câu hỏi sản phẩm/nghiên cứu đã xác định.

- Nguồn: DOCX 15 Dữ liệu tương tác và thước đọc
- Hiện trạng: Một phần
- Đối chiếu: Có một số event; thiếu event ID chống retry và nhiều loại sự kiện mới.
- Mã liên quan: app/workspace.tsx; app/api/pilot/route.ts
- Phân kỳ: R1

## BH02 — Thời gian

**Yêu cầu nguồn:** Thời gian: phân biệt phiên mở, trang đang hiển thị và thời gian có tương tác. Không đặt tên số đo này là mức tập trung hoặc thời gian hiểu bài.

- Nguồn: DOCX 15 Dữ liệu tương tác và thước đọc
- Hiện trạng: Một phần
- Đối chiếu: Có visible dwell gần đúng; chưa định nghĩa đủ thời gian mở/hiển thị/tương tác.
- Mã liên quan: app/workspace.tsx; app/api/pilot/route.ts
- Phân kỳ: R1

## BH03 — Thước đọc tự nguyện

**Yêu cầu nguồn:** Thước đọc tự nguyện: làm nổi bật dòng/đoạn theo con trỏ hoặc nút điều khiển; hỗ trợ bàn phím và chạm. Có thể tắt mà vẫn hoàn thành bài.

- Nguồn: DOCX 15 Dữ liệu tương tác và thước đọc
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1

## BH04 — Đọc từng đoạn

**Yêu cầu nguồn:** Đọc từng đoạn: người dùng chủ động mở phần tiếp theo; phù hợp nhiệm vụ nghiên cứu cụ thể, nhưng cần ghi nhận việc thay đổi cách đọc tự nhiên.

- Nguồn: DOCX 15 Dữ liệu tương tác và thước đọc
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1

## BH05 — Báo khó khăn trực tiếp

**Yêu cầu nguồn:** Báo khó khăn trực tiếp: nút “Tôi đang vướng ở đây”, chọn từ, câu, liên kết ý hoặc suy luận. Đây là nguồn xác nhận quan trọng cho cách diễn giải log.

- Nguồn: DOCX 15 Dữ liệu tương tác và thước đọc
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1

## BH06 — Hỗ trợ ít làm phiền

**Yêu cầu nguồn:** Hỗ trợ ít làm phiền: chỉ đề nghị nhẹ nhàng khi có đủ căn cứ; hạn chế số lần hiện; người học chọn bỏ qua hoặc tắt.

- Nguồn: DOCX 15 Dữ liệu tương tác và thước đọc
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1

## GZ01 — Chế độ tự nguyện

**Yêu cầu nguồn:** Chế độ tự nguyện: giải thích mục đích, dữ liệu và giới hạn; xin phép camera; có nút tạm dừng/dừng dễ thấy; không cản luồng học thông thường.

- Nguồn: DOCX 16 Eye tracking và phòng nghiên cứu
- Hiện trạng: Một phần
- Đối chiếu: Có xin phép camera và nút dừng trong lab; chưa consent/phạm vi dữ liệu gaze thực.
- Mã liên quan: app/media-lab.tsx
- Phân kỳ: R4

## GZ02 — Hiệu chỉnh và kiểm tra

**Yêu cầu nguồn:** Hiệu chỉnh và kiểm tra: hiệu chỉnh điểm nhìn, sau đó kiểm tra ở vị trí riêng; lưu sai số và tỷ lệ tín hiệu hợp lệ. Kiểm tra lại khi tư thế, cửa sổ hoặc bố cục thay đổi đáng kể.

- Nguồn: DOCX 16 Eye tracking và phòng nghiên cứu
- Hiện trạng: Một phần
- Đối chiếu: Chỉ diễn tập 9 điểm; chưa hiệu chỉnh/validation hoặc đo sai số.
- Mã liên quan: app/media-lab.tsx
- Phân kỳ: R4

## GZ03 — Vùng quan tâm

**Yêu cầu nguồn:** Vùng quan tâm: bắt đầu ở vùng bài đọc/câu hỏi hoặc đoạn lớn. Chỉ dùng cấp dòng/từ nếu kết quả đo thực tế chứng minh đủ độ phân giải.

- Nguồn: DOCX 16 Eye tracking và phòng nghiên cứu
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R4

## GZ04 — Chất lượng và dự phòng

**Yêu cầu nguồn:** Chất lượng và dự phòng: khi tín hiệu kém, ngừng phản hồi dựa trên gaze và chuyển sang click/tra từ/tự báo. Không tạo chỉ số chính xác giả định từ dữ liệu mất hoặc trôi.

- Nguồn: DOCX 16 Eye tracking và phòng nghiên cứu
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R4

## GZ05 — Trình xem nghiên cứu

**Yêu cầu nguồn:** Trình xem nghiên cứu: thời gian nhìn ước lượng theo vùng, chuyển vùng, tỷ lệ mất tín hiệu, chú thích điều kiện. Heatmap phục vụ xem dữ liệu, không thay thế đo hiệu quả học.

- Nguồn: DOCX 16 Eye tracking và phòng nghiên cứu
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R4

## GZ06 — Kiểm tra giá trị tăng thêm

**Yêu cầu nguồn:** Kiểm tra giá trị tăng thêm: so sánh mô hình dùng tương tác thông thường với mô hình bổ sung gaze; đánh giá cả chất lượng hỗ trợ, độ phiền và khả năng dùng thiết bị.

- Nguồn: DOCX 16 Eye tracking và phòng nghiên cứu
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R4

## CM01 — Hồ sơ cộng đồng tùy chọn

**Yêu cầu nguồn:** Hồ sơ cộng đồng tùy chọn: sở thích, mục tiêu, mức hỗ trợ mong muốn và khung giờ; không tự công khai điểm yếu hay lịch sử riêng.

- Nguồn: DOCX 17 Cộng đồng và hỗ trợ từ con người
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## CM02 — Ghép bạn

**Yêu cầu nguồn:** Ghép bạn: ngôn ngữ, chủ đề, lịch và mục tiêu; cho chấp nhận/từ chối, chặn và báo cáo. Không cần công khai vị trí chính xác.

- Nguồn: DOCX 17 Cộng đồng và hỗ trợ từ con người
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## CM03 — Phòng nhóm nhỏ

**Yêu cầu nguồn:** Phòng nhóm nhỏ: đọc chung, luyện nói, câu lạc bộ theo chủ đề, phòng học yên tĩnh. Có người điều phối và quy tắc rõ khi mở cho người thật.

- Nguồn: DOCX 17 Cộng đồng và hỗ trợ từ con người
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## CM04 — Nhiệm vụ hợp tác

**Yêu cầu nguồn:** Nhiệm vụ hợp tác: phỏng vấn, tranh luận, giải quyết tình huống và làm podcast. Người học có vai trò và sản phẩm cuối, tránh phòng chat không có hoạt động.

- Nguồn: DOCX 17 Cộng đồng và hỗ trợ từ con người
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## CM05 — Góp ý có tiêu chí

**Yêu cầu nguồn:** Góp ý có tiêu chí: tác giả chọn sửa ý, ngữ pháp, phát âm hoặc phong cách; mẫu phản hồi cụ thể; lưu bản trước–sau và quyền phản hồi lại.

- Nguồn: DOCX 17 Cộng đồng và hỗ trợ từ con người
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## CM06 — AI hỗ trợ nhóm

**Yêu cầu nguồn:** AI hỗ trợ nhóm: chuẩn bị câu hỏi, gợi ý khi bí và tổng kết nếu cả nhóm được thông báo. Không âm thầm phân tích người khác hoặc tự công khai nhận xét cá nhân.

- Nguồn: DOCX 17 Cộng đồng và hỗ trợ từ con người
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## CM07 — Giáo viên và mentor

**Yêu cầu nguồn:** Giáo viên và mentor: giao bài, nhận bài, góp ý, duyệt phản hồi AI, xem tiến độ trong phạm vi được cấp quyền.

- Nguồn: DOCX 17 Cộng đồng và hỗ trợ từ con người
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## CM08 — Cộng đồng nối ôn tập

**Yêu cầu nguồn:** Cộng đồng nối ôn tập: người học chọn lưu câu được sửa vào sổ lỗi; hệ thống tạo bài luyện và kiểm tra lại sau đó.

- Nguồn: DOCX 17 Cộng đồng và hỗ trợ từ con người
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## EN01 — Khám phá ngắn

**Yêu cầu nguồn:** Khám phá ngắn: nội dung ưa thích, từ/câu nổi bật, nghe mẫu, thử nói/viết và nút học sâu. Phiên có điểm kết thúc; đánh giá tỷ lệ chuyển từ xem sang thực hành.

- Nguồn: DOCX 18 Học từ mạng xã hội và ứng dụng hấp dẫn
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## EN02 — Khoảnh khắc tiếng Anh

**Yêu cầu nguồn:** Khoảnh khắc tiếng Anh: mô tả bữa ăn, một đồ vật hoặc điều bất ngờ; gợi ý theo trình độ; lưu bản đầu và bản sửa; quyền chia sẻ riêng/nhóm/công khai.

- Nguồn: DOCX 18 Học từ mạng xã hội và ứng dụng hấp dẫn
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## EN03 — Hồ sơ cá nhân sáng tạo

**Yêu cầu nguồn:** Hồ sơ cá nhân sáng tạo: avatar, chủ đề, bộ sưu tập, sản phẩm và lời giới thiệu; cho chế độ tối giản dành cho người không thích hiệu ứng.

- Nguồn: DOCX 18 Học từ mạng xã hội và ứng dụng hấp dẫn
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## EN04 — Tổng kết có bằng chứng

**Yêu cầu nguồn:** Tổng kết có bằng chứng: kể lại nhiệm vụ, lỗi đã sửa nhiều lần và bản nói/viết trước–sau; không chuyển phút học thành năng lực hoặc từ đã lưu thành từ thành thạo.

- Nguồn: DOCX 18 Học từ mạng xã hội và ứng dụng hấp dẫn
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## EN05 — Thử thách theo xu hướng

**Yêu cầu nguồn:** Thử thách theo xu hướng: dùng chủ đề gần giới trẻ, có giải thích sắc thái và bối cảnh; tránh dạy tiếng lóng như lựa chọn phù hợp mọi tình huống.

- Nguồn: DOCX 18 Học từ mạng xã hội và ứng dụng hấp dẫn
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## GM01 — Bạn đồng hành

**Yêu cầu nguồn:** Bạn đồng hành: chọn hình dáng, tên, phong cách phản hồi; tham gia câu chuyện và dẫn vào bài luyện; có thể tắt. Phản hồi ghi nhận một hành động cụ thể thay vì khen mọi câu trả lời.

- Nguồn: DOCX 19 Trò chơi hóa và động lực bền vững
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## GM02 — Nhiệm vụ

**Yêu cầu nguồn:** Nhiệm vụ: mục tiêu buổi, chuỗi dự án, thử thách tuần và nhiệm vụ nhóm. Mỗi nhiệm vụ gắn một năng lực hoặc sản phẩm, có mức vừa sức và mức thử thách.

- Nguồn: DOCX 19 Trò chơi hóa và động lực bền vững
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## GM03 — Phần thưởng

**Yêu cầu nguồn:** Phần thưởng: đồ trang trí và mở địa điểm khi hoàn thành nhiệm vụ hợp lệ. Ghi nhận sửa bài, thử lại và vận dụng; hạn chế việc lặp bài dễ chỉ để lấy điểm.

- Nguồn: DOCX 19 Trò chơi hóa và động lực bền vững
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## GM04 — Không gian tích lũy

**Yêu cầu nguồn:** Không gian tích lũy: khu vườn, thư viện, phòng cá nhân hoặc bản đồ. Nhấn một vật phẩm để xem bài hoặc bản ghi liên quan; công sức gắn với ký ức học thật.

- Nguồn: DOCX 19 Trò chơi hóa và động lực bền vững
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## GM05 — Nhịp học linh hoạt

**Yêu cầu nguồn:** Nhịp học linh hoạt: mục tiêu theo tuần, ngày nghỉ, buổi tối thiểu và cơ chế quay lại; không xóa giá trị tích lũy vì một ngày bỏ lỡ.

- Nguồn: DOCX 19 Trò chơi hóa và động lực bền vững
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## GM06 — Thi đua tùy chọn

**Yêu cầu nguồn:** Thi đua tùy chọn: nhóm nhỏ và nhiệm vụ hợp tác; so tiến bộ cá nhân hoặc đóng góp hữu ích. Không dùng bảng tổng điểm công khai để xếp hạng năng lực nếu phép đo không tương đương.

- Nguồn: DOCX 19 Trò chơi hóa và động lực bền vững
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## GM07 — Nhắc học

**Yêu cầu nguồn:** Nhắc học: lịch do người dùng chọn, tần suất có giới hạn, tắt được; nhắc việc đang dang dở hoặc lời mời thật. Không tạo thông báo xã hội giả.

- Nguồn: DOCX 19 Trò chơi hóa và động lực bền vững
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## CR01 — Lồng tiếng

**Yêu cầu nguồn:** Lồng tiếng: cảnh do nhóm tạo hoặc có quyền dùng, kịch bản theo vai, nghe mẫu, ghi âm, đồng bộ và xem lại. Phản hồi về rõ nghĩa, nhịp và mục tiêu phát âm.

- Nguồn: DOCX 20 Xưởng sáng tạo và học theo dự án
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## CR02 — Podcast và phỏng vấn

**Yêu cầu nguồn:** Podcast và phỏng vấn: lập câu hỏi, luyện trước, ghi âm đơn/đôi, transcript, chỉnh nội dung và trình bày sản phẩm.

- Nguồn: DOCX 20 Xưởng sáng tạo và học theo dự án
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## CR03 — Video giới thiệu

**Yêu cầu nguồn:** Video giới thiệu: viết kịch bản, nói về game, món ăn, công nghệ hoặc trải nghiệm; có phương án chỉ giọng và hình, không bắt bật mặt.

- Nguồn: DOCX 20 Xưởng sáng tạo và học theo dự án
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## CR04 — Viết sáng tạo

**Yêu cầu nguồn:** Viết sáng tạo: truyện tiếp nối, nhật ký, lời thoại, bài đánh giá và meme có giải thích. AI gợi mở và phản biện; ghi rõ mức hỗ trợ trong portfolio khi cần đánh giá độc lập.

- Nguồn: DOCX 20 Xưởng sáng tạo và học theo dự án
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## CR05 — Tình huống tương tác

**Yêu cầu nguồn:** Tình huống tương tác: nhân vật, lựa chọn, hội thoại và kết quả; cho thử lại bằng cách diễn đạt khác. Nhánh truyện phải phục vụ mục tiêu giao tiếp.

- Nguồn: DOCX 20 Xưởng sáng tạo và học theo dự án
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## CR06 — Dự án chuyên ngành

**Yêu cầu nguồn:** Dự án chuyên ngành: giới thiệu phần mềm, đọc tài liệu, viết email học thuật, thuyết trình nghiên cứu. Có thuật ngữ theo ngành nhưng vẫn kiểm tra nguồn và nghĩa.

- Nguồn: DOCX 20 Xưởng sáng tạo và học theo dự án
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## CR07 — Portfolio

**Yêu cầu nguồn:** Portfolio: lưu sản phẩm, phiên bản, phản hồi, tự đánh giá và quyền chia sẻ; tìm lại và đưa vào tổng kết.

- Nguồn: DOCX 20 Xưởng sáng tạo và học theo dự án
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R3

## OP01 — Quyền theo vai trò

**Yêu cầu nguồn:** Quyền theo vai trò: người học, giáo viên, biên tập, kiểm duyệt, hỗ trợ, nghiên cứu và quản trị. Kiểm tra phía máy chủ, giới hạn theo lớp/nhóm và ghi nhật ký thao tác quan trọng.

- Nguồn: DOCX 22 Quản trị hỗ trợ và quản lý học liệu
- Hiện trạng: Một phần
- Đối chiếu: Có role allowlist server; chưa quyền giáo viên/biên tập/theo lớp và đầy đủ audit.
- Mã liên quan: app/api/pilot/route.ts
- Phân kỳ: R1/R3

## OP02 — Biên tập học liệu

**Yêu cầu nguồn:** Biên tập học liệu: tạo, nhập, kiểm tra nguồn, duyệt câu hỏi, gợi ý, rubric và âm thanh; phiên bản nháp/xuất bản/thu hồi. Khi sửa nội dung, biết buổi học nào đã dùng bản cũ.

- Nguồn: DOCX 22 Quản trị hỗ trợ và quản lý học liệu
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1/R3

## OP03 — Quản lý phản hồi AI

**Yêu cầu nguồn:** Quản lý phản hồi AI: báo sai ngay tại câu trả lời, lưu ngữ cảnh cần thiết theo quyền, phân loại nguyên nhân và cập nhật ca kiểm tra hồi quy.

- Nguồn: DOCX 22 Quản trị hỗ trợ và quản lý học liệu
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1/R3

## OP04 — Hỗ trợ người dùng

**Yêu cầu nguồn:** Hỗ trợ người dùng: ticket, trạng thái, phản hồi, đính kèm phù hợp, hướng dẫn thiết bị; không cho bộ phận hỗ trợ xem mọi dữ liệu nghiên cứu theo mặc định.

- Nguồn: DOCX 22 Quản trị hỗ trợ và quản lý học liệu
- Hiện trạng: Một phần
- Đối chiếu: Có ticket/trả lời/trạng thái; chưa đính kèm và phân vai hỗ trợ riêng.
- Mã liên quan: app/api/pilot/route.ts
- Phân kỳ: R1/R3

## OP05 — Kiểm duyệt cộng đồng

**Yêu cầu nguồn:** Kiểm duyệt cộng đồng: báo cáo, chặn, ẩn/khôi phục, lịch sử xử lý và yêu cầu xem lại. Quy định ai trực và thời gian xử lý dự kiến trước khi mở cộng đồng rộng.

- Nguồn: DOCX 22 Quản trị hỗ trợ và quản lý học liệu
- Hiện trạng: Một phần
- Đối chiếu: Có report/ẩn/khôi phục; thiếu block, yêu cầu xem lại và quy trình trực.
- Mã liên quan: app/api/pilot/route.ts
- Phân kỳ: R1/R3

## OP06 — Quản lý lớp

**Yêu cầu nguồn:** Quản lý lớp: giao nhiệm vụ, hạn nộp linh hoạt, xem bài và phản hồi; người học thấy rõ nội dung nào giáo viên được xem.

- Nguồn: DOCX 22 Quản trị hỗ trợ và quản lý học liệu
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1/R3

## OP07 — Bảng vận hành

**Yêu cầu nguồn:** Bảng vận hành: tỷ lệ lỗi, độ trễ, lưu dữ liệu, sử dụng AI, chi phí ước tính, nội dung bị báo sai và sức khỏe sự kiện; tách khỏi bảng năng lực người học.

- Nguồn: DOCX 22 Quản trị hỗ trợ và quản lý học liệu
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1/R3

## OP08 — Quản lý thí nghiệm

**Yêu cầu nguồn:** Quản lý thí nghiệm: chỉ người đủ quyền tạo điều kiện can thiệp, phân nhóm, đóng đợt, khóa phiên bản và xuất tập dữ liệu. Một biểu mẫu lưu đề cương không được gọi là cơ chế thực nghiệm đã hoạt động.

- Nguồn: DOCX 22 Quản trị hỗ trợ và quản lý học liệu
- Hiện trạng: Một phần
- Đối chiếu: Chỉ lưu đề cương; chưa phân nhóm, khóa phiên bản hay điều kiện thật.
- Mã liên quan: app/api/pilot/route.ts
- Phân kỳ: R1/R3

## AI01 — Ngữ cảnh có giới hạn

**Yêu cầu nguồn:** Ngữ cảnh có giới hạn: bài, câu hỏi, rubric, mục tiêu và lịch sử cần thiết. Không gửi toàn bộ hồ sơ khi một câu hỏi chỉ cần một đoạn văn.

- Nguồn: DOCX 23 Kiến trúc và chất lượng AI
- Hiện trạng: Một phần
- Đối chiếu: Có giới hạn history và bài cho Gemini; chưa chọn riêng đoạn/context người học kiểm soát.
- Mã liên quan: app/api/pilot/route.ts
- Phân kỳ: R2

## AI02 — Đầu ra có cấu trúc

**Yêu cầu nguồn:** Đầu ra có cấu trúc: nội dung phản hồi, bằng chứng, loại hỗ trợ, cảnh báo thiếu căn cứ và gợi ý tiếp. Máy chủ kiểm tra schema và điều kiện nghiệp vụ.

- Nguồn: DOCX 23 Kiến trúc và chất lượng AI
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## AI03 — Chống chỉ dẫn từ học liệu

**Yêu cầu nguồn:** Chống chỉ dẫn từ học liệu: xem nội dung nhập là dữ liệu, không cho câu trong bài thay đổi quyền, tiết lộ đáp án hoặc gọi hành động ngoài phạm vi.

- Nguồn: DOCX 23 Kiến trúc và chất lượng AI
- Hiện trạng: Một phần
- Đối chiếu: Có system instruction coi học liệu là dữ liệu; chưa đánh giá chống injection thực tế.
- Mã liên quan: app/api/pilot/route.ts
- Phân kỳ: R2

## AI04 — Bộ kiểm tra chất lượng

**Yêu cầu nguồn:** Bộ kiểm tra chất lượng: câu hỏi mơ hồ, dẫn chứng thiếu, người học phản biện đáp án, transcript sai, giọng khác, yêu cầu không lộ đáp án và API mất kết nối.

- Nguồn: DOCX 23 Kiến trúc và chất lượng AI
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## AI05 — Tái lập

**Yêu cầu nguồn:** Tái lập: lưu model, phiên bản prompt/rubric/nội dung, thời điểm và đầu ra cần thiết theo chính sách. Có thể đối chiếu các lần cập nhật.

- Nguồn: DOCX 23 Kiến trúc và chất lượng AI
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R2

## AI06 — Fallback trung thực

**Yêu cầu nguồn:** Fallback trung thực: báo dịch vụ chưa sẵn sàng, cho dùng học liệu/gợi ý đã duyệt; không trình bày phản hồi kịch bản như LLM thật.

- Nguồn: DOCX 23 Kiến trúc và chất lượng AI
- Hiện trạng: Một phần
- Đối chiếu: Có prepared fallback gắn nhãn; AI provider thật chưa kiểm thử.
- Mã liên quan: app/api/pilot/route.ts
- Phân kỳ: R2

## DT01 — Các lựa chọn tách biệt

**Yêu cầu nguồn:** Các lựa chọn tách biệt: sử dụng sản phẩm, tham gia nghiên cứu, gửi dữ liệu đến AI, dùng mic/camera và chia sẻ cộng đồng. Quyền thiết bị không tự thay thế giải thích mục đích thu thập.

- Nguồn: DOCX 24 Quyền dữ liệu và độ tin cậy vận hành
- Hiện trạng: Một phần
- Đối chiếu: Có consent nghiên cứu/AI riêng và quyền thiết bị; chưa mô hình chia sẻ nhóm đầy đủ.
- Mã liên quan: db/schema.ts; app/api/pilot/route.ts
- Phân kỳ: R1

## DT02 — Tối thiểu hóa

**Yêu cầu nguồn:** Tối thiểu hóa: chỉ lưu dữ liệu cần cho nhiệm vụ. Audio, hình ảnh và tọa độ chi tiết cần quyết định riêng; mặc định hạn chế bản thô nếu mục tiêu không cần.

- Nguồn: DOCX 24 Quyền dữ liệu và độ tin cậy vận hành
- Hiện trạng: Một phần
- Đối chiếu: Không lưu audio/camera thô ở pilot; chưa chính sách chi tiết cho module mới.
- Mã liên quan: db/schema.ts; app/api/pilot/route.ts
- Phân kỳ: R1

## DT03 — Mã ổn định

**Yêu cầu nguồn:** Mã ổn định: mã người tham gia ngẫu nhiên và bền giữa các lần xuất; bảng liên kết danh tính giữ riêng. Dữ liệu thay tên bằng mã vẫn có thể liên kết lại, không tự trở thành ẩn danh tuyệt đối.

- Nguồn: DOCX 24 Quyền dữ liệu và độ tin cậy vận hành
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1

## DT04 — Xuất và xóa

**Yêu cầu nguồn:** Xuất và xóa: xuất dữ liệu cá nhân, xóa bộ nhớ AI, rút nghiên cứu và xử lý bản sao nghiên cứu theo quy trình đã công bố. Ghi rõ giới hạn với bản đã được tải xuống.

- Nguồn: DOCX 24 Quyền dữ liệu và độ tin cậy vận hành
- Hiện trạng: Một phần
- Đối chiếu: Có export/delete/withdraw; chưa bộ nhớ AI riêng và quy trình bản sao hoàn chỉnh.
- Mã liên quan: db/schema.ts; app/api/pilot/route.ts
- Phân kỳ: R1

## DT05 — Lưu giữ

**Yêu cầu nguồn:** Lưu giữ: xác định thời hạn theo loại dữ liệu, thực hiện tác vụ tự xóa khi đã cam kết, kiểm tra lỗi tác vụ và sao lưu. Không gọi chính sách thủ công là tự động.

- Nguồn: DOCX 24 Quyền dữ liệu và độ tin cậy vận hành
- Hiện trạng: Một phần
- Đối chiếu: Chính sách 30 ngày thủ công; chưa tự purge/giám sát backup.
- Mã liên quan: db/schema.ts; app/api/pilot/route.ts
- Phân kỳ: R1

## DT06 — Độ tin cậy

**Yêu cầu nguồn:** Độ tin cậy: sao lưu, diễn tập phục hồi, gửi lại an toàn, chống tạo bản ghi trùng, trạng thái đồng bộ và cách khôi phục phiên học.

- Nguồn: DOCX 24 Quyền dữ liệu và độ tin cậy vận hành
- Hiện trạng: Một phần
- Đối chiếu: Có lưu server/khôi phục session; thiếu idempotency, backup và diễn tập restore.
- Mã liên quan: db/schema.ts; app/api/pilot/route.ts
- Phân kỳ: R1

## DT07 — Phân tích đầy đủ

**Yêu cầu nguồn:** Phân tích đầy đủ: phân trang xuất, tổng số, số bản ghi thiếu, phiên bản schema; không âm thầm cắt sự kiện. Phân biệt số người, số buổi và số lần thử.

- Nguồn: DOCX 24 Quyền dữ liệu và độ tin cậy vận hành
- Hiện trạng: Một phần
- Đối chiếu: Xuất giới hạn 500/5000 bản ghi; chưa phân trang/tổng/thiếu dữ liệu.
- Mã liên quan: db/schema.ts; app/api/pilot/route.ts
- Phân kỳ: R1

## CP01 — Kéo bằng chuột/cảm ứng

**Yêu cầu nguồn:** Kéo bằng chuột/cảm ứng: Có vùng nắm rõ; phân biệt click và drag; chỉ vùng kéo chặn gesture cuộn

- Nguồn: Markdown §18.2
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1

## CP02 — Giới hạn vị trí

**Yêu cầu nguồn:** Giới hạn vị trí: Nhân vật không ra khỏi vùng nhìn thấy; chừa safe area, thanh điều hướng, vùng bàn phím ảo

- Nguồn: Markdown §18.2
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1

## CP03 — Ghim cạnh

**Yêu cầu nguồn:** Ghim cạnh: Tuỳ chọn bám cạnh gần nhất; không bật quán tính khiến nhân vật trượt khó kiểm soát

- Nguồn: Markdown §18.2
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1

## CP04 — Lưu vị trí

**Yêu cầu nguồn:** Lưu vị trí: Lưu sau khi thả, không ghi từng pixel; khôi phục khi tải lại hoặc chuyển trang

- Nguồn: Markdown §18.2
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1

## CP05 — Thích nghi kích thước

**Yêu cầu nguồn:** Thích nghi kích thước: Resize/zoom/xoay màn hình thì tính lại vị trí; toạ độ desktop không áp cứng cho mobile

- Nguồn: Markdown §18.2
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1

## CP06 — Không cần kéo

**Yêu cầu nguồn:** Không cần kéo: Menu “Đặt ở góc trái/phải”, “Đặt lại vị trí”; hỗ trợ bàn phím

- Nguồn: Markdown §18.2
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1

## CP07 — Mở panel

**Yêu cầu nguồn:** Mở panel: Panel tự chọn phía đủ chỗ; không tràn viewport hay đè lên nhân vật

- Nguồn: Markdown §18.2
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1

## CP08 — Thu gọn/ẩn

**Yêu cầu nguồn:** Thu gọn/ẩn: Có nút hiển thị rõ, khôi phục được, không làm mất nội dung đang trao đổi

- Nguồn: Markdown §18.2
- Hiện trạng: Chưa triển khai theo đặc tả mới
- Đối chiếu: Chưa tìm thấy luồng hoàn chỉnh đáp ứng yêu cầu này trong mã pilot đã rà soát.
- Mã liên quan: —
- Phân kỳ: R1

## Cập nhật Phase 1

Bảng phía trên giữ đối chiếu lúc tiếp nhận. Bằng chứng triển khai mới tại [Phase 1](phase-1-data.md):

- **DT03**: Đã triển khai mã ngẫu nhiên bền, ánh xạ riêng, kiểm tra rút/đồng ý lại/xóa trong Phase 1.
- **DT07**: Đã triển khai phân trang, tổng, revision và từ chối bản xuất không nhất quán; UI tải đủ trang.
- **AD01**: Phase 1 có contentVersion, từng Attempt và HintExposure; chưa hồ sơ bằng chứng xuyên kỹ năng hoặc độ chắc chắn.
- **RD08**: Phase 1 tách firstResults và kết quả gần nhất; chưa đủ tổng kết chiến lược/từ/bài mới.
- **BH01**: Phase 1 chống gửi trùng event và ledger; chưa đủ mọi loại sự kiện của đặc tả.
- **DT06**: Phase 1 có transaction/CAS chống trùng đáp án/gợi ý và khôi phục; backup/restore và các thao tác khác chưa đầy đủ.
