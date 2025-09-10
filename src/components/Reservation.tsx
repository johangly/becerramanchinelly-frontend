import { useState, useEffect } from 'react';
import axios from 'axios';
import type { AppointmentInterface } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { apiClient } from '../api/index';
import toast from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';
import {
  format,
  parseISO,
  startOfWeek,
  addDays,
  isSameDay,
  setHours,
  setMinutes,
  addMinutes,
  set
} from 'date-fns';

import { es } from 'date-fns/locale';
import { TZDate } from "@date-fns/tz";

const ZONE = import.meta.env.VITE_ZONE_TIME || 'America/Caracas';

const AdminApp = () => {
    const [appointments, setAppointments] = useState<AppointmentInterface[]>([]);
    const [formData, setFormData] = useState<AppointmentInterface>({
        id: 0,
        day: new TZDate(new Date(), ZONE),
        start_time: '',
        end_time: '',
        reservation: 0,
        reservation_date: null,
        status: 'disponible'
    });
    const localUserTime = new TZDate(new Date(), ZONE);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    // Obtener las fechas de la semana actual
    const getCurrentWeekDates = () => {
        let today = new TZDate(new Date(), ZONE);
        
        const isSunday = today.getDay() === 0;

        // Si es domingo, se ajusta a lunes
        if(isSunday){
            today = addDays(today, 1);
        }
        
        const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Lunes como primer día de la semana
        
        const weekDays = [
            'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'
        ];
        
        // Crear arreglo con los días y sus fechas
        return weekDays.map((day, index) => {
            const dayDate = addDays(startOfCurrentWeek, index);
            const dayNumber = parseInt(format(dayDate, 'd'), 10); // Obtener el día del mes como número
            const month = format(dayDate, 'MMM', { locale: es }).toUpperCase();
            
            // Establecer la hora al final del día (23:59:59.999)
            const dateWithTime = set(dayDate, {
                hours: 23,
                minutes: 59,
                seconds: 59,
                milliseconds: 999
              });
            
            return {
                name: day,
                date: dayNumber,
                month: month,
                fullDate: dateWithTime
            };
        });
    };
    
    const dayNames = getCurrentWeekDates();

    console.log('dayNames', dayNames);

    // Cargar citas al montar el componente
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await apiClient.get('/appointments');
                if(response.statusText === 'OK'){
                    // console.log('appointments', response.data);
                    setAppointments(response.data.appointments);
                    setLoading(false);
                }else{
                    toast.error('Error al cargar las citas');
                    setLoading(false);
                }
            } catch (err) {
                toast.error('Error al cargar las citas');
                console.error('Error fetching appointments:', err);
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Si es el campo de fecha, convertir a objeto Date
        if (name === 'day') {
            const dateValue = parseISO(value);
            setFormData(prev => ({
                ...prev,
                [name]: dateValue,
            }));
            return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));

        // Lógica para establecer la hora de finalización automáticamente
        if (name === 'start_time' && value && !editingId) {
            const [hours, minutes] = value.split(':').map(Number);
            const startDate = new Date();
            const dateWithTime = setHours(
                setMinutes(startDate, minutes),
                hours
            );
            
            // Agregar 1 hora y 30 minutos
            const endDate = addMinutes(dateWithTime, 90);
            
            setFormData(prev => ({
                ...prev,
                start_time: value,
                end_time: format(endDate, 'HH:mm')
            }));
            return;
        }
    };

    const handleAddOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Asegurarse de que las fechas sean objetos Date válidos

            const dayDate = formData.day ? new TZDate(formData.day, ZONE) : new TZDate(new Date(), ZONE);
            // Preparar los datos para enviar al backend
            const appointmentData = {
                ...formData,
                // Formatear la fecha como YYYY-MM-DD
                day: format(dayDate, 'yyyy-MM-dd'),
            };

            if (editingId) {
                // Actualizar horario existente
                const response = await apiClient.put(`/appointments/${editingId}`, appointmentData);
                if (response.status === 200) {
                    toast.success('Horario actualizado exitosamente');
                    setAppointments(appointments.map(app => 
                        app.id === editingId ? response.data : app
                    ));
                    closeCustomModal();
                }
            } else {
                // Agregar un nuevo horario
                // console.log('appointmentData', appointmentData)
                const response = await apiClient.post('/appointments', appointmentData);
                if (response.status === 201) {
                    toast.success('Horario guardado exitosamente');
                    setAppointments([...appointments, response.data.newAppointment]);
                    closeCustomModal();
                }
            }
            
            // Resetear el formulario
            setFormData({
                id: 0,
                day: new TZDate(new Date(), ZONE),
                start_time: '',
                end_time: '',
                reservation: 0,
                reservation_date: null,
                status: 'disponible'
            });
            setEditingId(null);

            // Resetear el formulario y cerrar el modal

        } catch (err) {
            toast.error('Error al guardar la cita');
            console.error('Error saving appointment:', err);
        }
    };

    const handleEdit = (appointment: AppointmentInterface) => {
        setFormData({
            id: appointment.id,
            day: typeof appointment.day === 'string' 
                ? new TZDate(new Date(appointment.day), ZONE) 
                : appointment.day,
            start_time: appointment.start_time,
            end_time: appointment.end_time,
            reservation: appointment.reservation,
            reservation_date: appointment.reservation_date,
            status: appointment.status
        });
        setEditingId(appointment.id);
        showCustomModal();
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
            try {
                await axios.delete(`/api/appointments/${id}`);
                const updatedAppointments = appointments.filter((appt) => appt.id !== id);
                setAppointments(updatedAppointments);
            } catch (err) {
                toast.error('Error al eliminar la cita');
                console.error('Error deleting appointment:', err);
            }
        }
    };

    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [pendingDate, setPendingDate] = useState<Date | null>(null);

    const showCustomModal = (message = '') => {
        setModalMessage(message);
        setShowModal(true);
    };
    const closeCustomModal = () => {
        setShowModal(false);
        setFormData({
            id: 0,
            day: new TZDate(new Date(), ZONE),
            start_time: '',
            end_time: '',
            reservation: 0,
            reservation_date: null,
            status: 'disponible' as const
        });
        setEditingId(null);
    };

    const confirmCreateForNextWeek = () => {
        if (!pendingDate) return;
        
        const nextWeek = new Date(pendingDate);
        nextWeek.setDate(nextWeek.getDate() + 7);
        nextWeek.setHours(12, 0, 0, 0)
        
        setFormData(prev => ({
            ...prev,
            day: new TZDate(nextWeek, ZONE),
            reservation_date: null
        }));
        
        setShowConfirmModal(false);
        setPendingDate(null);
        setShowModal(true);
    };

    const openAddModal = ({ name, date, month, fullDate }: { name: string; date: number; month: string; fullDate: Date }) => {
        // Mapeo de días de la semana (0: Domingo, 1: Lunes, ..., 6: Sábado)
        const weekDays = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
        
        // Extraer el nombre del día si es un objeto
        const dayString = name;
        
        // Obtener el índice del día seleccionado (0-6)
        const selectedDayIndex = weekDays.findIndex(d => d === dayString.toUpperCase());
        
        if (selectedDayIndex === -1) {
            toast.error('Día de la semana no válido');
            return;
        }
        
        const today = new TZDate(new Date(), ZONE);
        const selectedDate = new TZDate(fullDate, ZONE);
        console.log('selectedDate', selectedDate)
        console.log('today', today)
        console.log('selectedDate < today =', selectedDate < today)
        if (selectedDate < today) {
            setPendingDate(selectedDate);
            setShowConfirmModal(true);
            return;
        }

        setFormData({
            id: 0,
            day: selectedDate,
            start_time: '',
            end_time: '',
            reservation: 0,
            reservation_date: null, // Se establecerá cuando se haga la reserva
            status: 'disponible'
        });
        setEditingId(null);
        setShowModal(true);
    };
    // console.log('appointments', appointments)
    return (
        <div className="p-4">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div>
                    <AnimatePresence>
                        {showModal && (
                            <motion.div className="fixed inset-0 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className='fixed backdrop-blur-xs inset-0 bg-gray-600/50 h-full w-full'>

                                </motion.div>
                                <motion.div initial={{ y: -100,opacity: 0 }} animate={{ y: 0,opacity: 1 }} exit={{ y: -100,opacity: 0 }} className="relative p-6 bg-white rounded-lg shadow-xl max-w-lg w-full">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                                        {editingId ? 'Actualizar Horario' : 'Crear Horario'}
                                    </h3>
                                    <form onSubmit={handleAddOrUpdate} className="flex flex-col gap-4">
                                        <label htmlFor="day" className="sr-only">Día</label>
                                        <input
                                            type="date"
                                            name="day"
                                            value={formData.day 
                                                ? format(new Date(formData.day), 'yyyy-MM-dd')
                                                : ''}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                            min={new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                        <label htmlFor="start_time" className="sr-only">Hora de Inicio</label>
                                        <input
                                            type="time"
                                            name="start_time"
                                            value={formData.start_time}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                            required
                                        />
                                        <label htmlFor="end_time" className="sr-only">Hora de Fin</label>
                                        <input
                                            type="time"
                                            name="end_time"
                                            value={formData.end_time}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                            required
                                        />
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                            required
                                        >
                                            <option value="disponible">Disponible</option>
                                            <option value="reservado">Reservado</option>
                                            <option value="completado">Completado</option>
                                            <option value="cancelado">Cancelado</option>
                                        </select>
                                        <div className="flex justify-end gap-2 mt-4">
                                            <button
                                                type="button"
                                                onClick={closeCustomModal}
                                                className="px-6 py-2 rounded-lg text-gray-700 font-bold border border-gray-300 hover:bg-gray-200 transition duration-200"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-6 py-2 rounded-lg text-white font-bold bg-blue-600 hover:bg-blue-700 transition duration-200"
                                            >
                                                {editingId ? 'Actualizar' : 'Crear'}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div className="max-w-[1200px] mx-auto p-6 rounded-lg">
                        <motion.h1 
                            initial={{y: -50, opacity: 0 }} 
                            animate={{ y: 0,opacity: 1 }} 
                            exit={{ y: -50,opacity: 0 }} 
                            transition={{ duration: 0.3, delay: 0.1, type: 'spring', stiffness: 100 }} 
                            className="text-3xl font-bold mb-6 text-center text-gray-800"
                        >
                            Panel de Administración de Asesorías
                        </motion.h1>

                        <hr className="my-8" />
                        <p className="text-gray-600 text-sm mb-4"> {format(localUserTime, 'yyyy-MM-dd HH:mm:ss')}</p>
                        <motion.h2 
                            initial={{y: -50, opacity: 0 }} 
                            animate={{ y: 0,opacity: 1 }} 
                            exit={{ y: -50,opacity: 0 }} 
                            transition={{ duration: 0.3, delay: 0.1, type: 'spring', stiffness: 100 }} 
                            className="text-2xl font-bold mb-4 text-center text-gray-800"
                        >
                            Horarios Existentes
                        </motion.h2>
                        <div className="flex flex-col md:flex-row gap-4 pb-4">
                            {dayNames.map((day, index) => (
                                <motion.div 
                                    initial={{y: -100, opacity: 0 }} 
                                    animate={{ y: 0,opacity: 1 }} 
                                    exit={{ y: -100,opacity: 0 }} 
                                    transition={{ duration: 0.3, delay: index * 0.1, type: 'spring', stiffness: 100 }} 
                                    key={`${day.name}-${index}`} 
                                    className="flex-1 min-w-[100px] p-4"
                                >
                                    <div className="flex flex-col space-y-2 justify-between items-center mb-4">
                                        <div className="text-center">
                                            <h3 className="text-lg font-bold text-gray-700">{day.name}</h3>
                                            <p className="text-sm text-gray-500">
                                                {day.date} {day.month}
                                            </p>
                                        </div>
                                        <motion.button
                                            initial={{scale:1, opacity: 0 }} 
                                            animate={{ scale: 1,opacity: 1 }} 
                                            exit={{ scale: 1,opacity: 0 }} 
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            transition={{ duration: 0.2, type: 'spring', stiffness: 100 }} 
                                            onClick={() => openAddModal(day)}
                                            className="p-2 w-full flex justify-center items-center bg-blue-500 text-white hover:bg-blue-600 transition-colors mt-2 rounded-md cursor-pointer"
                                            aria-label={`Agregar horario para ${day.name}`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                        </motion.button>
                                    </div>
                                    {appointments && appointments.filter(appt => {
                                        const apptDate = new Date(appt.day);
                                        const targetDate = typeof day === 'string' ? new Date() : day.fullDate;
                                        const targetDay = typeof day === 'string' ? day : day.name;
                                        
                                        if (typeof day === 'string') {
                                            const apptDay = format(apptDate, 'EEEE', { locale: es }).toUpperCase();
                                            return apptDay === targetDay.toUpperCase();
                                        }
                                        
                                        return isSameDay(apptDate, targetDate);
                                    }).length === 0 ? (
                                        <p className="text-center text-gray-400 text-sm">No hay horarios.</p>
                                    ) : (
                                        <ul className="space-y-3">
                                            {appointments
                                                .filter(appt => {
                                                    const apptDate = new Date(appt.day);
                                                    const targetDate = typeof day === 'string' ? new Date() : day.fullDate;
                                                    const targetDay = typeof day === 'string' ? day : day.name;
                                                    
                                                    if (typeof day === 'string') {
                                                        const apptDay = apptDate.toLocaleDateString('es-ES', { weekday: 'long' }).toUpperCase();
                                                        return apptDay === targetDay.toUpperCase();
                                                    }
                                                    
                                                    return (
                                                        apptDate.getDate() === day.date &&
                                                        apptDate.getMonth() === targetDate.getMonth() &&
                                                        apptDate.getFullYear() === targetDate.getFullYear()
                                                    );
                                                })
                                                .map((appt, idx) => (
                                                    <li key={idx} className="bg-gray-200 text-black p-3 pb-6 rounded-md shadow-md relative">
                                                        <div className="flex justify-between items-center mt-2 mb-4">
                                                            <span className="font-medium text-center w-full">
                                                                {appt.start_time.split(':').slice(0, 2).join(':')} - {appt.end_time.split(':').slice(0, 2).join(':')}
                                                            </span>
                                                        </div>
                                                        <div className="w-full flex flex-col justify-between space-y-2 items-center text-sm">
                                                            <button
                                                                onClick={() => handleEdit(appt)}
                                                                className="text-blue-700 hover:text-blue-800 transition-colors cursor-pointer bg-blue-200 p-1 w-full rounded-sm"
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(appt.id)}
                                                                className="text-red-700 hover:text-red-800 transition-colors cursor-pointer bg-red-200 p-1 w-full rounded-sm"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                        <span className={twMerge(
                                                                'px-2 py-1 w-[100px] text-center text-xs rounded-full absolute top-1/1 left-1/2 translate-y-[-50%] translate-x-[-50%] shadow-md',
                                                                appt.status === 'disponible' && 'bg-green-100 text-green-800',
                                                                appt.status === 'reservado' && 'bg-yellow-100 text-yellow-800',
                                                                appt.status === 'completado' && 'bg-blue-100 text-blue-800',
                                                                appt.status === 'cancelado' && 'bg-red-100 text-red-800',
                                                                !['disponible', 'reservado', 'completado', 'cancelado'].includes(appt.status) && 'bg-gray-100 text-gray-800'
                                                            )}>
                                                                {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                                                            </span>
                                                    </li>
                                                ))}
                                        </ul>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmación para fechas pasadas */}
            <AnimatePresence>
                {showConfirmModal && (
                    <motion.div 
                        className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowConfirmModal(false)}
                    >
                        <motion.div 
                            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Fecha pasada</h3>
                            <p className="text-gray-600 mb-6">
                                No se puede crear un espacio de cita para una fecha pasada. 
                                ¿Deseas crear el espacio para el mismo día pero de la próxima semana?
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmCreateForNextWeek}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    Crear para la próxima semana
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function Reservation() {
    return <AdminApp />;
}
