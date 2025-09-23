import {
	DollarSign,
	Calendar,
	Hash,
	User,
	Mail,
	Phone,
	FileText,
	Image,
} from "lucide-react";
import { motion } from "motion/react";
import { Toaster } from "react-hot-toast";
import useManualPayment from "@/hooks/useManualPayment";

const inputs = [
    { label: "Monto", name: "amount", type: "number", icon: DollarSign },
    { label: "Fecha de Transacción", name: "transactionDate", type: "date", icon: Calendar },
    { label: "Referencia", name: "reference", type: "text", icon: Hash },
    { label: "Nombre del Cliente", name: "client_name", type: "text", icon: User },
    { label: "Correo Electrónico", name: "client_email", type: "email", icon: Mail },
    { label: "Teléfono del Cliente", name: "client_phone", type: "tel", icon: Phone },
    { label: "Notas", name: "notes", type: "textarea", icon: FileText },
    { label: "Imagen del Pago", name: "paymentImage", type: "file", icon: Image },
]

export default function ManualPayment() {
    const {
        formData,
        previewImage,
        handleChange,
        handleImageChange,
        handleSubmit,
    } = useManualPayment();

	return (
		<div className="container mx-auto px-4 py-6 mt-24">
			<Toaster position="top-center" reverseOrder={false} />

			<motion.div
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ scale: 0.5, opacity: 0 }}
				className="bg-white rounded-lg flex flex-col items-center overflow-hidden"
			>
				<h2 className="text-4xl font-bold mb-4 text-[#bd9554]">
					Formulario de Pago Manual
				</h2>
				<p className="text-gray-600">
					Una vez que hayas completado y enviado el
					formulario, nos pondremos en contacto contigo al
					verificar el pago.
				</p>
				<form
					onSubmit={handleSubmit}
					className="w-[50%] p-6 grid grid-cols-2 gap-4"
				>
                    {inputs.map(({ label, name, type, icon: Icon }) => (
                        <div key={name} className={name === "notes" || name === "paymentImage" ? "col-span-2" : ""}>
                            <div className="flex items-center gap-2">
                                <Icon className="text-[#bd9554]" />
                                <label
                                    htmlFor={name}
                                    className="block text-[#1e1e1e] font-medium"
                                >
                                    {label}
                                </label>
                            </div>
                            {type === "textarea" ? (
                                <textarea
                                    id={name}
                                    name={name}
                                    value={formData[name as keyof typeof formData] as string}
                                    onChange={handleChange}
                                    className="w-full shadow-sm border border-gray-200 mt-2 rounded-md p-2 text-[#1e1e1e]"
                                ></textarea>
                            ) : type === "file" ? (
                                <>
                                    <p className="text-gray-600">
                                        Sube una imagen del comprobante de pago
                                    </p>
                                    <input
                                        type="file"
                                        id={name}
                                        name={name}
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full shadow-sm border border-gray-200 mt-2 rounded-md p-2 text-[#1e1e1e]"
                                    />
                                    {previewImage && (
                                        <div className="mt-4">
                                            <p className="text-[#1e1e1e] font-medium">
                                                Vista previa:
                                            </p>
                                            <img
                                                src={previewImage}
                                                alt="Vista previa del pago"
                                                className="shadow- p-2 w-full h-auto rounded-md"
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <input
                                    type={type}
                                    id={name}
                                    name={name}
                                    value={formData[name as keyof typeof formData] as string}
                                    onChange={handleChange}
                                    className="w-full shadow-sm border border-gray-200 mt-2 rounded-md p-2 text-[#1e1e1e]"
                                />
                            )}
                        </div>
                    ))}

					<div className="col-span-2">
						<button
							type="submit"
							className="bg-[#1e1e1e] h-12 text-white px-4 py-2 rounded-md hover:bg-[#1e1e1ed4] transition-colors w-full "
						>
							Enviar
						</button>
					</div>
				</form>
			</motion.div>
		</div>
	);
}
