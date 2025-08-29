import React, { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:8000';

// Estilos
const containerStyle = { padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: 'white' };
const formStyle = { display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' };
const inputStyle = { padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '150px' };
const buttonStyle = { padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' };
const addButtonStyle = { backgroundColor: '#28a745' };
const saveButtonStyle = { backgroundColor: '#007bff' };
const cancelButtonStyle = { backgroundColor: '#6c757d' };
const deleteButtonStyle = { backgroundColor: '#dc3545' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
const thStyle = { border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2', textAlign: 'left' };
const tdStyle = { border: '1px solid #ddd', padding: '8px' };
const errorStyle = { color: 'red', marginTop: '10px' };

function SpeciesManager() {
  const [speciesList, setSpeciesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ESTADO UNIFICADO PARA O FORMULÁRIO. 'id' controla se é modo de edição ou adição.
  const [formData, setFormData] = useState({
    id: null, // Se for null, é um novo registro. Se tiver um número, é uma edição.
    name: '',
    base_health: '',
    base_strength: '',
  });

  const fetchSpecies = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/species/`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setSpeciesList(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchSpecies(); }, [fetchSpecies]);

  // Reseta o formulário para o modo de adição
  const resetForm = () => {
    setFormData({ id: null, name: '', base_health: '', base_strength: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };
  
  const handleEditClick = (species) => {
    // Carrega os dados da espécie no formulário
    setFormData({
      id: species.id,
      name: species.name,
      base_health: species.base_health,
      base_strength: species.base_strength,
    });
    window.scrollTo(0, 0); // Rola a página para o topo para ver o formulário
  };

  const handleDelete = async (speciesId) => {
    if (!window.confirm('Tem certeza?')) return;
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/species/${speciesId}`, { method: 'DELETE' });
      if (!response.ok && response.status !== 204) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      // Se estiver editando a espécie que foi deletada, reseta o formulário
      if (formData.id === speciesId) {
        resetForm();
      }
      await fetchSpecies();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // O único preventDefault necessário!
    setError(null);
    
    // Determina se é uma criação (POST) ou atualização (PUT)
    const isEditing = formData.id !== null;
    const url = isEditing ? `${API_BASE_URL}/api/species/${formData.id}` : `${API_BASE_URL}/api/species/`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          base_health: parseInt(formData.base_health, 10),
          base_strength: parseInt(formData.base_strength, 10),
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      resetForm();
      await fetchSpecies();
    } catch (e) {
      setError(e.message);
    }
  };

  const isEditing = formData.id !== null;

  return (
    <div style={containerStyle}>
      <h3>{isEditing ? `Editando Espécie: ${formData.name}` : 'Adicionar Nova Espécie'}</h3>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input type="text" name="name" placeholder="Nome da Espécie" value={formData.name} onChange={handleInputChange} style={inputStyle} required />
        <input type="number" name="base_health" placeholder="Vida Base" value={formData.base_health} onChange={handleInputChange} style={inputStyle} required />
        <input type="number" name="base_strength" placeholder="Força Base" value={formData.base_strength} onChange={handleInputChange} style={inputStyle} required />
        
        {/* Botões que mudam de acordo com o modo */}
        {isEditing ? (
          <>
            <button type="submit" style={{...buttonStyle, ...saveButtonStyle}}>Salvar Alterações</button>
            <button type="button" onClick={resetForm} style={{...buttonStyle, ...cancelButtonStyle}}>Cancelar Edição</button>
          </>
        ) : (
          <button type="submit" style={{...buttonStyle, ...addButtonStyle}}>Adicionar Espécie</button>
        )}
      </form>

      {error && <div style={errorStyle}>Erro: {error}</div>}
      
      {isLoading ? ( <div>Carregando espécies...</div> ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th><th style={thStyle}>Nome</th><th style={thStyle}>Vida Base</th><th style={thStyle}>Força Base</th><th style={thStyle}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {speciesList.map(species => (
              <tr key={species.id}>
                <td style={tdStyle}>{species.id}</td>
                <td style={tdStyle}>{species.name}</td>
                <td style={tdStyle}>{species.base_health}</td>
                <td style={tdStyle}>{species.base_strength}</td>
                <td style={tdStyle}>
                  <button type="button" onClick={() => handleEditClick(species)} style={buttonStyle}>Editar</button>
                  <button type="button" onClick={() => handleDelete(species.id)} style={{...buttonStyle, ...deleteButtonStyle, marginLeft: '5px'}}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SpeciesManager;