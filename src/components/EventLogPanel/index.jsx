import { useState, useEffect } from 'react';
import api from '../../services/api';
import { LogList, LogItem } from './styles';

const REFRESH_INTERVAL = 3000;

const formatEvent = (event) => {
  const { eventType, payload } = event;

  switch (eventType) {
    case 'AI_DECISION':
    case 'CHARACTER_MOVE_WANDER':
      return null;
    case 'COMBAT_ACTION':
      return `⚔️ ${payload.attacker.name} atacou ${payload.defender.name} causando ${payload.damageDealt} de dano.`;
    case 'CHARACTER_DEATH':
      if (payload.killed_by && payload.killed_by.name) {
        return `💀 ${payload.character.name} foi morto em combate por ${payload.killed_by.name}.`;
      }
      return `💀 ${payload.character.name} morreu de ${payload.reason}.`;
    case 'CHARACTER_FLEE':
      return `🏃 ${payload.character.name} está fugindo de ${payload.fleeing_from.name}.`;
    case 'CHARACTER_GATHER':
      return `⛏️ ${payload.character.name} coletou ${payload.quantity} de ${payload.resource_type.name}.`;
    case 'CHARACTER_EAT':
      return `🍴 ${payload.character.name} comeu para saciar a fome.`;
    case 'CHARACTER_MOVE_ATTACK':
      return `🎯 ${payload.character.name} avança para atacar ${payload.target.name}.`;
    case 'CHARACTER_MOVE_GATHER':
      return ` resourceful ${payload.character.name} vai em direção a um recurso.`;
    case 'ALLIANCE_FORMED':
      return `🤝 O ${payload.clanA.name} e o ${payload.clanB.name} formaram uma aliança!`;
    case 'CHARACTER_BUILD_HOUSE':
      return `🏠 ${payload.character.name} construiu uma casa!`;
    default:
      return eventType;
  }
};

const EventLogPanel = ({ worldId, isPlaying }) => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!worldId) return;
      try {
        const response = await api.get(`/events/${worldId}?limit=50`);
        setEvents(response.data);
        setError(null);
      } catch (e) {
        console.error("Falha ao buscar eventos:", e);
        setError("Não foi possível carregar os eventos.");
      }
    };
  
    fetchEvents();
    
    let intervalId = null;
    if (isPlaying) {
      intervalId = setInterval(fetchEvents, REFRESH_INTERVAL);
    }
    
    return () => clearInterval(intervalId);
  }, [worldId, isPlaying]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (events.length === 0) return <p style={{ color: '#ccc' }}>Nenhum evento registrado ainda.</p>;

  return (
    <LogList>
      {events.map((event) => {
        const formattedText = formatEvent(event);
        if (!formattedText) return null;
        return <LogItem key={event.eventId}>{formattedText}</LogItem>;
      })}
    </LogList>
  );
};

export default EventLogPanel;