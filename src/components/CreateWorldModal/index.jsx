import { useState, useEffect } from 'react';
import api from '../../services/api';

import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  StyledInput,
  SectionTitle,
  CheckboxGrid,
  CheckboxLabel,
  StyledCheckbox,
  NumberInputWrapper,
  ButtonGroup,
  ActionButton,
  ErrorMessage
} from './styles';

const placeholderSpecies = [
    { id: 1, name: "Anão" },
    { id: 2, name: "Humano" },
    { id: 3, name: "Elfo" },
    { id: 4, name: "Fada" },
    { id: 5, name: "Goblin" },
    { id: 6, name: "Orc" },
    { id: 7, name: "Troll"},
    { id: 8, name: "Zumbi"}
];

const CreateWorldModal = ({ onWorldCreated, onClose }) => {
    const [worldName, setWorldName] = useState('');
    const [selectedSpecies, setSelectedSpecies] = useState([]);
    const [agentCount, setAgentCount] = useState(10);
    const [availableSpecies, setAvailableSpecies] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSpecies = async () => {
            try {
                const response = await api.get('/species');
                console.log("Espécies recebidas da API:", response.data);
                setAvailableSpecies(response.data);
            } catch (err) {
                console.error("Erro ao buscar espécies, usando placeholder.", err);
                setAvailableSpecies(placeholderSpecies);
            }
        };
        fetchSpecies();
    }, []);

    const handleSpeciesChange = (speciesId) => {
        setSelectedSpecies(prev => 
            prev.includes(speciesId) 
                ? prev.filter(id => id !== speciesId) 
                : [...prev, speciesId]
        );
    };
    
    const handleSubmit = async () => {
        if (!worldName.trim() || selectedSpecies.length === 0) {
            setError('Por favor, dê um nome ao mundo e selecione pelo menos uma espécie.');
            return;
        }
        setError('');

        try {
            const newWorldData = {
                name: worldName.trim(),
                species_ids: selectedSpecies,
                initial_agents_per_species: parseInt(agentCount, 10),
            };
            const response = await api.post('/worlds', newWorldData);
            onWorldCreated(response.data);
        } catch (err) {
            console.error("Erro ao criar o mundo:", err);
            setError(err.response?.data?.detail || 'Não foi possível criar o mundo.');
        }
    };

    return (
        <ModalOverlay>
            <ModalContent>
                <ModalTitle>Criar Nova Simulação</ModalTitle>
                
                <StyledInput 
                    type="text" 
                    value={worldName} 
                    onChange={e => setWorldName(e.target.value)} 
                    placeholder="Nome do Mundo" 
                />
                
                <SectionTitle>Selecione as Espécies Iniciais:</SectionTitle>
                <CheckboxGrid>
                   {availableSpecies.map(s => {
                        const speciesId = s.id ?? s._id;

                        return (
                            <CheckboxLabel key={speciesId}>
                                <StyledCheckbox 
                                    checked={selectedSpecies.includes(speciesId)} 
                                    onChange={() => handleSpeciesChange(speciesId)}
                                />
                                {s.name}
                            </CheckboxLabel>
                        );
                    })}
                </CheckboxGrid>
                
                <NumberInputWrapper>
                    <label htmlFor="agentCount">Agentes por Espécie:</label>
                    <StyledInput 
                        id="agentCount"
                        type="number" 
                        value={agentCount} 
                        onChange={e => setAgentCount(e.target.value)} 
                        min="1" 
                        max="50" 
                    />
                </NumberInputWrapper>
                
                <ErrorMessage>{error}</ErrorMessage>

                <ButtonGroup>
                    <ActionButton className="secondary" onClick={onClose}>
                        Cancelar
                    </ActionButton>
                    <ActionButton className="primary" onClick={handleSubmit}>
                        Criar Mundo
                    </ActionButton>
                </ButtonGroup>
            </ModalContent>
        </ModalOverlay>
    );
};

export default CreateWorldModal;