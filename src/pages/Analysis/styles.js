import styled from 'styled-components';

export { Header, Title, NavButtonGroup, NavButton } from '../SimulationView/styles';

// --- Layout Principal ---
export const DashboardGrid = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 20px auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 30px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

// --- Componentes do Header ---
export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const ActionButton = styled.button`
  background-color: #4CAF50; /* Um verde para a ação principal */
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #45a049;
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #555;
    cursor: not-allowed;
    transform: none;
  }
`;

export const ChartWrapper = styled.div`
  position: relative;
  width: 100%;
  flex-grow: 1; /* Faz este wrapper ocupar todo o espaço flexível disponível no ChartContainer */
`;

// --- Componentes de Gráficos e Tabelas ---
export const ChartContainer = styled.div`
  background-color: rgba(27, 38, 59, 0.7);
  border: 1px solid rgba(58, 141, 255, 0.2);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: 400px; // Garante uma altura mínima

  p {
    color: #ccc;
    font-size: 1rem;
    margin-top: auto;
    margin-bottom: auto;
  }
`;

export const ChartTitle = styled.h3`
  color: #E0E1DD;
  margin-top: 0;
  margin-bottom: 25px;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  width: 100%;
`;

export const TableContainer = styled.div`
  width: 100%;
  max-height: 350px;
  overflow-y: auto;
  
  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-track { background: #1B263B; border-radius: 4px; }
  &::-webkit-scrollbar-thumb { background: #3A8DFF; border-radius: 4px; }
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: #E0E1DD;
`;

export const Th = styled.th`
  background-color: rgba(58, 141, 255, 0.2);
  padding: 12px 15px;
  text-align: left;
  font-weight: 700;
  font-size: 14px;
  position: sticky;
  top: 0;
  z-index: 1;
`;

export const Td = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
`;

// --- Componentes do Heatmap ---
export const HeatmapContainer = styled(ChartContainer)`
  grid-column: span 2;
  position: relative;
  height: 500px;
  padding: 0;
  overflow: hidden;

  @media (max-width: 1200px) {
    grid-column: span 1;
  }
`;

export const HeatmapGrid = styled.div`
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  grid-template-rows: repeat(20, 1fr);
`;

export const HeatmapCell = styled.div`
  background-color: rgba(231, 76, 60, ${props => props.intensity || 0}); /* Vermelho */
  transition: background-color 0.3s;
`;

export const MapBackground = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.25;
`;

// --- Componentes do Overlay de Carregamento ---
export const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(13, 27, 42, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  color: white;
  font-size: 1.2rem;
  gap: 20px;
  backdrop-filter: blur(5px);
`;

export const LoadingSpinner = styled.div`
  border: 8px solid rgba(255, 255, 255, 0.2);
  border-top: 8px solid #3A8DFF; /* Azul do seu tema */
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;