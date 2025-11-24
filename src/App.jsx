import { Routes, Route, Navigate } from "react-router-dom";
import { GlobalStyle } from "./styles/global.js";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Importe suas páginas
import Login from "./pages/Login";
import Register from "./pages/Register";
import WorldSelector from "./pages/WorldSelector";
import SimulationView from "./pages/SimulationView";
import CreatorMode from "./pages/Storyteller";
import Analysis from "./pages/Analysis";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes = () => {
  const { logout } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <WorldSelector onLogout={logout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/simulation/:worldId"
        element={
          <ProtectedRoute>
            <SimulationView onLogout={logout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/creator/:worldId"
        element={
          <ProtectedRoute>
            <CreatorMode />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analysis/:worldId"
        element={
          <ProtectedRoute>
            <Analysis />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};


function App() {
  return (
    <>
      <GlobalStyle />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </>
  );
}

export default App;