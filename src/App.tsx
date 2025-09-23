import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
} from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import AdminApp from "./components/Reservation";
import { useSession } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AppointmentInterface } from "./types";
import ManualPayment from "./components/ManualPayment";
import ManagementOfManualPayment from './components/ManagementOfManualPayment';

function App() {
	const { session } = useSession();
	const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
	const [step, setStep] = useState(1);
	const [selectedAppointment, setSelectedAppointment] =
		useState<AppointmentInterface | null>(null);
	const navigate = useNavigate();
	const location = useLocation();
	const isHomePage = location.pathname === "/";

	function nextStep(
		appointmentData: AppointmentInterface,
		step: number
	) {
		setSelectedAppointment(appointmentData);
		setStep(step);
		navigate("/pago");
	}

	return (
		<div className={isHomePage ? "app" : ""}>

			<Header />
			<main
				className={`main ${
					isHomePage ? "" : "no-background"
				}`}
			>
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
				<Routes>
					{session?.user &&
					session?.publicUserData?.identifier ===
						adminEmail ? (
						<>
							<Route path="/" element={<AdminApp />} />
							<Route
								path="/manual-payment"
								element={<ManualPayment />}
							/>
							<Route
								path="*"
								element={
									<div className="text-center min-h-screen w-full text-gray-400 text-sm py-2 flex justify-center items-center">
										404 - Página no encontrada
									</div>
								}
							/>
							<Route
								path="/management-of-manual-payment"
								element={<ManagementOfManualPayment />}
							/>
						</>
					) : (
						<>
							<Route
								path="/"
								element={
									<Home goToNextStep={nextStep} />
								}
							/>
							<Route
								path="/pago"
								element={<div>Página de Pago</div>}
							/>
							<Route
								path="*"
								element={
									<div>
										404 - Página no encontrada
									</div>
								}
							/>

						</>
					)}
				</Routes>
			</main>
		</div>
	);
}

export default App;
