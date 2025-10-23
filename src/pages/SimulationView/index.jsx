import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stage, Layer, Rect, Text, Star  } from 'react-konva';

import {
  PageWrapper, Header, Title, NavButtonGroup, NavButton,
  SubHeader, InfoBox, StartButton, MainContent,
  SimulationContainer, Sidebar, SidebarTitle, EventLogContainer
} from './styles';

import Character from '../../components/Character';
import EventLogPanel from '../../components/EventLogPanel';
import api from '../../services/api';

const TICK_INTERVAL = 1000;
const WEBSOCKET_URL = 'ws://localhost:8000';

const clanColorMap = { 1: '#3498db', 2: '#2c3e50', 3: '#2ecc71', 4: '#f1c40f', 5: '#c0392b', 6: '#7f8c8d' };
const resourceColorMap = { 1: '#27ae60', 2: '#e67e22', 3: '#7f8c8d', 4: '#964B00', 5: '#bdc3c7' };

const SimulationView = ({ onLogout }) => {
  const { worldId } = useParams();
  const navigate = useNavigate();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [worldData, setWorldData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Conectando...');
  
  const tickIntervalRef = useRef(null);
  const containerRef = useRef(null);
  const wsRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const shouldReconnectRef = useRef(true);
  const connectingRef = useRef(false);
  const [dimensions, setDimensions] = useState({ width: 1, height: 1 });

  const closeWebSocket = () => {
    shouldReconnectRef.current = false;
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onmessage = null;
      wsRef.current.onerror = null;
      wsRef.current.onclose = null;
      try { wsRef.current.close(); } catch (e) { console.error('Erro ao fechar WS:', e); }
      wsRef.current = null;
    }
    setConnectionStatus('Desconectado');
    setIsPlaying(false);
  };

  useLayoutEffect(() => {
    let ro = null;
    const update = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      setDimensions(prev => (prev.width !== w || prev.height !== h) ? { width: w, height: h } : prev);
    };

    const tryAttach = () => {
      if (containerRef.current) {
        update();
        ro = new ResizeObserver(() => window.requestAnimationFrame(update));
        ro.observe(containerRef.current);
      } else {
        setDimensions(prev => (prev.width > 1 && prev.height > 1) ? prev : { width: 800, height: 600 });
        window.requestAnimationFrame(tryAttach);
      }
    };

    tryAttach();

    return () => {
      try { ro && ro.disconnect(); } catch (e) { console.error('Error disconnecting ResizeObserver:', e); }
    };
  }, []);
  
  const handleTick = async () => {
    try {
      const resp = await api.post(`/worlds/${worldId}/tick`);

      if (resp?.data && (resp.data.characters || resp.data.territories)) {
        setWorldData(resp.data);
        return;
      }

      const stateResp = await api.get(`/worlds/${worldId}/state`);
      if (stateResp?.data) {
        setWorldData(stateResp.data);
      }
    } catch (error) {
      console.error(`Erro ao enviar tick para o mundo ${worldId}:`, error);
      pauseSimulation();
    }
  };

  useEffect(() => {
    if (!worldId) return;

    let isMounted = true;

    const connectToWorld = async () => {
        if (!isMounted) return;
        if (connectingRef.current) {
          console.log("Já está conectando, evitando duplicar tentativa.");
          return;
        }

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            console.error("Nenhum token de acesso encontrado, redirecionando para o login.");
            navigate('/login');
            return;
        }

        try {
            console.log(`Buscando estado inicial para o mundo: ${worldId}`);
            const response = await api.get(`/worlds/${worldId}/state`);
            if (isMounted) {
                setWorldData(response.data);
            }
        } catch (error) {
            console.error("Falha ao buscar estado inicial:", error);
            if (isMounted) setConnectionStatus('Erro ao carregar mundo');
            return;
        }

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          reconnectAttemptsRef.current = 0;
          setConnectionStatus('Conectado');
          return;
        }

        connectingRef.current = true;
        shouldReconnectRef.current = true;

        console.log(`Criando WebSocket -> ${WEBSOCKET_URL}/ws/${worldId}`);
        const ws = new WebSocket(`${WEBSOCKET_URL}/ws/${worldId}?token=${encodeURIComponent(accessToken)}`);
        wsRef.current = ws;

        ws.onopen = () => {
            if (!isMounted) return;
            console.log(`WebSocket aberto para mundo ${worldId}`);
            reconnectAttemptsRef.current = 0;
            connectingRef.current = false;
            setConnectionStatus('Conectado');
        };

        ws.onmessage = (event) => {
            if (!isMounted) return;
            try {
              const updatedState = JSON.parse(event.data);
              setWorldData(updatedState);
            } catch (e) {
              console.error("Erro ao parsear mensagem WS:", e);
            }
        };

        ws.onerror = (err) => {
            if (!isMounted) return;
            console.error("Erro no WebSocket:", err);
            setConnectionStatus('Erro no WebSocket');
        };
    };

    connectToWorld();

    return () => {
        console.log("Limpando useEffect do SimulationView...");
        isMounted = false;
        if (tickIntervalRef.current) {
            clearInterval(tickIntervalRef.current);
        }
        closeWebSocket();
    };
  }, [worldId, navigate]);

  const startSimulation = () => {
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    setIsPlaying(true);
    handleTick();
    tickIntervalRef.current = setInterval(handleTick, TICK_INTERVAL);
  };

  const pauseSimulation = () => {
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    setIsPlaying(false);
    tickIntervalRef.current = null;
  };
  
  const getStatusColor = () => {
    switch(connectionStatus) {
        case 'Conectado': return '#2ECC71';
        case 'Conectando...': return '#F1C40F';
        default: return '#C0392B';
    }
  };
  
  if (!worldData) {
    return (
        <PageWrapper>
            <Header>
                <Title>ORBIS LIFE SIMULATOR</Title>
            </Header>
            <div style={{color: 'white', fontSize: '20px', textAlign: 'center', marginTop: '50px'}}>
                Carregando dados do mundo...
            </div>
        </PageWrapper>
    );
  }

  const mapWidth = worldData?.map_width || worldData?.mapWidth || 1000;
  const mapHeight = worldData?.map_height || worldData?.mapHeight || 1000;
  const scale = {
    x: dimensions.width / Math.max(1, mapWidth),
    y: dimensions.height / Math.max(1, mapHeight),
  };

  console.log("Renderizando personagens:", worldData);

  return (
    <PageWrapper>
      <Header>
        <Title>ORBIS LIFE SIMULATOR</Title>
        <NavButtonGroup>
          <NavButton onClick={() => { closeWebSocket(); navigate("/")}}>SELECIONAR MUNDO</NavButton>
          <NavButton onClick={() => { closeWebSocket(); }}>STORYTELLER</NavButton>
          <NavButton onClick={() => { closeWebSocket(); }}>SANDBOX</NavButton>
          <NavButton onClick={() => { closeWebSocket(); }}>ANALYSIS</NavButton>
          <NavButton onClick={() => { closeWebSocket(); onLogout(); }}>SAIR</NavButton>
        </NavButtonGroup>
      </Header>

      <SubHeader>
        <StartButton 
          onClick={isPlaying ? pauseSimulation : startSimulation} 
          disabled={connectionStatus !== 'Conectado'}
          className={isPlaying ? 'paused' : ''}
        >
          {isPlaying ? 'PAUSAR' : 'INICIAR'}
        </StartButton>
        <InfoBox style={{ backgroundColor: 'transparent', color: getStatusColor(), border: `1px solid ${getStatusColor()}` }}>
          Status: {connectionStatus}
        </InfoBox>
        <InfoBox>AÇÕES: {worldData.world.current_tick || 0}</InfoBox>
        <InfoBox>PERSONAGENS: {worldData.characters.length || 0}</InfoBox>
      </SubHeader>

      <MainContent>
        <SimulationContainer ref={containerRef} style={{ filter: isPlaying ? 'none' : 'grayscale(1)' }}>
          <Stage width={dimensions.width} height={dimensions.height}>
            <Layer>
               {worldData.territories?.map(terr => {
                 const startX = Number(terr.start_x ?? terr.startX ?? 0);
                 const startY = Number(terr.start_y ?? terr.startY ?? 0);
                 const endX = Number(terr.end_x ?? terr.endX ?? startX + 1);
                 const endY = Number(terr.end_y ?? terr.endY ?? startY + 1);
                 const sx = startX * scale.x;
                 const sy = startY * scale.y;
                 const sw = (endX - startX) * scale.x;
                 const sh = (endY - startY) * scale.y;
                 return (
                   <React.Fragment key={`terr-group-${terr._id}`}>
                     <Rect
                       x={sx} y={sy}
                       width={sw}
                       height={sh}
                       fill={clanColorMap[terr.owner_clan_id] || 'rgba(128, 128, 128, 0.2)'}
                       stroke={'rgba(255, 255, 255, 0.12)'}
                       strokeWidth={1}
                     />
                     <Text 
                       text={terr.name} 
                       x={sx + 6} 
                       y={sy + 6} 
                       fontSize={12 * Math.max(scale.x, scale.y)} 
                       fill="rgba(255, 255, 255, 0.8)" 
                     />
                   </React.Fragment>
                 );
               })}
               {worldData.resource_nodes?.map(node => {
                 if (node.is_depleted) {
                   return null;
                 }

                 const scaledX = node.position.x * scale.x;
                 const scaledY = node.position.y * scale.y;
                 const minScale = Math.min(scale.x, scale.y);
                 
                 return (
                   <Star
                     key={`node-${node._id}`}
                     x={scaledX}
                     y={scaledY}
                     numPoints={6}
                     innerRadius={3 / minScale}
                     outerRadius={6 / minScale}
                     fill={resourceColorMap[node.resource_type_id] || 'purple'}
                     stroke="black"
                     strokeWidth={0.5 / minScale}
                   />
                 );
               })}
            </Layer>
            <Layer>
              {worldData.characters?.map(char => (
                <Character key={char.id ?? char._id} charData={char} scale={scale} />
              ))}
            </Layer>
           </Stage>
        </SimulationContainer>

        <Sidebar>
          <SidebarTitle>Histórico De Eventos</SidebarTitle>
          <EventLogContainer>
            <EventLogPanel worldId={worldId} isPlaying={isPlaying} />
          </EventLogContainer>
        </Sidebar>
      </MainContent>
    </PageWrapper>
  );
};

export default SimulationView;