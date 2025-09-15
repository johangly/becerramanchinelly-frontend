import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import AdminApp from './components/Reservation';
import {useSession} from '@clerk/clerk-react';
import {useState} from 'react';

function App() {
    const {session} = useSession();
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const [step, setStep] = useState(1);

    return (
        <Router>
            <div className="app">
                <Header/>
                <main className="mt-[70px] main" style={{
                    minHeight: 'calc(100vh - 70px)'
                }}>
                    <section className='min-h-screen text-center flex flex-col justify-center items-center '>
                        <div className='mb-24'>
                        <h1 className='text-4xl md:text-6xl text-white leading-20'>
                            Firma <span className='text-[#bd9554]'>Legal</span> <br/>
                            Mexicana <br/>
                        </h1>
                        <div className='flex items-center gap-4 mt-8'>
                            <div className='border border-white w-20 h-0'></div>
                            <p className='font-bold text-white text-white textWithPoppins tracking-[5px]'>+ DE 40 AÑOS DE EXPERIENCIA</p>
                            <div className='border border-white w-30 h-0 '></div>
                        </div>
                        </div>
                    </section>
                    <Routes>
                        {session?.user && session?.publicUserData?.identifier === adminEmail ? (
                            <Route path="/" element={<AdminApp/>}/>
                        ) : (
                            <>
                                <Route path="/" element={<Home/>}/>
                                <Route path="/pago" element={<div>Página de Pago</div>}/>
                                <Route path="*" element={<div>404 - Página no encontrada</div>}/>
                            </>
                        )}
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
