import { AnimatePresence, motion } from "motion/react"
import { SquareChartGantt, X } from "lucide-react"
import { Moon, Sun, Bell, CheckCircle, XCircle, AlertTriangle, Info, Eye } from "lucide-react"
import { useTheme } from "../contexts/ThemeContext"
import { useEffect, useState } from "react"
import type { Notification } from "../types/notifications"

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { TZDate } from "react-day-picker"
import { apiClient } from "@/api"

const ZONE = import.meta.env.VITE_ZONE_TIME || 'America/Caracas';

// Datos simulados de notificaciones basados en el modelo
// const mockNotifications: Notification[] = [
//     // Notificación de éxito (pago recibido)
//     {
//         id: 1,
//         title: 'Pago Recibido',
//         body: 'Se ha recibido un pago por $1,500.00 MXN',
//         type: 'success',
//         seen: false,
//         user_id: 1,
//         payment_id: 123,
//         createdAt: new Date('2025-09-22T10:30:00'),
//         updatedAt: new Date('2025-09-22T10:30:00')
//     },
//     // Notificación informativa (cita próxima)
//     {
//         id: 2,
//         title: 'Cita Próxima',
//         body: 'Tienes una cita programada para mañana a las 10:00 AM con el Dr. Pérez',
//         type: 'info',
//         seen: false,
//         user_id: 1,
//         payment_id: null,
//         createdAt: new Date('2025-09-22T09:15:00'),
//         updatedAt: new Date('2025-09-22T09:15:00')
//     },
//     // Notificación de advertencia (recordatorio de pago)
//     {
//         id: 3,
//         title: 'Recordatorio de Pago',
//         body: 'Recuerda realizar el pago de tu próxima cita antes del 25 de Septiembre',
//         type: 'warning',
//         seen: true,
//         user_id: 1,
//         payment_id: 456,
//         createdAt: new Date('2025-09-21T16:45:00'),
//         updatedAt: new Date('2025-09-21T16:45:00')
//     },
//     // Notificación de error (pago fallido)
//     {
//         id: 4,
//         title: 'Pago Fallido',
//         body: 'Hubo un error al procesar tu pago. Por favor, verifica los datos de tu tarjeta',
//         type: 'error',
//         seen: false,
//         user_id: 1,
//         payment_id: 789,
//         createdAt: new Date('2025-09-21T14:20:00'),
//         updatedAt: new Date('2025-09-21T14:20:00')
//     },
//     // Otro tipo de notificación
//     {
//         id: 5,
//         title: 'Nuevo Mensaje',
//         body: 'Tienes un nuevo mensaje en el sistema. Por favor, revisa tu bandeja de entrada',
//         type: 'other',
//         seen: true,
//         user_id: 1,
//         payment_id: null,
//         createdAt: new Date('2025-09-20T18:30:00'),
//         updatedAt: new Date('2025-09-20T18:30:00')
//     },
//     // Notificación de confirmación
//     {
//         id: 6,
//         title: 'Cita Confirmada',
//         body: 'Tu cita para el 25 de Septiembre a las 15:00 ha sido confirmada exitosamente',
//         type: 'success',
//         seen: false,
//         user_id: 1,
//         payment_id: null,
//         createdAt: new Date('2025-09-20T11:10:00'),
//         updatedAt: new Date('2025-09-20T11:10:00')
//     }
// ];

function LayoutHeader({ session }: { session: any }) {
    const { isDark, toggleTheme } = useTheme();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const unreadCount = notifications.filter((n: Notification) => !n.seen).length;
    const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
    // const [loading, setLoading] = useState(true);
    console.log('desde notificaciones')

    function handleSelectNotification(notification:Notification) {
        setSelectedNotification(notification);
        setNotificationsDropdownOpen(true);
        setShowNotificationModal(true);
    }

    function handleCloseNotificationModal() {
        setShowNotificationModal(false);
        setSelectedNotification(null);
    }

    useEffect(() => {

        const fetchNotifications = async () => {
            if (session?.user?.id) {
                try {
                    // setLoading(true);
                    const response = await apiClient.get(`/notifications/${session.user.id}`);
                    console.log('response.data:', response.data);
                    if (response.data && response.data.notifications) {
                        setNotifications(response.data.notifications);

                    }
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                } finally {
                    // setLoading(false);
                }
            }
        };

        fetchNotifications();
    }, [session?.user?.id]);
    
    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="mx-auto px-4 sm:px-6 lg:px-6">
                <div className="flex items-center justify-between h-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center space-x-3"
                    >
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <SquareChartGantt className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                Gestión de Asesorías
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Sistema de gestión de asesorías
                            </p>
                        </div>
                    </motion.div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center">
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="sign-in-button">Iniciar Sesión</button>
                                </SignInButton>
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                        <DropdownMenu open={notificationsDropdownOpen} onOpenChange={setNotificationsDropdownOpen}>
                            <DropdownMenuTrigger>
                                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors relative">
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-[35%] inline-flex items-center justify-center px-1 py-1 min-w-6 min-h-6 text-xs font-medium text-white bg-red-500 rounded-full">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                            onPointerDownOutside={(e) => {
                                console.log('onPointerDownOutside')
                             }}
                             onFocusOutside={(e) => {
                                console.log('onFocusOutside')
                             }}
                             onInteractOutside={(e) => {
                                // Aquí puedes agregar lógica condicional
                                if (selectedNotification === null && !showNotificationModal) {
                                    setNotificationsDropdownOpen(false);
                                } else {
                                    e.preventDefault();
                                }
                            }}
                             className="dark:bg-gray-800 p-0 min-w-[300px] w-full max-w-[400px] border-gray-200 dark:border-gray-700 max-h-[400px] relative" align="end" side="bottom">
                                <DropdownMenuLabel className="flex justify-between items-center sticky top-0 z-10 w-full bg-gray-100 dark:bg-gray-700 px-2 py-1.5">
                                    <span>Notificaciones</span>
                                    <div>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                                    <Eye className="w-5 h-5" />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="dark:text-gray-800 text-gray-100">Marcar todas como leídas</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </DropdownMenuLabel>
                                <div className="p-1.5 space-y-1.5">
                                    {notifications.length > 0 ? notifications.map((notification) => (
                                        <NotificationItem key={notification.id} notification={notification} openModal={handleSelectNotification}/>
                                    )) : (
                                        <div className="p-2">
                                            <p className="text-gray-500 text-center">No hay notificaciones pendientes</p>
                                        </div>
                                    )}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </motion.button>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {showNotificationModal && (
                    <motion.div className="fixed inset-0 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNotificationModal(false)} className='fixed backdrop-blur-xs inset-0 bg-gray-600/50 h-full w-full'>

                        </motion.div>
                        <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="relative p-6 bg-white border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800 rounded-lg max-w-lg w-full">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Notificación</h2>
                                <button onClick={() => handleCloseNotificationModal()} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="mt-4">
                                <p className="text-gray-600 dark:text-gray-300">{selectedNotification?.body}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

export { LayoutHeader }

// Función para obtener el ícono según el tipo de notificación
const getNotificationIcon = (type: Notification['type']) => {
    const iconClass = 'w-4 h-4';
    switch (type) {
        case 'success':
            return <CheckCircle className={`${iconClass} text-green-500`} />;
        case 'error':
            return <XCircle className={`${iconClass} text-red-500`} />;
        case 'warning':
            return <AlertTriangle className={`${iconClass} text-yellow-500`} />;
        case 'info':
            return <Info className={`${iconClass} text-blue-500`} />;
        default:
            return <Bell className={`${iconClass} text-gray-500`} />;
    }
};

// Función para formatear la fecha de forma relativa (ej: "hace 5 minutos")
const formatRelativeTime = (dateString: string | Date) => {
    // Asegurarnos de que tengamos un objeto Date
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
        console.error('Fecha inválida:', dateString);
        return 'Fecha inválida';
    }

    const now = new TZDate(new Date(), ZONE);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Ahora';
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)} d`;

    // Usar toLocaleDateString con la zona horaria correcta
    return new TZDate(date, ZONE).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

function NotificationItem({ notification, openModal }: { notification: Notification, openModal: (notification: Notification) => void }) {
    return (
        <DropdownMenuItem
            className={`relative flex items-start p-3 space-x-3 cursor-pointer bg-gray-100 dark:bg-gray-700/40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${!notification.seen ? 'bg-blue-50 dark:bg-blue-900/40' : ''}`}
            onClick={() => {
                // Marcar como leída al hacer clic
                // Aquí iría la lógica para actualizar el estado
                openModal(notification);
            }}
        >
            <div className="flex-shrink-0 mt-0.5">
                <div className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700">
                    {getNotificationIcon(notification.type)}
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-medium ${!notification.seen ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                        {notification.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                        {formatRelativeTime(notification.createdAt)}
                    </span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 text-wrap break-words">
                    {notification.body}
                </p>
                {notification.payment_id && (
                    <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Pago #{notification.payment_id}
                        </span>
                    </div>
                )}
            </div>
            {!notification.seen && (
                <div className="absolute right-3 top-3 w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
        </DropdownMenuItem>
    )
}