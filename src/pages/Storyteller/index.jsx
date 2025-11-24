import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

import {
  PageWrapper, Header, Title, MainContent,
  SectionLabel, CommandInput, ActionButton, ResponseArea, Suggestions, NavButtonGroup, NavButton
} from './styles';

const CreatorMode = () => {
  const { worldId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [command, setCommand] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const suggestions = [
    "Adicione 10 Orcs como o 'Clã Machado Sangrento' em um novo território chamado 'Pântano Sombrio'.",
    "Faça o Clã Martelo de Ferro e o Reino de Valmor formarem uma aliança.",
    "Inicie um evento de PRAGA que vai durar 300 ticks.",
    "Dê ao Clã dos Elfos a missão 'Expansão da Floresta' para conquistar as Colinas Rochosas.",
    "Faça os Goblins e os Anões entrarem em guerra."
  ];

  const handleSubmit = async () => {
    if (!command.trim()) return;
    setIsLoading(true);
    setResponse('Enviando decreto para os céus...');

    try {
      const apiResponse = await api.post(`/storyteller/${worldId}/decreto`, {
        decreto: command
      });
      setResponse(apiResponse.data.details || apiResponse.data.message);
    } catch (err) {
      console.error("Erro ao enviar decreto:", err);
      const errorMessage = err.response?.data?.detail || "Os deuses não atenderam ao seu chamado.";
      setResponse(`Erro: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    setCommand(suggestion);
  };

  return (
    <PageWrapper>
        <Header>
            <Title>MODO CRIADOR</Title>
            <NavButtonGroup>
              <NavButton onClick={() => { navigate("/")}}>SELECIONAR MUNDO</NavButton>
              <NavButton onClick={() => { navigate(`/simulation/${worldId}`)}}>SIMULAÇÃO</NavButton>
              <NavButton onClick={() => { navigate(`/analysis/${worldId}`)}}>ANÁLISE</NavButton>
              <NavButton onClick={logout}>SAIR</NavButton>
            </NavButtonGroup>
        </Header>
      <MainContent>
        <div>
          <SectionLabel htmlFor="command-input">Seu Decreto Divino</SectionLabel>
          <CommandInput 
            id="command-input"
            value={command}
            onChange={e => setCommand(e.target.value)}
            placeholder="Descreva o que você quer que aconteça no mundo..."
            disabled={isLoading}
          />
        </div>
        
        <ActionButton onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Decretando...' : 'Decretar'}
        </ActionButton>

        <div>
          <SectionLabel>Resposta do Mundo</SectionLabel>
          <ResponseArea>
            {response || 'Aguardando seus comandos...'}
          </ResponseArea>
        </div>
      </MainContent>

      <Suggestions>
          <h3>Sugestões de Decretos</h3>
          <ul>
            {suggestions.map((s, index) => (
                <li key={index} onClick={() => handleSuggestionClick(s)}>
                    {s}
                </li>
            ))}
          </ul>
      </Suggestions>
    </PageWrapper>
  );
};

export default CreatorMode;