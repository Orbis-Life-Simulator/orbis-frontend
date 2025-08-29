import React from 'react';

// Estilos para o painel de log
const panelStyle = {
  width: '300px',
  height: '100%',
  borderLeft: '2px solid black',
  padding: '10px',
  fontFamily: 'monospace',
  fontSize: '14px',
  backgroundColor: '#f4f4f4',
  boxSizing: 'border-box',
  color: 'black',
};

const logContainerStyle = {
  height: 'calc(100% - 40px)', // Altura total menos o título
  overflowY: 'auto', // Adiciona uma barra de rolagem se o conteúdo transbordar
  backgroundColor: '#ffffff',
  border: '1px solid #ccc',
  padding: '5px',
  color: 'black',
};

const eventStyle = {
  padding: '4px',
  borderBottom: '1px solid #eee',
};

function EventLogPanel({ events }) {
  return (
    <div style={panelStyle}>
      <h3>Log de Eventos</h3>
      <div style={logContainerStyle}>
        {events.length === 0 && <p>Nenhum evento registrado ainda...</p>}
        {events.map(event => (
          <div key={event.id} style={eventStyle}>
            {event.description}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventLogPanel;