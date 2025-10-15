import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Text, Star, Image } from 'react-konva';
import useImage from 'use-image';

import EventLogPanel from './EventLogPanel';
import Character from './components/Character';

import mapBackgroundUrl from './assets/map_background.jpeg'; 

const WORLD_ID = 1;
const API_BASE_URL = 'http://localhost:8000';
const TICK_INTERVAL = 1000;

const clanColorMap = { 1: '#3498db', 2: '#2c3e50', 3: '#2ecc71', 4: '#f1c40f', 5: '#c0392b', 6: '#7f8c8d' };
const resourceColorMap = { 1: '#27ae60', 2: '#27ae60', 3: '#7f8c8d', 4: '#964B00', 5: '#626567' };

const BackgroundLayer = ({ imageUrl, width, height }) => {
  const [image] = useImage(imageUrl);
  return <Image image={image} x={0} y={0} width={width} height={height} />;
};

function SimulationView() {
  const [worldState, setWorldState] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [events, setEvents] = useState([]);
  const [territories, setTerritories] = useState([]);
  const [resourceNodes, setResourceNodes] = useState([]);
  // isConnected controla se o WebSocket está ativo
  const [isConnected, setIsConnected] = useState(false);
  // isPlaying controla se a simulação foi explicitamente iniciada (botão INICIAR/PLAY)
  const [isPlaying, setIsPlaying] = useState(false); 

  const timeoutRef = useRef(null);

  const handleTick = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/worlds/${WORLD_ID}/tick`, { method: 'POST' });
    } catch (error) {
      console.error("Falha ao enviar o comando de tick:", error);
    }
    if (isPlaying) {
      timeoutRef.current = setTimeout(handleTick, TICK_INTERVAL);
    }
  };

  useEffect(() => {
    const fetchInitialState = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/worlds/${WORLD_ID}/state`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const initialState = await response.json();
        setWorldState(initialState.world);
        setCharacters(initialState.characters);
        setEvents(initialState.events);
        setTerritories(initialState.territories);
        setResourceNodes(initialState.resourceNodes);
        // Se a chamada inicial for bem-sucedida, consideramos conectado.
        setIsConnected(true); 
      } catch (error) {
        console.error("Falha ao buscar estado inicial:", error);
        setIsConnected(false);
      }
    };
    fetchInitialState();

    const ws = new WebSocket(`ws://localhost:8000/ws/${WORLD_ID}`);
    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        setIsConnected(false);
    };
    ws.onmessage = (event) => {
      const updatedState = JSON.parse(event.data);
      setWorldState(updatedState.world);
      setCharacters(updatedState.characters);
      setEvents(updatedState.events);
      setTerritories(updatedState.territories);
      setResourceNodes(updatedState.resourceNodes);
    };
    
    return () => ws.close();
  }, []);

  const stageWidth = 796;
  const stageHeight = 693;
  const backgroundImageUrl = mapBackgroundUrl;

  const startSimulation = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // ATENÇÃO: Muda isPlaying para true ao clicar em INICIAR/PLAY
    setIsPlaying(true);
    timeoutRef.current = setTimeout(handleTick, TICK_INTERVAL);
  };

  const pauseSimulation = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const isMapBW = !isPlaying;

return (
  <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
    <div className="main-content">
      <div className="main-left">
  {!isPlaying ? (
    <button
      className="start-btn"
      onClick={startSimulation}
      style={{ marginBottom: 32 }}
    >
      INICIAR
    </button>
  ) : (
    <div className="action-bar">
      <button className="action-btn" onClick={handleTick}>AGIR</button>
      <div className="action-info">AÇÕES: {worldState?.current_tick || 0}</div>
      <div className="action-info">PERSONAGENS : {characters.length}</div>
    </div>
  )}

  <div className={isPlaying ? "map-container" : "map-container map-bw"}>
    <Stage width={796} height={693}>
      <Layer>
        <BackgroundLayer
          imageUrl={backgroundImageUrl}
          width={796}
          height={693}
              />
              {territories.map(terr => (
                <Rect
                  key={`terr-${terr.id}`}
                  x={terr.start_x} y={terr.start_y}
                  width={terr.end_x - terr.start_x}
                  height={terr.end_y - terr.start_y}
                  fill={clanColorMap[terr.owner_clan_id] || '#dddddd'}
                  opacity={0.2} stroke={'black'} strokeWidth={1}
                />
              ))}
              {territories.map(terr => (
                <Text key={`terr-name-${terr.id}`} text={terr.name} x={terr.start_x + 5} y={terr.start_y + 5} fontSize={14} fill="#555" />
              ))}
              {resourceNodes.map(node => !node.is_depleted && (
                <Star
                  key={`node-${node.id}`}
                  x={node.position_x} y={node.position_y}
                  numPoints={5} innerRadius={3} outerRadius={5}
                  fill={resourceColorMap[node.resource_type_id] || 'purple'}
                />
              ))}
              {characters.map(char => (
                <Character key={char.id} charData={char} />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>
      
      {/* Painel de Eventos */}
      <div className="main-right">
        <div className="main-card">
          <h2>Histórico De Eventos</h2>
          <div className="main-card-content">
            {events.length === 0
              ? <div style={{ color: "#EDEDED", textAlign: "center" }}>A simulação ainda não foi iniciada.</div>
              : <div style={{ width: '100%', height: '100%', overflowY: 'auto', padding: '0px', display: 'block', textAlign: 'left' }}>
                  {events.map((ev, i) => <div key={i} style={{ color: "#EDEDED", fontSize: 18, marginBottom: 8, lineHeight: '1.2' }}>{ev.text}</div>)}
                </div>
            }
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default SimulationView;