import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { TZDate } from "@date-fns/tz";
import { Button } from "@/components/ui/button";
import { apiClient } from '../api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

type TimeSlot = {
  id: number;
  start_time: string;
  end_time: string;
  day: string;
  status: string;
};

const ZONE = import.meta.env.VITE_ZONE_TIME || 'America/Caracas';

const WeeklySchedule = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedDate] = useState(new TZDate(new Date(), ZONE));
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

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

  useEffect(() => {
    fetchAvailableSlots();
  }, [selectedDate]);

  // Agrupar horarios por día
  const slotsByDay = timeSlots.reduce((acc, slot) => {
    const day = slot.day.split('T')[0];
    if (!acc[day]) acc[day] = [];
    acc[day].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  const weekDays = getWeekDays();

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
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Horarios Disponibles</h2>
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
                  className={`border rounded-lg overflow-hidden transition-colors ${
                    isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div 
                    className={`p-3 cursor-pointer ${
                      isSelected ? 'bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedDay(day)}
                  >
                    <h3 className="font-medium text-gray-900">
                      {format(day, 'EEEE', { locale: es })}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {format(day, 'd MMMM', { locale: es })}
                    </p>
                  </div>
                  
                  <AnimatePresence>
                    {isSelected && daySlots.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
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
