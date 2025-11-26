import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title as ChartTitleJS, 
  Tooltip, Legend, PointElement, LineElement, 
} from 'chart.js';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import mapBackgroundUrl from '../../assets/map_background.jpeg';

import {
  Header, Title, DashboardGrid, 
  ChartContainer, ChartTitle,
  HeatmapContainer, HeatmapGrid, 
  HeatmapCell, MapBackground, TableContainer, StyledTable, Th, Td, 
  NavButtonGroup, NavButton, HeaderActions, ActionButton,
  LoadingOverlay, LoadingSpinner,
  ChartWrapper
} from './styles';
import { PageWrapper } from '../Storyteller/styles';

// Registrar os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale, LinearScale, BarElement, ChartTitleJS, 
  Tooltip, Legend, PointElement, LineElement
);

const POLLING_INTERVAL = 10000; // 10 segundos
const MAX_POLLING_ATTEMPTS = 12; // 12 tentativas * 10s = 2 minutos

const Analysis = () => {
  const { worldId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [reports, setReports] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const pollingRef = useRef(null);
  const attemptsRef = useRef(0);

  const fetchAnalytics = useCallback(async (isPolling = false) => {
    if (!isPolling) setIsLoading(true);
    if (!isPolling) setError(''); // Limpa o erro apenas na carga inicial

    try {
      const response = await api.get(`/worlds/${worldId}/analytics`);
      if (!response.data || !response.data.spark_reports) {
          throw new Error("Relatórios de análise ainda não foram gerados. Clique em 'Atualizar Análise' para iniciar o processamento.");
      }
      setReports(response.data.spark_reports);
      console.log("Dados de análise carregados:", response.data.spark_reports);
      setError(''); // Limpa qualquer erro anterior se a busca for bem-sucedida
      if (pollingRef.current) clearInterval(pollingRef.current);
      setIsProcessing(false);
      return true; // Sucesso
    } catch (err) {
      if (!isPolling) {
        setError(err.message || "Não foi possível carregar os dados.");
      }
      console.error("Erro ao buscar dados de análise:", err);
      return false; // Falha
    } finally {
      if (!isPolling) setIsLoading(false);
    }
  }, [worldId]);
  
  useEffect(() => {
    fetchAnalytics();
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchAnalytics]);
  
  const handleRefreshAnalysis = async () => {
    setIsProcessing(true);
    setError("Iniciando processamento... Os dados serão atualizados automaticamente.");
    setReports(null);
    attemptsRef.current = 0;

    try {
      await api.post(`/analysis/${worldId}/run`);
      
      pollingRef.current = setInterval(async () => {
        attemptsRef.current += 1;
        if (attemptsRef.current > MAX_POLLING_ATTEMPTS) {
          clearInterval(pollingRef.current);
          setIsProcessing(false);
          setError("O processamento da análise demorou mais que o esperado. Tente recarregar a página mais tarde.");
          return;
        }
        
        const success = await fetchAnalytics(true);
        if (success) {
          clearInterval(pollingRef.current);
          setIsProcessing(false);
          setError('');
        }
      }, POLLING_INTERVAL);

    } catch (err) {
      const errorMessage = err.response?.data?.detail || "Falha ao iniciar a atualização da análise.";
      setError(errorMessage);
      setIsProcessing(false);
    }
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { labels: { color: 'white', font: { size: 14 } } } 
    },
    scales: { 
      x: { ticks: { color: 'white' } }, 
      y: { ticks: { color: 'white' } } 
    }
  };

  const getKdData = () => {
    if (!reports?.report_combat_kd_ratio) return null;
    const data = reports.report_combat_kd_ratio;
    console.log(data)
    return {
      labels: data.map(d => d.species),
      datasets: [
        { label: 'Abates (Kills)', data: data.map(d => d.kills), backgroundColor: 'rgba(46, 204, 113, 0.8)' },
        { label: 'Mortes (Deaths)', data: data.map(d => d.deaths), backgroundColor: 'rgba(231, 76, 60, 0.8)' }
      ]
    };
  };
  
  const getTotalDeathsData = () => {
    if (!reports?.report_total_deaths) return null;
    const data = reports.report_total_deaths;
    return {
      labels: data.map(d => d.species),
      datasets: [{
        label: 'Total de Mortes',
        data: data.map(d => d.total_deaths),
        backgroundColor: 'rgba(155, 89, 182, 0.8)',
      }]
    };
  };

  return (
    <PageWrapper>
      {isProcessing && (
        <LoadingOverlay>
          <LoadingSpinner />
          <p>Processando dados da simulação... Isso pode levar alguns minutos.</p>
        </LoadingOverlay>
      )}

      <Header>
        <Title>PAINEL DE ANÁLISE</Title>
        <HeaderActions>
          <ActionButton onClick={handleRefreshAnalysis} disabled={isLoading || isProcessing}>
            {isProcessing ? 'Processando...' : 'Atualizar Análise'}
          </ActionButton>
          <NavButtonGroup>
            <NavButton onClick={() => navigate("/")}>SELECIONAR MUNDO</NavButton>
            <NavButton onClick={() => navigate(`/simulation/${worldId}`)}>SIMULAÇÃO</NavButton>
            <NavButton onClick={() => navigate(`/creator/${worldId}`)}>STORYTELLER</NavButton>
            <NavButton onClick={logout}>SAIR</NavButton>
          </NavButtonGroup>
        </HeaderActions>
      </Header>

      {isLoading && <p style={{color: 'white', fontSize: '20px', textAlign: 'center', marginTop: '20px'}}>Carregando...</p>}
      
      {!isLoading && error && !reports && (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{color: '#ff4d4d', fontSize: '20px'}}>{error}</p>
        </div>
      )}

      {!isLoading && reports && (
        <DashboardGrid>
          <ChartContainer>
            <ChartTitle>⚔️ Análise de Combate: K/D Ratio por Espécie</ChartTitle>
            <ChartWrapper>

            {getKdData() ? <Bar options={chartOptions} data={getKdData()} /> : <p>Dados não disponíveis.</p>}
            </ChartWrapper>
          </ChartContainer>
          
          <ChartContainer>
            <ChartTitle>📉 Sobrevivência: Total de Mortes por Espécie</ChartTitle>
            <ChartWrapper>

            {getTotalDeathsData() ? <Bar options={chartOptions} data={getTotalDeathsData()} /> : <p>Dados não disponíveis.</p>}
            </ChartWrapper>
          </ChartContainer>

          <ChartContainer>
            <ChartTitle>🏛️ Diplomacia: Alianças Formadas por Clã</ChartTitle>
              <TableContainer>
                <StyledTable>
                  <thead>
                    <tr><Th>Clã</Th><Th>Nº de Alianças</Th></tr>
                  </thead>
                  <tbody>
                    {reports?.report_alliances_formed && reports.report_alliances_formed.length > 0 ? (
                      reports.report_alliances_formed.map((row, index) => (
                        <tr key={index}><Td>{row.clan_name}</Td><Td>{row.alliances_formed}</Td></tr>
                      ))
                    ) : (
                      <tr><Td colSpan="2" style={{textAlign: 'center'}}>Nenhuma aliança formada.</Td></tr>
                    )}
                  </tbody>
                </StyledTable>
              </TableContainer>
          </ChartContainer>
          
          <HeatmapContainer>
            <ChartTitle>🗺️ Heatmap de Zonas de Morte</ChartTitle>
            <MapBackground src={mapBackgroundUrl} alt="Mapa do Mundo" />
            <HeatmapGrid>
              {Array.from({ length: 400 }).map((_, index) => {
                const x = (index % 20) * 50;
                const y = Math.floor(index / 20) * 50;
                const cellData = reports?.report_conflict_heatmap?.find(d => d.grid_x === x && d.grid_y === y);
                const maxIntensity = reports?.report_conflict_heatmap ? Math.max(...reports.report_conflict_heatmap.map(d => d.conflict_intensity), 1) : 1;
                const intensity = cellData ? cellData.conflict_intensity / maxIntensity : 0;
                return <HeatmapCell key={index} intensity={intensity} />;
              })}
            </HeatmapGrid>
          </HeatmapContainer>
        </DashboardGrid>
      )}
    </PageWrapper>
  );
};

export default Analysis;