import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import api from '../../services/api';

import {
  PageContainer,
  MainTitle,
  RegisterBox,
  FormTitle,
  InputWrapper,
  Icon,
  StyledInput,
  StyledButton,
  SwitchLink
} from './styles';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }

    if (password.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres.");
        return;
    }
    
    try {
      await api.post('/users/register', {
        email: email,
        password: password
      });

      alert("Registro realizado com sucesso! Por favor, faça o login para continuar.");
      
      navigate('/login');

    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Ocorreu um erro ao tentar registrar. Tente novamente.");
      }
      console.error("Falha no registro:", err);
    }
  };

  return (
    <PageContainer>
      <MainTitle>ORBIS LIFE SIMULATOR</MainTitle>
      <RegisterBox>
        <FormTitle>Registrar</FormTitle>
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <InputWrapper>
            <Icon><FaEnvelope /></Icon>
            <StyledInput
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputWrapper>
          
          <InputWrapper>
            <Icon><FaLock /></Icon>
            <StyledInput
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputWrapper>

          <InputWrapper>
            <Icon><FaLock /></Icon>
            <StyledInput
              type="password"
              placeholder="Confirmar Senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </InputWrapper>
          
          {error && <p style={{ color: '#ff4d4d', textAlign: 'center', fontSize: '14px' }}>{error}</p>}
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <StyledButton type="submit">
              Registrar
            </StyledButton>
          </div>
        </form>

        <SwitchLink>
          Já tem uma conta? <span onClick={() => navigate('/login')}>Entre</span>
        </SwitchLink>

      </RegisterBox>
    </PageContainer>
  );
};

export default Register;