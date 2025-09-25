import {useState, useEffect} from "react";
import {format, startOfWeek, addDays} from "date-fns";
import {es} from "date-fns/locale";
import {TZDate} from "@date-fns/tz";
import {apiClient} from "../api";
import {toast} from "react-hot-toast";
import {motion, AnimatePresence} from "framer-motion";
import type {DayInfo, AppointmentInterface} from "@/types";
import {set} from "date-fns";
import {twMerge} from "tailwind-merge";
import {CalendarDays, ChevronDown, ChevronUp} from "lucide-react";

type TimeSlot = {
    id: number;
    start_time: string;
    end_time: string;
    day: string;
    status: string;
};

const ZONE = import.meta.env.VITE_ZONE_TIME || "America/Caracas";

const WeeklySchedule = ({
                            goToNextStep,
                        }: {
    goToNextStep: (
        appointmentData: AppointmentInterface,
        step: number
    ) => void;
}) => {
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [selectedDate] = useState(new TZDate(new Date(), ZONE));
    const [loading, setLoading] = useState(true);
    const [dayNames, setDayNames] = useState<DayInfo[]>([]);
    const [appointments, setAppointments] = useState<
        AppointmentInterface[]
    >([]);
    const [expandedDayKey, setExpandedDayKey] = useState<
        string | null
    >(null);
    // Obtener la semana actual (lunes a sábado)
    const getWeekDays = () => {
        const start = startOfWeek(selectedDate, {weekStartsOn: 1}); // Lunes
        return Array.from({length: 6}, (_, i) => addDays(start, i));
    };
    // Obtener los horarios disponibles
    const fetchAvailableSlots = async () => {
        try {
            setLoading(true);
            const startDate = format(
                startOfWeek(selectedDate, {weekStartsOn: 1}),
                "yyyy-MM-dd"
            );
            const endDate = format(
                addDays(new Date(startDate), 5),
                "yyyy-MM-dd"
            );

            const response = await apiClient.get(
                `/appointments?startDate=${startDate}&endDate=${endDate}`
            );

            if (response.data && Array.isArray(response.data)) {
                setTimeSlots(response.data);
            }
        } catch (error) {
            toast.error("Error al cargar los horarios disponibles");
        } finally {
            setLoading(false);
        }
    };

    // Manejar la reserva de un horario
    const handleReservation = async (slotId: number) => {
        try {
            toast.success("Redirigiendo al formulario de reserva...");
            // Ejemplo: navigate(`/reservar/${slotId}`);
        } catch (error) {
            toast.error("Error al procesar la reserva");
        }
    };

    // Agrupar citas por día
    const appointmentsByDay = appointments.reduce<
        Record<string, AppointmentInterface[]>
    >((acc, appointment) => {
        if (appointment.isDeleted) return acc;

        const apptDate = new Date(appointment.day);
        const dayKey = format(apptDate, "yyyy-MM-dd");

        if (!acc[dayKey]) acc[dayKey] = [];
        acc[dayKey].push(appointment);
        return acc;
    }, {} as Record<string, AppointmentInterface[]>);

    // const weekDays = getWeekDays();

    // Obtener las fechas de la semana actual
    const getCurrentWeekDates = () => {
        let today = new TZDate(new Date(), ZONE);

        const isSunday = today.getDay() === 0;

        // Si es domingo, se ajusta a lunes
        if (isSunday) {
            today = addDays(today, 1);
        }

        const startOfCurrentWeek = startOfWeek(today, {
            weekStartsOn: 1,
        }); // Lunes como primer día de la semana

        const weekDays = [
            "LUNES",
            "MARTES",
            "MIÉRCOLES",
            "JUEVES",
            "VIERNES",
            "SÁBADO",
        ];

        // Crear arreglo con los días y sus fechas
        return weekDays.map((day, index) => {
            const dayDate = addDays(startOfCurrentWeek, index);
            const dayNumber = parseInt(format(dayDate, "d"), 10); // Obtener el día del mes como número
            const month = format(dayDate, "MMM", {
                locale: es,
            }).toUpperCase();

            // Establecer la hora al final del día (23:59:59.999)
            const dateWithTime = set(dayDate, {
                hours: 23,
                minutes: 59,
                seconds: 59,
                milliseconds: 999,
            });

            return {
                name: day,
                date: dayNumber,
                month: month,
                fullDate: dateWithTime,
            };
        });
    };
    useEffect(() => {
        // fetchAvailableSlots();
        setDayNames(getCurrentWeekDates());
        const fetchAppointments = async () => {
            try {
                const startDate = dayNames[0]?.fullDate;
                const endDate =
                    dayNames[dayNames.length - 1]?.fullDate;

                const response = await apiClient.get(
                    "/appointments",
                    {
                        params: {
                            startDate: startDate?.toISOString(),
                            endDate: endDate?.toISOString(),
                        },
                    }
                );
                if (response.statusText === "OK") {
                    setAppointments(response.data.appointments);
                    setLoading(false);
                } else {
                    toast.error("Error al cargar las citas");
                    setLoading(false);
                }
            } catch (err) {
                toast.error("Error al cargar las citas");
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [selectedDate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-[#ffffff] text-cent">
                    <h2 className="text-4xl text-center text-[#1e1e1e]">
                        Horarios Disponibles
                    </h2>
                </div>

                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dayNames.map((dayInfo) => {
                            const dayKey = format(
                                dayInfo.fullDate,
                                "yyyy-MM-dd"
                            );
                            const daySlots =
                                appointments.filter(
                                    (appt) =>
                                        format(
                                            appt.day,
                                            "yyyy-MM-dd"
                                        ) === dayKey
                                ) || [];
                            const isSelected =
                                expandedDayKey === dayKey; // 🔹 Ahora usamos este estado

                            return (
                                <div
                                    key={dayKey}
                                    className={`bg-[#ffffff] border rounded-lg overflow-hidden transition-colors ${
                                        isSelected
                                            ? "border-[#bd9554] shadow-sm shadow-[#bd9554]"
                                            : "border-[#bd9554] hover:border-gray-300"
                                    }`}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setExpandedDayKey(
                                            isSelected ? null : dayKey
                                        );
                                    }}
                                >
                                    <div
                                        className={`text-[#1e1e1e] flex cursor-pointer ${
                                            isSelected
                                                ? "bg-gray-100"
                                                : "hover:opacity-90"
                                        }`}
                                    >
                                        <div className="bg-[#bd9554]  w-20 h-20 flex items-center justify-center">
                                            <CalendarDays
                                                color="#ffffff"
                                                size={48}
                                            />
                                        </div>
                                        <div
                                            className="py-4 px-2 text-xl flex gap-4 justify-beetwen w-full items-center">
                                            <div className="w-1/3">
                                                <h3 className="font-bold text-lg">
                                                    {format(
                                                        dayInfo.fullDate,
                                                        "EEEE",
                                                        {locale: es}
                                                    ).toUpperCase()}
                                                </h3>
                                                <p className="text-sm text-[#1e1e1e] font-medium">
                                                    {format(
                                                        dayInfo.fullDate,
                                                        "d MMMM",
                                                        {locale: es}
                                                    )}
                                                </p>
                                            </div>
                                            <div className="w-2/3">
                                                {daySlots.length >
                                                0 ? (
                                                    <span className="text-sm font-medium text-green-600">
														{
                                                            daySlots.length
                                                        }{" "}
                                                        {daySlots.length ===
                                                        1
                                                            ? "cita disponible"
                                                            : "citas disponibles"}
                                                        {isSelected ? (
                                                            <ChevronUp className="inline ml-2"/>
                                                        ) : (
                                                            <ChevronDown className="inline ml-2"/>
                                                        )}
													</span>
                                                ) : (
                                                    <span className="text-sm font-medium text-gray-500">
														No disponible
													</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {isSelected &&
                                            daySlots.length > 0 && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        height: 0,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        height: "auto",
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        height: 0,
                                                    }}
                                                    className="overflow-hidden"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="p-3 space-y-2">
                                                        {appointmentsByDay[
                                                            dayKey
                                                            ]?.length >
                                                        0 ? (
                                                            <ul className="space-y-2">
                                                                {appointmentsByDay[
                                                                    dayKey
                                                                    ].map(
                                                                    (
                                                                        appt,
                                                                        idx
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                idx
                                                                            }
                                                                            className="bg-gray-100 p-3 rounded-md shadow-sm"
                                                                        >
                                                                            <div
                                                                                className="flex justify-start items-center space-x-3">
																				<span
                                                                                    className="text-sm font-medium mr-auto text-[#1e1e1e]">
																					{appt.start_time.slice(
                                                                                        0,
                                                                                        5
                                                                                    )}{" "}
                                                                                    -{" "}
                                                                                    {appt.end_time.slice(
                                                                                        0,
                                                                                        5
                                                                                    )}
																				</span>
                                                                                <span
                                                                                    className={twMerge(
                                                                                        "text-xs px-2 py-1 rounded-full",
                                                                                        appt.status ===
                                                                                        "disponible" &&
                                                                                        "bg-green-100 text-green-800",
                                                                                        appt.status ===
                                                                                        "reservado" &&
                                                                                        "bg-blue-100 text-blue-800",
                                                                                        appt.status ===
                                                                                        "completado" &&
                                                                                        "bg-purple-100 text-purple-800",
                                                                                        appt.status ===
                                                                                        "cancelado" &&
                                                                                        "bg-red-100 text-red-800"
                                                                                    )}
                                                                                >
																					{appt.status ===
                                                                                    "disponible"
                                                                                        ? "Disponible"
                                                                                        : appt.status ===
                                                                                        "reservado"
                                                                                            ? "Reservado"
                                                                                            : appt.status ===
                                                                                            "completado"
                                                                                                ? "Completado"
                                                                                                : "Cancelado"}
																				</span>
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation()
                                                                                        goToNextStep(
                                                                                            appt,
                                                                                            2
                                                                                        )
                                                                                    }}
                                                                                    disabled={appt.status !=="disponible"}
                                                                                    className="bg-[#1e1e1e] text-white px-2 py-1 rounded-md hover:opacity-70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                                >
                                                                                    Reservar
                                                                                </button>
                                                                            </div>
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        ) : (
                                                            <motion.div
                                                                initial={{opacity: 0, height: 0}}
                                                                animate={{opacity: 1, height: 'auto'}}
                                                                exit={{opacity: 0, height: 0}}
                                                                transition={{
                                                                    type: "spring",
                                                                    stiffness: 10,
                                                                    damping: 110
                                                                }}
                                                                className="overflow-hidden"
                                                            >
                                                                <p className="text-center text-gray-400 text-sm py-2">
                                                                    No
                                                                    hay
                                                                    citas
                                                                    programadas
                                                                </p>
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                    </AnimatePresence>

                                    {isSelected &&
                                        daySlots.length === 0 && (
                                            <div className="p-3 text-sm text-gray-500 bg-white">
                                                No hay horarios
                                                disponibles para este
                                                día.
                                            </div>
                                        )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeeklySchedule;
