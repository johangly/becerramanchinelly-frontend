import useManualPayment from "@/hooks/useManualPayment";
import {motion} from "motion/react";
import Modal from "./Modal";
import {CheckCircle, XCircle, Clock} from "lucide-react";
import ModalOfManualPaymentToSeeDetails from "@/components/ModalOfManualPaymentToSeeDetails.tsx";

const buttonsActionsOfVerifyPayment=[
    {
        label:"Aceptar",
        value:"completado",
        style:"bg-green-500",
        icon:<CheckCircle className="w-4 h-4 inline mr-1"/>
    }
    ,
    {
        label:"Rechazar",
        value:"fallido",
        style:"bg-red-500",
        icon:<XCircle className='w-4 h-4 inline mr-1'/>
    }
    ,
    {
        label:"Pendiente",
        value:"pendiente",
        style:"bg-yellow-500",
        icon:<Clock className="w-4 h-4 inline mr-1"/>
    }
]

export default function ManagementOfManualPayment() {
    const {
        setIdManualPayment,
        showModal,
        setShowModal,
        infoOfManualPaymentById,
        isZoomed,
        setIsZoomed,
        showImageModal,
        setShowImageModal,
        dataFiltered,
        setNewStatusOfManualPayment,
        filter,
        setFilter,
    } = useManualPayment();

    return (
        <div className="container mx-auto px-4 py-6 mt-24 h-[100%] min-h-screen">
            <motion.div
                initial={{y: -100, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                className="bg-white h-[100%] min-h-screen rounded-lg flex flex-col items-center overflow-hidden"
            >
                {showModal && (
                    <ModalOfManualPaymentToSeeDetails setShowModal={setShowModal} infoOfManualPaymentById={infoOfManualPaymentById} setShowImageModal={setShowImageModal} setNewStatusOfManualPayment={setNewStatusOfManualPayment} buttonsActionsOfVerifyPayment={buttonsActionsOfVerifyPayment}
                    />
                )}
                {showImageModal && (
                    <Modal setShowModal={setShowImageModal} title="Comprobante de Pago">
                        <motion.div
                            className="bg-white max-w-200 max-h-130 rounded-lg p-6 w-auto relative flex flex-col items-center cursor-zoom-in"
                            initial={{scale: 0.95, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            exit={{scale: 0.95, opacity: 0}}
                            transition={{duration: 0.2}}
                            onClick={e => e.stopPropagation()}
                        >
                            <img
                                src={`${import.meta.env.VITE_BASE_URL_IMAGES}${infoOfManualPaymentById?.imageOfPayment[0].file_path}`}
                                alt="Comprobante de pago grande"
                                className={`rounded transition-transform duration-300 cursor-zoom-in ${isZoomed ? "scale-150 z-10" : "scale-100"}`}
                                onClick={() => setIsZoomed(!isZoomed)}


                            />
                        </motion.div>
                    </Modal>
                )}
                <div className="max-md:flex-col max-md:items-start mb-6 flex items-center justify-around w-[90%]">
                    <h2 className="text-4xl font-bold text-[#bd9554]">
                        Gestión de Pagos Manuales
                    </h2>
                    <div>
                        <p className="text-gray-600 mb-2">
                            Filtros
                        </p>
                        <div className="flex gap-4">
                            <select title="Filtrar por estado"
                                    className="border border-gray-300 rounded px-3 py-2 radius-md focus:outline-none focus:ring-1 focus:ring-[#bd9554] focus:border-transparent"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="">Todos los Estados</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="completado">Aprobado</option>
                                <option value="fallido">Rechazado</option>
                            </select>
                        </div>
                    </div>
                </div>
                {dataFiltered && dataFiltered.data.length > 0 ? (
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center justify-items-center content-center w-[90%]">
                        {dataFiltered.data.map((payment) => (
                            <motion.div
                                key={payment.id}
                                initial={{opacity: 0, scale: 0.95}}
                                animate={{opacity: 1, scale: 1}}
                                exit={{opacity: 0, scale: 0.95}}
                                transition={{duration: 0.3}}
                                className="bg-white shadow-md rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300 w-[90%]"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold text-[#1e1e1e]">
                                        {payment.client_name.slice(0, 25)}
                                    </h3>
                                    <span
                                        className={`px-3 py-1 text-sm font-medium rounded-full ${
                                            payment.status === "pendiente"
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
                                <div className="text-sm text-gray-600 space-y-2">
                                    <p>
                                        <strong>Monto:</strong> {payment.amount} {payment.currency}
                                    </p>
                                    <p>
                                        <strong>Referencia:</strong> {payment.reference}
                                    </p>
                                    <p>
                                        <strong>Fecha:</strong>{" "}
                                        {new Date(payment.transactionDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    className="mt-4 px-4 py-2 bg-[#bd9554] text-white rounded hover:bg-[#a67c3d] transition-colors duration-300 w-full"
                                    onClick={() => {
                                        setIdManualPayment(payment.id);
                                        setShowModal(true);
                                    }}
                                >
                                    Ver Detalles
                                </button>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{opacity: 0, height: 0}}
                        animate={{opacity: 1, height: "auto"}}
                        exit={{opacity: 0, height: 0}}
                        transition={{type: "spring", duration: 0.4, bounce: 0.2}}
                        className="overflow-hidden"
                    >
                        <p className="text-center text-gray-400 text-sm py-2">
                            No hay pagos manuales registrados
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
