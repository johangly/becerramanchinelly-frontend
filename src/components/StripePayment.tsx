import {motion} from "motion/react";
import type {AppointmentInterface} from "@/types";
import {BadgeDollarSign, Calendar, CheckCircle, Clock, Loader2, XCircle} from "lucide-react";
import type { JSX } from "react";
interface StripePaymentsProps {
    selectedAppointment: AppointmentInterface | null;
}

export default function StripePayment({selectedAppointment}: StripePaymentsProps) {

    const statusMap: Record<string, { icon: JSX.Element; label: string; color: string }> = {
        disponible: { icon: <CheckCircle className="text-green-500 inline" />, label: "Disponible", color: "text-green-600" },
        reservado: { icon: <Loader2 className="text-blue-500 inline" />, label: "Reservado", color: "text-blue-600" },
        completado: { icon: <CheckCircle className="text-emerald-500 inline" />, label: "Completado", color: "text-emerald-600" },
        cancelado: { icon: <XCircle className="text-red-500 inline" />, label: "Cancelado", color: "text-red-600" }
    };
    const status = statusMap[selectedAppointment ? selectedAppointment.status : ""];


    return (
        <div className="container max-md:flex max-md:flex-col flex mx-auto px-4 py-6 gap-4 ">
            <motion.div
                initial={{y: -100, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                exit={{scale: 0.5, opacity: 0}}
                className="bg-white rounded-lg flex flex-col items-center overflow-hidden"
            >
                {selectedAppointment ? (
                        <div className="w-1/4 size-fit shadow-sm rounded-lg p-6 border border-gray-200">
                            <h3 className="text-2xl font-semibold mb-4 text-[#bd9554]">Detalles de la Cita</h3>
                            <ul className="space-y-4 text-[#1e1e1e]">
                                <li>
                                    <Calendar className="inline mr-2 text-[#bd9554]" />
                                    <strong>Fecha:</strong> 
                                    {/* {date} */}
                                </li>
                                <li>
                                    <Clock className="inline mr-2 text-[#bd9554]" />
                                    <strong>Hora:</strong> 
                                    {/* {start} - {end} */}
                                </li>
                                <li>
                                    <BadgeDollarSign className="inline mr-2 text-[#bd9554]" />
                                    <strong>Precio:</strong> ${selectedAppointment.price}
                                </li>
                                <li>
                                    {status.icon}
                                    <strong className={`ml-2 ${status.color}`}>Estado:</strong> {status.label}
                                </li>
                            </ul>
                        </div>
                    ):
                    (
                        <div className="w-1/4 size-fit shadow-sm rounded-lg p-6 border border-gray-200 flex items-center justify-center">
                            <p className="text-gray-400">No hay ninguna cita seleccionada</p>
                        </div>
                    )}
                <h2 className="text-4xl font-bold mb-4 text-[#bd9554]">
                    Formulario de Pago con Stripe
                </h2>
            </motion.div>
        </div>
    )
}
