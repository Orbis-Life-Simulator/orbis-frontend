// src/AdminPanel.js
import React from 'react';
import SpeciesManager from './components/SpeciesManager';
import RelationshipManager from './components/RelationshipManager'; // 1. Importar

const panelStyle = {
  padding: '20px',
  fontFamily: 'sans-serif',
  backgroundColor: '#f9f9f9',
  color: 'black'
};

function AdminPanel() {
  return (
    <div style={panelStyle}>
      <h2>Painel de Administração</h2>
      <hr />
      
      {/* Módulo de Espécies */}
      <SpeciesManager />

      {/* 2. Adicionar o Módulo de Relacionamentos */}
      <RelationshipManager />
      
    </div>
  );
}

export default AdminPanel;