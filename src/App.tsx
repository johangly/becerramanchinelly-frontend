import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import AdminApp from './components/Reservation';
import { useSession } from '@clerk/clerk-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AppointmentInterface } from './types';
import Payment from './pages/Payment';
import { Layout } from './components/Layout';

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
    <div className={`${session?.user && session?.publicUserData?.identifier === adminEmail ? 'no-background' : 'app'}`}>
      <Routes>
        {session?.user && session?.publicUserData?.identifier === adminEmail ? (
          <Route path="/" element={
            <main className="main" style={{
              minHeight: 'calc(100vh - 70px)'
            }}>
              <Layout>
                <AdminApp />
              </Layout>
            </main>
          } />
        ) : (
          <>
              <Route path="/" element={
                <UserLayout>
                  <Home goToNextStep={nextStep} />
                </UserLayout>
              } />
              <Route path="/pago" element={
                <UserLayout>
                  <Payment appointmentData={selectedAppointment} />
                </UserLayout>
              } />
              <Route path="*" element={
                <UserLayout>
                  <div>404 - Página no encontrada</div>
                </UserLayout>
              } />
          </>
        )}
      </Routes>

    </div>
  );
}

export default App;

function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mt-[70px] main" style={{
        minHeight: 'calc(100vh - 70px)'
      }}>
        <section className='min-h-screen text-center flex flex-col justify-center items-center '>
          <div className='mb-24'>
            <h1 className='text-4xl md:text-6xl text-white leading-20'>
              Firma <span className='text-[#bd9554]'>Legal</span> <br />
              Mexicana <br />
            </h1>
            <div className='flex items-center gap-4 mt-8'>
              <div className='border border-white w-20 h-0'></div>
              <p className='font-bold text-white text-white textWithPoppins tracking-[5px]'>+ DE 40 AÑOS DE EXPERIENCIA</p>
              <div className='border border-white w-30 h-0 '></div>
            </div>
          </div>
        </section>
        {children}
      </main>
    </>
  )
}
