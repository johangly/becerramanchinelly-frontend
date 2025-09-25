import useManualPayment from "@/hooks/useManualPayment";
import { motion } from "motion/react";
import Modal from "./Modal";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import ModalOfManualPaymentToSeeDetails from "@/components/ModalOfManualPaymentToSeeDetails.tsx";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const buttonsActionsOfVerifyPayment = [
    {
        label: "Rechazar",
        value: "fallido",
        style: "bg-red-500",
        icon: <XCircle className='w-4 h-4 inline mr-1' />
    },
    {
        label: "Aceptar",
        value: "completado",
        style: "bg-green-500",
        icon: <CheckCircle className="w-4 h-4 inline mr-1" />
    }
    ,
    {
        label: "Pendiente",
        value: "pendiente",
        style: "bg-yellow-500",
        icon: <Clock className="w-4 h-4 inline mr-1" />
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
        <div className="container mx-auto px-4 py-6 ">
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="max-w-7xl w-full mx-auto rounded-lg flex flex-col items-center"
            >
                {showModal && (
                    <ModalOfManualPaymentToSeeDetails setShowModal={setShowModal} infoOfManualPaymentById={infoOfManualPaymentById} setShowImageModal={setShowImageModal} setNewStatusOfManualPayment={setNewStatusOfManualPayment} buttonsActionsOfVerifyPayment={buttonsActionsOfVerifyPayment}
                    />
                )}
                {showImageModal && (
                    <Modal setShowModal={setShowImageModal} title="Comprobante de Pago">
                        <motion.div
                            className="bg-white max-w-200 max-h-130 rounded-lg p-6 w-auto relative flex flex-col items-center cursor-zoom-in"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
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
                <div className="max-md:flex-col max-md:items-start mb-6 flex items-center justify-between w-full">
                    <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                        Gestión de Pagos Externos
                    </h2>
                    <div>
                        <div className="flex gap-4">
                            <Label htmlFor="status-select" className="px-1 flex-1 gap-3 flex flex-col justify-center items-start">
                                Filtros
                                <Select defaultValue={filter} onValueChange={(value) => setFilter(value)}>
                                    <SelectTrigger id="status-select" className="w-full min-w-[180px]">
                                        <SelectValue placeholder="Seleccionar estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Estado</SelectLabel>
                                            <SelectItem value="all">Todos</SelectItem>
                                            <SelectItem value="pendiente">Pendiente</SelectItem>
                                            <SelectItem value="completado">Aprobado</SelectItem>
                                            <SelectItem value="fallido">Rechazado</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Label>
                        </div>
                    </div>
                </div>
                {dataFiltered && dataFiltered.data.length > 0 ? (
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center justify-items-center content-center w-[100%]">
                        {dataFiltered.data.map((payment) => (
                            <motion.div
                                key={payment.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 w-[100%]"
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
                                                <Clock className="w-4 h-4 inline mr-1" />
                                            ) : payment.status === "completado" ? (
                                                <CheckCircle className="w-4 h-4 inline mr-1" />
                                            ) : (
                                                <XCircle className="w-4 h-4 inline mr-1" />
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
                                        <strong>Referencia:</strong> {payment.reference}
                                    </p>
                                    <p>
                                        <strong>Fecha:</strong>{" "}
                                        {new Date(payment.transactionDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="mt-4 px-4 py-2 bg-gray-600 dark:bg-gray-600 text-white rounded hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors duration-300 w-full"
                                    onClick={() => {
                                        setIdManualPayment(payment.id);
                                        setShowModal(true);
                                    }}
                                >
                                    Ver Detalles
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
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
