import useStripe from "@/hooks/useStripe.tsx";

export default function Success() {
    const {paymentData, loading,appointmentId} = useStripe()

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
                            <svg className="w-20 h-20 text-green-500 mb-4" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M9 12l2 2l4-4"/>
                            </svg>
                            <h1 className="text-3xl font-bold text-green-600 mb-2">¡Pago realizado con éxito!</h1>
                            <p className="text-gray-700 mb-6">Gracias por tu
                                compra, {paymentData.customer_details.name || "usuario"}.</p>
                            <div className="text-left text-gray-800 w-full max-w-xs ">
                                <p className='text-wrap break-words'><span
                                    className="font-semibold break-words">Operación:</span> {paymentData.id}</p>
                                <p><span
                                    className="font-semibold">Monto:</span> ${(paymentData.amount_total / 100).toFixed(2)}
                                </p>
                                <p><span className="font-semibold">Estado:</span> {paymentData.payment_status}</p>
                                <p><span
                                    className="font-semibold">Email:</span> {paymentData.customer_details.email}
                                </p>
                            </div>
                            <p className="text-gray-700 mt-6 mb-6 text-primary font-bold">Nos estaremos comunicando
                                contigo en breve.</p>
                            <a
                                href={`/selected-platform/${appointmentId}`}
                                className="mt-6 inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded transition"
                            >
                                Elegir plataforma de reunión
                            </a>
                        </div>
            }

        </div>
    );
}