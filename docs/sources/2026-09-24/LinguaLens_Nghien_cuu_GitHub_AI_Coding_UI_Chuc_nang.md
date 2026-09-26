# LinguaLens — Nghiên cứu GitHub cho AI coding, hệ thống web, UI, chuyển động và chức năng học tập

Ngày tra cứu: **24/09/2026**. Cập nhật: Codex là công cụ code chính; bổ sung đặc tả Companion ở mục 17–18. Đây là báo cáo bổ sung cho kế hoạch chức năng–UI/UX, không thay thế đặc tả sản phẩm.

## 1. Kết luận và phạm vi kiểm chứng

**Khuyến nghị:** dùng AI coding theo đặc tả nhỏ, xây một nền tảng web nhất quán và chọn thư viện theo vấn đề cần giải quyết. Với LinguaLens, ưu tiên chuỗi **đọc → lưu từ trong ngữ cảnh → ôn tập → vận dụng khi nói/viết → phản hồi → theo dõi tiến bộ**. Hiệu ứng, linh vật và 3D phục vụ chuỗi này.

Báo cáo tuyển chọn **33 repo**, chia thành công cụ phát triển, hệ thống web, giao diện/chuyển động, chức năng học tập và kiểm chứng. Mỗi liên kết trong bảng là nguồn gốc để kiểm tra tiếp. Các đánh giá “nên dùng”, mức ưu tiên, kiến trúc và tiêu chí thử nghiệm là đề xuất riêng cho LinguaLens, không phải tuyên bố của tác giả repo.

### Đã làm và chưa làm

- Đã đọc tài liệu tổng hợp ba TikTok; đối chiếu README của gói demo và định hướng nghiên cứu trong PDF đính kèm.
- Đã tra cứu README/tài liệu chính thức của các repo; đối chiếu giấy phép, một số tệp LICENSE và hướng dẫn liên quan. Đã kiểm tra metadata trực tiếp qua GitHub API cho 13 repo trọng điểm, ghi ở phụ lục.
- Chưa cài và chạy toàn bộ repo; chưa benchmark trên máy của nhóm; chưa audit toàn bộ mã nguồn/dependency; chưa đo hiệu quả học tập. Vì vậy đây là **nghiên cứu tuyển chọn và kế hoạch thử nghiệm**, chưa phải chứng nhận khả năng tích hợp.
- Không dùng số sao làm bằng chứng chất lượng, không coi ngày push gần đây là bảo đảm bảo trì, không coi ví dụ demo là kết quả thử nghiệm độc lập.
- Không xác định được chắc chắn repo trong video TikTok thứ ba từ tài liệu mô tả. Các repo dưới đây là kết quả tìm kiếm độc lập, không khẳng định chính là repo xuất hiện trong video.

### Căn cứ dự án

README của `LinguaLens_AI_Release_Demo_Pack.zip` mô tả demo tĩnh, chuyển vai để xem giao diện, chưa có xác thực thật; AI, gaze và một số phân tích giọng nói sử dụng adapter minh họa. Đây là hiện trạng của **gói ZIP**, không phải kết luận về mọi bản triển khai khác của nhóm.

PDF `De_xuat_NCKH_AI_Adaptive_English_ULIS.pdf` ưu tiên reading, vocabulary, behavioral analytics và adaptive feedback; gaze là module thử nghiệm, voice/3D có thể phát triển sau. Vì vậy báo cáo giữ hai mục tiêu song song: sản phẩm đa kỹ năng có thể mở rộng, và thí nghiệm nghiên cứu đủ hẹp để đánh giá.

## 2. Những điểm cần hiệu chỉnh từ bản tổng hợp TikTok

| Ý tưởng trong tài liệu | Đánh giá sau đối chiếu | Cách áp dụng |
|---|---|---|
| Context, rules, skills, hooks, MCP có vai trò riêng | Hữu ích như bản đồ trách nhiệm; không phải chuỗi bắt buộc phải đi đủ | Bắt đầu bằng hướng dẫn dự án, một workflow và kiểm tra tự động |
| Thư mục `rules/`, `skills/`, `agents/` | Cần phân biệt tài liệu thông thường với đường dẫn công cụ tự phát hiện | Claude Code có `.claude/rules/`; không giả định thư mục bất kỳ ở root tự được nạp |
| CLAUDE.md là luật dự án | Đây là hướng dẫn trong context, không thay thế kiểm soát quyền hay CI | Ràng buộc dữ liệu ở server/database; quality gate ở CI |
| Hook chạy test cuối phiên | Có ích nhưng không đủ làm cổng chất lượng | Chạy kiểm tra phù hợp trong PR/CI; hook cục bộ hỗ trợ phản hồi nhanh |
| Nhiều agents giúp mạnh hơn | Chỉ có lợi khi công việc tách được, ít tranh chấp và có người tổng hợp | Không tạo nhiều vai trò chỉ để đủ bộ; một thay đổi phải có chủ sở hữu |
| Thêm MCP là tăng khả năng | Đúng về quyền truy cập, nhưng cũng tăng công cụ và context | Chỉ thêm công cụ giải quyết nhu cầu hiện tại; CLI có thể đơn giản hơn |
| Đổi endpoint là dùng được model khác | Không đủ chứng minh tương thích | Kiểm tra streaming, tool calling, schema, cancellation và lỗi trên bộ việc thật |
| Thư viện UI làm sản phẩm đẹp | Cung cấp nguyên liệu, chưa tạo ra hệ thống thiết kế | Chốt token, hierarchy, hành vi và trạng thái trước khi chọn hiệu ứng |

Nguồn đối chiếu: [Claude Code memory/rules](https://code.claude.com/docs/en/memory), [plugin reference](https://code.claude.com/docs/en/plugins-reference), [Playwright MCP](https://github.com/microsoft/playwright-mcp). Không cung cấp cấu hình JSON chưa kiểm chứng cho phiên bản công cụ mà nhóm chưa chốt.

Một hiệu chỉnh quan trọng: khả năng mở mã nguồn để đọc, quyền sử dụng thư viện và quyền dùng dịch vụ cloud là ba chuyện khác nhau. Ví dụ repo `anthropics/skills` ghi nhiều skill theo Apache-2.0 nhưng các skill tài liệu có điều kiện source-available riêng; không gán một giấy phép cho toàn bộ repo.

## 3. Bản đồ 33 repo

Quy ước: **A** = ưu tiên thử trong nền tảng; **B** = thêm khi luồng chính ổn định; **C** = nghiên cứu hoặc học pattern. Đây là độ phù hợp dự kiến, không phải điểm benchmark. Giấy phép dưới đây là ghi nhận từ nguồn đã xem, không thay thế việc kiểm tra LICENSE của commit/package thực dùng và các tài sản đi kèm.

### 3.1. AI coding và quy trình phát triển — 9 repo

| # | Repo / loại | Giá trị với LinguaLens | Mức | Giấy phép / giới hạn |
|---|---|---|---|---|
| 01 | [github/spec-kit](https://github.com/github/spec-kit) — workflow đặc tả | Biến từng chức năng thành yêu cầu, kế hoạch và công việc có thể review | A | MIT; template cần rút gọn theo quy mô nhóm |
| 02 | [obra/superpowers](https://github.com/obra/superpowers) — kỹ năng phát triển | Học cách làm rõ bài toán, lập kế hoạch, debug, kiểm chứng | B | MIT; không bật chồng nhiều workflow có quy tắc trùng nhau |
| 03 | [anthropics/skills](https://github.com/anthropics/skills) — ví dụ skills | Học cách đóng gói quy trình thiết kế và kiểm tra web | A, chọn lọc | Theo từng skill; có phần source-available |
| 04 | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) — hướng dẫn React/web | Review hiệu năng, composition, khả năng tiếp cận và tương tác | A nếu React | Kiểm tra điều kiện từng skill/tài nguyên khi sao chép |
| 05 | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) — tri thức thiết kế | Tạo phương án typography, màu sắc, bố cục để nhóm lựa chọn | B | MIT; đề xuất tự động chưa phải nghiên cứu người dùng |
| 06 | [upstash/context7](https://github.com/upstash/context7) — truy xuất tài liệu | Giúp agent tra API theo thư viện/phiên bản | A khi cần | MIT cho repo; dịch vụ có tài khoản/hạn mức riêng |
| 07 | [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp) — điều khiển trình duyệt | Agent khám phá lỗi, thao tác luồng, xem trạng thái UI | B | Apache-2.0; không đồng nhất với test hồi quy trong CI |
| 08 | [cline/cline](https://github.com/cline/cline) — coding agent | Lựa chọn môi trường AI coding có thao tác file, lệnh và công cụ | C/tuỳ nhóm | Apache-2.0; chi phí inference riêng |
| 09 | [stackblitz-labs/bolt.diy](https://github.com/stackblitz-labs/bolt.diy) — môi trường dựng app | Thử nhanh ý tưởng màn hình rồi đưa phần phù hợp vào repo chính | C | MIT cho mã; README nêu điều kiện WebContainers riêng khi dùng thương mại |

**Lựa chọn của mình:** lấy Spec Kit làm khung đặc tả nhẹ; học một số kỹ năng từ Anthropic/Vercel; dùng Context7 khi cần tra API. Superpowers là phương án quy trình khác để thử có kiểm soát. Cline và bolt.diy là công cụ làm việc, không phải dependency cần cài vào web học tiếng Anh.

### 3.2. Nền tảng hệ thống — 3 repo

| # | Repo | Ứng dụng | Mức | Giấy phép / giới hạn |
|---|---|---|---|---|
| 10 | [vercel/next.js](https://github.com/vercel/next.js) | Nền React full-stack nếu xây mới hoặc chuyển đổi có lý do | A có điều kiện | MIT; không cần viết lại backend tốt chỉ để dùng Next.js |
| 11 | [supabase/supabase](https://github.com/supabase/supabase) | Postgres, auth, storage và các dịch vụ liên quan | A có điều kiện | Apache-2.0 ở repo; thành phần/dịch vụ có điều kiện riêng; phải thiết kế phân quyền |
| 12 | [vercel/ai](https://github.com/vercel/ai) | Lớp TypeScript nối model/provider, tương tác AI trong web | A nếu TS | Apache-2.0 theo LICENSE đã đọc; model/API tính phí riêng |

Đây là phương án kiến trúc, chưa phải stack được xác nhận của bản pilot hiện tại. Trước khi chọn phải kiểm tra repo đang chạy, cơ sở dữ liệu, auth, deployment và năng lực nhóm.

### 3.3. Giao diện và chuyển động — 7 repo

| # | Repo | Dùng ở đâu | Mức | Giấy phép / giới hạn |
|---|---|---|---|---|
| 13 | [shadcn-ui/ui](https://github.com/shadcn-ui/ui) | Button, dialog, sheet, form, navigation làm nền đồng nhất | A | MIT; mã đưa vào dự án cần được nhóm bảo trì |
| 14 | [motiondivision/motion](https://github.com/motiondivision/motion) | Chuyển trạng thái, mở panel, đổi câu hỏi, phản hồi thao tác | A | MIT cho thư viện; không suy ra mọi sản phẩm liên quan đều miễn phí |
| 15 | [magicuidesign/magicui](https://github.com/magicuidesign/magicui) | Landing, giới thiệu hành trình học, tổng kết thành tích | B | MIT của repo; chọn ít component phù hợp |
| 16 | [imskyleen/animate-ui](https://github.com/imskyleen/animate-ui) | Tham khảo component có chuyển động và trạng thái rõ | B | MIT; tránh chồng với component nền cùng chức năng |
| 17 | [DavidHDev/react-bits](https://github.com/DavidHDev/react-bits) | Một vài điểm nhấn thị giác, thử nghiệm trang khám phá | B/C | MIT + Commons Clause; không coi là MIT thuần |
| 18 | [rive-app/rive-react](https://github.com/rive-app/rive-react) | Linh vật 2D phản ứng theo trạng thái học | B | MIT runtime; tài sản, editor và gói dịch vụ cần xét riêng |
| 19 | [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber) | Hiển thị mô hình cấu âm/đối tượng 3D | C | MIT; cần asset, kiến thức Three.js, kiểm tra tương thích React |

### 3.4. Chức năng học tập — 11 repo

| # | Repo | Ứng dụng trực tiếp | Mức | Giấy phép / giới hạn |
|---|---|---|---|---|
| 20 | [LuteOrg/lute-v3](https://github.com/LuteOrg/lute-v3) | Học kiến trúc trải nghiệm học ngoại ngữ qua đọc | A để nghiên cứu | MIT; Python/Flask, không phải component React cắm trực tiếp |
| 21 | [mozilla/readability](https://github.com/mozilla/readability) | Trích phần nội dung chính từ HTML được phép xử lý | A/B | Apache-2.0; không làm nhiệm vụ sanitize |
| 22 | [cure53/DOMPurify](https://github.com/cure53/DOMPurify) | Làm sạch HTML trước khi hiển thị | A khi nhận HTML | Apache-2.0 hoặc MPL-2.0; phải giữ dependency phù hợp |
| 23 | [open-spaced-repetition/ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) | Lập lịch ôn từ theo lịch sử trả lời | A | MIT; không tự tạo nội dung thẻ hoặc kết luận trình độ |
| 24 | [ueberdosis/tiptap](https://github.com/ueberdosis/tiptap) | Soạn bài, bài viết, phản hồi tại đoạn văn | B | MIT lõi; Pro Extensions/dịch vụ có điều kiện riêng |
| 25 | [yjs/yjs](https://github.com/yjs/yjs) | Đồng biên tập, chia sẻ thay đổi trong phòng học | C | Kiểm tra LICENSE phiên bản dùng; cần auth và lưu bền bên ngoài |
| 26 | [katspaugh/wavesurfer.js](https://github.com/katspaugh/wavesurfer.js) | Sóng âm, chọn đoạn nghe, nghe lại câu luyện nói | B | BSD-3-Clause; không phải bộ chấm phát âm |
| 27 | [livekit/agents](https://github.com/livekit/agents) | Hội thoại giọng nói thời gian thực | B | Apache-2.0 framework; turn-detection model có license riêng |
| 28 | [pipecat-ai/pipecat](https://github.com/pipecat-ai/pipecat) | Phương án pipeline voice Python thay thế | B | BSD-2-Clause; chọn qua thử nghiệm so sánh với LiveKit |
| 29 | [MontrealCorpusTools/Montreal-Forced-Aligner](https://github.com/MontrealCorpusTools/Montreal-Forced-Aligner) | Căn thời gian transcript với âm thanh, hỗ trợ phân tích | C | MIT code; kiểm tra acoustic model/dictionary riêng |
| 30 | [brownhci/WebGazer](https://github.com/brownhci/WebGazer) | Thử ước lượng vùng nhìn từ webcam | C | GPL-3.0-or-later theo LICENSE; bảo trì chính thức đã kết thúc |

### 3.5. Kiểm chứng — 3 repo

| # | Repo | Việc cần làm | Mức | Giấy phép / giới hạn |
|---|---|---|---|---|
| 31 | [microsoft/playwright](https://github.com/microsoft/playwright) | Test các hành trình thật trên trình duyệt; trace khi lỗi | A | Apache-2.0; viết assertion về kết quả, không chỉ click |
| 32 | [dequelabs/axe-core](https://github.com/dequelabs/axe-core) | Phát hiện một phần lỗi accessibility tự động | A | MPL-2.0; vẫn phải kiểm tra thủ công |
| 33 | [promptfoo/promptfoo](https://github.com/promptfoo/promptfoo) | So sánh prompt/model, kiểm tra output AI và regression | A khi nối AI | MIT; bộ mẫu và rubric quyết định giá trị phép đo |

## 4. Bộ công cụ ưu tiên và cách tránh dư thừa

### 4.1. Ba quyết định nên chốt trước

1. **Giữ hay thay nền hiện tại:** nếu backend/auth/database đã hoạt động, ưu tiên bổ sung module. Chỉ chuyển toàn bộ khi chi phí giữ lớn hơn chi phí chuyển và đã có kế hoạch dữ liệu.
2. **Một bộ UI nền:** shadcn/ui nếu dùng React; Motion cho chuyển trạng thái; Magic UI hoặc React Bits chỉ cung cấp vài điểm nhấn.
3. **Một workflow AI chính:** Spec Kit hoặc workflow rút gọn do nhóm tự viết. Không bật đồng thời nhiều bộ yêu cầu lập kế hoạch, xin duyệt và tạo tài liệu cho cùng một công việc.

### 4.2. Những công cụ giải quyết khác nhau

| Dễ nhầm | Khác biệt | Quyết định |
|---|---|---|
| Spec Kit / Superpowers | Cùng hỗ trợ cách phát triển nhưng tổ chức quy trình khác nhau | Thử trên cùng một task; chọn quy trình nhóm theo được |
| shadcn / Magic UI / React Bits | Nền component và kho hiệu ứng có mục đích khác nhau | Một nền thống nhất, hiệu ứng chọn lọc |
| Playwright / Playwright MCP | Một bên là framework test/automation; một bên là giao diện cho agent dùng trình duyệt | CI dùng test cố định; agent dùng MCP/CLI để khám phá |
| LiveKit / Pipecat | Hai hướng tổ chức voice pipeline và tích hợp hạ tầng | Một demo so sánh, chọn một cho vòng đầu |
| Tiptap / Yjs | Editor và cơ chế đồng bộ trạng thái chia sẻ | Chưa có co-writing thì chưa cần Yjs |
| Motion / Rive / R3F | Chuyển động UI, đồ họa tương tác, và cảnh 3D | Chọn theo đối tượng cần thể hiện |

**Cấu hình khởi đầu đề xuất nếu xây React/TypeScript:** frontend nhất quán + backend/auth hiện có hoặc Next.js/Supabase sau kiểm tra + shadcn/ui + Motion + ts-fsrs + lớp nối AI + Playwright/axe-core. Thêm editor và voice khi chuỗi đọc–ôn đã lưu dữ liệu đúng. Không cần cài đủ 33 repo.

## 5. Thiết kế workflow AI coding cho nhóm bốn người

### 5.1. Đơn vị công việc là một lát cắt người dùng hoàn chỉnh

Ví dụ tốt: “Người học chọn một cụm từ trong bài, lưu nghĩa phù hợp ngữ cảnh, mở lại sau khi đăng nhập và ôn khi đến hạn.” Task này có UI, API, database và kiểm tra, nhưng phạm vi đủ cụ thể.

Ví dụ chưa đủ: “Làm toàn bộ màn hình thật chuyên nghiệp, có AI, có flashcard.” Không có điều kiện nào để biết đã xong.

Mỗi task cần ghi:

- Người dùng, nhu cầu và tình huống khởi đầu.
- Input, output, dữ liệu phải lưu và quyền truy cập.
- Trạng thái loading/empty/error/success, mất mạng và thao tác lặp.
- Tiêu chí nghiệm thu, phần chưa làm, bằng chứng sau khi hoàn tất.

### 5.2. Quy trình bảy bước

1. **Khảo sát code thật:** agent đọc entrypoint, scripts, schema và phần liên quan; báo điểm chưa chắc chắn.
2. **Viết đặc tả nhỏ:** từ bản kế hoạch, chọn một kết quả người dùng; không gửi tất cả 135 chức năng cho một lần code.
3. **Chốt hợp đồng:** dữ liệu, API, phân quyền, lỗi và trạng thái giao diện.
4. **Thực hiện:** giữ dependency mới ở mức cần thiết, không sửa ngoài phạm vi chỉ để đồng bộ phong cách.
5. **Kiểm tra kỹ thuật:** typecheck/build và test tập trung vào rủi ro của thay đổi.
6. **Kiểm tra trong trình duyệt:** màn hình hẹp/rộng, bàn phím, tải lại, timeout; lưu trace/screenshot phù hợp.
7. **Review và ghi quyết định:** người phụ trách hiểu diff; ghi giới hạn, phiên bản và cách quay lại khi lỗi.

### 5.3. Cấu trúc tài liệu đề xuất

Đây là cấu trúc gợi ý, chưa được tạo/cài vào repo dự án:

```text
AGENTS.md                       # Hướng dẫn chính cho Codex
CLAUDE.md                       # Tuỳ chọn nếu nhóm còn dùng Claude Code
.claude/rules/                  # Quy tắc Claude Code theo phạm vi
docs/product/                   # Hành trình, phạm vi và tiêu chí nghiệm thu
docs/architecture/              # Data flow, auth, quyết định kiến trúc
docs/design/                    # Token, component, motion, accessibility
docs/ai/                        # Schema output, rubric và bộ ví dụ
docs/decisions/                 # Lý do chọn/thay công nghệ
tests/e2e/                      # Hành trình quan trọng
evals/                          # Bộ đánh giá AI
```

Không sao chép hai bản hướng dẫn rồi để lệch nhau. Chỉ định một nguồn quy ước chung và kiểm tra cách công cụ thực sự nạp hướng dẫn. Trong tài liệu AI, ghi rõ: không dùng dữ liệu minh họa làm kết quả thật; không tự thay đổi schema/auth; không bịa kết quả test.

### 5.4. Mẫu yêu cầu đưa cho coding agent

> Đọc code hiện tại của reader, vocabulary và auth. Thực hiện chức năng lưu cụm từ từ bài đọc theo đặc tả này. Dùng component và API đã có nếu phù hợp. Dữ liệu cần chứa articleId, đoạn trích, cụm từ, nghĩa đã chọn và chủ sở hữu xác định từ phiên đăng nhập. Hiển thị rõ trạng thái đang lưu, đã lưu và lưu lỗi; retry không tạo bản ghi trùng. Người dùng khác không đọc/sửa được bản ghi. Kiểm tra thao tác bằng chuột, bàn phím, màn hình hẹp và tải lại trang. Báo file thay đổi, kiểm tra đã chạy, kết quả và phần chưa xác minh. Không tạo điểm học tập giả và không mở rộng sang chức năng khác.

Mẫu này là đặc tả minh họa; tên field/API phải theo schema thật của nhóm.

## 6. UI và chuyển động: áp dụng ở mức sản phẩm

### 6.1. Quy tắc thiết kế đề xuất

Các con số sau là điểm bắt đầu để thử, không phải chuẩn bắt buộc hay kết quả nghiên cứu:

- Một bảng token cho màu, khoảng cách, bo góc, typography; component từ nhiều repo phải quy về token này.
- Chuyển động thao tác nhỏ khoảng 120–200 ms; chuyển panel khoảng 180–280 ms rồi đánh giá thực tế.
- Thay đổi trạng thái cần hiểu được cả khi tắt chuyển động.
- Không dùng animation vòng lặp gây tranh chú ý trong vùng đọc; không tự cuộn làm mất vị trí đọc.
- Tôn trọng reduced motion, focus bàn phím và nhãn trạng thái; không truyền đạt đúng/sai chỉ bằng màu.
- Tải Rive/3D khi người dùng mở tính năng; giữ phương án tĩnh khi thiết bị hoặc trình duyệt không đáp ứng.

### 6.2. Bảng chức năng–giao diện–thư viện

| Trải nghiệm | Thành phần đề xuất | Công cụ | Bằng chứng nghiệm thu |
|---|---|---|---|
| Trang Hôm nay | Một nhiệm vụ chính, lịch ôn, tiếp tục phiên trước | shadcn + Motion | Tiếp tục đúng phiên sau tải lại; không chỉ hiển thị thẻ đẹp |
| Kho bài đọc | Bộ lọc, trạng thái đã đọc, bộ sưu tập | UI nền, học pattern Lute | Bộ lọc và vị trí điều hướng được giữ hợp lý |
| Tra từ tại chỗ | Popover/panel trên desktop, sheet trên mobile | UI nền + Motion | Không che đoạn đang học; đóng trả focus đúng |
| Ôn từ | Lật đáp án, tự đánh giá, lịch ôn | ts-fsrs + UI | Lịch cập nhật đúng, không tăng hai lần khi double click |
| Voice chat | Trạng thái mic, lượt nói, transcript, nút dừng | LiveKit hoặc Pipecat | Dừng thật, reconnect rõ, không còn thu mic khi kết thúc |
| Luyện nghe | Lặp đoạn, tốc độ, waveform | wavesurfer.js | Mốc thời gian đúng; vẫn dùng được bằng bàn phím |
| Bài viết | Editor, góp ý bên cạnh, chấp nhận/từ chối sửa | Tiptap | Góp ý không gắn nhầm đoạn sau khi bài thay đổi |
| Bạn đồng hành | Idle, listening, thinking, encouraging | Rive | Phản ứng từ trạng thái thật; cho phép tắt |
| Tổng kết | Thành quả có nguồn từ phiên học | UI nền + điểm nhấn Magic UI | Không tạo số liệu thành tích từ dữ liệu giả |
| Cấu âm 3D | Góc nhìn, play/pause, chú thích cơ quan | R3F | Có bản 2D thay thế và nội dung được chuyên môn duyệt |

### 6.3. Cách dùng kho design skills

UI UX Pro Max có thể giúp tạo phương án; các skill web/React của Vercel hỗ trợ review. Đầu vào cần gồm người dùng, nội dung thật, thao tác chính, trạng thái lỗi và token. Yêu cầu AI giải thích vì sao lựa chọn phù hợp với reader hoặc speaking room. Không dùng một mẫu landing page nhiều gradient cho toàn bộ màn hình học tập.

Một design review nên chỉ ra cụ thể: CTA cạnh tranh ở đâu, độ dài dòng có khó đọc không, trạng thái lưu có gây hiểu nhầm không, thao tác bằng bàn phím có bị kẹt không. “Đẹp hơn” cần được chuyển thành thay đổi quan sát được.

## 7. Đọc và từ vựng: phần đáng đầu tư trước

### 7.1. Lute là nguồn học pattern nghiệp vụ

Repo Lute cung cấp một ứng dụng Python/Flask học ngoại ngữ qua đọc. Giá trị với nhóm là có ví dụ gần miền bài toán để nghiên cứu luồng và cách tổ chức chức năng. Nên thử ứng dụng và đối chiếu: lựa chọn bài, xử lý cụm nhiều từ, trạng thái từ đã biết và thao tác tra nghĩa. Đây là danh sách cần khảo sát sâu khi chạy thử, không khẳng định đã kiểm thử các hành vi đó trong lượt tra cứu này.

Không chuyển nguyên ứng dụng sang LinguaLens chỉ vì cùng học ngôn ngữ. Hãy trích ra quyết định sản phẩm phù hợp rồi tự thiết kế hợp đồng dữ liệu của mình.

### 7.2. Pipeline nhập bài đọc đề xuất

1. Nhận văn bản hoặc URL từ nguồn đã được nhóm chấp thuận.
2. Khi có fetch server-side, kiểm soát đích truy cập, redirect, thời gian và dung lượng để tránh truy cập tài nguyên nội bộ ngoài ý muốn.
3. Tách nội dung chính bằng Readability nếu loại nội dung phù hợp.
4. Làm sạch HTML với DOMPurify; không bật thực thi script trong bộ phân tích DOM.
5. Lưu nguồn, tiêu đề, phiên bản nội dung và trạng thái duyệt.
6. Tách paragraph/sentence ID ổn định trước khi gắn highlight/câu hỏi.
7. Sinh câu hỏi dựa trên đoạn cụ thể; kiểm tra schema và bằng chứng đáp án.

Readability không cấp quyền tái sử dụng bài báo. Chức năng trích xuất, xử lý HTML an toàn và quản lý quyền học liệu là ba lớp độc lập. Với bản thử, nội dung do nhóm biên soạn hoặc nguồn có điều kiện sử dụng rõ ràng giúp giảm bất định.

### 7.3. FSRS cần dữ liệu gì của LinguaLens?

Thiết kế đề xuất: mỗi thẻ gắn người học, từ/cụm từ, ngữ cảnh gốc và trạng thái lịch; mỗi lần ôn lưu thời gian, lựa chọn đánh giá và phiên bản thuật toán. Cập nhật lịch ở nơi có thể kiểm soát đồng thời và chống gửi lặp.

FSRS giải quyết lịch ôn, không giải quyết việc nghĩa có đúng ngữ cảnh, ví dụ có phù hợp hay người học đã đạt B2. Khi chưa có đủ lịch sử, dùng cấu hình mặc định đã kiểm chứng trên phiên bản chọn; việc tối ưu cá nhân hóa cần dữ liệu và đánh giá riêng.

### 7.4. Tín hiệu hành vi đơn giản nên thử trước gaze

Ghi sự kiện có mục đích: mở đoạn, tra từ, yêu cầu gợi ý, trả lời, sửa đáp án, đánh dấu khó. Dwell time bị ảnh hưởng bởi chuyển tab hoặc rời máy; vì vậy cần page visibility và giới hạn diễn giải.

Con trỏ chuột chỉ phản ánh tương tác trỏ, không chứng minh ánh mắt đang ở đó. Nếu dùng “thước đọc”, hãy thiết kế như công cụ tự nguyện và lưu trạng thái bật/tắt. Trước tiên thử quy tắc giải thích được, ví dụ người học bấm “khó” thì đề xuất chia câu hoặc gợi ý từ, thay vì suy luận tâm lý từ chuyển động chuột.

## 8. Voice: một hệ thống thời gian thực, không chỉ một nút micro

LiveKit Agents cung cấp nền voice agent với hệ sinh thái client/WebRTC và tích hợp STT–LLM–TTS; Pipecat cung cấp pipeline voice/multimodal Python. Hai hướng đều đáng thử, nhưng không nên ghép cả hai làm tầng điều phối cho bản đầu.

### Demo so sánh bắt buộc

Cùng một bài luyện 3–5 phút, cùng model/provider khi có thể, cùng thiết bị và điều kiện mạng. Ghi:

- Thời gian từ lúc người học kết thúc câu tới âm thanh phản hồi đầu tiên.
- Số lần cắt ngang không thành công, phản hồi trùng hoặc mất lượt.
- Chất lượng transcript với người học tiếng Anh có giọng Việt.
- Chi phí theo phút hoặc theo phiên, tính cả dịch vụ và hạ tầng.
- Khả năng dừng, mất quyền mic, reconnect và xóa bản ghi.

Không đặt một con số độ trễ trên mạng thành cam kết sản phẩm. Dùng median và các trường hợp chậm để so sánh, lưu cấu hình thí nghiệm.

### Trạng thái UX đề xuất

`idle`, `requesting_permission`, `listening`, `processing`, `speaking`, `interrupted`, `reconnecting`, `ended`, `error`. Mỗi trạng thái có nhãn, nút thao tác hợp lệ và quy tắc giữ/mất dữ liệu. Linh vật phản ánh trạng thái này, không tự chuyển sang “đang nghe” khi mic chưa hoạt động.

Kết quả cần có giá trị học tập: một nhận xét ưu tiên, ví dụ sửa cụ thể, câu cho người học thử lại và lịch sử lần thử. Không nên sửa mọi lỗi ngay giữa lượt nói; có thể chọn chế độ phản hồi cuối lượt hoặc cuối phiên.

## 9. Phát âm 2D/3D: tách bốn lớp kỹ thuật

| Lớp | Làm được gì | Không được suy ra |
|---|---|---|
| Waveform/audio UI | Cho xem và nghe lại đoạn | Sóng giống nhau không chứng minh phát âm đúng |
| Speech recognition | Ước lượng nội dung nói | Nhận đúng chữ không đồng nghĩa từng âm đúng |
| Forced alignment | Căn âm thanh với transcript đã biết | Mốc âm vị không tự trở thành điểm phát âm |
| Mô hình cấu âm | Minh họa vị trí và chuyển động mục tiêu | Avatar đẹp không chứng minh đúng giải phẫu/ngữ âm |

MFA đáng nghiên cứu cho căn thời gian, R3F cho trình bày cảnh, Rive/SVG cho minh họa 2D. **Chấm phát âm** là một hệ thống đánh giá riêng, cần mẫu giọng người học, rubric và đối chiếu người có chuyên môn.

Đề xuất triển khai: chọn một cặp âm thường nhầm → có giải thích và mẫu chuẩn được duyệt → người học ghi âm/nghe lại → cung cấp phản hồi với mức tin cậy → thử lại. Khi chứng minh lợi ích của 2D rồi mới trả chi phí làm 3D nhiều âm.

Nếu có điểm, lưu phiên bản model/rubric và điều kiện ghi âm. Trường hợp nhiễu hoặc không chắc cần nói “chưa đủ dữ liệu đánh giá”. Không biến transcript khớp thành điểm 95/100 hay dùng điểm giả để làm demo hấp dẫn.

## 10. Eye tracking: có tiềm năng nghiên cứu nhưng cần thay đổi kế hoạch

README WebGazer thông báo từ **24/02/2026**: phần mềm vẫn hoạt động theo tác giả, nhưng bảo trì chính thức đã kết thúc và không bảo đảm cập nhật. LICENSE hiện đọc ghi GPL phiên bản 3 hoặc mới hơn. Do đó chỉ nên đưa vào **nhánh thử nghiệm có kiểm soát**, không coi là dependency cốt lõi được bảo trì dài hạn.

Nguồn: [README WebGazer](https://github.com/brownhci/WebGazer), [LICENSE](https://github.com/brownhci/WebGazer/blob/master/LICENSE.md). Đây là ghi nhận văn bản, không phải kết luận pháp lý về mọi cách tích hợp.

### Thiết kế thử nghiệm đề xuất

1. Hiển thị mục đích và xin lựa chọn riêng trước khi dùng camera.
2. Hiệu chỉnh rồi kiểm tra ở các điểm khác với điểm hiệu chỉnh.
3. Đo sai số theo thiết bị/người dùng; đánh giá vùng đoạn văn trước khi kỳ vọng chính xác từng từ.
4. Ghi tỷ lệ mẫu hợp lệ, ánh sáng, thay đổi tư thế và ảnh hưởng khi cuộn.
5. Khi tín hiệu kém, ngừng suy luận từ gaze và chuyển sang thao tác tự báo khó.
6. So sánh **bản không gaze** với **bản thêm gaze**, cùng nội dung và hỗ trợ cơ bản.

Câu hỏi nghiên cứu phù hợp: gaze có cung cấp thông tin hữu ích thêm so với click, thời gian đọc và tự báo khó không? Chỉ số cần cả chất lượng tín hiệu, mức làm phiền và kết quả nhiệm vụ. Người nhìn lâu có thể đang suy nghĩ, mất tập trung hoặc bị gián đoạn; không gắn nhãn “không hiểu” từ một tín hiệu duy nhất.

## 11. Viết, cộng tác và AI phản hồi

Tiptap là nền editor để xây UI riêng; Yjs hỗ trợ dữ liệu chia sẻ cho đồng biên tập. Với bản đầu, ưu tiên viết cá nhân và góp ý ổn định trước khi làm co-writing thời gian thực.

Thiết kế phản hồi đề xuất:

- Giữ nguyên bản người học và lưu phiên bản trước/sau sửa.
- Góp ý chứa vị trí/đoạn trích, loại lỗi, giải thích, đề xuất và mức độ can thiệp.
- Khi người dùng sửa tiếp, kiểm tra version trước khi áp dụng góp ý cũ.
- Người học chọn chấp nhận hoặc bỏ qua; không tự viết lại toàn bài.
- Cùng một lỗi có thể sinh bài luyện ngắn sau phiên, nối sang lịch ôn.

Nếu dùng Yjs, đồng bộ được văn bản không có nghĩa đã có phân quyền lớp học, moderation hoặc lưu lịch sử đầy đủ. Những phần này phải thiết kế riêng. Tương tự, không coi tính năng Pro trong hệ sinh thái Tiptap mặc nhiên thuộc phần lõi miễn phí.

## 12. Kế hoạch thử nghiệm công nghệ trước khi tích hợp lớn

Các khoảng thời gian sau là **timebox đề xuất**, không phải ước lượng chắc chắn. Dừng khi đủ bằng chứng ra quyết định; không cộng thành lời hứa hoàn thành toàn hệ thống.

| Thử nghiệm | Timebox | Đầu ra và điều kiện quyết định |
|---|---|---|
| Workflow AI trên một task lưu từ | 1–2 ngày | So sánh số lần sửa, lỗi còn lại, thời gian review và mức hiểu code của người phụ trách |
| UI nền + motion | 1–2 ngày | Reader có panel, mobile sheet, keyboard và reduced motion; chọn một bộ nền |
| FSRS + dữ liệu thật | 1–2 ngày | Lưu/reload đúng, cập nhật lịch một lần, xử lý retry và ngày giờ |
| Nhập bài + sanitize | 1–2 ngày | Bộ mẫu bài được phép dùng, mẫu HTML xấu bị xử lý, source ID còn nguyên |
| Voice LiveKit/Pipecat | 2–4 ngày | Cùng kịch bản và bảng đo latency/lỗi/chi phí; chọn một hướng |
| Cấu âm 2D | 2–3 ngày sau khi có nội dung duyệt | Một cặp âm, hướng dẫn, ghi âm và nghe lại; chưa yêu cầu chấm tự động |
| Gaze | 2–4 ngày nghiên cứu | Báo cáo sai số/tỷ lệ mẫu hợp lệ và quyết định làm tiếp hoặc dừng |

### Gắn vào các đợt phát triển trước đó

- **R1:** workflow, UI nền, reading, lưu từ, lịch ôn, auth/phân quyền, test; thêm trợ lý kéo thả và hướng dẫn cơ bản theo mục 18.
- **R2:** phản hồi AI thật có đánh giá, editor, nghe và voice, minh họa 2D có nội dung được duyệt.
- **R3:** linh vật, tổng kết, nhóm học, co-writing khi có nhu cầu và người vận hành.
- **R4:** gaze, 3D cấu âm và đánh giá phát âm chuyên sâu sau các điều kiện kiểm chứng.

Mỗi đợt vẫn có thể cho người dùng thấy định hướng rộng bằng lối đi và ví dụ được ghi rõ. Một tính năng chưa nối dịch vụ phải có nhãn phù hợp, không lưu kết quả minh họa vào hồ sơ học thật.

## 13. Tiêu chí nghiệm thu và cách đo giá trị

### 13.1. Kỹ thuật

- Dữ liệu thuộc người dùng A không đọc/sửa được từ phiên B.
- Retry hoặc double click không tạo nhiều lần chấm/ôn/lưu cùng một sự kiện.
- Reload không mất tiến độ đã được xác nhận lưu.
- API timeout có trạng thái rõ; không hiện thành công trước khi lưu thành công.
- Test hành trình reader → lưu từ → ôn → xem tiến bộ bằng Playwright.
- Kiểm tra accessibility tự động bằng axe-core rồi thử bàn phím, focus, zoom và chuyển động giảm bằng tay.

### 13.2. Chất lượng AI

Bộ đánh giá ban đầu đề xuất gồm bài dễ/vừa/khó, câu hỏi có và không đủ bằng chứng, câu trả lời đúng một phần, HTML/nội dung có chỉ dẫn gây nhiễu, lỗi provider và câu hỏi ngoài ngữ cảnh. Mỗi mẫu phải có kỳ vọng/rubric do người phụ trách học liệu kiểm tra.

Promptfoo hỗ trợ thực thi và so sánh; bản thân công cụ không xác định đúng tiêu chuẩn sư phạm. Tách kiểm tra schema tự động khỏi đánh giá chất lượng giải thích. Khi đổi prompt/model, chạy cùng bộ mẫu và kiểm tra những trường hợp chất lượng giảm.

### 13.3. Người dùng và học tập

Đo ba lớp riêng:

1. **Dùng được:** hoàn thành nhiệm vụ, lỗi thao tác, thời gian tìm chức năng.
2. **Muốn quay lại:** tự chọn phiên tiếp, lý do quay lại, mức phiền của thông báo/linh vật.
3. **Học được:** hiểu bài mới, nhớ từ sau độ trễ, vận dụng vào nói/viết ngoài câu đã luyện.

Streak, số click và thời gian online không tự chứng minh lớp thứ ba. Bản thử nhỏ phù hợp để tìm lỗi và tạo giả thuyết; thiết kế kiểm định tác động cần trao đổi với GVHD về mẫu, bài đo và đối chứng.

## 14. Chi phí và bảo trì cần đưa vào quyết định

Không đưa bảng giá cloud cố định vì chưa chốt provider, model và workload. Khi chạy thử, ghi chi phí theo công thức:

**Chi phí một phiên = inference + STT/TTS hoặc realtime audio + transport/egress + compute + lưu trữ + phần vận hành phân bổ.**

Với AI coding, đo thêm chi phí review và sửa lỗi. Một công cụ tạo code nhanh nhưng khiến nhóm không hiểu auth/database có thể tăng tổng chi phí.

Trước khi thêm dependency:

- Ghi phiên bản/commit và LICENSE; xem khác biệt giữa code, model, asset và dịch vụ.
- Đọc issue/release liên quan chính use case: mobile mic, reconnect, SSR, editor selection hoặc chữ nhiều dấu.
- Thử chạy lại từ clean checkout với lockfile; không phụ thuộc cấu hình bí mật trên máy một thành viên.
- Xác định người chịu trách nhiệm nâng cấp và phương án khi thư viện ngừng bảo trì.
- Không chạy script cài đặt/hook từ repo tham khảo trước khi đọc phạm vi thao tác.

Đây là những kiểm tra phục vụ trực tiếp tích hợp; báo cáo chưa thực hiện audit từng dependency xuyên suốt.

## 15. Quyết định đề xuất cho nhóm và GVHD

**Nên thông qua ngay về hướng đi:** một UI nền; một workflow AI coding có đặc tả và bằng chứng; chuỗi đọc–từ vựng–ôn tập có lưu dữ liệu thật; phân biệt kết quả học thật và minh họa.

**Cần thử rồi quyết định:** giữ/chuyển stack; LiveKit hay Pipecat; tác dụng của linh vật; hiệu ứng nào cải thiện sự rõ ràng; có cần co-writing thời gian thực.

**Chưa nên hứa như chức năng hoàn chỉnh:** đánh giá chính xác sự tập trung từ chuột/gaze, chấm phát âm chuyên sâu, bộ cấu âm 3D đầy đủ. Đây là các module có yêu cầu kiểm chứng riêng.

Giá trị khác biệt khả thi của LinguaLens nằm ở việc nối các hoạt động: từ khó trong bài đọc xuất hiện lại trong ôn tập, sau đó thành mục tiêu của buổi hội thoại hoặc bài viết; phản hồi từ các buổi đó điều chỉnh kế hoạch tiếp theo. Những repo được chọn là phương tiện hiện thực hóa sự liên kết ấy. Bằng chứng sản phẩm cần đến từ trải nghiệm và kết quả học của người dùng, không từ số công nghệ được lắp ghép.

## 16. Tài liệu và cách đọc tiếp

- Đầu vào: `Tong_hop_3_TikTok_Claude_Code_AI_Coding.md`, README trong `LinguaLens_AI_Release_Demo_Pack.zip`, `De_xuat_NCKH_AI_Adaptive_English_ULIS.pdf`.
- Nguồn repo: 33 liên kết tại mục 3 dẫn về chủ dự án; đọc README, LICENSE, examples, issues và release của phiên bản định dùng.
- [Claude Code — memory và rules](https://code.claude.com/docs/en/memory): căn cứ phân biệt hướng dẫn context và kiểm soát thực thi.
- [Claude Code — plugin reference](https://code.claude.com/docs/en/plugins-reference): kiểm tra cấu trúc plugin theo phiên bản.
- [React Bits LICENSE](https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md): điều kiện bổ sung cho việc phân phối component.
- [WebGazer LICENSE](https://github.com/brownhci/WebGazer/blob/master/LICENSE.md): điều kiện bản mã đã đọc.
- [AI SDK LICENSE](https://github.com/vercel/ai/blob/main/LICENSE): tránh suy đoán giấy phép từ hệ sinh thái Vercel.
- [bolt.diy licensing trong README](https://github.com/stackblitz-labs/bolt.diy#licensing): phân biệt repo và WebContainers.

Các nhận xét ưu tiên, dữ liệu đề xuất, mốc thời gian và tiêu chí nghiệm thu trong báo cáo là thiết kế cho LinguaLens. Chúng cần được cập nhật sau thử nghiệm; không phải tuyên bố rằng repo đã cung cấp sẵn toàn bộ chức năng đó.


## Phụ lục A. Metadata 13 repo trọng điểm

Nguồn: GitHub REST API tại `https://api.github.com/repos/{owner}/{repo}`, truy cập 24/09/2026. `pushed_at` là thời điểm push gần nhất được API trả về, không nhất thiết là ngày commit trên nhánh mặc định hoặc ngày phát hành. Không repo nào trong bảng bị đánh dấu archived tại thời điểm truy vấn.

| Repo | Push gần nhất (UTC) | SPDX do API nhận diện | Ghi chú đối chiếu |
|---|---|---|---|
| [github/spec-kit](https://github.com/github/spec-kit) | 2026-09-24T01:35:45Z | MIT | Metadata không thay thế kiểm tra bản phát hành và dependency. |
| [obra/superpowers](https://github.com/obra/superpowers) | 2026-09-22T18:22:49Z | MIT | Metadata không thay thế kiểm tra bản phát hành và dependency. |
| [shadcn-ui/ui](https://github.com/shadcn-ui/ui) | 2026-09-21T09:05:58Z | MIT | Metadata không thay thế kiểm tra bản phát hành và dependency. |
| [motiondivision/motion](https://github.com/motiondivision/motion) | 2026-09-24T11:01:43Z | MIT | Metadata không thay thế kiểm tra bản phát hành và dependency. |
| [open-spaced-repetition/ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) | 2026-09-24T10:31:10Z | MIT | Metadata không thay thế kiểm tra bản phát hành và dependency. |
| [livekit/agents](https://github.com/livekit/agents) | 2026-09-24T10:19:12Z | Apache-2.0 | Metadata không thay thế kiểm tra bản phát hành và dependency. |
| [brownhci/WebGazer](https://github.com/brownhci/WebGazer) | 2026-02-24T05:12:20Z | NOASSERTION | LICENSE đọc trực tiếp: GPL-3.0-or-later; README thông báo hết bảo trì chính thức. |
| [DavidHDev/react-bits](https://github.com/DavidHDev/react-bits) | 2026-09-23T13:56:49Z | NOASSERTION | LICENSE: MIT + Commons Clause, không ghi thành MIT thuần. |
| [vercel/ai](https://github.com/vercel/ai) | 2026-09-24T11:16:25Z | NOASSERTION | LICENSE đọc trực tiếp ghi Apache-2.0. |
| [ueberdosis/tiptap](https://github.com/ueberdosis/tiptap) | 2026-09-24T11:20:53Z | MIT | Metadata không thay thế kiểm tra bản phát hành và dependency. |
| [LuteOrg/lute-v3](https://github.com/LuteOrg/lute-v3) | 2026-09-05T02:33:00Z | MIT | Metadata không thay thế kiểm tra bản phát hành và dependency. |
| [microsoft/playwright](https://github.com/microsoft/playwright) | 2026-09-24T09:30:05Z | Apache-2.0 | Metadata không thay thế kiểm tra bản phát hành và dependency. |
| [upstash/context7](https://github.com/upstash/context7) | 2026-09-24T08:14:13Z | MIT | Metadata không thay thế kiểm tra bản phát hành và dependency. |

`NOASSERTION` nghĩa là API không đưa ra mã SPDX chắc chắn; không có nghĩa repo không có giấy phép. Đây là lý do cần đọc LICENSE thay vì tự động kết luận từ một trường metadata.

## 17. Điều chỉnh cho dự án dùng Codex làm công cụ code chính

Cập nhật theo lựa chọn của người dùng ngày 24/09/2026: **Codex là công cụ phát triển chính**. Các phần nói về Claude Code ở trên được giữ làm tài liệu tham khảo, không phải yêu cầu phải dùng Claude.

### 17.1. CLAUDE.md có ảnh hưởng gì?

Một file Markdown không tự thay đổi runtime của website. Tuy nhiên nội dung hướng dẫn có thể ảnh hưởng cách coding agent sửa code nếu agent đọc/nạp nó.

Theo tài liệu OpenAI, Codex ưu tiên `AGENTS.override.md`, rồi `AGENTS.md`, rồi tên fallback được cấu hình; tối đa một file mỗi thư mục trong chuỗi tìm kiếm. Vì thế chọn **AGENTS.md ở root**. Không mặc định `CLAUDE.md` tự được nạp. Với Codex hỗ trợ cấu hình này, có thể thêm vào `~/.codex/config.toml`:

```toml
project_doc_fallback_filenames = ["CLAUDE.md"]
```

Đây là phương án tương thích, không cần khi đã dùng AGENTS.md. Tạo phiên mới để kiểm tra hướng dẫn đã nạp. Nguồn: [OpenAI — AGENTS.md](https://developers.openai.com/codex/guides/agents-md/).

### 17.2. Phương án tổ chức cho LinguaLens

- Chuyển các quy ước trung lập trong CLAUDE.md sang AGENTS.md: mục tiêu, cấu trúc code, lệnh có thật, quy tắc dữ liệu, thiết kế, nghiệm thu.
- Những mục thuộc riêng Claude, như `.claude/`, hook hoặc lệnh plugin, giữ ở tài liệu công cụ đó; không giả định đổi tên file sẽ chuyển chúng thành cấu hình Codex.
- Nếu vẫn dùng cả hai công cụ, có một nguồn quy ước dùng chung; mỗi công cụ có phần cấu hình riêng. Tránh hai bản hướng dẫn dài được sửa độc lập.
- AGENTS.md chỉ ghi quy tắc ngắn và chỉ đường tới đặc tả. Không nhét nguyên báo cáo này vào context thường trực.
- `docs/product/companion.md` có thể chứa đặc tả trợ lý; `docs/design/motion.md` chứa quy tắc hoạt ảnh. Các đường dẫn này là đề xuất, chưa tạo trong repo ứng dụng.

Mẫu nội dung trung lập cần đưa vào hướng dẫn Codex: giữ auth/phân quyền; dùng design token; phân biệt mock/live; kiểm tra reload và lỗi API; không bịa điểm học tập; không tự thêm dependency nếu phần hiện có đáp ứng; báo kiểm tra thực sự đã chạy.

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
