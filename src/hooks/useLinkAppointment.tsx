import {type FormEvent, useEffect, useState} from "react";
import type {AppointmentInterface} from "@/types";
import axios from "axios";
import {catchError} from "../../Fetch.ts";
import toast from "react-hot-toast";

export const useLinkAppointment = () => {
    const [allAppointments, setAllAppointments] = useState<AppointmentInterface[] | null>(null);
    const urlBack = import.meta.env.VITE_API_BASE_URL
    const [urlMeet, setUrlMeet] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [idOfAppointment, setIdOfAppointment] = useState<number | null>(null);

    async function fetchAppointments() {
        const promise = axios.get(`${urlBack}/appointments`);
        const [data, error] = await catchError(promise)

        if (!data) {
            toast.error(error)
            return
        }
        setAllAppointments(data.data.appointments);

    }

    async function saveLink(e: FormEvent) {
        e.preventDefault()
        if (!urlMeet) return;
        const [data, error] = await catchError(axios.put(`${urlBack}/generate-link/save-meet-link/${idOfAppointment}`, {link: urlMeet}));
        if (!data) {
            toast.error(error)
            return
        }
        setShowModal(false)
        fetchAppointments()
        console.log(data)

        toast.success("Link guardado correctamente")
        fetchAppointments()
    }

    async function generateLinkWithMeet() {
        const handleMessage = async (e:FormEvent) => {
            e.preventDefault()
            await fetch(`http://localhost:3000/api/generate-link/generate-meet-link/${idOfAppointment}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
            })
                .then((res) =>

                        res.json())
                .then((resData) => {
                    setUrlMeet(resData.link)
                    toast.success("Link generado: " + resData.link);

                })
                .catch((err) => {
                    console.log(err)

                    toast.error("No se pudo generar el link");
                });
        }
        const messageListener = (e:FormEvent) => {
            handleMessage(e);
            window.removeEventListener("message", messageListener);
            clearInterval(interval);
            win?.close();
        };
         window.addEventListener("message", handleMessage
            , {once: true});
        const win = window.open(`${urlBack}/generate-link/auth`, "_blank", "width=500,height=600");

        const interval = setInterval((e:FormEvent) => {
            if (win && win.closed) {
                clearInterval(interval);
                win.close()
                handleMessage(e)
            } else {
                try {
                    // Intenta leer el texto de la ventana hija
                    const text = win?.document.body.innerText;
                    if (text?.includes("Autenticación exitosa")) {
                        // Aquí puedes hacer lo que necesites
                        toast.success("Autenticación exitosa detectada.");
                        clearInterval(interval);
                        win?.close();
                        fetchAppointments();
                    }
                } catch (e) {
                    console.log(e)

                    toast.error('Error')
                }
            }
        }, 500);
    }

    useEffect(() => {
        fetchAppointments()
    }, []);


    return {
        allAppointments,
        generateLinkWithMeet,
        urlMeet,
        setUrlMeet,
        setShowModal, showModal,
        saveLink,
        setIdOfAppointment
    }
};
