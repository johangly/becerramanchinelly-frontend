import React from 'react'
import {Calendar, CheckCircle, Clock, DollarSign, Hash, Mail, Phone, User, XCircle} from "lucide-react";
import Modal from "@/components/Modal.tsx";
import type {ManualPaymentByIdInterface} from "@/interfaces/manualPaymentInterfaces.ts";

interface ModalOfManualPaymentToSeeDetailsProps {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    infoOfManualPaymentById: ManualPaymentByIdInterface | null;
    setShowImageModal: React.Dispatch<React.SetStateAction<boolean>>;
    setNewStatusOfManualPayment: (status: string) => void;
    buttonsActionsOfVerifyPayment: {
        label: string;
        value: string;
        style: string;
        icon: React.ReactNode;
    }[];
}

export default function ModalOfManualPaymentToSeeDetails({
                                                             setShowModal,
                                                             infoOfManualPaymentById,
                                                             setNewStatusOfManualPayment,
                                                             setShowImageModal,
                                                             buttonsActionsOfVerifyPayment
                                                         }: ModalOfManualPaymentToSeeDetailsProps) {
    return (
        <Modal setShowModal={setShowModal} title="Detalles del Pago">
            {infoOfManualPaymentById ? (
                <div className="space-y-3 w-150 h-110 overflow-y-scroll">
                    <h3 className="text-2xl font-bold text-[#1e1e1e]">
                        Información del Pago
                    </h3>
                    <span
                        className={`px-4 flex items-center py-1 w-24 text-sm mb-4 font-medium rounded-full ${
                            infoOfManualPaymentById.paymentAppointment.status === "pendiente"
                                ? "bg-yellow-100 text-yellow-600"
                                : infoOfManualPaymentById.paymentAppointment.status === "completado"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-red-100 text-red-600"
                        }`}
                    >
										{
                                            infoOfManualPaymentById.paymentAppointment.status === "pendiente" ? (
                                                <Clock className="w-4 h-4 inline mr-1"/>
                                            ) : infoOfManualPaymentById.paymentAppointment.status === "completado" ? (
                                                <CheckCircle className="w-4 h-4 inline mr-1"/>
                                            ) : (
                                                <XCircle className="w-4 h-4 inline mr-1"/>
                                            )
                                        }
                        {infoOfManualPaymentById.paymentAppointment.status}
									</span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <p className="text-sm text-gray-700 flex items-center gap-2">
                                <User className="w-4 h-4 text-[#bd9554]"/>
                                <strong>Nombre del Cliente:</strong> {" "}
                            </p>
                            <span className="text-gray-900">
												{infoOfManualPaymentById.paymentAppointment.client_name}
											</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-700 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-[#bd9554]"/>
                                <strong>Email del Cliente:</strong> {" "}
                            </p>
                            <span className="text-gray-900">
												{infoOfManualPaymentById.paymentAppointment.client_email}
											</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-700 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-[#bd9554]"/>
                                <strong>Teléfono del Cliente:</strong> {" "}
                            </p>
                            <span className="text-gray-900">
												{infoOfManualPaymentById.paymentAppointment.client_phone}
											</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-700 flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-[#bd9554]"/>
                                <strong>Monto:</strong> {" "}
                            </p>
                            <span className="text-gray-900">
												{infoOfManualPaymentById.paymentAppointment.amount} {infoOfManualPaymentById.paymentAppointment.currency}
											</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-700 flex items-center gap-2">
                                <Hash className="w-4 h-4 text-[#bd9554]"/>
                                <strong>Referencia:</strong> {" "}
                            </p>
                            <span className="text-gray-900">
												{infoOfManualPaymentById.paymentAppointment.reference}
											</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-700 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#bd9554]"/>
                                <strong>Fecha de la Transacción:</strong> {" "}
                            </p>
                            <span className="text-gray-900">
												{new Date(
                                                    infoOfManualPaymentById.paymentAppointment.transactionDate
                                                ).toLocaleDateString()}
											</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-700 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#bd9554]"/>
                                <strong>Notas</strong> {" "}
                            </p>
                            <span className="text-gray-900">
												{
                                                    infoOfManualPaymentById.paymentAppointment.notes
                                                }
											</span>
                        </div>
                    </div>
                    <div className='w-full py-4'>
                        <p className="text-gray-600 mb-2">
                            Cambiar Estado:
                        </p>
                        <div className='flex items-center justify-around gap-2'>
                            {
                                buttonsActionsOfVerifyPayment.filter(b => b.value !== infoOfManualPaymentById.paymentAppointment.status).map((button) => (
                                    <button
                                        key={button.value}
                                        className={`px-3 flex gap-2 items-center justify-center py-2 ${button.style} text-white rounded hover:opacity-90 transition-colors w-full`}
                                        onClick={() => setNewStatusOfManualPayment(button.value)}
                                    >
                                        {button.icon}
                                        {button.label}
                                    </button>
                                ))
                            }
                        </div>

                    </div>
                    <hr className='text-gray-200'/>
                    {infoOfManualPaymentById.imageOfPayment[0].file_path && (
                        <div className="mt-4 w-full flex flex-col items-center">

                            <button
                                className="px-3 py-1 w-full h-10 bg-[#bd9554] text-white rounded hover:bg-[#a67c3d] transition-colors"
                                onClick={() => setShowImageModal(true)}
                            >
                                Ver imagen
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-center text-gray-500">Cargando detalles...</p>
            )}
        </Modal>
    )
}
