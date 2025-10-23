import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import CreateWorldModal from '../../components/CreateWorldModal';

import {
  PageWrapper, Header, Title, HeaderActions, ActionButton,
  WorldListContainer, WorldList, WorldCard, WorldName,
  WorldInfo, LoadingText, NoWorldsText,
} from './styles';
import { DeleteButton } from './styles';

const WorldSelector = ({ onLogout }) => {
    const [worlds, setWorlds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWorlds = async () => {
            try {
                const response = await api.get('/worlds/');
                console.log("Mundos recebidos da API:", response.data);
                setWorlds(response.data);
                if (response.data.length === 0) {
                    setShowCreateModal(true);
                }
            } catch (error) {
                console.error("Erro ao buscar mundos:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWorlds();
    }, []);

    const handleWorldCreated = (newWorld) => {
        setWorlds(prev => [...prev, newWorld]);
        setShowCreateModal(false);
        navigate(`/simulation/${newWorld.id}`);
    };

    const handleDeleteWorld = async (id, e) => {
        if (e && e.stopPropagation) e.stopPropagation();

        const confirmed = window.confirm('Deseja realmente deletar este mundo? Esta ação é irreversível.');
        if (!confirmed) return;

        try {
            await api.delete(`/worlds/${id}`);
            setWorlds(prev => prev.filter(w => (w.id ?? w._id) !== id));
        } catch (error) {
            console.error('Erro ao deletar mundo:', error);
            alert('Falha ao deletar o mundo. Veja o console para mais detalhes.');
        }
    };

    if (isLoading) {
        return <PageWrapper><LoadingText>Carregando seus mundos...</LoadingText></PageWrapper>;
    }

    return (
        <PageWrapper>
            <Header>
                <Title>SEUS MUNDOS</Title>
                <HeaderActions>
                    <ActionButton onClick={() => setShowCreateModal(true)}>
                        + CRIAR NOVO MUNDO
                    </ActionButton>
                    <ActionButton className="secondary" onClick={onLogout}>
                        SAIR
                    </ActionButton>
                </HeaderActions>
            </Header>

            <WorldListContainer>
                {worlds.length > 0 ? (
                    <WorldList>
                        {worlds.map(world => {
                            const worldId = world.id ?? world._id;

                            return (
                                <WorldCard key={worldId} onClick={() => navigate(`/simulation/${worldId}`)}>
                                    <DeleteButton onClick={(e) => handleDeleteWorld(worldId, e)} title="Deletar mundo">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                          <path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                          <path d="M10 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                          <path d="M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </DeleteButton>

                                    <WorldName>{world.name}</WorldName>
                                    <WorldInfo>Ações (Ticks): {world.current_tick}</WorldInfo>
                                    <WorldInfo>Criado em: {new Date(world.created_at).toLocaleDateString()}</WorldInfo>
                                </WorldCard>
                            );
                        })}
                    </WorldList>
                ) : (
                    !showCreateModal && <NoWorldsText>Você ainda não criou nenhum mundo. Clique em "Criar Novo Mundo" para começar.</NoWorldsText>
                )}
            </WorldListContainer>

            {showCreateModal && (
                <CreateWorldModal 
                    onWorldCreated={handleWorldCreated}
                    onClose={() => setShowCreateModal(false)}
                />
            )}
        </PageWrapper>
    );
};

export default WorldSelector;