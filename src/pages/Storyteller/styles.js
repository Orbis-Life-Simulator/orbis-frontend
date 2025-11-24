// src/pages/Storyteller/styles.js
import styled, { keyframes } from 'styled-components';

export { Header, Title} from '../SimulationView/styles';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  width: 100%;
  min-height: 100vh;
`;

export const BackButton = styled.button`
  background-color: transparent;
  color: #E0E1DD;
  border: 1px solid #4A4A4A;
  border-radius: 8px;
  padding: 10px 20px;
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background-color: #3A8DFF;
    border-color: #3A8DFF;
    color: #FFFFFF;
  }
`;

export const MainContent = styled.div`
  width: 100%;
  max-width: 900px;
  background-color: rgba(27, 38, 59, 0.6); /* Tom de azul mais escuro e alinhado */
  border: 1px solid rgba(58, 141, 255, 0.3);
  border-radius: 15px;
  padding: 30px 40px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  animation: ${fadeIn} 0.5s ease-out 0.1s;
  animation-fill-mode: backwards;
`;

export const SectionLabel = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: #A9A9A9;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
  display: block;
`;

export const CommandInput = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 15px;
  border: 1px solid #4A4A4A;
  border-radius: 8px;
  background-color: #1B263B;
  color: #E0E1DD;
  font-size: 16px;
  font-family: 'Roboto', sans-serif;
  resize: vertical;
  transition: box-shadow 0.2s, border-color 0.2s;
  
  &::placeholder {
    color: #6a737d;
  }

  &:focus {
    outline: none;
    border-color: #3A8DFF;
    box-shadow: 0 0 0 3px rgba(58, 141, 255, 0.3);
  }
`;

export const ActionButton = styled.button`
  align-self: flex-end;
  background: linear-gradient(145deg, #4a9dff, #3a8dff);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 30px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 15px 0 rgba(58, 141, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px 0 rgba(58, 141, 255, 0.4);
  }

  &:disabled {
    background: #555;
    cursor: not-allowed;
    transform: translateY(0);
    box-shadow: none;
  }
`;

export const ResponseArea = styled.div`
  background-color: #101824; /* Fundo mais escuro para contraste */
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px;
  min-height: 100px;
  color: #a9b3be;
  white-space: pre-wrap;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.6;
`;

export const Suggestions = styled.div`
  width: 100%;
  max-width: 900px;
  margin-top: 40px;
  padding: 25px;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  animation: ${fadeIn} 0.5s ease-out 0.2s;
  animation-fill-mode: backwards;

  h3 {
    color: #FFFFFF;
    margin-bottom: 15px;
    font-weight: 700;
  }
  ul {
    list-style-type: none;
    padding-left: 0;
  }
  li {
    color: #99a1ab;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 8px;
    font-size: 14px;
    font-family: 'Courier New', Courier, monospace;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
    
    &:before {
      content: '» ';
      color: #3A8DFF;
    }
    
    &:hover {
      background-color: rgba(58, 141, 255, 0.1);
      color: #E0E1DD;
    }
  }
`;

export const NavButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

export const NavButton = styled.button`
  background-color: #1B263B;
  color: #E0E1DD;
  border: 1px solid #3A8DFF;
  border-radius: 8px;
  padding: 10px 20px;
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3A8DFF;
    color: #FFFFFF;
  }
`;