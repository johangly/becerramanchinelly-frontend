import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';  
import AdminApp from './components/Reservation';
import { useSession } from '@clerk/clerk-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AppointmentInterface } from './types';

function App() {
  const { session } = useSession();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const [step, setStep] = useState(1);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentInterface | null>(null);
  const navigate = useNavigate();
  
  function nextStep(appointmentData: AppointmentInterface, step: number) {
    setSelectedAppointment(appointmentData);
    setStep(step);
    navigate('/pago');
  }
  return (
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
              <Route path="/" element={<Home goToNextStep={nextStep} />} />
              <Route path="/pago" element={<div>Página de Pago</div>} />
              <Route path="*" element={<div>404 - Página no encontrada</div>} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
}

export default App;
