import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ClientView from './pages/ClientView';
import KitchenView from './pages/KitchenView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Se alguém for apenas para localhost:5173, reencaminha para o cliente */}
        <Route path="/" element={<Navigate to="/cliente" />} />
        
        {/* A rota do Cliente */}
        <Route path="/cliente" element={<ClientView />} />
        
        {/* A rota da Cozinha */}
        <Route path="/cozinha" element={<KitchenView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;