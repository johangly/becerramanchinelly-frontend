export interface AppointmentInterface {
  id: number;
  day: Date; // Ahora puede ser string o Date
  start_time: string;
  end_time: string;
  reservation: number;
  reservation_date: Date | null; // Ahora puede ser string o Date
  status: 'disponible' | 'reservado' | 'completado' | 'cancelado';
}
