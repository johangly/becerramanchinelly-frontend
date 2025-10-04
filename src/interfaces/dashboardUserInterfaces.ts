interface Appointment {
    id: number;
    createdAt: string;
    updatedAt: string;
    day: string;
    start_time: string;
    end_time: string;
    price: string;
    status: string;
    isDeleted: boolean;
    reservation: any;
    reservation_date: string | null;
    currency_id: number | null;
    meetingPlatformId: number | null;
    meeting_link: string | null;
}

export interface PaymentOfUser {
    id: number;
    user_id: number;
    appointment_id: number;
    paymentMethodId: number;
    amount: string;
    currency: string;
    status: string;
    transactionDate: string;
    createdAt: string;
    updatedAt: string;
    client_name: string;
    client_email: string;
    client_phone: string;
    notes: string;
    reference: string;
    is_approved: boolean | null;
    payment_method_id: number | null;
    Appointment: Appointment;
}

export interface AppointmentsByUserApiResponse {
    status: string;
    paymentsOfUser: PaymentOfUser[];
}