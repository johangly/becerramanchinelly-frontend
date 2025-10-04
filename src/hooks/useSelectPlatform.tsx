import {useParams} from "react-router-dom";
import {catchError} from "../../Fetch.ts";
import axios from "axios";
import type {FormEvent} from "react";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
export const useSelectPlatform = () => {
    const params = useParams()
    const idAppointment = params.id
    const navigate = useNavigate();
    async function handleSubmitPlatform(e: FormEvent, idPlatform: number) {
        e.preventDefault();
        const promise = axios.put(`${import.meta.env.VITE_API_BASE_URL}/appointments/update-appointment-platform/${idAppointment}`, {meetingPlatformId: idPlatform});
        const [data, error] = await catchError(promise)
        if (!data) {
            toast.error(error)
            return
        }
        toast.success(data.data.message, {duration: 2000})
        setTimeout(() => {
            toast.success(
                "Te redirigiremos automaticamente a tus citas"
            )
            setTimeout(() => {
                navigate("/user/appointments")
            }, 2000)

        }, 2000)


    }

    return {
        handleSubmitPlatform
    }
};
