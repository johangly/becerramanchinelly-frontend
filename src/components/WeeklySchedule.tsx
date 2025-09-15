import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { TZDate } from "@date-fns/tz";
import { Button } from "@/components/ui/button";
import { apiClient } from '../api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import type { DayInfo, AppointmentInterface } from '@/types';
import { set } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import {CalendarDays, ChevronDown, ChevronUp } from 'lucide-react'

type TimeSlot = {
    id: number;
    start_time: string;
    end_time: string;
    day: string;
    status: string;
};

const ZONE = import.meta.env.VITE_ZONE_TIME || 'America/Caracas';


const WeeklySchedule = ({ goToNextStep }: { goToNextStep: (appointmentData: AppointmentInterface, step: number) => void }) => {
const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedDate] = useState(new TZDate(new Date(), ZONE));
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<DayInfo | null>(null);
  const [dayNames, setDayNames] = useState<DayInfo[]>([]);
  const [appointments, setAppointments] = useState<AppointmentInterface[]>([]);

  // Obtener la semana actual (lunes a sábado)
  const getWeekDays = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Lunes
    return Array.from({ length: 6 }, (_, i) => addDays(start, i));
  };

  // Obtener los horarios disponibles
  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      const startDate = format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      const endDate = format(addDays(new Date(startDate), 5), 'yyyy-MM-dd');
      
      const response = await apiClient.get(`/appointments?startDate=${startDate}&endDate=${endDate}`);
      
      if (response.data && Array.isArray(response.data)) {
        setTimeSlots(response.data);
      }
    } catch (error) {
      console.error('Error al obtener los horarios:', error);
      toast.error('Error al cargar los horarios disponibles');
    } finally {
      setLoading(false);
    }
  };

  // Manejar la reserva de un horario
  const handleReservation = async (slotId: number) => {
    try {
      toast.success('Redirigiendo al formulario de reserva...');
      // Ejemplo: navigate(`/reservar/${slotId}`);
    } catch (error) {
      console.error('Error al procesar la reserva:', error);
      toast.error('Error al procesar la reserva');
    }
  };

 

  // Agrupar citas por día
  const appointmentsByDay = appointments.reduce<Record<string, AppointmentInterface[]>>((acc, appointment) => {
    if (appointment.isDeleted) return acc;
    
    const apptDate = new Date(appointment.day);
    const dayKey = format(apptDate, 'yyyy-MM-dd');
    
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
  useEffect(() => {
    // fetchAvailableSlots();
    setDayNames(getCurrentWeekDates());
    const fetchAppointments = async () => {
      try {
          const startDate = dayNames[0]?.fullDate;
          const endDate = dayNames[dayNames.length - 1]?.fullDate;
          
          const response = await apiClient.get('/appointments', {
              params: {
                  startDate: startDate?.toISOString(),
                  endDate: endDate?.toISOString()
              }
          });
          if(response.statusText === 'OK'){
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
            <div className="rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-[#ffffff] text-cent">
                    <h2 className="text-4xl text-center text-[#1e1e1e]">Horarios Disponibles</h2>
                </div>

                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {weekDays.map((day) => {
                            const dayKey = format(day, 'yyyy-MM-dd');
                            const daySlots = slotsByDay[dayKey] || [];
                            const isSelected = selectedDay && isSameDay(day, selectedDay);

                            return (
                                <div
                                    key={dayKey}
                                    className={`h-20 bg-[#ffffff] border rounded-lg overflow-hidden transition-colors ${
                                        isSelected ? 'border-[#bd9554] shadow-sm shadow-[#bd9554]' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div
                                        className={`text-[#1e1e1e] flex cursor-pointer ${
                                            isSelected ? 'bg-gray-100' : 'hover:opacity-70'
                                        }`}
                                        onClick={() => setSelectedDay(day)}
                                    >
                                        <div className='bg-[#bd9554]  w-20 h-20 flex items-center justify-center'>
                                            <CalendarDays color='#ffffff' size={48}/>
                                        </div>
                                        <div
                                            className='py-4 px-2 text-xl flex w-full justify-beetwen w-full items-center'>
                                            <div className='w-1/2'>
                                                <h3 className="font-medium">
                                                    {format(day, 'EEEE', {locale: es}).toUpperCase()}
                                                </h3>
                                                <p className="text-sm text-[#1e1e1e]            ">
                                                    {format(day, 'd MMMM', {locale: es})}
                                                </p>
                                            </div>
                                            <div className='w-1/2'>
                                                {daySlots.length > 0 ? (
                                                    <span className="text-sm font-medium text-green-600">
                                                        {daySlots.length} {daySlots.length === 1 ? 'cita disponible' : 'citas disponibles'}
                                                        {isSelected ? <ChevronUp className='inline ml-2'/> : <ChevronDown className='inline ml-2'/>}
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
                                        {isSelected && daySlots.length > 0 && (
                                            <motion.div
                                                initial={{opacity: 0, height: 0}}
                                                animate={{opacity: 1, height: 'auto'}}
                                                exit={{opacity: 0, height: 0}}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-3 space-y-2">
                                                    {daySlots.map((slot) => (
                                                        <div
                                                            key={slot.id}
                                                            className="flex items-center justify-between p-2 bg-white border rounded-md hover:bg-gray-50"
                                                        >
                              <span className="text-sm font-medium">
                                {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                              </span>
                                                            <Button
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleReservation(slot.id);
                                                                }}
                                                                className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1 h-7"
                                                            >
                                                                Reservar
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {isSelected && daySlots.length === 0 && (
                                        <div className="p-3 text-sm text-gray-500 bg-white">
                                            No hay horarios disponibles para este día.
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
