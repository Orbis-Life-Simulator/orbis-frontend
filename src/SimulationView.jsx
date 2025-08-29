import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Text, Star } from 'react-konva';
import EventLogPanel from './EventLogPanel';
import Character from './components/Character';

const WORLD_ID = 1;
const API_BASE_URL = 'http://localhost:8000';
const TICK_INTERVAL = 1000;

const clanColorMap = { 1: '#3498db', 2: '#2c3e50', 3: '#2ecc71', 4: '#f1c40f', 5: '#c0392b', 6: '#7f8c8d' };
const resourceColorMap = { 1: '#27ae60', 2: '#27ae60', 3: '#7f8c8d', 4: '#964B00', 5: '#626567' };

function SimulationView() {
  const [worldState, setWorldState] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [events, setEvents] = useState([]);
  const [territories, setTerritories] = useState([]);
  const [resourceNodes, setResourceNodes] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const timeoutRef = useRef(null);

  const handleTick = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/worlds/${WORLD_ID}/tick`, { method: 'POST' });
    } catch (error) {
      console.error("Falha ao enviar o comando de tick:", error);
    }

    // só agenda o próximo tick se ainda estiver tocando
    if (isPlaying) {
      timeoutRef.current = setTimeout(handleTick, TICK_INTERVAL);
    }
  };

  // Carregar estado inicial + websocket
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
      } catch (error) {
        console.error("Falha ao buscar estado inicial:", error);
      }
    };
    fetchInitialState();

    const ws = new WebSocket(`ws://localhost:8000/ws/${WORLD_ID}`);
    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
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

  const stageWidth = worldState?.map_width || 1000;
  const stageHeight = worldState?.map_height || 800;

  // Iniciar loop
  const startSimulation = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsPlaying(true);
    timeoutRef.current = setTimeout(handleTick, TICK_INTERVAL);
  };

  // Pausar loop
  const pauseSimulation = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setIsPlaying(false);
  };

  // Limpeza ao desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div style={{ padding: '10px 20px' }}>
      {/* <h1>Painel de Controle de Orbis</h1> */}
      <div>
        <p>
          Status: {isConnected ? 'Conectado' : 'Desconectado'} | Tick: {worldState?.current_tick || 0} | Personagens: {characters.length}
        </p>
        <div style={{ marginBottom: '10px' }}>
          {isPlaying ? (
            <button onClick={pauseSimulation} style={{ marginRight: '10px' }}>Pausar</button>
          ) : (
            <button onClick={startSimulation} style={{ marginRight: '10px' }}>Iniciar</button>
          )}
          <button onClick={handleTick} disabled={isPlaying}>Avançar 1 Tick</button>
        </div>
      </div>
      
      <div style={{ display: 'flex', height: stageHeight, border: '2px solid black' }}>
        <div style={{ flexGrow: 1 }}>
          <Stage width={stageWidth} height={stageHeight}>
            <Layer>
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
        <EventLogPanel events={events} />
      </div>
    </div>
  );
}

export default SimulationView;
