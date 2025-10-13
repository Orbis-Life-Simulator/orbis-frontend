import React, { useState } from 'react';

function Register({ onRegister, onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senha2, setSenha2] = useState('');

  return (
    <div className="auth-bg">
      <div className="auth-header">ORBIS LIFE SIMULATOR</div>
      <div className="auth-line" />
      <div className="auth-card">
        <h2>Criar Conta</h2>
        <form onSubmit={e => { e.preventDefault(); onRegister(email, senha, senha2); }}>
          <label className="auth-label">E-mail</label>
          <input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <label className="auth-label">Senha</label>
          <input className="auth-input" type="password" value={senha} onChange={e => setSenha(e.target.value)} required />
          <label className="auth-label">Repita sua senha</label>
          <input className="auth-input" type="password" value={senha2} onChange={e => setSenha2(e.target.value)} required />
          <button className="auth-btn" type="submit">Criar Conta</button>
        </form>
        <button className="auth-switch" onClick={onSwitchToLogin}>Entrar</button>
      </div>
    </div>
  );
}

export default Register;