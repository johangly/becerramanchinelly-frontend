import {useEffect, useState} from 'react'
import {useSession} from "@clerk/clerk-react";
import axios, {isAxiosError} from "axios";
import toast from "react-hot-toast";
import type {AppointmentsByUserApiResponse} from "@/interfaces/dashboardUserInterfaces.ts";

export default function useDashboardUser() {
    const {session}=useSession()
    const [appointmentsOfUser, setAppointmentsOfUser] = useState<AppointmentsByUserApiResponse>([])
    const [loading, setLoading] = useState(false);
    const urlBackend = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchData = async () => {
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
        }
        fetchData();

    }, [session?.user.id, urlBackend]);
    console.log(appointmentsOfUser)

    return {
        appointmentsOfUser,
        loading
    }

}
