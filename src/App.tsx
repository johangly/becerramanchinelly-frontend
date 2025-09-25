import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import AdminApp from './components/Reservation';
import { useSession } from '@clerk/clerk-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { AppointmentInterface } from './types';
// import Payment from './pages/Payment';
import { Layout } from './components/Layout';
import ManualPayment from "./components/ManualPayment";
import ManagementOfManualPayment from './components/ManagementOfManualPayment';
import SelectMethodOfPayment from "@/components/SelectMethodOfPayment.tsx";

function App() {
	const { session } = useSession();
	const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
	const [selectedAppointment, setSelectedAppointment] = useState<AppointmentInterface | null>(null);
	const navigate = useNavigate();
	const location = useLocation();
	const isHomePage = location.pathname === "/";

    function nextStep(appointmentData: AppointmentInterface) {
		setSelectedAppointment(appointmentData);
		navigate('/pago');
	}

	return (
		<div className={`${isHomePage ? "app" : ""}`}>
			{session?.user && session?.publicUserData?.identifier === adminEmail ? (
				<main className="main" style={{
					minHeight: 'calc(100vh - 70px)'
				}}>
					<Layout>
						<Routes>
							<Route path="/" element={
								<AdminApp />
							} />
							<Route
								path="*"
								element={
									<div className="text-center min-h-screen w-full text-gray-400 text-sm py-2 flex justify-center items-center">
										404 - Página no encontrada
									</div>
								}
							/>
							<Route
								path="/management-of-external-payment"
								element={
									<ManagementOfManualPayment />
								}
							/>
						</Routes>

					</Layout>
				</main>
			) : (
				<Routes>
					<>
						{session?.user && (
							<Route
								path="/payment/pago-externo"
								element={
									<UserLayout isHomePage={isHomePage}>
										<ManualPayment selectedAppointment={selectedAppointment} />
									</UserLayout>
								}
							/>
						)}
						<Route path="/" element={
							<UserLayout isHomePage={isHomePage}>
								<Home goToNextStep={nextStep} />
							</UserLayout>
						} />
						<Route path="/pago" element={
							<UserLayout isHomePage={isHomePage}>
								<SelectMethodOfPayment />
							</UserLayout>
						} />
						<Route path="*" element={
							<UserLayout isHomePage={isHomePage}>
								<div>404 - Página no encontrada</div>
							</UserLayout>
						} />
					</>
				</Routes>
			)}



		</div>
	);
}

export default App;

function UserLayout({ children, isHomePage }: { children: React.ReactNode, isHomePage: boolean }) {
	return (
		<>
			<Header />
			<main className={`main ${isHomePage ? "" : "no-background"
				}`}>
				{isHomePage && (
					<section className="min-h-screen text-center flex flex-col justify-center items-center ">
						<div className="mb-24">
							<h1 className="text-4xl md:text-6xl text-white leading-20">
								Firma{" "}
								<span className="text-[#bd9554]">
									Legal
								</span>{" "}
								<br />
								Mexicana <br />
							</h1>
							<div className="flex items-center gap-4 mt-8">
								<div className="border border-white w-20 h-0"></div>
								<p className="font-bold text-white textWithPoppins tracking-[5px]">
									+ DE 40 AÑOS DE EXPERIENCIA
								</p>
								<div className="border border-white w-30 h-0 "></div>
							</div>
						</div>
					</section>
				)}
				{children}
			</main>
		</>
	)
}
