import { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import api from '../../services/api'; 

import {
  PageContainer, 
  MainTitle, 
  LoginBox, 
  FormTitle, 
  InputWrapper, 
  Icon, 
  StyledInput, 
  StyledButton,
  SwitchLink
} from './styles';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await api.post('/users/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const { access_token } = response.data;
      
      localStorage.setItem('accessToken', access_token);
      
      onLogin();
      
    } catch (err) {
      console.error("Falha no login:", err);
      setError('E-mail ou senha incorretos.');
      localStorage.removeItem('accessToken');
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