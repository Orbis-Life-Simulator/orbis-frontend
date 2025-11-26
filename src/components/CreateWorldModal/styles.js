import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -45%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background-color: #2A2A2A; // Cinza escuro, como a caixa de login
  padding: 30px 40px;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  // Posicionamento e animação
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ${fadeIn} 0.3s ease-out;
`;

export const ModalTitle = styled.h2`
  color: #FFFFFF;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 10px;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(145deg, #1f2a3a, #1a2330); // Mesmo estilo dos inputs de login
  color: #E0E1DD;
  font-size: 16px;

  &::placeholder {
    color: #A9A9A9;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #3A8DFF;
  }
`;

export const SectionTitle = styled.p`
  color: #E0E1DD;
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const CheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ccc;
  font-size: 16px;
  cursor: pointer;
  padding: 8px;
  border-radius: 5px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export const StyledCheckbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
`;

export const NumberInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
`;

export const ActionButton = styled.button`
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;

  &.primary {
    background-color: #3A8DFF;
    color: white;
    &:hover { background-color: #589eff; }
  }

  &.secondary {
    background-color: #4A4A4A;
    color: #E0E1DD;
    &:hover { background-color: #6A6A6A; }
  }
`;

export const ErrorMessage = styled.p`
  color: #ff4d4d;
  text-align: center;
  font-size: 14px;
  min-height: 20px;
`;