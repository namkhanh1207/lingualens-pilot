# Đặc tả phát triển LinguaLens

Hai tài liệu mới được tiếp nhận ngày 24/09/2026 làm căn cứ mở rộng sản phẩm. Chúng mô tả đích cần xây; không chứng minh các chức năng đã chạy và không tự cho phép cài công cụ, đổi cấu hình cá nhân hoặc thay dịch vụ.

## Điểm bắt đầu

- [Kế hoạch tích hợp và quyết định](decisions/2026-09-24-integration.md): phạm vi, khác biệt, thứ tự và phần việc tiếp theo.
- [Ma trận 143 yêu cầu](product/requirements-matrix.md): giữ nguyên 135 yêu cầu sản phẩm và 8 yêu cầu CP, đối chiếu từng mã với pilot.
- [Dữ liệu yêu cầu](product/requirements.json): cùng nội dung để quản lý và kiểm tra tự động.
- [Đặc tả Companion](product/companion.md): toàn bộ mục 18, bao gồm hành vi, trạng thái, điều phối, quyền và nghiệm thu.
- [Giao diện và chuyển động](design/ui-motion.md): quy tắc và ánh xạ trải nghiệm–UI.
- [33 repo tham khảo](architecture/repository-register.md): danh mục từ tài liệu, chưa phải quyết định cài đặt.
- [Bản nguồn được lưu](sources/2026-09-24/): DOCX, Markdown nguyên bản, bản trích text và checksum.

## Cách dùng

Mỗi thay đổi chọn một lát cắt có mã yêu cầu, hợp đồng dữ liệu, trạng thái UI, quyền, tiêu chí kiểm tra và bằng chứng. Đọc cả chương gốc vì các đoạn nghiệm thu ngoài mã cũng là phần đặc tả. Cập nhật trạng thái sau khi có bằng chứng; không đánh dấu hoàn thành chỉ vì đã có giao diện.

Khi tài liệu có khác biệt: yêu cầu trực tiếp mới nhất của người dùng được ưu tiên; đặc tả sản phẩm xác định kết quả, nghiên cứu kỹ thuật cung cấp cách làm có điều kiện. Mục 18 của bản Markdown cập nhật vị trí Companion cơ bản lên R1; không đẩy toàn bộ chức năng AI/memory/reminder vào R1 theo đó.

Lượt tiếp nhận ban đầu chỉ cập nhật tài liệu. Tiến độ sau đó: [Phase 1 dữ liệu nghiên cứu](product/phase-1-data.md). API AI vẫn để sau theo quyết định đang có.

- [Phase 2 — Từ vựng trong ngữ cảnh](product/phase-2-vocabulary.md)

- [Phase 3 — Companion cơ bản](product/phase-3-companion.md)

- [Phase 4 — Hành trình đa kỹ năng](product/phase-4-skill-path.md)
