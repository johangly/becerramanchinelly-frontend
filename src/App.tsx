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
import ExternalPayment from "./components/ExternalPayment";
import ManagementOfManualPayment from './components/ManagementOfManualPayment';
import SelectMethodOfPayment from "@/components/SelectMethodOfPayment.tsx";
import StripePayment from "@/components/StripePayment.tsx";
import Success from "@/components/StripeSucces.tsx";
import StripeCancel from "@/components/StripeCancel.tsx";

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
		<div>
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
							<>
                            <Route
								path="/payment/pago-externo"
								element={
									<UserLayout isHomePage={isHomePage}>
										<ExternalPayment selectedAppointment={selectedAppointment} />
									</UserLayout>
								}
							/><Route
								path="/payment/stripe"
								element={
									<UserLayout isHomePage={isHomePage}>
										<StripePayment selectedAppointment={selectedAppointment} />
									</UserLayout>
								}
							/>
                                <Route
                                    path="/success"
                                    element={
                                        <UserLayout isHomePage={isHomePage}>
                                            <Success/>
                                        </UserLayout>
                                    }
                                />
                                <Route
                                    path="/canceled"
                                    element={
                                    <UserLayout isHomePage={isHomePage}>
                                        <StripeCancel/>
                                    </UserLayout>
                                    }
                                />
                            </>

						)}
						<Route path="/" element={
							<UserLayout isHomePage={isHomePage}>
								<Home goToNextStep={nextStep} />
							</UserLayout>
						} />
						<Route path="/pago" element={
							<UserLayout isHomePage={isHomePage}>
								<SelectMethodOfPayment session={session} selectedAppointment={selectedAppointment}/>
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
			<Header isHomePage={isHomePage} />
			<main className={`userlayout main ${isHomePage ? "" : "no-background"
				}`}>
				{isHomePage && (
					<section className="min-h-[821.84px] mt-[2px] text-center flex flex-col space-y-5 justify-center items-center">
							<h1 className="text-[74px] font-[300] leading-[88.8px] text-white h-[177.89px]">
								Firma{" "}
								<span className="text-[#bd9554]">
									Legal
								</span>{" "}
								<br />
								Mexicana <br />
							</h1>
							<div className="flex items-center mt-[2px] mb-[3.75px] mx-[3.75px]">
								<div className="bg-white mr-[12px] h-[1px] w-[52.5px]"></div>
								<p className="font-[600] text-[15px] text-white textWithPoppins tracking-[2px]">
									+ DE 40 AÑOS DE EXPERIENCIA
								</p>
								<div className="bg-white ml-[12px] h-[1px] w-[52.5px]"></div>
							</div>
					</section>
				)}
				{children}
			</main>
		</>
	)
}
