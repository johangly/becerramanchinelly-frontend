import type {
    ManualPayment,
    ManualPaymentByIdInterface,
    ManualPaymentResponseInterface
} from '@/interfaces/manualPaymentInterfaces';
import {useSession} from '@clerk/clerk-react';
import axios, {isAxiosError} from 'axios';
import React, {useCallback, useEffect, useState} from 'react'
import toast from 'react-hot-toast';
import {Clock} from "lucide-react";

const dataEmpty = {
    amount: "",
    transactionDate: "",
    reference: "",
    client_name: "",
    client_email: "",
    client_phone: "",
    notes: "",
    appointment_id: "1",
};

export default function useManualPayment() {
    const [formData, setFormData] = useState(dataEmpty);
    const {session} = useSession();
    const [allManualPayments, setAllManualPayments] = useState<ManualPaymentResponseInterface |
        null>(null);
    const [paymentImage, setPaymentImage] = useState<File | null>(
        null
    );
    const [previewImage, setPreviewImage] = useState<string | null>(
        null
    );
    const [infoOfManualPaymentById, setInfoOfManualPaymentById] = useState<ManualPaymentByIdInterface | null>(null);
    const [idManualPayment, setIdManualPayment] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [dataFiltered, setDataFiltered] = useState(allManualPayments)
    const [filter, setFilter] = useState("")
    const [showImageModal, setShowImageModal] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [newStatusOfManualPayment, setNewStatusOfManualPayment] = useState<string | null>(infoOfManualPaymentById?.paymentAppointment.status);
    useEffect(() => {
        if (filter === "") {
            setDataFiltered(allManualPayments)
        } else {
            const filtered = allManualPayments?.data.filter(payment => payment.status === filter)
            setDataFiltered({status: allManualPayments?.status || "", data: filtered || []})
        }
    }, [allManualPayments, filter])
    const handleSubmitChangeStatusOfManualPayment = useCallback(async () => {
        try {
            if (newStatusOfManualPayment && infoOfManualPaymentById) {
                const response = axios.put(`${import.meta.env.VITE_API_BASE_URL}/manual-payments/${infoOfManualPaymentById.paymentAppointment.id}`, {
                    status: newStatusOfManualPayment
                }).then(res => {
                    if (res.status === 200) {
                        toast.success("Estado del pago actualizado correctamente")
                        fetchAllManualPayments()
                        setShowModal(false)
                        setNewStatusOfManualPayment(null)
                        setIdManualPayment(null)
                    }
                })
            }
        } catch (error) {
            if (isAxiosError(error)) toast.error(error.message)
        }
    }, [newStatusOfManualPayment,infoOfManualPaymentById])


    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0] || null;
        setPaymentImage(file);

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };
    const fetchAllManualPayments = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/manual-payments/`
            );
            setAllManualPayments(response.data);
        } catch (error) {
            if (isAxiosError(error))
                toast.error(error.message);
        }
    };
    const fetchManualPaymentById = async (id: number) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/manual-payments/${id}`
            );
            setInfoOfManualPaymentById(response.data.data);
        } catch (error) {
            if (isAxiosError(error))
                toast.error(error.message);
            return null;
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !formData.amount ||
            !formData.transactionDate ||
            !formData.client_name ||
            !formData.client_email ||
            !formData.client_phone
        ) {
            toast.error("Please fill in all required fields.");
            return;
        }
        if (formData.transactionDate > new Date().toISOString().split('T')[0]) {
            toast.error("Transaction date cannot be in the future.");
            return;
        }
        if (!paymentImage) {
            toast.error("Please upload a payment image.");
            return;
        }
        try {
            const submissionData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                submissionData.append(key, value);
            });
            submissionData.append("user_id", session?.user.id || "");
            submissionData.append("paymentImage", paymentImage);
            const response = await axios
                .post(
                    `${
                        import.meta.env.VITE_API_BASE_URL
                    }/manual-payments`,
                    submissionData
                )
                .then(() => {
                    toast.success("Form submitted successfully!");
                    setFormData(dataEmpty);
                    setPaymentImage(null);
                    setPreviewImage(null);
                });
        } catch (error) {
            if (isAxiosError(error))
                toast.error("Error submitting form. Please try again.");
        }
    };
    useEffect(() => {
        fetchAllManualPayments();
    }, []);
    useEffect(() => {
        if (idManualPayment !== null) {
            fetchManualPaymentById(idManualPayment);
        }
    }, [idManualPayment]);
    useEffect(() => {
        if(!newStatusOfManualPayment || !infoOfManualPaymentById) return
        handleSubmitChangeStatusOfManualPayment()

    }, [newStatusOfManualPayment, handleSubmitChangeStatusOfManualPayment, infoOfManualPaymentById]);
    return {
        formData,
        paymentImage,
        previewImage,
        handleChange,
        handleImageChange,
        handleSubmit,
        setFormData,
        setPaymentImage,
        setPreviewImage,
        allManualPayments,
        setIdManualPayment,
        showModal,
        setShowModal,
        infoOfManualPaymentById,
        dataFiltered,
        isZoomed,
        setIsZoomed,
        showImageModal,
        setShowImageModal,
        setNewStatusOfManualPayment,
        newStatusOfManualPayment,
        filter,
        setFilter
    }
}
