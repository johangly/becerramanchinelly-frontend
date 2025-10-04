import {type MouseEvent, useCallback, useEffect, useState} from 'react'
import {useSession} from "@clerk/clerk-react";
import axios, {isAxiosError} from "axios";
import toast from "react-hot-toast";
import type {AppointmentsByUserApiResponse} from "@/interfaces/dashboardUserInterfaces.ts";
import {catchError} from "../../Fetch.ts";

export default function useDashboardUser() {
    const {session} = useSession()
    const [appointmentsOfUser, setAppointmentsOfUser] = useState<AppointmentsByUserApiResponse | null>(null)
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [idAppointment, setIdAppointment] = useState<number | null>(null);
    const urlBackend = import.meta.env.VITE_API_BASE_URL;
    const [platform,setPlatform]= useState<number | null>(null)

    const fetchData =
        useCallback(async () => {
                setLoading(true);
                try {
                    const response = await axios.get(`${urlBackend}/appointments/user/${session?.user.id}`);
                    setAppointmentsOfUser(response.data);
                } catch (error) {
                    if (isAxiosError(error))
                        toast.error(`Error al obtener las citas del usuario ${error.message}`);
                    else
                        toast.error(`Error al obtener las citas del usuario ${error}`);
                } finally {
                    setLoading(false);
                }
            }, [session?.user.id, urlBackend]
        )

async function handleChangePlatform (id: number) {
    const promise = axios.put(`${urlBackend}/appointments/update-appointment-platform/${idAppointment}`, {
        meetingPlatformId: id
    })
    const [data,error]= await catchError(promise)

    if(!data) toast.error(error);
    toast.success('Plataforma actualizada con éxito')
    await fetchData()
    setShowModal(false)
    setIdAppointment(null)


}
    function handleCancelAppointment(paymentId: number) {
        toast((t) => (
                <span>¿Estás seguro de que deseas eliminar esta cita?
                    <strong className='text-red-500'> Si cancela la cita debe ponerse en contacto con el administrador para la devolución del dinero, a través del numero colocado en nuestra web.
                    </strong>
                <div className="mt-2 flex justify-end">
                    <button
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded mr-2 hover:bg-gray-300"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancelar
                    </button>
                    <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={async () => {
                            try {
                                const response = await axios.delete(`${urlBackend}/payments/delete-payment/${paymentId}`);
                                console.log(response)
                                toast.success(response.data.message);

                                fetchData()
                            } catch (error) {
                                if (isAxiosError(error))
                                    if (error.response) {
                                        const errorMessage = error.response.data.message;
                                        toast.error(`Error: ${errorMessage}`,{ duration: 5000 });
                                    } else if (error.request) {
                                        toast.error('No se pudo conectar con el servidor. Revisa tu conexión a internet.',{ duration: 5000 });
                                    } else {
                                        toast.error('Ocurrió un error inesperado al eliminar.',{ duration: 5000 });
                                    }
                            } finally {
                                toast.dismiss(t.id);
                            }

                        }}
                    >
                        Eliminar
                    </button>
                </div>
            </span>

            ), {
                style: {
                    minWidth: '800px',
                },
                icon: '⚠️',
                duration: 8000
            }
        );
    }


    useEffect(() => {
        fetchData()
    }, [fetchData]);

    return {
        appointmentsOfUser,
        loading,
        handleCancelAppointment,
        setShowModal,
        showModal,
        setIdAppointment,
handleChangePlatform
    }

}
