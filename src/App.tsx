import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';  
import AdminApp from './components/Reservation';
import { useSession } from '@clerk/clerk-react';

function App() {
  const { session } = useSession();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="mt-[70px] bg-gray-100" style={{
          // 70px es la altura del header
          minHeight: 'calc(100vh - 70px)'
          }}>
          <Routes>
            {session?.user && session?.publicUserData?.identifier === adminEmail ? (
              <Route path="/" element={<AdminApp />} />
            ) : (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/pago" element={<div>Página de Pago</div>} />
                <Route path="/admin" element={<AdminApp />} />
                <Route path="*" element={<div>404 - Página no encontrada</div>} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
