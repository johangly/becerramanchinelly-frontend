import React, {useEffect} from 'react'
import  { motion } from "motion/react";
import toast, {Toaster} from "react-hot-toast";
import axios, {isAxiosError} from "axios";
import type {PaymentMethodResponseInterface} from "@/interfaces/paymentMethodInterface.ts";
import { CreditCard, Banknote, HelpCircle, Wallet } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export default function SelectMethodOfPayment() {
    const navigate = useNavigate();
    const [paymentsMethods, setPaymentsMethods] = React.useState<PaymentMethodResponseInterface | null>(null);
    const handleGetOfAllMethodsOfPayment = async () => {
        try{
            const response =await axios.get(`${
                import.meta.env.VITE_API_BASE_URL
            }/payment-methods/`);
            console.log(response)
            setPaymentsMethods(response.data);
        }catch(err){
            if (isAxiosError(err))
            toast.error(err.message);
        }
    }
    function handleSelectMethod(methodName: string) {
        // Normaliza el nombre para la ruta
        const route = `/payment/${methodName.toLowerCase().replace(/\s+/g, "-")}`;
        navigate(route);

    }
    function getPaymentIcon(name: string) {
        if (name.toLowerCase().includes("stripe")) return <CreditCard className="w-8 h-8 text-blue-500 mb-2" />;
        if (name.toLowerCase().includes("paypal")) return <Wallet className="w-8 h-8 text-indigo-500 mb-2" />;
        if (name.toLowerCase().includes("externo")) return <Banknote className="w-8 h-8 text-green-500 mb-2" />;
        return <HelpCircle className="w-8 h-8 text-gray-400 mb-2" />;
    }
    useEffect(() => {
        handleGetOfAllMethodsOfPayment()
    }, []);
    return (
        <div className="container mx-auto px-4 py-6">
            <Toaster position="top-center" reverseOrder={false}/>
            <motion.div
                initial={{y: -100, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                className="max-w-7xl w-full mx-auto rounded-lg flex flex-col items-center"
            >
                <h2 className="text-4xl font-bold text-[#bd9554]">
                   Selecciona el metodo de pago
                </h2>
                <p className='text-gray-400 mt-2'>En este apartado puedes elegir con que metodo pagar tu reserva</p>
                 <div className="w-full max-w-7xl flex justify-center">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">
                    {paymentsMethods?.data.map((method) => (
                        <div
                            key={method.id}
                            className="border-2 border-gray-200 rounded-xl p-6 flex flex-col items-center bg-white shadow-md hover:shadow-lg hover:border-[#bd9554] transition-all cursor-pointer group"
                            onClick={() =>handleSelectMethod(method.name)
                            }
                        >
                            {getPaymentIcon(method.name)}
                            <h3 className="text-lg font-semibold mb-1 group-hover:text-[#bd9554] transition-colors">{method.name}</h3>
                            <p className="text-gray-500 text-center text-sm">{method.description}</p>
                        </div>
                    ))}
                </div>
                </div>
            </motion.div>
        </div>
    )
}
