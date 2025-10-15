import React, { useState } from "react";
import SimulationView from "./SimulationView";
import AdminPanel from "./AdminPanel";
import Login from "./components/Login";
import Register from "./components/Register";

const appStyle = {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  width: "100vw",
};

function App() {
  const [authScreen, setAuthScreen] = useState('login');
  const [activeView, setActiveView] = useState("simulation");

  const handleLogin = (email, senha) => setAuthScreen('app');
  const handleRegister = (email, senha, senha2) => setAuthScreen('app');

  if (authScreen === 'login') {
    return <Login onLogin={handleLogin} onSwitchToRegister={() => setAuthScreen('register')} />;
  }
  if (authScreen === 'register') {
    return <Register onRegister={handleRegister} onSwitchToLogin={() => setAuthScreen('login')} />;
  }

  return (
    <div style={appStyle}>
      <div className="main-bg">
        <div className="main-header">ORBIS LIFE SIMULATOR</div>
        
        <div className="main-nav">
          <button 
            className={`nav-btn ${activeView === 'simulation' ? 'nav-btn-active' : ''}`}
            onClick={() => setActiveView('simulation')}
          >
            SIMULAÇÃO
          </button>
          <button 
            className={`nav-btn ${activeView === 'admin' ? 'nav-btn-active' : ''}`}
            onClick={() => setActiveView('admin')}
          >
            GERENCIAR
          </button>
        </div>

        <div className="main-line"></div>
        
        <div style={{ flexGrow: 1, overflow: "hidden" }}>
          {activeView === "simulation" && <SimulationView />}
          {activeView === "admin" && <AdminPanel />}
        </div>
      </div>
    </div>
  );
}

export default App;