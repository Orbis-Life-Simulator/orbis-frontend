import React, { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:8000';

// Estilos
const containerStyle = { padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: 'white', marginTop: '20px' };
const formStyle = { display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' };
const selectStyle = { padding: '8px', border: '1px solid #ccc', borderRadius: '4px' };
const buttonStyle = { padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' };
const deleteButtonStyle = { backgroundColor: '#dc3545' };
const listStyle = { listStyleType: 'none', padding: 0 };
const listItemStyle = { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderBottom: '1px solid #eee' };
const relationStyle = { fontWeight: 'bold', minWidth: '100px', textAlign: 'center' };
const errorStyle = { color: 'red', marginTop: '10px' };

function RelationshipManager() {
  const [relationships, setRelationships] = useState([]);
  const [species, setSpecies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ species_a_id: '', species_b_id: '', relationship_type: 'FRIEND' });

  // (fetchData, useEffect, getSpeciesName, handleInputChange, handleSubmit não mudam)
  const fetchData = useCallback(async () => { try { setIsLoading(true); const [speciesRes, relsRes] = await Promise.all([ fetch(`${API_BASE_URL}/api/species/`), fetch(`${API_BASE_URL}/api/relationships/species`), ]); if (!speciesRes.ok || !relsRes.ok) throw new Error('Falha ao buscar dados do servidor.'); const speciesData = await speciesRes.json(); const relsData = await relsRes.json(); setSpecies(speciesData); setRelationships(relsData); if (speciesData.length >= 2) { setFormData(prev => ({ ...prev, species_a_id: speciesData[0].id, species_b_id: speciesData[1].id })); } setError(null); } catch (e) { setError(e.message); } finally { setIsLoading(false); } }, []);
  useEffect(() => { fetchData(); }, [fetchData]);
  const getSpeciesName = (id) => species.find(s => s.id === id)?.name || 'Desconhecido';
  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = async (e) => { e.preventDefault(); setError(null); if (formData.species_a_id === formData.species_b_id) { setError("Uma espécie não pode ter um relacionamento consigo mesma."); return; } try { const response = await fetch(`${API_BASE_URL}/api/relationships/species`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ species_a_id: parseInt(formData.species_a_id, 10), species_b_id: parseInt(formData.species_b_id, 10), relationship_type: formData.relationship_type, }), }); if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.detail || `HTTP error! status: ${response.status}`); } await fetchData(); } catch (e) { setError(e.message); } };

  // --- NOVA FUNÇÃO PARA DELETAR RELACIONAMENTOS ---
  const handleDelete = async (relationshipId) => {
    if (!window.confirm('Tem certeza que deseja deletar esta regra?')) {
      return;
    }
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/relationships/species/${relationshipId}`, {
        method: 'DELETE',
      });
      if (!response.ok && response.status !== 204) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      // Atualiza a UI otimisticamente
      setRelationships(prev => prev.filter(rel => rel.id !== relationshipId));
    } catch (e) {
      setError(e.message);
    }
  };
  
  if (isLoading) return <div>Carregando relacionamentos...</div>;

  return (
    <div style={containerStyle}>
      <h3>Gerenciar Relacionamentos entre Espécies</h3>
      <form onSubmit={handleSubmit} style={formStyle}>
        <select name="species_a_id" value={formData.species_a_id} onChange={handleInputChange} style={selectStyle}>
          {species.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select name="relationship_type" value={formData.relationship_type} onChange={handleInputChange} style={selectStyle}>
          <option value="FRIEND">Amigo de</option><option value="ENEMY">Inimigo de</option><option value="INDIFFERENT">Indiferente a</option>
        </select>
        <select name="species_b_id" value={formData.species_b_id} onChange={handleInputChange} style={selectStyle}>
          {species.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <button type="submit" style={buttonStyle}>Adicionar Regra</button>
      </form>
      
      {error && <div style={errorStyle}>Erro: {error}</div>}

      <ul style={listStyle}>
        {relationships.map(rel => (
          <li key={rel.id} style={listItemStyle}>
            <span>{getSpeciesName(rel.species_a_id)}</span>
            <span style={{ ...relationStyle, color: rel.relationship_type === 'FRIEND' ? 'green' : (rel.relationship_type === 'ENEMY' ? 'red' : 'gray') }}>
              {rel.relationship_type}
            </span>
            <span>{getSpeciesName(rel.species_b_id)}</span>
            {/* --- BOTÃO DE DELETAR FUNCIONAL --- */}
            <button 
              onClick={() => handleDelete(rel.id)}
              style={{...buttonStyle, ...deleteButtonStyle, marginLeft: 'auto' }}
            >
              Deletar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RelationshipManager;