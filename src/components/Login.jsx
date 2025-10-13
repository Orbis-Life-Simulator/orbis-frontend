import React, { useState } from 'react';

function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <div className="auth-bg">
      <div className="auth-header">ORBIS LIFE SIMULATOR</div>
      <div className="auth-line" />
      <div className="auth-card">
        <h2>Entrar</h2>
        <form onSubmit={e => { e.preventDefault(); onLogin(email, senha); }}>
          <label className="auth-label">E-mail</label>
          <input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <label className="auth-label">Senha</label>
          <input className="auth-input" type="password" value={senha} onChange={e => setSenha(e.target.value)} required />
          <button className="auth-btn" type="submit">Entrar</button>
        </form>
        <button className="auth-switch" onClick={onSwitchToRegister}>Criar Conta</button>
      </div>
    </div>
  );
}

export default Login;