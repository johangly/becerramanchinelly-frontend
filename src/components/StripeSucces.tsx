import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import {useSession} from "@clerk/clerk-react";

interface  stripeSucces {
    payment_status: string;
    status: string;
    id:string
    customer_details:{
        email: string
        name: string
    }
    amount_total: number

}
export default function Success() {
    const {session}= useSession()
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const appointmentId = searchParams.get("appointmentId");
    const [paymentData, setPaymentData] = useState<stripeSucces | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (sessionId) {
            axios
                .get(`${import.meta.env.VITE_API_BASE_URL}/payment-stripe/verify-session?session_id=${sessionId}`)
                .then(res =>{
                    console.log(res)

            setPaymentData(res.data.session)})
                .catch(() => setPaymentData(null))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [sessionId]);
    useEffect(() => {
        if(!session) return;
        if (appointmentId && paymentData?.payment_status === "paid") {
            axios
                .put(`${import.meta.env.VITE_API_BASE_URL}/payment-stripe/updateStatus`, {
                    user_id: session?.user.id,
                    appointmentId: appointmentId,
                    paymentId: paymentData.id,
                    amount: paymentData.amount_total / 100,
                    client_name: paymentData.customer_details.name,
                })
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [appointmentId, paymentData,session]);
    if (loading) return <div>Cargando datos de pago...</div>;

    if (!paymentData) return <div>No se pudo obtener la información del pago.</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {
                loading ?
                <div className="text-center">
                    <p className="text-lg mb-4">Verificando el estado del pago...</p>
                    <div className="loader">Cargando...</div>
                </div> :
                    !paymentData ?
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4 text-red-600">Error al procesar el pago</h2>
                        <p className="text-lg">No se pudo obtener la información del pago.</p>
                    </div> :

                        <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
                            <svg className="w-20 h-20 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2l4-4" />
                            </svg>
                            <h1 className="text-3xl font-bold text-green-600 mb-2">¡Pago realizado con éxito!</h1>
                            <p className="text-gray-700 mb-6">Gracias por tu compra, {paymentData.customer_details.name || "usuario"}.</p>
                            <div className="text-left w-full max-w-xs ">
                                <p className='text-wrap break-words'><span className="font-semibold break-words">Operación:</span> {paymentData.id}</p>
                                <p><span className="font-semibold">Monto:</span> ${(paymentData.amount_total / 100).toFixed(2)}</p>
                                <p><span className="font-semibold">Estado:</span> {paymentData.payment_status}</p>
                                <p><span className="font-semibold">Email:</span> {paymentData.customer_details.email}</p>
                            </div>
                            <p className="text-gray-700 mt-6 mb-6 text-primary font-bold">Nos estaremos comunicando contigo.</p>
                            <a
                                href="/"
                                className="mt-6 inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded transition"
                            >
                                Volver al inicio
                            </a>
                        </div>
            }

        </div>
    );
}