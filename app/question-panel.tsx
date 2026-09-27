'use client';
import { useId } from 'react';
import { Check, X } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
type Any = Record<string, any>;
type Action = (body: Any, success?: string, reload?: boolean) => Promise<any>;

const skillNames: Record<string, string> = {
    detail: 'Chi tiết',
    inference: 'Suy luận',
    vocabulary_in_context: 'Từ trong ngữ cảnh',
    main_idea: 'Ý chính',
    reference: 'Từ tham chiếu',
    author_purpose: 'Mục đích tác giả',
    critical_reading: 'Đọc phản biện',
    evidence_based_explanation: 'Giải thích bằng dẫn chứng',
};

/* ─────────────────────────────────────────────────────────────
   ResultIcon — stroke-draw checkmark or X icon
   Respects prefers-reduced-motion automatically via CSS class
───────────────────────────────────────────────────────────── */
function ResultIcon({ correct }: { correct: boolean | null }) {
    if (correct === null) return null;
    if (correct) {
        return (
            <span className="feedback-icon" style={{ color: 'var(--color-success)' }}>
                <svg
                    className="check-icon"
                    width="16" height="16" viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M2.5 8.5l4 4 7-7" />
                </svg>
                Chính xác
            </span>
        );
    }
    return (
        <span className="feedback-icon" style={{ color: '#bf3452' }}>
            <X size={16} aria-hidden="true" />
            Hãy đối chiếu lại dẫn chứng
        </span>
    );
}

/* ─────────────────────────────────────────────────────────────
   FeedbackBlock — animated reveal (CSS keyframe ll-reveal)
   + option highlight for MCQ correct/wrong state
───────────────────────────────────────────────────────────── */
function FeedbackBlock({
    result,
    question,
    onShowParagraph,
}: {
    result: Any;
    question: Any;
    onShowParagraph: (n: number) => void;
}) {
    const isCorrect   = result.correct === true;
    const isWrong     = result.correct === false;
    const isSelfCheck = result.correct === null;

    return (
        <div
            className={'feedback' + (isCorrect ? ' good' : isWrong ? ' bad' : '')}
            role="status"
            aria-live="polite"
        >
            <ResultIcon correct={result.correct} />

            {isSelfCheck && (
                <strong style={{ display: 'block', marginBottom: 4 }}>
                    Tự đối chiếu — chưa chấm bằng AI.
                </strong>
            )}

            {question.type === 'mcq' && result.correctIndex !== undefined && (
                <p>Đáp án: <strong>{question.options[result.correctIndex]}</strong></p>
            )}

            {result.modelAnswer && <p>{result.modelAnswer}</p>}
            {result.rubric?.map((r: string) => (
                <p className="small" key={r}>• {r}</p>
            ))}

            {result.evidence && (
                <blockquote lang="en">{result.evidence}</blockquote>
            )}

            {result.paragraph != null && (
                <button
                    className="secondary"
                    style={{ marginTop: 10, fontSize: 13 }}
                    onClick={() => onShowParagraph(result.paragraph - 1)}
                >
                    Xem đoạn {result.paragraph}
                </button>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   MCQOption — with correct/wrong CSS state classes
───────────────────────────────────────────────────────────── */
function MCQOption({
    optionText,
    index,
    questionId,
    selectedIndex,
    result,
    finished,
    busy,
    onChange,
}: {
    optionText: string;
    index: number;
    questionId: string;
    selectedIndex: string | undefined;
    result: Any | undefined;
    finished: boolean;
    busy: boolean;
    onChange: () => void;
}) {
    const isSelected = selectedIndex === String(index);
    const hasResult  = result != null;
    const isCorrectAnswer = hasResult && result.correctIndex === index;
    const isWrongAnswer   = hasResult && result.answer === String(index) && result.correct === false;

    let cls = 'option';
    if (isCorrectAnswer) cls += ' option--correct';
    else if (isWrongAnswer) cls += ' option--wrong';

    return (
        <label className={cls}>
            <input
                type="radio"
                name={questionId}
                checked={isSelected}
                disabled={busy || finished}
                onChange={onChange}
            />
            {optionText}
            {isCorrectAnswer && hasResult && (
                <Check size={14} style={{ marginLeft: 'auto', color: 'var(--color-success)', flexShrink: 0 }} />
            )}
        </label>
    );
}

/* ─────────────────────────────────────────────────────────────
   HintBlock — styled hint display
───────────────────────────────────────────────────────────── */
function HintBlock({ hint }: { hint: Any }) {
    return (
        <div className="feedback" role="status" aria-live="polite">
            <strong style={{ display: 'block', marginBottom: 4, fontSize: 13 }}>
                Gợi ý {hint.level}/3
            </strong>
            {hint.text}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   QuestionPanel — main export
   Drop-in replacement for the <aside> in workspace.tsx
───────────────────────────────────────────────────────────── */
export default function QuestionPanel({
    questions,
    answers,
    results,
    hints,
    busy,
    finished,
    totalQuestions,
    onDraft,
    onSubmit,
    onHint,
    onSetFocus,
    onFinish,
    onEvent,
}: {
    questions: Any[];
    answers: Record<string, string>;
    results: Record<string, Any>;
    hints: Record<string, Any>;
    busy: boolean;
    finished: boolean;
    totalQuestions: number;
    onDraft: (update: Partial<{ answers: Record<string, string> }>) => void;
    onSubmit: (q: Any) => Promise<void>;
    onHint: (q: Any) => Promise<void>;
    onSetFocus: (n: number | null) => void;
    onFinish: () => Promise<void>;
    onEvent: (type: string, value: number) => Promise<void>;
}) {
    const answeredCount = Object.keys(results).length;
    const progressPct   = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
    const panelId = useId();

    return (
        <aside className="card" data-guide="questions" aria-labelledby={panelId + '-title'}>
            {/* Header */}
            <div className="row between" style={{ marginBottom: 12 }}>
                <h2 id={panelId + '-title'}>Đọc hiểu &amp; suy ngẫm</h2>
                <span className="badge">{answeredCount}/{totalQuestions}</span>
            </div>

            {/* Question progress bar — v9 */}
            <div
                className="question-progress"
                role="progressbar"
                aria-valuenow={answeredCount}
                aria-valuemin={0}
                aria-valuemax={totalQuestions}
                aria-label={`Đã trả lời ${answeredCount} trong ${totalQuestions} câu`}
            >
                <span style={{ width: progressPct + '%' }} />
            </div>

            <p className="small" style={{ marginBottom: 16 }}>
                Gửi từng câu để xem dẫn chứng. Câu tự luận có đáp án tham khảo để tự đối chiếu.
            </p>

            {/* Question list */}
            {questions.map((q, i) => {
                const result  = results[q.id];
                const hint    = hints[q.id];
                const hasResult = result != null;

                return (
                    <div className="question" key={q.id}>
                        <span className="badge" style={{ marginBottom: 8 }}>
                            {skillNames[q.skill] || q.skill}
                        </span>

                        <fieldset disabled={busy || finished}>
                            <legend>{i + 1}. {q.prompt}</legend>

                            {q.type === 'mcq' ? (
                                q.options.map((o: string, j: number) => (
                                    <MCQOption
                                        key={o}
                                        optionText={o}
                                        index={j}
                                        questionId={q.id}
                                        selectedIndex={answers[q.id]}
                                        result={result}
                                        finished={finished}
                                        busy={busy}
                                        onChange={() => {
                                            onDraft({ answers: { ...answers, [q.id]: String(j) } });
                                            void onEvent('answer_change', 1);
                                        }}
                                    />
                                ))
                            ) : (
                                <textarea
                                    aria-label={'Trả lời câu ' + (i + 1)}
                                    value={answers[q.id] || ''}
                                    maxLength={2000}
                                    onChange={e => onDraft({ answers: { ...answers, [q.id]: e.target.value } })}
                                    placeholder="Write your answer in English…"
                                />
                            )}

                            {!finished && (
                                <div className="row" style={{ marginTop: 12 }}>
                                    <button
                                        className="btn"
                                        disabled={!answers[q.id]?.trim()}
                                        onClick={() => onSubmit(q)}
                                    >
                                        {hasResult ? 'Gửi lại câu trả lời' : 'Gửi câu trả lời'}
                                    </button>
                                    <button
                                        className="secondary"
                                        onClick={() => onHint(q)}
                                    >
                                        Gợi ý{hint ? ` ${hint.level}/3` : ''}
                                    </button>
                                </div>
                            )}
                        </fieldset>

                        {/* Animated hint reveal */}
                        {hint && <HintBlock hint={hint} />}

                        {/* Animated feedback reveal (ll-reveal keyframe) */}
                        {hasResult && (
                            <FeedbackBlock
                                result={result}
                                question={q}
                                onShowParagraph={n => onSetFocus(n)}
                            />
                        )}
                    </div>
                );
            })}

            {/* Finish button / done state */}
            {finished ? (
                <div className="feedback good" style={{ marginTop: 16 }}>
                    <Check size={16} style={{ display: 'inline', marginRight: 6 }} />
                    Đã hoàn thành buổi đọc. Kết quả đã lưu vào thư viện.
                </div>
            ) : (
                <button
                    className="btn"
                    style={{ marginTop: 16, width: '100%' }}
                    disabled={busy || answeredCount < totalQuestions}
                    onClick={onFinish}
                >
                    <Check size={17} />
                    Hoàn thành buổi đọc
                </button>
            )}
        </aside>
    );
}
