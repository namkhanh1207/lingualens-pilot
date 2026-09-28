'use client';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import './login.css';

export default function Login() {
    const [error, setError] = useState(''), [busy, setBusy] = useState(false);
    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setError(''); setBusy(true);
        try {
            const response = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ op: 'login', username: form.get('username'), password: form.get('password') }) });
            const data = await response.json() as { error?: string };
            if (!response.ok) { setError(data.error || 'Chưa thể đăng nhập. Hãy thử lại.'); return; }
            window.location.assign('/#dashboard');
        } catch { setError('Không kết nối được máy chủ. Vui lòng thử lại.'); }
        finally { setBusy(false); }
    }
    return <main className="pilot-auth-page">
        <section className="pilot-auth-card" aria-labelledby="login-title">
            <Link className="pilot-auth-brand" href="/">LinguaLens<span>PHÒNG HỌC TIẾNG ANH</span></Link>
            <p className="pilot-auth-eyebrow">BẢN THỬ NGHIỆM NHÓM NHỎ</p>
            <h1 id="login-title">Tiếp tục hành trình học</h1>
            <p>Đăng nhập bằng tài khoản người tổ chức đã gửi cho bạn. Tiến trình và ghi chú được lưu riêng cho từng người.</p>
            <form onSubmit={submit}>
                <label htmlFor="username">Tên tài khoản</label>
                <input id="username" name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} required maxLength={32} placeholder="Ví dụ: pilot01" />
                <label htmlFor="password">Mật khẩu</label>
                <input id="password" name="password" type="password" autoComplete="current-password" required maxLength={256} />
                {error && <p className="pilot-auth-error" role="alert">{error}</p>}
                <button type="submit" disabled={busy}>{busy ? 'Đang đăng nhập…' : 'Vào phòng học'}</button>
            </form>
            <p className="pilot-auth-help">Chưa có tài khoản hoặc quên mật khẩu? Liên hệ người tổ chức để được cấp lại.</p>
            <Link href="/">← Về trang giới thiệu</Link>
        </section>
    </main>;
}
