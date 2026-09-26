'use client';

type RecordItem = { kind: string; data: Record<string, any> };

export default function PilotGuide({ records, go }: { records: RecordItem[]; go: (page: string) => void }) {
    const steps = [
        { title: '1. Thiết lập hồ sơ', time: '2 phút', page: 'privacy', text: 'Chọn biệt danh, trình độ và đọc lựa chọn đồng ý. Bạn vẫn học được nếu không tham gia nghiên cứu.', done: records.some(r => r.kind === 'consent') },
        { title: '2. Hoàn thành một bài đọc', time: '8–10 phút', page: 'discover', text: 'Trả lời câu hỏi, thử gợi ý và viết một ghi chú. Nhấn hoàn thành để lưu kết quả buổi đọc.', done: records.some(r => r.kind === 'session' && r.data.finished) },
        { title: '3. Lưu và ôn từ mới', time: '3 phút', page: 'vocabulary', text: 'Lưu ít nhất một từ, lật flashcard và chọn mức độ nhớ để thử lịch ôn.', done: records.some(r => r.kind === 'vocab' && r.data.reviews > 0) },
        { title: '4. Thử hành trình kỹ năng', time: '10–15 phút', page: 'skill-path', text: 'Gửi bài nghe, lưu ý chính nói và bản viết. Thử Người đồng hành rồi ẩn/khôi phục để góp ý trải nghiệm.', done: records.some(r=>r.kind==='skill_path' && r.data.listening && r.data.speakingReview && r.data.writingReview?.text===r.data.writing) },
        { title: '5. Gửi đánh giá', time: '3–5 phút', page: 'support', text: 'Chấm trải nghiệm và mô tả chỗ khó dùng. Có thể thử thêm hội thoại hoặc phòng thực nghiệm trước khi góp ý.', done: records.some(r => r.kind === 'feedback') },
    ];
    const doneCount = steps.filter(s => s.done).length;

    return (
        <section className="card" aria-labelledby="pilot-guide-title">
            <div className="row between" style={{ marginBottom: 12 }}>
                <div>
                    <span className="badge">BẮT ĐẦU TẠI ĐÂY</span>
                    <h2 id="pilot-guide-title" style={{ marginTop: 8 }}>Buổi thử khoảng 30–40 phút</h2>
                </div>
                <span className="badge" style={{ alignSelf: 'flex-start' }}>
                    {doneCount}/{steps.length} bước đã ghi nhận
                </span>
            </div>

            {/* Progress bar for steps */}
            <div className="question-progress" role="progressbar" aria-valuenow={doneCount} aria-valuemin={0} aria-valuemax={steps.length} aria-label="Tiến độ các bước">
                <span style={{ width: `${(doneCount / steps.length) * 100}%` }} />
            </div>

            <p className="small" style={{ marginBottom: 16 }}>
                Tiến độ lấy từ dữ liệu đã lưu. Hoàn thành các bước theo tốc độ của bạn; camera và micro không bắt buộc.
            </p>

            {/* Step items — v9 hero animation */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {steps.map(s => (
                    <div
                        key={s.page}
                        className={'step-item' + (s.done ? ' step-done' : '')}
                    >
                        {/* Animated check circle */}
                        <div className="step-check" aria-hidden="true">
                            {s.done && (
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 6l3 3 5-5" className="check-icon" />
                                </svg>
                            )}
                        </div>

                        {/* Step content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="row between" style={{ gap: 8, flexWrap: 'wrap' }}>
                                <strong style={{ fontSize: 14 }}>{s.title}</strong>
                                <span className={'badge' + (s.done ? ' green' : '')} style={{ fontSize: 11 }}>
                                    {s.done ? '✓ Đã ghi nhận' : s.time}
                                </span>
                            </div>
                            <p style={{ fontSize: 13, marginTop: 4 }}>{s.text}</p>
                        </div>

                        {/* CTA */}
                        <button className="secondary" onClick={() => go(s.page)} style={{ flexShrink: 0, fontSize: 13, padding: '6px 11px' }}>
                            {s.done ? 'Xem lại' : 'Mở'}
                        </button>
                    </div>
                ))}
            </div>

            <p className="small" style={{ marginTop: 12 }}>
                Bài đọc được biên soạn cho demo; CEFR là ước lượng. Hội thoại hiện dùng kịch bản soạn sẵn. Phát âm và gaze là mô hình minh họa, chưa đo năng lực hoặc ánh nhìn.
            </p>
        </section>
    );
}
