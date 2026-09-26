'use client';
import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Camera, CameraOff, Volume2, Info } from 'lucide-react';
type Recognition = {
    lang: string;
    interimResults: boolean;
    onresult: ((e: any) => void) | null;
    onerror: ((e: any) => void) | null;
    onend: (() => void) | null;
    start: () => void;
    abort: () => void;
    stop: () => void;
};
const targets = [{ sound: '/θ/', word: 'think', instruction: 'Đặt nhẹ đầu lưỡi giữa hai hàm răng. Thổi hơi liên tục, không rung dây thanh.' }, { sound: '/ð/', word: 'this', instruction: 'Đặt nhẹ đầu lưỡi giữa hai hàm răng như /θ/, nhưng có rung dây thanh.' }, { sound: '/ʃ/', word: 'she', instruction: 'Môi hơi tròn, nâng phần trước lưỡi về phía sau lợi trên. Đẩy luồng hơi liên tục.' }];
export default function MediaLab({ mode, onTranscript }: {
    mode: 'speech' | 'pronunciation' | 'eye';
    onTranscript?: (t: string) => void;
}) {
    const [allowed, setAllowed] = useState(false), [cameraAllowed, setCameraAllowed] = useState(false), [listening, setListening] = useState(false), [camera, setCamera] = useState(false), [error, setError] = useState(''), [transcript, setTranscript] = useState(''), [target, setTarget] = useState(0), [jaw, setJaw] = useState(12), [tongue, setTongue] = useState(0), [angle, setAngle] = useState(0), [point, setPoint] = useState(-1), [calibrated, setCalibrated] = useState(false);
    const video = useRef<HTMLVideoElement>(null), stream = useRef<MediaStream | null>(null), recognition = useRef<Recognition | null>(null), mounted = useRef(true), cameraPending = useRef(false), [startingCamera, setStartingCamera] = useState(false);
    const stop = () => { recognition.current?.abort(); recognition.current = null; setListening(false); stream.current?.getTracks().forEach(t => t.stop()); stream.current = null; setCamera(false); setPoint(-1); };
    useEffect(() => { mounted.current = true; return () => { mounted.current = false; recognition.current?.abort(); stream.current?.getTracks().forEach(t => t.stop()); if ('speechSynthesis' in window)
        speechSynthesis.cancel(); }; }, []);
    useEffect(() => { const hide = () => { if (document.hidden)
        stop(); }; document.addEventListener('visibilitychange', hide); return () => document.removeEventListener('visibilitychange', hide); }, []);
    async function startCamera() { setError(''); if (!cameraAllowed || cameraPending.current)
        return; cameraPending.current = true; setStartingCamera(true); try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (!mounted.current || document.hidden) {
            s.getTracks().forEach(t => t.stop());
            return;
        }
        stream.current = s;
        if (video.current)
            video.current.srcObject = s;
        setCamera(true);
    }
    catch {
        setError('Không mở được camera. Kiểm tra quyền trình duyệt hoặc tiếp tục mà không dùng camera.');
    }
    finally {
        cameraPending.current = false;
        if (mounted.current)
            setStartingCamera(false);
    } }
    function listen() { setError(''); if (!allowed)
        return; const w = window as unknown as {
        SpeechRecognition?: new () => Recognition;
        webkitSpeechRecognition?: new () => Recognition;
    }; const SR = w.SpeechRecognition || w.webkitSpeechRecognition; if (!SR) {
        setError('Trình duyệt này không hỗ trợ nhận dạng giọng nói. Hãy nhập chữ hoặc thử Chrome/Edge.');
        return;
    } recognition.current?.abort(); const r = new SR(); recognition.current = r; r.lang = 'en-US'; r.interimResults = false; r.onresult = e => { if (!mounted.current)
        return; const t = e.results[0][0].transcript; setTranscript(t); onTranscript?.(t); }; r.onerror = () => { if (mounted.current) {
        setError('Không nhận được giọng nói hoặc quyền micro bị từ chối. Bạn vẫn có thể nhập chữ.');
        setListening(false);
    } }; r.onend = () => { if (mounted.current)
        setListening(false); }; try {
        r.start();
        setListening(true);
    }
    catch {
        setError('Micro chưa sẵn sàng. Hãy thử lại.');
    } }
    function speak() { setError(''); if (!('speechSynthesis' in window)) {
        setError('Trình duyệt chưa hỗ trợ giọng đọc mẫu.');
        return;
    } speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(targets[target].word); u.lang = 'en-US'; u.rate = .75; speechSynthesis.speak(u); }
    const speech = <><label className="check"><input type="checkbox" checked={allowed} onChange={e => { setAllowed(e.target.checked); if (!e.target.checked) {
        recognition.current?.abort();
        setListening(false);
    } }}/><span>Tôi đồng ý dùng micro. Âm thanh có thể được xử lý bởi dịch vụ nhận dạng của trình duyệt; ứng dụng chỉ nhận văn bản và không lưu âm thanh thô.</span></label><div className="row"><button className="btn" disabled={!allowed || listening} onClick={listen}><Mic size={17}/>{listening ? 'Đang nghe…' : 'Bắt đầu nói'}</button>{listening && <button className="secondary" onClick={() => { recognition.current?.stop(); setListening(false); }}><MicOff size={17}/>Dừng</button>}</div>{transcript && <div className="feedback"><b>Văn bản nhận dạng</b><p lang="en">{transcript}</p><p className="small">Đây không phải điểm phát âm. Nhận dạng có thể sai vì tiếng ồn hoặc thiết bị.</p></div>}</>;
    if (mode === 'speech')
        return <div className="card"><h2>Nói thay vì gõ</h2><p>Bạn có thể sửa văn bản nhận dạng trước khi gửi.</p>{speech}{error && <div className="error" role="alert">{error}</div>}</div>;
    return <>{mode === 'pronunciation' ? <div className="grid-2"><div className="card"><span className="badge">Mô hình giảng dạy · không phải phép đo</span><h2 style={{ marginTop: 15 }}>Khẩu hình và luồng hơi</h2><label className="form-label" htmlFor="targetSound">Âm mục tiêu</label><select id="targetSound" value={target} onChange={e => { setTarget(Number(e.target.value)); setTranscript(''); }}>{targets.map((t, i) => <option key={t.sound} value={i}>{t.sound} — {t.word}</option>)}</select><svg className="mouth-diagram" role="img" aria-label="Sơ đồ mặt cắt miệng: răng, lưỡi và hướng luồng hơi, dùng để minh họa" viewBox="0 0 440 230" style={{ marginTop: 20, transform: 'perspective(700px) rotateY(' + angle + 'deg)' }}><path d="M65 67 Q140 20 280 65 L330 86 L365 82 L360 99 L330 105" fill="none" stroke="#b38e92" strokeWidth="14" strokeLinecap="round"/><path d={'M65 170 Q160 ' + (195 + jaw) + ' 280 ' + (165 + jaw) + ' L330 ' + (135 + jaw) + ' L363 ' + (130 + jaw)} fill="none" stroke="#b38e92" strokeWidth="14" strokeLinecap="round"/><rect x="322" y="85" width="12" height="28" rx="3" fill="white" stroke="#8295ae"/><rect x="322" y={122 + jaw} width="12" height="20" rx="3" fill="white" stroke="#8295ae"/><path d={'M80 161 Q210 122 ' + (325 + tongue) + ' 118 Q' + (340 + tongue) + ' 125 278 143 L100 176'} fill="#e8909a" stroke="#ba6875" strokeWidth="2"/><path d="M344 117 L405 117 M394 109 L405 117 L394 125" fill="none" stroke="#2855d9" strokeWidth="3"/><text x="145" y="211" fontSize="12" fill="#506783">Lưỡi — vị trí minh họa</text><text x="340" y="60" fontSize="12" fill="#506783">Răng</text><text x="362" y="151" fontSize="12" fill="#2855d9">Luồng hơi</text></svg><label className="form-label" htmlFor="tonguePos">Minh họa độ đưa lưỡi</label><input id="tonguePos" type="range" min="-35" max="20" value={tongue} onChange={e => setTongue(Number(e.target.value))}/><label className="form-label" htmlFor="jawPos">Minh họa độ mở hàm</label><input id="jawPos" type="range" min="0" max="28" value={jaw} onChange={e => setJaw(Number(e.target.value))}/><label className="form-label" htmlFor="viewAngle">Góc nhìn sơ đồ</label><input id="viewAngle" type="range" min="-35" max="35" value={angle} onChange={e => setAngle(Number(e.target.value))}/><p className="small">Sơ đồ 2D xoay phối cảnh, chưa phải mô hình giải phẫu 3D. Thanh trượt không mô phỏng đầy đủ cách tạo từng âm.</p></div><div className="card"><h2>{targets[target].sound} trong “{targets[target].word}”</h2><p>{targets[target].instruction}</p><button className="secondary" onClick={speak} style={{ marginTop: 14 }}><Volume2 size={17}/>Nghe mẫu từ trình duyệt</button><div className="divider"/><h2>Thử nói một lần</h2>{speech}<div className="notice warn" style={{ marginTop: 20 }}><Info size={20}/><p>Chưa có mô hình chấm âm vị hoặc ngữ điệu. Webcam không đo được vị trí lưỡi sâu bên trong; kết quả nhận dạng chữ không chứng minh phát âm đúng.</p></div></div></div> : <div className="notice warn"><Info size={20}/><div><strong>Hiện là trải nghiệm camera và quy trình hiệu chỉnh.</strong><p>Chưa tích hợp mô hình ước lượng gaze. Không có tọa độ ánh nhìn, heatmap hoặc chỉ số chú ý được đo trong bản này.</p></div></div>}
 <div className="card"><div className="grid-2"><div><h2>{mode === 'eye' ? 'Camera & hiệu chỉnh thử' : 'Tự quan sát môi và hàm'}</h2><p>Hình ảnh chỉ hiển thị trên thiết bị, không gửi lên máy chủ và không được ghi lại.</p><label className="check"><input type="checkbox" checked={cameraAllowed} onChange={e => { setCameraAllowed(e.target.checked); if (!e.target.checked)
        stop(); }}/>Tôi đồng ý mở camera cho lần trải nghiệm này.</label><div className="row"><button className="btn" onClick={startCamera} disabled={!cameraAllowed || camera || startingCamera}><Camera size={17}/>{startingCamera ? 'Đang mở…' : 'Mở camera'}</button><button className="secondary" onClick={stop} disabled={!camera}><CameraOff size={17}/>Tắt camera</button></div>{mode === 'eye' && <><button className="secondary" style={{ marginTop: 14 }} disabled={!camera} onClick={() => { setPoint(0); setCalibrated(false); }}>Thử quy trình 9 điểm</button><p className="small">Nhìn vào điểm rồi bấm điểm đó. Đây chỉ là diễn tập thao tác, không huấn luyện hay đo độ chính xác gaze.</p>{calibrated && <div className="feedback">Đã thử đủ 9 điểm. Không có dữ liệu gaze được tạo hoặc lưu.</div>}</>}</div><div className="camera-box"><video ref={video} autoPlay muted playsInline style={{ display: camera ? 'block' : 'none' }}/>{!camera && <span>Camera đang tắt</span>}{point >= 0 && <button aria-label={'Điểm hiệu chỉnh ' + (point + 1)} className="calibration-dot" style={{ left: (15 + point % 3 * 35) + '%', top: (15 + Math.floor(point / 3) * 35) + '%' }} onClick={() => { if (point === 8) {
        setPoint(-1);
        setCalibrated(true);
    }
    else
        setPoint(point + 1); }}/>}</div></div>{error && <div className="error" role="alert">{error}</div>}</div></>;
}
