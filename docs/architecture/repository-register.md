# Danh mục repo tham khảo

Tiếp nhận 33 repo từ tài liệu được cung cấp, không cài thêm dependency trong lượt này. Các thông tin giấy phép/bảo trì bên dưới là ghi nhận của tài liệu nguồn, chưa được kiểm chứng lại độc lập trong lượt tích hợp. Trước khi chọn phiên bản thực dùng phải đọc nguồn chính thức, LICENSE, runtime compatibility, model/asset/service terms và chạy thử. Không dùng bảng này như kết luận pháp lý hay xác nhận tương thích.

| # | Repo | Mục đích theo tài liệu | Ưu tiên nguồn | Ghi nhận nguồn, cần kiểm tra lại |
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
| 10 | [vercel/next.js](https://github.com/vercel/next.js) | Nền React full-stack nếu xây mới hoặc chuyển đổi có lý do | A có điều kiện | MIT; không cần viết lại backend tốt chỉ để dùng Next.js |
| 11 | [supabase/supabase](https://github.com/supabase/supabase) | Postgres, auth, storage và các dịch vụ liên quan | A có điều kiện | Apache-2.0 ở repo; thành phần/dịch vụ có điều kiện riêng; phải thiết kế phân quyền |
| 12 | [vercel/ai](https://github.com/vercel/ai) | Lớp TypeScript nối model/provider, tương tác AI trong web | A nếu TS | Apache-2.0 theo LICENSE đã đọc; model/API tính phí riêng |
| 13 | [shadcn-ui/ui](https://github.com/shadcn-ui/ui) | Button, dialog, sheet, form, navigation làm nền đồng nhất | A | MIT; mã đưa vào dự án cần được nhóm bảo trì |
| 14 | [motiondivision/motion](https://github.com/motiondivision/motion) | Chuyển trạng thái, mở panel, đổi câu hỏi, phản hồi thao tác | A | MIT cho thư viện; không suy ra mọi sản phẩm liên quan đều miễn phí |
| 15 | [magicuidesign/magicui](https://github.com/magicuidesign/magicui) | Landing, giới thiệu hành trình học, tổng kết thành tích | B | MIT của repo; chọn ít component phù hợp |
| 16 | [imskyleen/animate-ui](https://github.com/imskyleen/animate-ui) | Tham khảo component có chuyển động và trạng thái rõ | B | MIT; tránh chồng với component nền cùng chức năng |
| 17 | [DavidHDev/react-bits](https://github.com/DavidHDev/react-bits) | Một vài điểm nhấn thị giác, thử nghiệm trang khám phá | B/C | MIT + Commons Clause; không coi là MIT thuần |
| 18 | [rive-app/rive-react](https://github.com/rive-app/rive-react) | Linh vật 2D phản ứng theo trạng thái học | B | MIT runtime; tài sản, editor và gói dịch vụ cần xét riêng |
| 19 | [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber) | Hiển thị mô hình cấu âm/đối tượng 3D | C | MIT; cần asset, kiến thức Three.js, kiểm tra tương thích React |
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
| 31 | [microsoft/playwright](https://github.com/microsoft/playwright) | Test các hành trình thật trên trình duyệt; trace khi lỗi | A | Apache-2.0; viết assertion về kết quả, không chỉ click |
| 32 | [dequelabs/axe-core](https://github.com/dequelabs/axe-core) | Phát hiện một phần lỗi accessibility tự động | A | MPL-2.0; vẫn phải kiểm tra thủ công |
| 33 | [promptfoo/promptfoo](https://github.com/promptfoo/promptfoo) | So sánh prompt/model, kiểm tra output AI và regression | A khi nối AI | MIT; bộ mẫu và rubric quyết định giá trị phép đo |

Driver.js là ứng viên bổ sung ở mục 18, ngoài danh mục 33. Công cụ coding như Spec Kit, Cline, bolt.diy không phải dependency runtime của web. Next.js/Supabase là phương án có điều kiện, không phải quyết định thay stack.
