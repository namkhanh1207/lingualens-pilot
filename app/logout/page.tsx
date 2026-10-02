'use client';
import { useState } from 'react';
import Link from 'next/link';
import '../login/login.css';
export default function Logout() {
    const [error, setError] = useState(''), [busy, setBusy] = useState(false);
    async function logout() {
        setBusy(true); setError('');
        try {
            const response = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'logout' }) });
            if (!response.ok) { setError('Chưa thể đăng xuất. Hãy thử lại.'); return; }
            window.location.assign('/login');
        } catch { setError('Không kết nối được máy chủ.'); }
        finally { setBusy(false); }
    }
    return <main className="pilot-auth-page"><section className="pilot-auth-card">
        <h1>Đăng xuất</h1><p>Tiến trình đã lưu vẫn nằm trong tài khoản của bạn.</p>
        {error && <p role="alert" className="pilot-auth-error">{error}</p>}
        <form onSubmit={event => { event.preventDefault(); void logout(); }}><button disabled={busy}>{busy ? 'Đang đăng xuất…' : 'Xác nhận đăng xuất'}</button></form>
        <Link href="/">Quay lại phòng học</Link>
    </section></main>;
}
