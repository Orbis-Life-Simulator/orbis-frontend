import styled from 'styled-components';

export const PageWrapper = styled.div`
  width: 100%;
  height: 100vh;
  padding: 20px 40px;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

export const Title = styled.h1`
  font-family: 'Press Start 2P', cursive;
  font-size: 24px;
  color: #FFFFFF;
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

export const SubHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
  padding-bottom: 20px;
`;

export const InfoBox = styled.div`
  background-color: rgba(42, 42, 42, 0.8);
  color: #FFFFFF;
  padding: 10px 20px;
  border-radius: 8px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 700;
`;

export const StartButton = styled(InfoBox)`
  cursor: pointer;
  background-color: #2ECC71;
  color: #1B263B;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  &.paused {
    background-color: #c0392b;
  }
`;

export const MainContent = styled.main`
  display: flex;
  flex-grow: 1;
  gap: 30px;
  margin-top: 20px;
  overflow: hidden;
`;

export const SimulationContainer = styled.div`
  flex: 1 1 0;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: #0D1B2A;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Sidebar = styled.aside`
  width: 350px;
  background-color: rgba(42, 42, 42, 0.8);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

export const SidebarTitle = styled.h2`
  color: #FFFFFF;
  text-align: center;
  margin-bottom: 20px;
`;

export const EventLogContainer = styled.div`
  flex-grow: 1;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  overflow-y: auto;
  padding: 15px;
`;