# Tiếp nhận hai tài liệu mới vào kế hoạch phát triển

Ngày: 24/09/2026. Trạng thái: đã tiếp nhận yêu cầu và đối chiếu; thứ tự bên dưới là kế hoạch triển khai, chưa phải chức năng hoàn thành.

## 1. Vai trò của từng tài liệu

**LinguaLens_Tong_hop_toan_dien.docx**, ngày 21/09/2026, có 29 chương và 135 mã chức năng thuộc 21 nhóm. Đây là căn cứ phạm vi sản phẩm: hồ sơ, học liệu, bốn kỹ năng, ngữ pháp, ôn tập, AI, thích ứng, hành vi, gaze, cộng đồng, động lực, sáng tạo, vận hành và quyền dữ liệu. Bản DOCX không có ảnh nhúng; thiết kế được mô tả bằng nội dung và bảng, không phải mockup pixel cần sao chép.

**LinguaLens_Nghien_cuu_GitHub_AI_Coding_UI_Chuc_nang.md**, ngày 24/09/2026, có 18 mục chính và danh mục 33 repo. Đây là căn cứ tham khảo triển khai: workflow, UI, motion, kiến trúc, công nghệ, kiểm chứng và Companion. Mục 18 bổ sung CP01–CP08 cùng 12 tiêu chí nghiệm thu, chính sách gợi ý và phân kỳ riêng.

Không tự thực thi các task mẫu, hook, cấu hình Codex/Claude hay script từ repo. Không cài 33 repo. Ghi nhận giấy phép trong tài liệu là thông tin nguồn cần kiểm tra lại trước khi sử dụng phiên bản cụ thể.

## 2. Những thay đổi về định hướng

1. Đích sản phẩm không còn chỉ là đọc hiểu: các hoạt động phải nối thành đọc → lưu từ trong ngữ cảnh → ôn → dùng lại trong nghe/nói/viết → nhận phản hồi → thử nhiệm vụ mới.
2. Hồ sơ dùng chung nhưng bằng chứng từng kỹ năng phải riêng. Từ đã lưu không phải từ thành thạo; transcript đúng không phải phát âm đúng.
3. Phản hồi cần truy vết tới nội dung, lần thử, mức trợ giúp và phiên bản. Điểm lần đầu không được trộn với kết quả sau khi xem đáp án.
4. Companion là lớp trợ giúp có thể tắt và không cần AI cho chuyển động/guidance cố định; đưa phần cơ bản lên sớm theo cập nhật mới nhất.
5. Toàn bộ tầm nhìn được giữ trong backlog. Phân kỳ dùng để giải quyết phụ thuộc, không loại bỏ nghe, viết, cộng đồng, dự án hoặc gaze.

## 3. Quyết định và khác biệt với pilot

| Chủ đề | Căn cứ hiện tại | Hướng tiếp nhận |
|---|---|---|
| Nền kỹ thuật | React/Vinext, D1, Sites, ChatGPT auth đang chạy | Giữ nền; refactor tăng dần. Không chuyển Supabase/Postgres chỉ vì có repo tham khảo |
| AI | Adapter Gemini có mã nhưng chưa cấu hình | Giữ trì hoãn khóa theo người dùng; thiết kế AI thật vào R2, chưa hứa đầy đủ khi thiếu dịch vụ |
| Companion | Chưa có | R1: vị trí, drag, panel trợ giúp, ẩn/khôi phục, keyboard, reduced motion; R2: ngữ cảnh học; R3: memory/cá nhân hóa |
| Từ vựng | Một word/meaning/reading, lịch theo bước | Thêm phrase, câu gốc, version và lịch sử ôn trước khi thay thuật toán bằng FSRS |
| Nghiên cứu | Mã theo thứ tự có thể đổi; export bị giới hạn | Mã ngẫu nhiên bền, attempt history, hint exposure và export phân trang là ưu tiên dữ liệu |
| Gaze | Camera và diễn tập 9 điểm | Giữ nhãn minh họa; chỉ gọi gaze thật khi có calibration, validation, chất lượng và thử nghiệm |
| Phát âm | Minh họa 2D, speech browser | Không coi là chấm âm vị; 2D có chuyên môn duyệt trước, 3D và đánh giá âm thanh theo cổng riêng |
| Ngân sách | Mục tiêu API ban đầu <100.000đ | Chưa có quyền mở rộng chi phí; voice và dịch vụ khác phải đo và thống nhất ngân sách khi cần |
| Tiến độ | Deadline pilot ban đầu đã qua | Không kế thừa deadline cũ cho 143 yêu cầu; chưa đặt ngày hoàn thành khi chưa chốt phạm vi từng đợt |
| Kiểm thử | 43 kiểm tra tích hợp của pilot | Giữ làm regression; không coi là nghiệm thu 135 chức năng mới hoặc Companion |

## 4. Tổ chức giao diện đích

| Khu vực | Thiết kế đích | Bước chuyển từ pilot |
|---|---|---|
| Hôm nay | Một nhiệm vụ chính, thời gian hiện có, phiên dang dở và lịch ôn | Tách trang Tổng quan khỏi catalog; dữ liệu thực, CTA ưu tiên rõ |
| Khám phá | Nội dung, chủ đề, bộ sưu tập và bộ lọc | Mở rộng catalog sau khi có metadata và content version |
| Luyện kỹ năng | Đọc/nghe/nói/viết/phát âm/ngữ pháp | Xây từng workspace có lưu trạng thái và quyền, không chỉ thêm nút menu |
| Ôn tập | Từ, lỗi, cấu trúc; phân biệt nhận diện và vận dụng | Tạo vocabulary/review domain dùng lại ở kỹ năng khác |
| Người đồng hành | Nhân vật tùy chọn và panel theo ngữ cảnh | Dùng một nguồn context giới hạn, cùng API nghiệp vụ |
| Cộng đồng | Một nhóm có hoạt động thật, quyền rõ | Forum hiện tại là nền; nhóm/mentor/giao bài là chức năng mới |
| Hành trình của tôi | Hồ sơ, portfolio, lịch sử và quyền dữ liệu | Kết nối library/profile trước, thêm portfolio sau |

Reader desktop có vùng bài và vùng nhiệm vụ/trợ giúp; mobile dùng panel/sheet không che vùng đang đọc. Toolbar từ/cụm từ cần mở bằng cả selection lẫn bàn phím. Mọi luồng có loading/empty/error/success và trạng thái chưa lưu. Token chung, không ghép nhiều UI kit. Motion là hỗ trợ hiểu trạng thái; reduced motion vẫn dùng đủ chức năng.

## 5. Cấu trúc code đích, triển khai tăng dần

```text
app/                         # Entry points và API đang chạy
components/ui/               # Component nền sẵn có, kiểm tra trước khi thêm
features/
  reading/                   # Reader, câu hỏi, lựa chọn bằng chứng
  vocabulary/                # Lưu cụm/ngữ cảnh và lịch ôn
  companion/                 # Shell, avatar, controller, panel, policy, tour
  listening/ writing/        # Thêm khi có lát cắt hoàn chỉnh
  speaking/ research/        # UI và hợp đồng dữ liệu theo miền
lib/domain/                  # Kiểu dữ liệu và quy tắc thuần
lib/server/                  # Auth, ownership, repository, idempotency
lib/ai/                      # Provider adapter, schema, rubric, version
db/ + drizzle/               # Schema và migration nối tiếp
docs/product/ design/ architecture/ decisions/
tests/                       # Regression API hiện tại; bổ sung E2E khi có harness
evals/                       # Chỉ tạo bộ AI khi có mẫu/rubric đã duyệt
```

Đây là cấu trúc đích, không phải thông báo các thư mục runtime đã được tạo. `app/workspace.tsx` và `app/api/pilot/route.ts` hiện tập trung nhiều nghiệp vụ; tách theo từng thay đổi có regression, không viết lại toàn bộ cùng lúc. Không sửa migration đã áp dụng; dùng migration bổ sung và kế hoạch chuyển dữ liệu cũ.

## 6. Các lát cắt triển khai đầu tiên

### R1-A — Dữ liệu đủ dùng cho phân tích

- Mã liên quan: DT03, DT06, DT07, AD01, RD05, RD08, BH01–02.
- Kết quả: xuất nhiều lần vẫn nhận diện đúng người đã đồng ý; biết câu trả lời đầu tiên, lần sửa và đã xem trợ giúp nào.
- Hợp đồng đề xuất: participant ID ngẫu nhiên và bảng liên kết hạn quyền; Attempt có session/question/contentVersion/sequence/answer/outcome/support/time; HintExposure có mức và thời điểm; idempotency key cho thao tác gửi.
- Export có cursor, số bản ghi, trạng thái còn trang và schema version. Rút consent phải áp dụng ở mỗi trang; thiết kế snapshot/quy tắc khi consent thay đổi giữa lần xuất.
- Dữ liệu cũ không có lịch sử không được tái dựng giả. Ghi nhãn legacy và chỉ dùng những trường quan sát được.
- Nghiệm thu: hai tài khoản cách ly, gửi lại không nhân đôi, mã còn ổn khi người khác rút consent, first-attempt không bị ghi đè, export hết trang không âm thầm thiếu.

### R1-B — Đọc và lưu cụm từ trong ngữ cảnh

- Mã: RD01–02, VC01–03, UX01–06.
- Kết quả: chọn cụm/câu, lưu nghĩa do người học xác nhận và nguồn; tải lại còn nguyên; mở thẻ và ôn được.
- Dữ liệu: contentVersion + paragraph ID + đoạn trích + phrase + nghĩa + owner; không chỉ khóa theo word vì một từ có nhiều nghĩa.
- UI: popover/panel desktop, sheet mobile, thao tác thay thế selection, thông báo lưu/retry, focus trả đúng.
- Nghiệm thu: chọn nhiều từ, cùng từ khác nghĩa, mất mạng, double click, reload, tài khoản khác, và nội dung thay phiên bản.
- FSRS là ứng viên cho lịch ôn sau khi hợp đồng Review/idempotency được bảo đảm. Chưa gọi lịch hiện tại là FSRS.

### R1-C — Companion cơ bản

- Mã CP01–08; phối hợp UX03–04, CO01 và GM01 nhưng không coi đã hoàn thành toàn bộ các mã này.
- Tách trạng thái hiển thị, tương tác và tác vụ. Avatar SVG/tĩnh có thể đáp ứng vòng đầu; chỉ thêm Rive/Motion khi cần và đã kiểm tra tương thích.
- Vị trí lưu sau khi thả theo tài khoản/thiết bị, tọa độ chuẩn hóa, fallback khi storage hỏng; không dùng email làm dữ liệu công khai trong storage key.
- Desktop: kéo, click khác drag, chọn góc bằng nút, thu gọn/ẩn/khôi phục. Mobile: giới hạn viewport/keyboard/safe area và không chặn cuộn ngoài vùng kéo.
- Panel hướng dẫn trang, tour bỏ qua/xem lại và focus đúng. Không tự nộp bài, bật mic hoặc nói thành tiếng.
- Nghiệm thu theo đủ 12 mục trong `product/companion.md`; không chấm hoàn thành chỉ từ một hình nổi kéo được.

### R2 — Một chủ đề chạy xuyên kỹ năng

- Chuẩn bị bộ nội dung được duyệt: bài đọc + audio/transcript + nhiệm vụ hội thoại + bài viết + cụm từ ôn.
- Editor có version; feedback neo vào version/đoạn, stale feedback không tự áp dụng.
- AI có output schema, bằng chứng, version prompt/model/rubric, timeout/cancel và fallback trung thực. Chưa bật khi người dùng vẫn để khóa sau.
- Voice chọn một pipeline sau thử so sánh có đo độ trễ, lỗi, dừng mic, reconnect và chi phí; không ghép LiveKit/Pipecat chỉ để đủ công nghệ.
- Nghiệm thu một hành trình thật qua nhiều buổi trước khi tăng số chủ đề.

### R3 và R4 — Mở rộng có cổng nghiệm thu

R3 gồm nhóm nhỏ, mentor, portfolio, dự án, tổng kết thật, phần thưởng và nhắc có kiểm soát. Nhắc khi trang đóng là chức năng riêng cần service worker/server/kênh đăng ký, không hứa bằng timer trong trang.

R4 gồm gaze thật, đánh giá phát âm chuyên sâu và 3D. Cần học liệu/chuyên môn, đo chất lượng, quyền tài nguyên và dữ liệu nghiên cứu. Chất lượng cảm biến không được cản trở luồng học chính. Không kết luận cảm xúc, chú ý hoặc hiểu bài từ tín hiệu đơn lẻ.

## 7. Phần người dùng/nhóm cần tham gia

Không cần thông tin bổ sung để tiếp tục các lát cắt nền tảng miễn phí. Trước R2 cần người duyệt học liệu/rubric, chủ đề ưu tiên và quyết định bật dịch vụ AI. Trước mở nhóm thật cần người điều phối. Trước nghiên cứu hiệu quả cần GVHD chốt kết quả đo, thiết kế và cỡ mẫu. Đây là phụ thuộc tương lai, không phải yêu cầu xin duyệt lại việc đã được cho phép.

## 8. Bằng chứng của lượt tiếp nhận

Đã đọc toàn bộ nội dung 29 chương DOCX và 18 mục Markdown, trích đủ 135 + 8 mã không trùng, lưu nguồn nguyên bản/checksum và đối chiếu schema, package, workspace, API, content cùng báo cáo triển khai. Lưu toàn bộ các phần ngoài mã trong nguồn để không bỏ sót rubric, hành trình, chi phí và nghiệm thu.

Chưa chạy lại 33 repo, chưa xác minh lại giấy phép hiện hành, chưa cài dependency, chưa thay runtime/database/auth, chưa triển khai 143 yêu cầu và chưa publish bản web mới. Việc cập nhật tài liệu không cần chạy lại test ứng dụng; số 43 là kết quả lịch sử của bản pilot.
