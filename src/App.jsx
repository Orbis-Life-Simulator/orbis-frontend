import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { GlobalStyle } from './styles/global';
import Login from './pages/Login';
import Register from './pages/Register';
import WorldSelector from './pages/WorldSelector';
import SimulationView from './pages/SimulationView';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));
  
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/'); 
  };
  
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/" 
          element={isLoggedIn ? <WorldSelector onLogout={handleLogout} /> : <Navigate to="/login" />}
        />

        <Route 
          path="/simulation/:worldId"
          element={isLoggedIn ? <SimulationView onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;