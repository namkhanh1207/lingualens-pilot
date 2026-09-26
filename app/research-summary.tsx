'use client';

type Response = { participant: string; kind: string; data: Record<string, any> };
export default function ResearchSummary({ data }: { data: { participants: { participant: string }[]; responses: Response[] } }) {
    const feedback = data.responses.filter(r => r.kind === 'feedback');
    const sessions = data.responses.filter(r => r.kind === 'session');
    const paths=data.responses.filter(r=>r.kind==='skill_path');
    const reviews=data.responses.filter(r=>r.kind==='vocab_review');
    const completed = sessions.filter(r => r.data.finished);
    const learnersFinished = new Set(completed.map(r => r.participant)).size;
    const dimensions = [['ease', 'Dễ sử dụng'], ['helpful', 'Hữu ích'], ['again', 'Muốn dùng lại']];
    return <section className="card" aria-labelledby="summary-title"><h2 id="summary-title">Tổng hợp để trao đổi GVHD</h2>
        <p>{learnersFinished}/{data.participants.length} người đang đồng ý nghiên cứu có ít nhất một buổi đọc hoàn thành trong dữ liệu trả về. Đã hoàn thành {completed.length}/{sessions.length} buổi đọc.</p>
        <div className="table-wrap"><table><thead><tr><th>Tiêu chí</th><th>Trung bình / 5</th><th>Số phiếu hợp lệ</th></tr></thead><tbody>{dimensions.map(([key, label]) => {
            const values = feedback.map(r => r.data[key]).filter((n: unknown): n is number => typeof n === 'number' && Number.isInteger(n) && n >= 1 && n <= 5);
            return <tr key={key}><td>{label}</td><td>{values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : 'Chưa có dữ liệu'}</td><td>{values.length}</td></tr>;
        })}</tbody></table></div>
        <p className="small">Chỉ gồm người hiện đồng ý nghiên cứu; các trang đã được tải đủ và kiểm tra phiên dữ liệu nhất quán. Mỗi người có thể có nhiều buổi học. Điểm góp ý là thang nội bộ, không chứng minh hiệu quả học tập; nhóm 5 người chỉ phù hợp tìm vấn đề sử dụng.</p>
        <h3>Hoạt động từ vựng và đa kỹ năng</h3><p>{reviews.length} lần ôn từ đã lưu · {paths.length} hành trình đã bắt đầu.</p><p>{paths.filter(r=>r.data.listening).length} hành trình đã gửi bài nghe · {paths.filter(r=>r.data.speakingSelfReview).length} đã tự đối chiếu nói · {paths.filter(r=>r.data.writingSelfReview?.current).length} có tự đối chiếu đúng bản viết hiện tại.</p><p className="small">Đây là số hoạt động của người đang đồng ý nghiên cứu. Tự đối chiếu không phải điểm do giáo viên hoặc AI chấm; bản xuất không chứa nguyên văn bài viết, câu nói hay từ riêng của người học.</p>
        <details><summary>Gợi ý thảo luận sau pilot</summary><ol><li>Người thử dừng ở bước nào và vì sao?</li><li>Gợi ý và dẫn chứng có dễ hiểu không?</li><li>Tính năng nào cần sửa trước khi triển khai AI thật?</li><li>Cần thiết kế bài đo trước/sau và nhóm đối chứng thế nào cho nghiên cứu tiếp theo?</li></ol></details>
    </section>;
}
