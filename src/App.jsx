// src/App.js
import React, { useState } from "react";
import SimulationView from "./SimulationView";
import AdminPanel from "./AdminPanel";

const appStyle = {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  width: "100vw",
};

const navStyle = {
  backgroundColor: "#333",
  color: "white",
  padding: "10px 20px",
  display: "flex",
  gap: "20px",
  alignItems: "center",
  justifyContent: "space-between",
};

const buttonStyle = {
  background: "none",
  border: "1px solid white",
  color: "white",
  padding: "5px 10px",
  cursor: "pointer",
};

function App() {
  const [activeView, setActiveView] = useState("simulation"); // 'simulation' ou 'admin'

  return (
    <div style={appStyle}>
      <nav style={navStyle}>
        <h2>Orbis Life Simulator</h2>
        <div style={{display: "flex", gap: "10px"}}>
          <button
            style={buttonStyle}
            onClick={() => setActiveView("simulation")}
          >
            Simulação
          </button>
          <button style={buttonStyle} onClick={() => setActiveView("admin")}>
            Administração
          </button>
        </div>
      </nav>

      {/* Renderização condicional da tela ativa */}
      <div style={{ flexGrow: 1, overflow: "auto" }}>
        {activeView === "simulation" && <SimulationView />}
        {activeView === "admin" && <AdminPanel />}
      </div>
    </div>
  );
}

export default App;
