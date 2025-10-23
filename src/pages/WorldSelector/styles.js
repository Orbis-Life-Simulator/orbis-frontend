import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
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

export const Header = styled.header`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  animation: ${fadeIn} 0.5s ease-out;
`;

export const Title = styled.h1`
  font-family: 'Press Start 2P', cursive;
  font-size: 24px;
  color: #FFFFFF;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 15px;
`;

export const ActionButton = styled.button`
  background-color: #3A8DFF;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 25px;
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #589eff;
    transform: translateY(-2px);
  }

  &.secondary {
    background-color: transparent;
    border: 1px solid #C0392B;
    color: #C0392B;
    &:hover {
      background-color: #C0392B;
      color: white;
    }
  }
`;

export const WorldListContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  animation: ${fadeIn} 0.5s ease-out 0.2s;
  animation-fill-mode: backwards;
`;

export const WorldList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
`;

export const WorldCard = styled.li`
  background-color: rgba(42, 42, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    border-color: #3A8DFF;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

export const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: none;
  background: rgba(255,255,255,0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgba(255,0,0,0.12);
  }
`;

export const WorldName = styled.h3`
  font-size: 20px;
  color: #FFFFFF;
  margin-bottom: 10px;
`;

export const WorldInfo = styled.p`
  font-size: 14px;
  color: #ccc;
`;

export const LoadingText = styled.div`
  color: white;
  font-size: 20px;
  margin-top: 50px;
`;

export const NoWorldsText = styled.p`
  color: #ccc;
  font-size: 18px;
  text-align: center;
  margin-top: 50px;
`;