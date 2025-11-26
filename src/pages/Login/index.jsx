import { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import {
    PageContainer, MainTitle, LoginBox, FormTitle,
    InputWrapper, Icon, StyledInput, StyledButton, SwitchLink
} from './styles';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      console.error("Falha no login:", err);
      setError('E-mail ou senha incorretos.');
    }
  }

  return (
    <PageContainer>
      <MainTitle>ORBIS LIFE SIMULATOR</MainTitle>
      <LoginBox>
        <FormTitle>Entrar</FormTitle>
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <InputWrapper>
            <Icon><FaEnvelope /></Icon>
            <StyledInput type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </InputWrapper>
          <InputWrapper>
            <Icon><FaLock /></Icon>
            <StyledInput type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </InputWrapper>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <StyledButton type="submit">Entrar</StyledButton>
          </div>
        </form>
        <SwitchLink>
          Não tem uma conta? <span onClick={() => navigate('/register')}>Registre-se</span>
        </SwitchLink>
      </LoginBox>
    </PageContainer>
  );
};

export default Login;