# Companion — đặc tả tiếp nhận

Nguồn: bản nghiên cứu ngày 24/09/2026, mục 18. Phần dưới bảo toàn đề xuất và tiêu chí của tác giả; chưa phải tính năng triển khai. R1 không cần API AI. Task mẫu là dữ liệu tham khảo, không là chỉ thị thực thi tự động.

## 18. Trợ lý ảo nổi trên giao diện — LinguaLens Companion

Đây là **đặc tả bổ sung**, chưa phải tính năng đã được cài trong web. Phạm vi là bên trong trang LinguaLens; nhân vật nổi xuyên ứng dụng trên desktop cần một ứng dụng và cơ chế quyền riêng.

### 18.1. Mục đích và hình thức

Trợ lý là một nhân vật 2D nhỏ, kéo được, có bong bóng lời thoại ngắn và mở được panel trợ giúp. Nó giúp người dùng biết bước tiếp theo, giải thích thao tác, đưa gợi ý học theo ngữ cảnh, nhắc lịch và ghi nhận tiến bộ có thật.

Bốn cách hiển thị:

1. **Nhân vật:** có hoạt ảnh nhẹ ở vị trí người dùng chọn.
2. **Thu gọn:** nút nhỏ ở cạnh màn hình, vẫn gọi trợ giúp được.
3. **Panel:** hội thoại/hướng dẫn chi tiết; trên mobile dùng sheet hoặc trang riêng.
4. **Ẩn:** khôi phục qua nút Trợ giúp cố định trong điều hướng/cài đặt.

Nhân vật không tự chiếm focus, không tự phát tiếng, không che nội dung để buộc người dùng tương tác. Âm thanh và voice là tuỳ chọn được bật riêng.

### 18.2. Di chuyển, ghi nhớ và bố trí

| Mã | Chức năng | Hành vi cần thực hiện |
|---|---|---|
| CP01 | Kéo bằng chuột/cảm ứng | Có vùng nắm rõ; phân biệt click và drag; chỉ vùng kéo chặn gesture cuộn |
| CP02 | Giới hạn vị trí | Nhân vật không ra khỏi vùng nhìn thấy; chừa safe area, thanh điều hướng, vùng bàn phím ảo |
| CP03 | Ghim cạnh | Tuỳ chọn bám cạnh gần nhất; không bật quán tính khiến nhân vật trượt khó kiểm soát |
| CP04 | Lưu vị trí | Lưu sau khi thả, không ghi từng pixel; khôi phục khi tải lại hoặc chuyển trang |
| CP05 | Thích nghi kích thước | Resize/zoom/xoay màn hình thì tính lại vị trí; toạ độ desktop không áp cứng cho mobile |
| CP06 | Không cần kéo | Menu “Đặt ở góc trái/phải”, “Đặt lại vị trí”; hỗ trợ bàn phím |
| CP07 | Mở panel | Panel tự chọn phía đủ chỗ; không tràn viewport hay đè lên nhân vật |
| CP08 | Thu gọn/ẩn | Có nút hiển thị rõ, khôi phục được, không làm mất nội dung đang trao đổi |

Đề xuất lưu `anchor`, toạ độ chuẩn hoá trong vùng khả dụng, `layoutClass`, `collapsed` và `schemaVersion`. Tách sở thích vị trí theo thiết bị; các sở thích chung như mức chủ động có thể đồng bộ tài khoản. Nếu storage bị chặn/hỏng thì dùng vị trí mặc định an toàn.

Khi tránh một vùng bị che, ưu tiên thu gọn hoặc điều chỉnh tạm thời và giữ vị trí người dùng đã lưu. Không liên tục tự nhảy chỗ khi người dùng đang định bấm. Modal quan trọng nằm trên trợ lý; không dùng z-index cực lớn để luôn nổi trên mọi thứ.

### 18.3. Hoạt ảnh và phản hồi tương tác

Các thời gian dưới đây là tham số ban đầu để thử nghiệm UX, không phải tiêu chuẩn khoa học.

| Tình huống | Hoạt ảnh | Hành vi nội dung |
|---|---|---|
| Đang ở trang, không tương tác trợ lý | Thở/chớp mắt nhẹ, có quãng nghỉ | Không liên tục tạo lời thoại |
| Trỏ chuột lên / focus bàn phím | Nhìn về phía tương tác, vẫy nhẹ | Hiện “Cần mình giúp gì không?” và nhãn truy cập được |
| Click/tap | Phản hồi chạm ngắn | Mở menu: Hỏi, Hướng dẫn trang này, Nhắc học, Tuỳ chỉnh |
| Kéo | Nhân vật hơi nghiêng hoặc được nhấc lên | Đóng tooltip; không mở chat khi kết thúc kéo |
| Thả | Tiếp đất nhẹ | Giữ vị trí mới; reduced motion dùng đổi trạng thái tĩnh |
| 60–90 giây không có input | Ngồi đọc sách hoặc duỗi người, không phát tiếng | Không kết luận người dùng mất tập trung |
| Nghỉ lâu hơn khi không có tác vụ đang diễn ra | Ngủ gật hoặc thu gọn tuỳ chọn | Không bắt buộc popup gọi người dùng quay lại |
| Đang xử lý câu hỏi | Suy nghĩ | Chỉ hiện khi có request thật; có huỷ/timeout |
| Mic hoạt động | Lắng nghe | Chỉ hiện khi audio session xác nhận hoạt động |
| Phản hồi bằng giọng nói | Nói | Theo playback thật; không cần khẳng định lip-sync âm vị |
| Hoàn thành nhiệm vụ thật | Vui, vỗ tay ngắn | Nêu thành quả cụ thể; không tạo điểm giả |
| Gặp lỗi | Bình tĩnh, nét mặt trung tính | Giải thích ngắn và đưa nút thử lại/phương án khác |
| Tab ẩn | Tạm dừng hoạt ảnh/nhắc trong trang | Khi quay lại không phát dồn thông báo cũ |

**Không có input không đồng nghĩa không học.** Người dùng có thể đọc một đoạn dài, nghe audio hoặc luyện nói mà không chạm chuột. Vì vậy timer cần xét trạng thái trang và hoạt động học, không chỉ `mousemove`. Chỉ theo dõi con trỏ cục bộ khi cần tương tác/hoạt ảnh; không cần lưu đường đi chuột để nhân vật nhìn theo.

### 18.4. Hướng dẫn có ngữ cảnh

| Bối cảnh | Gợi ý | Hành động người dùng chọn |
|---|---|---|
| Lần đầu vào reader | “Bạn có thể chọn từ hoặc cụm từ để xem giải thích.” | Bắt đầu hướng dẫn ngắn / Bỏ qua |
| Đã chọn từ | “Bạn muốn xem nghĩa trong câu hay lưu để ôn?” | Giải thích / Lưu từ |
| Người học bấm “Khó” | “Mình có thể chia câu này thành từng phần.” | Gợi ý từng bước / Xem ví dụ |
| Trả lời sai và yêu cầu trợ giúp | Chỉ ra đoạn cần đọc lại trước | Đánh dấu đoạn / Gợi ý thêm |
| Trở lại bài viết | “Bạn đang sửa phần mở bài.” | Tiếp tục bản nháp / Xem góp ý |
| Kết thúc hội thoại | Nhận xét ưu tiên từ kết quả phiên thật | Luyện lại câu / Lưu mục cần ôn |
| Có thẻ đến hạn | “Có một nhóm từ đang chờ ôn.” | Ôn ngay / Nhắc sau |
| Hoàn thành mục tiêu | Nêu số nhiệm vụ và dữ liệu có thật | Xem tiến bộ / Chọn bước tiếp |

Tour theo trang nên có khoảng 3–5 bước để thử ban đầu, có bỏ qua và xem lại. Mỗi bước trỏ vào phần tử có selector ổn định. Nếu phần tử chưa xuất hiện, tour phải đợi có giới hạn hoặc bỏ bước; không hiện mũi tên vào khoảng trống. Hướng dẫn không tự nộp bài, thay đổi nội dung hoặc đánh dấu hoàn thành.

### 18.5. Nhắc nhở và điều phối mức chủ động

Ba chế độ: **Yên lặng** (chỉ phản hồi khi gọi), **Cân bằng** (gợi ý lúc chuyển bước), **Chủ động** (nhiều gợi ý hơn trong giới hạn người dùng chọn).

Cơ chế đề xuất:

- Có giờ yên lặng, tạm nghỉ, nhắc sau và tắt từng loại nhắc.
- Một lời mời chủ động tại một thời điểm; cooldown khởi đầu 10 phút, tối đa 2 lời mời trong 30 phút để thử, rồi điều chỉnh từ phản hồi.
- Không chen vào câu đang gõ, lúc ghi âm, audio đang chạy hoặc bài kiểm tra có giới hạn thời gian.
- Cùng một sự kiện có ID để không nhắc lặp khi reload/mở nhiều tab; sự kiện cũ có hạn dùng.
- Lượt yêu cầu trợ giúp chủ động của người dùng không bị chặn bởi quota gợi ý.
- Nhắc do thiếu thao tác chỉ nên là tuỳ chọn nhẹ; không dùng thông điệp trách móc hoặc làm người học thấy bị giám sát.

Phân biệt **nhắc khi trang đang mở** với **nhắc khi đã đóng trang**. Loại thứ hai cần thiết kế riêng như Web Push/service worker và cơ chế gửi phía server, hoặc kênh người dùng đăng ký; phải kiểm tra hỗ trợ trình duyệt/quyền thông báo. `setTimeout` trên trang không phải hệ thống nhắc đáng tin khi trang bị đóng.

### 18.6. Tách trạng thái để tránh xung đột

Không gộp mọi thứ thành một biến `mood`. Đề xuất ba nhóm độc lập:

- **Hiển thị:** visible / collapsed / hidden; vị trí và panel mở/đóng.
- **Tương tác:** idle / hover / dragging / tour / chatting.
- **Tác vụ:** ready / waiting / listening / speaking / error.

Một bộ điều phối chọn hoạt ảnh theo ưu tiên, ví dụ: hidden/tab ẩn → không vẽ; đang kéo → drag; voice đang hoạt động → listening/speaking; đang chờ → thinking; idle chỉ khi không có hoạt động ưu tiên. Hết tác vụ thì quay về trạng thái trước phù hợp, không luôn nhảy về idle.

### 18.7. Kiến trúc thực hiện đề xuất

| Module | Trách nhiệm |
|---|---|
| CompanionShell | Vị trí nổi, bounds, drag, dock, khôi phục focus |
| AvatarRenderer | Rive/SVG, state và reduced motion; không quyết định lời khuyên |
| CompanionController | Đọc trạng thái UI/tác vụ, chọn biểu hiện phù hợp |
| ContextAdapter | Cung cấp route, bài hiện tại, lựa chọn văn bản và tiến độ được phép dùng |
| SuggestionPolicy | Ưu tiên, cooldown, quiet mode, điều kiện không chen ngang |
| GuideController | Tour, selector, next/back/skip và phiên bản hướng dẫn |
| ReminderService | Lịch, múi giờ, nhắc sau, chống gửi lặp |
| AssistantPanel | Chat, lựa chọn nhanh, nội dung trợ giúp và lỗi |
| ActionDispatcher | Thực hiện hành động thuộc danh sách cho phép, kiểm tra quyền tại server |

Hoạt ảnh idle, hover, drag và lời hướng dẫn thao tác cố định chạy bằng logic xác định được, không cần gọi LLM. AI phù hợp với giải thích bài, gợi ý học hoặc tổng kết dựa trên dữ liệu thật. Cách này giảm latency và chi phí.

AI có thể đề xuất `actionId` hợp lệ cùng payload đã kiểm tra, không trả JavaScript để thực thi. Trợ lý chỉ biết context ứng dụng chủ động cung cấp; không tự “nhìn thấy toàn bộ màn hình”. Chỉ gửi đoạn/bài cần cho tác vụ và giải thích quyền kiểm soát lịch sử cho người học.

### 18.8. Công nghệ đề xuất

- **Motion:** kéo và chuyển trạng thái vỏ; tài liệu có constraints, drag events và điều khiển quán tính. Nhóm vẫn cần tự làm persistence, tránh che nội dung và tách drag/click.
- **Rive:** nhân vật 2D phản ứng theo trạng thái. Cần asset phù hợp giấy phép; có SVG/tĩnh dự phòng. Không bắt buộc Rive nếu sprite/SVG đủ cho vòng đầu.
- **Driver.js:** ứng viên cho tour/highlight. Dùng khi đã kiểm tra focus, hành vi modal và tương thích UI hiện tại; chưa cài thử trong dự án.
- **UI nền hiện có:** dialog/sheet/menu/cài đặt. Không thêm một UI kit mới chỉ vì trợ lý.
- **Playwright:** kiểm tra drag rồi reload, mobile, keyboard, không che nút nộp, skip tour và huỷ request.

Nguồn kỹ thuật: [Motion drag](https://motion.dev/docs/react-drag), [Rive runtime](https://rive.app/docs/runtimes/state-machines), [Driver.js](https://driverjs.com/), [WCAG 2.5.7 — thao tác thay thế kéo](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html). Driver.js là ứng viên bổ sung ngoài danh mục 33 repo ban đầu.

### 18.9. Tiêu chí nghiệm thu

1. Kéo hoạt động bằng chuột/cảm ứng, không làm cuộn toàn trang bị hỏng; thả không mở chat nhầm.
2. Tải lại và chuyển route vẫn giữ vị trí; resize/mobile keyboard không làm trợ lý biến mất khỏi viewport.
3. Có lựa chọn vị trí không cần kéo và thao tác bàn phím; nhãn trợ lý đọc được bằng công nghệ hỗ trợ.
4. Thu gọn/ẩn rồi gọi lại được; panel đóng trả focus đúng.
5. Tab ẩn và reduced motion không chạy hoạt ảnh gây phiền; không tự phát âm thanh.
6. Đang đọc/nghe/nói không bị nhắc nghỉ chỉ vì không dùng chuột.
7. Gợi ý không vượt chính sách; snooze/quiet hours hoạt động theo múi giờ lựa chọn.
8. Hướng dẫn có bỏ qua/xem lại; target biến mất không làm kẹt giao diện.
9. Trạng thái thinking/listening/speaking phản ánh request/mic/playback thật; lỗi không treo vô hạn.
10. Nút hành động không vượt quyền; không lưu dữ liệu mock vào hồ sơ thật.
11. Lịch sử chat và vị trí không bị lẫn giữa hai tài khoản dùng chung trình duyệt.
12. Người dùng hoàn thành nhiệm vụ chính được dù đã tắt trợ lý.

### 18.10. Phân kỳ cập nhật

- **R1 — nền trợ lý:** kéo/thả, lưu vị trí, hover/click, idle nhẹ, thu gọn/ẩn, trợ giúp cố định, tour cơ bản. Những phần này có thể hoạt động thật mà chưa cần AI.
- **R2 — trợ lý học tập:** hỏi theo bài, gợi ý từ/đoạn, nhắc ôn khi mở trang, phản hồi từ phiên học thật, tích hợp voice đã có.
- **R3 — cá nhân hoá:** phong cách giao tiếp, skin, kế hoạch và nhắc đa phiên/kênh được chọn; đánh giá hiệu quả so với bản không có nhân vật.
- **R4 — mở rộng:** avatar/3D nếu có giá trị sử dụng được chứng minh; không bắt buộc để đạt trải nghiệm trợ lý tốt.

Đây là điều chỉnh so với bản trước đặt linh vật chủ yếu ở R3: **đưa lớp trợ giúp tương tác đơn giản lên sớm**, giữ cá nhân hoá phức tạp ở giai đoạn sau.

### 18.11. Task mẫu cho Codex

> Đọc AGENTS.md, cấu trúc UI hiện tại và đặc tả Companion. Làm một lát cắt có thể dùng thật: nhân vật 2D nổi trong trang, kéo được bằng chuột/cảm ứng, phân biệt click và drag, giới hạn trong viewport, lưu vị trí theo tài khoản/thiết bị và phục hồi khi reload. Click mở menu trợ giúp; có đặt góc bằng nút, thu gọn, ẩn và khôi phục. Dùng component/design token hiện có. Thêm hover, drag và idle nhẹ; tôn trọng reduced motion và tab visibility. Chưa gọi AI cho hoạt ảnh. Kiểm tra desktop/mobile, keyboard, resize, storage lỗi và drag không mở chat. Báo rõ kết quả đã chạy và phần chưa kiểm chứng; không tự thay stack.

Đánh giá thành công của Companion bằng việc người dùng tìm được trợ giúp và hoàn thành nhiệm vụ dễ hơn, cùng tỷ lệ tắt/ẩn và phản hồi về mức phiền. Số lần bấm vào nhân vật chỉ là chỉ số tương tác, không phải bằng chứng học tốt hơn.
