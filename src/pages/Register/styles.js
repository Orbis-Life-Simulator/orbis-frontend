import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: relative;
`;

export const MainTitle = styled.h1`
  position: absolute;
  top: 40px;
  left: 40px;
  font-family: 'Press Start 2P', cursive;
  font-size: 24px;
  color: #FFFFFF;
  letter-spacing: 2px;
`;

export const RegisterBox = styled.div`
  background-color: rgba(42, 42, 42, 0.8);
  padding: 40px 50px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
`;

export const FormTitle = styled.h2`
  color: #FFFFFF;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Icon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #A9A9A9;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(145deg, #1f2a3a, #1a2330);
  color: #E0E1DD;
  font-size: 16px;

  &::placeholder { color: #A9A9A9; }
  &:focus { outline: none; box-shadow: 0 0 0 2px #3A8DFF; }
`;

export const StyledButton = styled.button`
  padding: 15px 40px;
  border: none;
  border-radius: 50px;
  background-color: #F5F5F5;
  color: #1B263B;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 15px;
  transition: transform 0.2s ease-in-out;

  &:hover { transform: scale(1.05); }
`;

export const SwitchLink = styled.p`
  color: #A9A9A9;
  margin-top: 20px;
  font-size: 14px;

  span {
    color: #3A8DFF;
    cursor: pointer;
    text-decoration: underline;
  }
`;