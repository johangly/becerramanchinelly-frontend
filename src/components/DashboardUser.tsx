import useDashboardUser from "@/hooks/useDashboardUser.tsx";
import {Layout} from "@/components/Layout.tsx";
import type {PaymentOfUser} from "@/interfaces/dashboardUserInterfaces.ts";
import {motion} from "motion/react";
import {CheckCircle, XCircle, Clock} from "lucide-react";
import {useSettings} from "@/hooks/useSettings.tsx";
import Modal from "@/components/Modal.tsx";

export default function DashboardUser() {
    const {
        appointmentsOfUser,
        loading,
        handleCancelAppointment,
        showModal,
        setShowModal,
        handleChangePlatform,
        setIdAppointment
    } = useDashboardUser()
    const {allSettings, allMeetingPlatforms} = useSettings();
    return (
        <Layout>

            {
                loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )
            }
            {
                showModal && (
                    <Modal setShowModal={setShowModal} title={'Cambia la plataforma de Reunión'}>
                        <div className="w-full">
                            {
                                !allMeetingPlatforms?.MeetingPlatforms ? (
                                    <p>Cargando plataformas...</p>
                                ) : allMeetingPlatforms?.MeetingPlatforms?.length === 0 ? (
                                        <p>No hay plataformas de reunión disponibles.</p>
                                    ) :
                                    allMeetingPlatforms.MeetingPlatforms.length > 0 ? (
                                        <div className="space-y-4">
                                            {allMeetingPlatforms.MeetingPlatforms.filter(plat => plat.is_active === true).map((platform) => (
                                                <button key={platform.id}
                                                        className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                                                        value={platform.id}
                                                        onClick={() => handleChangePlatform(platform.id)}>
                                                    <h3 className="text-lg font-semibold mb-2">{platform.name}</h3>
                                                    <p className="text-sm text-gray-600 mb-4">{platform.description}</p>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No hay plataformas de reunión disponibles.</p>
                                    )
                            }
                        </div>
                    </Modal>
                )
            }
            <div>
                <h1 className="text-2xl font-bold mb-4">Mis Citas</h1>
                {(appointmentsOfUser === null || appointmentsOfUser.paymentsOfUser.length === 0) ? (
                    <p>No tienes citas programadas.</p>
                ) : (
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center justify-items-center content-center w-[100%]">
                            {appointmentsOfUser.paymentsOfUser.map((payment: PaymentOfUser) => {
                            // Crear fecha de la cita en la zona horaria local
                            const appointmentDate = new Date(payment.Appointment.day);
                            const [hours, minutes, seconds] = payment.Appointment.start_time.split(':').map(Number);
                            appointmentDate.setHours(hours, minutes, seconds);
                            
                            // Obtener la fecha actual en la misma zona horaria
                            const now = new Date();
                            
                            // Calcular la diferencia en milisegundos
                            const diffMs = appointmentDate.getTime() - now.getTime();
                            const diffHours = diffMs / (1000 * 60 * 60);
                            
                            // Verificar si faltan más de 8 horas para la cita
                            const isMoreThan8Hours = diffHours > 8;

                            return (
                                <motion.div
                                    key={payment.id}
                                    initial={{opacity: 0, scale: 0.95}}
                                    animate={{opacity: 1, scale: 1}}
                                    exit={{opacity: 0, scale: 0.95}}
                                    transition={{duration: 0.3}}
                                    className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 w-[100%] min-h-[400px]"
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
                                                <strong>Numero de contacto
                                                    Whatsapp: {allSettings?.configs.find(set => set.key === 'phone')?.value}
                                                </strong>
                                            </p>
                                        ) : null
                                    }
                                    {isMoreThan8Hours &&
                                        <>
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

                                            <motion.button
                                                initial={{opacity: 0, scale: 0.95}}
                                                animate={{opacity: 1, scale: 1}}
                                                exit={{opacity: 0, scale: 0.95}}
                                                transition={{duration: 0.2}}
                                                whileHover={{scale: 1.05}}
                                                whileTap={{scale: 0.95}}
                                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300 w-full"
                                                onClick={() => (setShowModal(true),
                                                    setIdAppointment(payment.Appointment.id))
                                                }
                                            >
                                                Editar Plataforma
                                            </motion.button>

                                        </>
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
