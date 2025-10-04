import axios, {isAxiosError} from "axios";
import {useEffect, useState} from "react";
import type {PaymentMethodResponseInterface} from "@/interfaces/paymentMethodInterface.ts";
import toast from "react-hot-toast";
import type {MeetingPlatformResponse} from "@/interfaces/meetingInterfaces.ts";
import type {ConfigsResponse} from "../../settingsInterfaces.ts";

const dataEmpty = {
    name: "",
    description: ""
}

export const useSettings = () => {
    const [allPaymentsMethods, setAllPaymentsMethods] = useState<PaymentMethodResponseInterface | null>(null);
    const [allMeetingPlatforms, setAllMeetingPlatforms] = useState< MeetingPlatformResponse | null>(null);
    const [allSettings, setAllSettings] = useState<ConfigsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState(dataEmpty)
    console.log(allMeetingPlatforms)

    const inputsRegisterPlatform = [
        {
            label: "Nombre de la plataforma",
            type: "text",
            placeholder: "Zoom, Google Meet, Microsoft Teams, etc.",
            name: "name"
        },
        {
            label: "Descripción",
            type: "text",
            placeholder: "Descripción de la plataforma",
            name: "description"
        }
        ]
    async function FetchAllPaymentsMethods() {
        setLoading(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/payment-methods/admin`
            );

            setAllPaymentsMethods(response.data);
        } catch (error) {
            if (isAxiosError(error))
                toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }
    async function FetchAllMeetingPlatforms() {
        setLoading(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/meetings`
            );
            setAllMeetingPlatforms(response.data);
        } catch (error) {
            if (isAxiosError(error))
                toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }
    async function FetchAllSettings() {
        setLoading(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/config`
            );
            setAllSettings(response.data);
        } catch (error) {
            if (isAxiosError(error))
                toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }
    async function RegisterNewMeetingPlatform() {

        if(!formData.name || !formData.description){
            toast.error("Por favor, completa todos los campos");
            return;
        }
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/meetings`,
                formData
            );
            if (response.status >= 200 && response.status < 300) {
                toast.success("Plataforma registrada correctamente")
                FetchAllMeetingPlatforms()
                setShowModal(false)
                setFormData(dataEmpty)
            }
        } catch (error) {
            if (isAxiosError(error))
                toast.error(error.message);
        }
    }
    async function FetchChangeStatusPaymentMethod(id: number, is_active: boolean) {
        try {
            await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/payment-methods/${id}`,
                {is_active: !is_active}

        );

                toast.success("Estado del método de pago actualizado correctamente")
                FetchAllPaymentsMethods()

        } catch (error) {
            if (isAxiosError(error))
                toast.error(error.message);
        }
    }
    async function FetchChangeStatusPlatform(id: number, is_active: boolean) {
        try {
            await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/meetings/${id}`,
                {is_active: !is_active}

            );
            toast.success("Estado del método de pago actualizado correctamente")

            FetchAllMeetingPlatforms()

        } catch (error) {
            if (isAxiosError(error))
                toast.error(error.message);
        }
    }

    useEffect(() => {
        FetchAllPaymentsMethods()
        FetchAllMeetingPlatforms()
        FetchAllSettings()
    }, []);
    return {
        allPaymentsMethods,
        loading,
        FetchChangeStatusPaymentMethod,
        allMeetingPlatforms,
        showModal, setShowModal,inputsRegisterPlatform,handleChange,formData,
        RegisterNewMeetingPlatform,FetchChangeStatusPlatform,
        allSettings
    }

};
