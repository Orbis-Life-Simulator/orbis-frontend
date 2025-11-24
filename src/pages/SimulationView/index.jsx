import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Stage, Layer, Rect, Text, Star, Image } from "react-konva";
import { useImageLoader } from "../../hooks/useImageLoader";

import {
  PageWrapper,
  Header,
  Title,
  NavButtonGroup,
  NavButton,
  SubHeader,
  InfoBox,
  StartButton,
  MainContent,
  SimulationContainer,
  Sidebar,
  SidebarTitle,
  EventLogContainer,
} from "./styles";

import Character from "../../components/Character";
import EventLogPanel from "../../components/EventLogPanel";
import api from "../../services/api";

// --- 1. Importar todos os SVGs ---
import anaoM from "../../assets/imgs/anaoM.svg";
import anaoF from "../../assets/imgs/anaoF.svg";
import elfoM from "../../assets/imgs/elfoM.svg";
import elfoF from "../../assets/imgs/elfoF.svg";
import fadaM from "../../assets/imgs/fadaM.svg";
import fadaF from "../../assets/imgs/fadaF.svg";
import goblinM from "../../assets/imgs/goblinM.svg";
import goblinF from "../../assets/imgs/goblinF.svg";
import humanoM from "../../assets/imgs/humanoM.svg";
import humanoF from "../../assets/imgs/humanoF.svg";
import orcM from "../../assets/imgs/orcM.svg";
import orcF from "../../assets/imgs/orcF.svg";
import trollM from "../../assets/imgs/trollM.svg";
import trollF from "../../assets/imgs/trollF.svg";
import zumbiM from "../../assets/imgs/zumbiM.svg";
import zumbiF from "../../assets/imgs/zumbiF.svg";
import baga from "../../assets/imgs/baga.svg";
import ferro from "../../assets/imgs/ferro.svg";
import madeira from "../../assets/imgs/madeira.svg";
import pedra from "../../assets/imgs/pedra.svg";
import peixe from "../../assets/imgs/peixe.svg";

const imageMap = {
  anaoM: anaoM,
  anaoF: anaoF,
  elfoM: elfoM,
  elfoF: elfoF,
  fadaM: fadaM,
  fadaF: fadaF,
  goblinM: goblinM,
  goblinF: goblinF,
  humanoM: humanoM,
  humanoF: humanoF,
  orcM: orcM,
  orcF: orcF,
  trollM: trollM,
  trollF: trollF,
  zumbiM: zumbiM,
  zumbiF: zumbiF,
  baga: baga,
  ferro: ferro,
  madeira: madeira,
  pedra: pedra,
  peixe: peixe,
};

const resourceTypeIdMap = {
  2: "baga",
  3: "ferro",
  4: "madeira",
  5: "pedra",
  1: "peixe",
};

const TICK_INTERVAL = 1000;
const WEBSOCKET_URL = "ws://localhost:8000";

const clanColorMap = {
  1: "#3498db",
  2: "#2c3e50",
  3: "#2ecc71",
  4: "#f1c40f",
  5: "#c0392b",
  6: "#7f8c8d",
};

const SimulationView = ({ onLogout }) => {
  const { worldId } = useParams();
  const navigate = useNavigate();

  const [isPlaying, setIsPlaying] = useState(false);
  const [worldData, setWorldData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Conectando...");

  const tickIntervalRef = useRef(null);
  const containerRef = useRef(null);
  const wsRef = useRef(null);
  const tickAbortControllerRef = useRef(null);
  //   const shouldReconnectRef = useRef(true);
  const connectingRef = useRef(false);
  const [dimensions, setDimensions] = useState({ width: 1, height: 1 });

  const { images: loadedImages, isLoading: imagesLoading } = useImageLoader(
    Object.values(imageMap)
  );

  const getImageForEntity = (entity, type) => {
    let key;
    if (type === "character") {
      const species = (entity.species?.name || "")
        .toLowerCase()
        .replace("ã", "a");
      const gender = entity.gender === "feminino" ? "F" : "M";
      key = `${species}${gender}`;
    } else if (type === "resource") {
      key = resourceTypeIdMap[entity.resource_type_id];
    }

    const imageUrl = imageMap[key];
    return loadedImages[imageUrl];
  };

  //   const closeWebSocket = () => {
  //     shouldReconnectRef.current = false;
  //     if (wsRef.current) {
  //       wsRef.current.onopen = null;
  //       wsRef.current.onmessage = null;
  //       wsRef.current.onerror = null;
  //       wsRef.current.onclose = null;
  //       try {
  //         wsRef.current.close();
  //       } catch (e) {
  //         console.error("Erro ao fechar WS:", e);
  //       }
  //       wsRef.current = null;
  //     }
  //     setConnectionStatus("Desconectado");
  //     setIsPlaying(false);
  //   };

  // Normaliza diferentes formatos de resposta do backend para um formato consistente
  //   const normalizeWorldData = (data) => {
  //     if (!data)
  //       return { world: {}, characters: [], territories: [], resource_nodes: [] };

  //     const characters = data.characters ?? data.chars ?? data.entities ?? [];
  //     const territories = data.territories ?? data.territory ?? [];
  //     const resource_nodes =
  //       data.resource_nodes ?? data.resourceNodes ?? data.nodes ?? [];

  //     const world = data.world ?? {
  //       name: data.name,
  //       map_width: data.map_width ?? data.mapWidth,
  //       map_height: data.map_height ?? data.mapHeight,
  //       current_tick:
  //         data.current_tick ?? data.currentTick ?? data.world?.current_tick ?? 0,
  //       _id: data._id ?? data.id,
  //       created_at: data.created_at ?? data.createdAt,
  //     };

  //     return { ...data, world, characters, territories, resource_nodes };
  //   };

  useLayoutEffect(() => {
    let ro = null;
    const update = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      setDimensions((prev) =>
        prev.width !== w || prev.height !== h ? { width: w, height: h } : prev
      );
    };
    const tryAttach = () => {
      if (containerRef.current) {
        update();
        ro = new ResizeObserver(() => window.requestAnimationFrame(update));
        ro.observe(containerRef.current);
      } else {
        setDimensions((prev) =>
          prev.width > 1 && prev.height > 1 ? prev : { width: 800, height: 600 }
        );
        window.requestAnimationFrame(tryAttach);
      }
    };
    tryAttach();
    return () => {
      try {
        ro && ro.disconnect();
      } catch (e) {
        console.error("Error disconnecting ResizeObserver:", e);
      }
    };
  }, []);

  const handleTick = async () => {
    // Cancela qualquer tick anterior que ainda não tenha sido resolvido
    if (tickAbortControllerRef.current) {
      tickAbortControllerRef.current.abort();
    }

    // Cria um novo controller para a requisição atual
    const controller = new AbortController();
    tickAbortControllerRef.current = controller;

    try {
      // Passe o 'signal' para a chamada do axios
      await api.post(
        `/worlds/${worldId}/tick`,
        {},
        { signal: controller.signal }
      );
    } catch (error) {
      // Se o erro for por aborto (causado pela limpeza), não é um erro real.
      if (error.name === "CanceledError") {
        console.log("Tick request foi abortada intencionalmente.");
        return;
      }
      console.error(`Erro ao enviar tick para o mundo ${worldId}:`, error);
      pauseSimulation(); // Pausa a simulação se ocorrer um erro real
    }
  };

  useEffect(() => {
    if (!worldId) return;

    let isMounted = true;
    connectingRef.current = false;

    const connectToWorld = async () => {
      if (!isMounted || connectingRef.current) return;
      connectingRef.current = true;

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get(`/worlds/${worldId}/state`);
        if (isMounted) setWorldData(response.data);
      } catch (error) {
        console.error("Falha ao buscar estado inicial:", error);
        if (isMounted) setConnectionStatus("Erro ao carregar mundo");
        connectingRef.current = false;
        return;
      }

      if (wsRef.current) wsRef.current.close();

      const ws = new WebSocket(
        `${WEBSOCKET_URL}/ws/${worldId}?token=${encodeURIComponent(
          accessToken
        )}`
      );
      wsRef.current = ws;

      ws.onopen = () => {
        if (isMounted) setConnectionStatus("Conectado");
        connectingRef.current = false;
      };
      ws.onmessage = (event) => {
        if (isMounted)
          try {
            setWorldData(JSON.parse(event.data));
          } catch (e) {
            console.error("Erro ao parsear WS:", e);
          }
      };
      ws.onerror = () => {
        if (isMounted) setConnectionStatus("Erro no WebSocket");
        connectingRef.current = false;
      };
      ws.onclose = () => {
        if (isMounted) setConnectionStatus("Desconectado");
      };
    };

    connectToWorld();

    return () => {
      console.log("Componente desmonstando. Iniciando limpeza...");
      isMounted = false; // Impede que callbacks antigos atualizem o estado

      // 1. Limpa o intervalo do tick para parar de enviar novas requisições
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
        console.log("Intervalo de tick limpo.");
      }

      // 2. Aborta qualquer requisição de tick que ainda esteja em andamento
      if (tickAbortControllerRef.current) {
        tickAbortControllerRef.current.abort();
        console.log("Requisição de tick em andamento abortada.");
      }

      // 3. Desliga o WebSocket de forma segura
      if (wsRef.current) {
        console.log("Fechando WebSocket...");
        // Remove todos os listeners para evitar atualizações de estado em componente desmontado
        wsRef.current.onopen = null;
        wsRef.current.onmessage = null;
        wsRef.current.onerror = null;
        wsRef.current.onclose = null;

        // Apenas chame close se a conexão não estiver já fechando ou fechada
        if (wsRef.current.readyState === WebSocket.OPEN) {
          try {
            wsRef.current.close();
          } catch (e) {
            console.error("Erro ao tentar fechar o WebSocket:", e);
          }
        }
        wsRef.current = null;
        console.log("Limpeza do WebSocket concluída.");
      }
    };
  }, [worldId, navigate]);

  const startSimulation = () => {
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    setIsPlaying(true);
    handleTick();
    tickIntervalRef.current = setInterval(handleTick, TICK_INTERVAL);
  };

  const pauseSimulation = () => {
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
    }
    if (tickAbortControllerRef.current) {
      tickAbortControllerRef.current.abort();
    }
    setIsPlaying(false);
    tickIntervalRef.current = null;
  };

  const navigateAndClose = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    onLogout();
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "Conectado":
        return "#2ECC71";
      case "Conectando...":
        return "#F1C40F";
      default:
        return "#C0392B";
    }
  };

  if (!worldData || imagesLoading) {
    return (
      <PageWrapper>
        <Header>
          <Title>ORBIS LIFE SIMULATOR</Title>
        </Header>
        <div
          style={{
            color: "white",
            fontSize: "20px",
            textAlign: "center",
            marginTop: "50px",
          }}
        >
          {imagesLoading
            ? "Carregando recursos visuais..."
            : "Carregando dados do mundo..."}
        </div>
      </PageWrapper>
    );
  }

  const mapWidth =
    worldData?.world?.map_width ??
    worldData?.map_width ??
    worldData?.mapWidth ??
    1000;
  const mapHeight =
    worldData?.world?.map_height ??
    worldData?.map_height ??
    worldData?.mapHeight ??
    1000;
  const scale = {
    x: dimensions.width / Math.max(1, mapWidth),
    y: dimensions.height / Math.max(1, mapHeight),
  };

  // console.log("Renderizando personagens:", worldData);

  return (
    <PageWrapper>
      <Header>
        <Title>ORBIS LIFE SIMULATOR</Title>
        <NavButtonGroup>
          <NavButton onClick={() => navigateAndClose("/")}>
            SELECIONAR MUNDO
          </NavButton>
          <NavButton onClick={() => navigateAndClose(`/creator/${worldId}`)}>
            STORYTELLER
          </NavButton>
          <NavButton onClick={() => navigateAndClose(`/analysis/${worldId}`)}>
            ANÁLISE
          </NavButton>
          <NavButton onClick={handleLogout}>SAIR</NavButton>
        </NavButtonGroup>
      </Header>

      <SubHeader>
        <StartButton
          onClick={isPlaying ? pauseSimulation : startSimulation}
          disabled={connectionStatus !== "Conectado"}
          className={isPlaying ? "paused" : ""}
        >
          {isPlaying ? "PAUSAR" : "INICIAR"}
        </StartButton>
        <InfoBox
          style={{
            backgroundColor: "transparent",
            color: getStatusColor(),
            border: `1px solid ${getStatusColor()}`,
          }}
        >
          Status: {connectionStatus}
        </InfoBox>
        <InfoBox>AÇÕES: {worldData.world.current_tick || 0}</InfoBox>
        <InfoBox>PERSONAGENS: {worldData.characters.length || 0}</InfoBox>
      </SubHeader>

      <MainContent>
        <SimulationContainer
          ref={containerRef}
          style={{ filter: isPlaying ? "none" : "grayscale(1)" }}
        >
          <Stage width={dimensions.width} height={dimensions.height}>
            <Layer>
              {worldData.territories?.map((terr) => {
                const sx = (terr.start_x ?? 0) * scale.x;
                const sy = (terr.start_y ?? 0) * scale.y;
                const sw = (terr.end_x - terr.start_x) * scale.x;
                const sh = (terr.end_y - terr.start_y) * scale.y;
                return (
                  <React.Fragment key={`terr-group-${terr._id}`}>
                    <Rect
                      x={sx}
                      y={sy}
                      width={sw}
                      height={sh}
                      fill={
                        clanColorMap[terr.owner_clan_id] ||
                        "rgba(128, 128, 128, 0.2)"
                      }
                      stroke={"rgba(255, 255, 255, 0.12)"}
                      strokeWidth={1}
                    />
                    <Text
                      text={terr.name}
                      x={sx + 6}
                      y={sy + 6}
                      fontSize={12}
                      fill="rgba(255, 255, 255, 0.8)"
                    />
                  </React.Fragment>
                );
              })}
              {worldData.resource_nodes?.map((node) => {
                if (node.is_depleted) return null;
                const resourceImage = getImageForEntity(node, "resource");
                if (!resourceImage) return null;
                const scaledX = node.position.x * scale.x;
                const scaledY = node.position.y * scale.y;
                const RESOURCE_SIZE = 18;
                return (
                  <Image
                    key={`node-${node._id}`}
                    image={resourceImage}
                    x={scaledX - RESOURCE_SIZE / 2}
                    y={scaledY - RESOURCE_SIZE / 2}
                    width={RESOURCE_SIZE}
                    height={RESOURCE_SIZE}
                  />
                );
              })}
            </Layer>
            <Layer>
              {worldData.characters?.map((char) => (
                <Character
                  key={char._id}
                  charData={char}
                  scale={scale}
                  characterImage={getImageForEntity(char, "character")}
                />
              ))}
            </Layer>
          </Stage>
        </SimulationContainer>
        <Sidebar>
          <SidebarTitle>Histórico De Eventos</SidebarTitle>
          <EventLogContainer>
            <EventLogPanel worldId={worldId} isPlaying={isPlaying} />
          </EventLogContainer>
        </Sidebar>
      </MainContent>
    </PageWrapper>
  );
};

export default SimulationView;
