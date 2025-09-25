import React, { useState } from 'react';
import './LoginAndSignup.css';

function LoginAndSignup({ onClose }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup fields
  const [suName, setSuName] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suConfirm, setSuConfirm] = useState('');

  const handleClose = () => {
    if (typeof onClose === 'function') onClose();
  };

  const passwordOk = (pwd) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(pwd);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'signup') {
      if (!passwordOk(suPassword)) {
        alert('Mật khẩu phải từ 6 ký tự, gồm cả số và chữ.');
        return;
      }
      if (suPassword !== suConfirm) {
        alert('Xác nhận mật khẩu không trùng khớp.');
        return;
      }
      alert('Đăng ký thành công!');
      setMode('login');
      setSuPassword('');
      setSuConfirm('');
      return;
    }

    if (!loginEmail || !loginPassword) {
      alert('Vui lòng nhập email và mật khẩu.');
      return;
    }
    alert('Đăng nhập thành công!');
  };

  return (
    <div className="auth-overlay">
      <div className="auth-container">
        <button className="close-btn" onClick={handleClose}>×</button>
        
        <style>{`.form-box label{font-size:15px}`}</style>

        {mode === 'login' ? (
          <div className="form-box">
            <h2>Đăng nhập</h2>
            <form onSubmit={handleSubmit}>
              <label>Email *</label>
              <input
                type="email"
                placeholder="Nhập email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                autoComplete="email"
              />

              <label>Mật khẩu *</label>
              <input
                type={showLoginPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                autoComplete="current-password"
              />

              <div className="form-options">
                <label>
                  <input
                    type="checkbox"
                    checked={showLoginPassword}
                    onChange={(e) => setShowLoginPassword(e.target.checked)}
                  />
                  Hiện mật khẩu
                </label>
                <label>
                  <input type="checkbox" />
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <button type="submit" className="btn-auth">Đăng nhập</button>
            </form>
            <p className="switch-auth">
              Chưa có tài khoản?{' '}
              <button type="button" className="link-btn" onClick={() => setMode('signup')}>Đăng ký</button>
            </p>
          </div>
        ) : (
          <div className="form-box">
            <h2>Đăng ký tài khoản</h2>
            <form onSubmit={handleSubmit}>
              <label>Tên tài khoản *</label>
              <input
                type="text"
                placeholder="Nhập tên tài khoản"
                required
                value={suName}
                onChange={(e) => setSuName(e.target.value)}
                autoComplete="username"
              />

              <label>Email *</label>
              <input
                type="email"
                placeholder="Nhập email"
                required
                value={suEmail}
                onChange={(e) => setSuEmail(e.target.value)}
                autoComplete="email"
              />

              <label>Mật khẩu *</label>
              <input
                type="password"
                placeholder="Tạo mật khẩu "
                required
                value={suPassword}
                onChange={(e) => setSuPassword(e.target.value)}
                autoComplete="new-password"
              />

              <label>Xác nhận mật khẩu *</label>
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                required
                value={suConfirm}
                onChange={(e) => setSuConfirm(e.target.value)}
                autoComplete="new-password"
              />

              <button type="submit" className="btn-auth">Đăng ký</button>
            </form>
            <p className="switch-auth">
              Đã có tài khoản?{' '}
              <button type="button" className="link-btn" onClick={() => setMode('login')}>Đăng nhập</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginAndSignup;
