import { useState, useEffect } from 'react';
import { LogList, LogItem, Timestamp } from './styles';

const API_BASE_URL = 'http://localhost:8000';
const REFRESH_INTERVAL = 3000;

const formatEvent = (event) => {
  const { eventType, payload } = event;

  switch (eventType) {
    case 'AI_DECISION':
      return null;
    case 'CHARACTER_MOVE_WANDER':
      return `${payload.character.name} está vagando.`;
    case 'CHARACTER_MOVE_ATTACK':
      return `${payload.character.name} está se aproximando para atacar.`;
    case 'COMBAT_ACTION':
      return `${payload.attacker.name} atacou ${payload.defender.name} causando ${payload.damageDealt} de dano.`;
    case 'CHARACTER_DEATH':
      if (payload.killed_by) {
        return `${payload.character.name} foi morto em combate por ${payload.killed_by.name}.`;
      }
      return `${payload.character.name} morreu por ${payload.reason}.`;
    case 'GATHER_RESOURCE':
      return `${payload.character_id} coletou um recurso.`;
    default:
      return eventType;
  }
};


const EventLogPanel = ({ worldId, isPlaying }) => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${worldId}?limit=50`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEvents(data);
      setError(null);
    } catch (e) {
      console.error("Falha ao buscar eventos:", e);
      setError("Não foi possível carregar os eventos.");
    }
  };

  useEffect(() => {
    fetchEvents();

    let intervalId = null;
    if (isPlaying) {
      intervalId = setInterval(fetchEvents, REFRESH_INTERVAL);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [worldId, isPlaying]);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (events.length === 0) {
    return <p style={{ color: '#ccc' }}>Nenhum evento registrado ainda.</p>;
  }

  return (
    <LogList>
      {events.map((event) => {
        const formattedText = formatEvent(event);
        if (!formattedText) return null;

        const eventTime = new Date(event.timestamp).toLocaleTimeString();

        return (
          <LogItem key={event.eventId}>
            <Timestamp>[{eventTime}]</Timestamp>
            {formattedText}
          </LogItem>
        );
      })}
    </LogList>
  );
};

export default EventLogPanel;