export interface AppointmentInterface {
  id: number;
  day: Date; // Ahora puede ser string o Date
  start_time: string;
  end_time: string;
  reservation: number;
  reservation_date: Date | null; // Ahora puede ser string o Date
  status: 'disponible' | 'reservado' | 'completado' | 'cancelado';
  isDeleted: boolean;
}

export interface DayInfo {
    name: string;       // Ejemplo: "LUNES", "MARTES", etc.
    date: number;       // Día del mes (1-31)
    month: string;      // Mes en formato corto en mayúsculas (ej. "ENE", "FEB", etc.)
    fullDate: Date;     // Objeto Date completo con la fecha
}