import axios, {isAxiosError} from "axios";
import {useEffect, useState} from "react";
import type {PaymentMethodResponseInterface} from "@/interfaces/paymentMethodInterface.ts";
import toast from "react-hot-toast";
import type {MeetingPlatformResponse} from "@/interfaces/meetingInterfaces.ts";
import type {ConfigsResponse, CurrenciesResponse} from "../interfaces/settingsInterfaces.ts";
import type {Config} from "../interfaces/settingsInterfaces.ts";
import {catchError} from "../../Fetch.ts";

const dataEmpty = {
    name: "",
    description: ""
}


export const useSettings = () => {
    const [allPaymentsMethods, setAllPaymentsMethods] = useState<PaymentMethodResponseInterface | null>(null);
    const [allMeetingPlatforms, setAllMeetingPlatforms] = useState<MeetingPlatformResponse | null>(null);
    const [allSettings, setAllSettings] = useState<ConfigsResponse | null>(null);
    const [allCurrencies, setAllCurrencies] = useState<CurrenciesResponse | null>(null);
    const [valueOfCurrencyMain, setValueOfCurrencyMain] = useState<string | null>(null);
    const [valueOfPhone, setValueOfPhone] = useState<string | null>(null);
    const [priceAppointment, setPriceAppointment] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState(dataEmpty)
    const urlBack = import.meta.env.VITE_API_BASE_URL;

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
                `${urlBack}/payment-methods/admin`
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
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
    }

    async function FetchAllMeetingPlatforms() {
        setLoading(true);
        try {
            const response = await axios.get(
                `${urlBack}/meetings`
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
                `${urlBack}/config`
            );
            setAllSettings(response.data);
            setValueOfCurrencyMain(response.data.configs.find((set: Config) => set.key === 'currency')?.value);
        } catch (error) {
            if (isAxiosError(error))
                toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function FetchAllCurrencies() {
        setLoading(true);
        try {
            const response = await axios.get(
                `${urlBack}/currencies`
            );

            setAllCurrencies(response.data);
        } catch (error) {
            if (isAxiosError(error))
                toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const changePhone = async () => {
        const id = allSettings?.configs.find(set => set.key === 'phone')?.id
        if (!id) return;
        if (!valueOfPhone) {
            toast.error("Por favor, ingresa un número de teléfono válido")
            return;
        }
        const promise = axios.put(`${urlBack}/config/${id}`, {
            newValues: {
                value: valueOfPhone
            }
        })
        const [data, error] = await catchError(promise)
        if (!data) {
            toast.error(error)
            return;
        }
        toast.success("Teléfono actualizado correctamente")
        setValueOfPhone(null)
        await FetchAllSettings()


    }
    const changePrice = async () => {
        const id = allSettings?.configs.find(set => set.key === 'priceAppointment')?.id
        if (!id) return;
        if (!priceAppointment) {
            toast.error("Por favor, ingresa un precio válido")
            return;
        }
        const promise = axios.put(`${urlBack}/config/${id}`, {
            newValues: {
                value: priceAppointment
            }
        })
        const [data, error] = await catchError(promise)
        if (!data) {
            toast.error(error)
            return;
        }
        toast.success("Precio actualizado correctamente")
        setValueOfPhone(null)
        await FetchAllSettings()


    }

    async function RegisterNewMeetingPlatform() {

        if (!formData.name || !formData.description) {
            toast.error("Por favor, completa todos los campos");
            return;
        }
        try {
            await axios.post(
                `${urlBack}/meetings`,
                formData
            );
            toast.success("Plataforma registrada correctamente")
            FetchAllMeetingPlatforms()
            setShowModal(false)
            setFormData(dataEmpty)

        } catch (error) {
            if (isAxiosError(error))
                toast.error(error.message);
        }
    }

    async function FetchChangeStatusPaymentMethod(id: number, is_active: boolean) {
        try {
            await axios.put(
                `${urlBack}/payment-methods/${id}`,
                {is_active: !is_active}
            );

            toast.success("Estado del método de pago actualizado correctamente")
            FetchAllPaymentsMethods()

        } catch (error) {
            if (isAxiosError(error))
                toast.error(error.message);
        }
    }

    const handleSelectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        const id = allSettings?.configs.find(set => set.key === 'currency')?.id
        setValueOfCurrencyMain(selectedValue);
        try {
            await axios.put(
                `${urlBack}/config/${id}`,
                {
                    newValues: {
                        value: selectedValue
                    }
                }
            )
            toast.success("Moneda principal actualizada correctamente")
            await FetchAllSettings()
        } catch (error) {
            if (isAxiosError(error))
                toast.error(error.message);
        }
    }

    async function FetchChangeStatusPlatform(id: number, is_active: boolean) {
        try {
            await axios.put(
                `${urlBack}/meetings/${id}`,
                {is_active: !is_active}
            );
            toast.success("Estado del método de pago actualizado correctamente")

            await FetchAllMeetingPlatforms()

        } catch (error) {
            if (isAxiosError(error))
                toast.error(error.message);
        }
    }

    useEffect(() => {
        FetchAllPaymentsMethods()
        FetchAllMeetingPlatforms()
        FetchAllSettings()
        FetchAllCurrencies()
    }, []);
    return {
        allPaymentsMethods,
        loading,
        FetchChangeStatusPaymentMethod,
        allMeetingPlatforms,
        showModal, setShowModal, inputsRegisterPlatform, handleChange, formData,
        RegisterNewMeetingPlatform, FetchChangeStatusPlatform,
        allSettings,
        allCurrencies,
        setValueOfCurrencyMain,
        valueOfCurrencyMain,
        handleSelectChange,
        valueOfPhone, changePhone, setValueOfPhone,changePrice,setPriceAppointment

    }

};
