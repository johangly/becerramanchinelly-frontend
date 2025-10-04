import useDashboardUser from "@/hooks/useDashboardUser.tsx";
import {Layout} from "@/components/Layout.tsx";
import type {PaymentOfUser} from "@/interfaces/dashboardUserInterfaces.ts";
import { motion } from "motion/react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import {useSettings} from "@/hooks/useSettings.tsx";

export default function DashboardUser() {
    const {appointmentsOfUser,loading,handleCancelAppointment}= useDashboardUser()
    const {allSettings, allMeetingPlatforms}= useSettings();
    return (
        <Layout>

            {
                loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )
            }
            <div>
                <h1 className="text-2xl font-bold mb-4">Mis Citas</h1>
                {(appointmentsOfUser === null || appointmentsOfUser.paymentsOfUser.length === 0) ?  (
                    <p>No tienes citas programadas.</p>
                ):(
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center justify-items-center content-center w-[100%]">
                        {appointmentsOfUser.paymentsOfUser.map((payment:PaymentOfUser) => {
                            const dateWithHour = new Date(payment.Appointment.day).toLocaleDateString() + ' ' + payment.Appointment.start_time;

                            const now = new Date()
                            const diffMs = new Date(dateWithHour).getTime() - new Date(now).getTime();
                            const diffHours = diffMs / (1000 * 60 * 60);

                            return (
                                <motion.div
                                    key={payment.id}
                                    initial={{opacity: 0, scale: 0.95}}
                                    animate={{opacity: 1, scale: 1}}
                                    exit={{opacity: 0, scale: 0.95}}
                                    transition={{duration: 0.3}}
                                    className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 w-[100%] min-h-72"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                                            {payment.client_name.slice(0, 25)}
                                        </h3>
                                        <span
                                            className={`px-3 py-1 text-sm font-medium rounded-full flex justify-center items-center ${payment.status === "pendiente"
                                                ? "bg-yellow-100 text-yellow-600"
                                                : payment.status === "completado"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-red-100 text-red-600"
                                            }`}
                                        >
                                        {
                                            payment.status === "pendiente" ? (
                                                <Clock className="w-4 h-4 inline mr-1"/>
                                            ) : payment.status === "completado" ? (
                                                <CheckCircle className="w-4 h-4 inline mr-1"/>
                                            ) : (
                                                <XCircle className="w-4 h-4 inline mr-1"/>
                                            )
                                        }
                                            {payment.status}
                                    </span>
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                                        <p>
                                            <strong>Monto:</strong> {payment.amount} {payment.currency}
                                        </p>
                                        <p>
                                            <strong>Referencia:</strong> <span
                                            className="text-wrap break-words">{payment.reference}</span>
                                        </p>
                                        <p>
                                            <strong>Fecha pago:</strong>{" "}
                                            {new Date(payment.transactionDate).toLocaleDateString()}
                                        </p>
                                        <p>
                                            <strong>Fecha cita:</strong>{" "}
                                            {new Date(payment.Appointment.day).toLocaleDateString()}
                                        </p>

                                        <p>
                                            <strong>Hora cita:</strong>{" "}
                                            {` ${payment.Appointment.start_time} - ${payment.Appointment.end_time}`}
                                        </p>
                                        <p>
                                            <strong>Plataforma:</strong> {allMeetingPlatforms?.MeetingPlatforms.find(mp => mp.id === payment.Appointment.meetingPlatformId)?.name || 'No especificada'}
                                        </p>
                                        {payment.Appointment.meeting_link && (
                                            <p className="break-words">
                                                <strong>Link de la reunión:</strong>{" "}
                                                <a href={payment.Appointment.meeting_link} target="_blank"
                                                   className="text-blue-500 hover:underline break-words">
                                                    {payment.Appointment.meeting_link}
                                                </a>
                                            </p>
                                        )}

                                    </div>
                                    {
                                        payment.status === 'reembolso' || payment.status === 'reembolsado' || payment.status === 'fallido' ? (
                                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                Contacta a Soporte para más información. <br/>
                                                <strong>Numero de contacto Whatsapp: {allSettings?.configs.find(set => set.key==='phone')?.value}
</strong>
                                            </p>
                                        ) : null
                                    }
                                    { (diffHours > 8) &&
                                        <motion.button
                                            initial={{opacity: 0, scale: 0.95}}
                                            animate={{opacity: 1, scale: 1}}
                                            exit={{opacity: 0, scale: 0.95}}
                                            transition={{duration: 0.2}}
                                            whileHover={{scale: 1.05}}
                                            whileTap={{scale: 0.95}}
                                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300 w-full"
                                            onClick={() => handleCancelAppointment(payment.id)}
                                        >
                                            Cancelar Cita
                                        </motion.button>
                                    }
                                </motion.div>)
                        })}
                    </div>
                )
                }
            </div>
        </Layout>
        )
}
