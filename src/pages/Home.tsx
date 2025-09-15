
import { motion } from 'framer-motion';
import WeeklySchedule from '@/components/WeeklySchedule';
import type { AppointmentInterface } from '@/types';

export const Home = ({ goToNextStep }: { goToNextStep: (appointmentData: AppointmentInterface, step: number) => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Bienvenido a Becerra Manchinelly
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Selecciona un horario disponible para tu cita
          </p>
        </div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white shadow-xl rounded-lg overflow-hidden"
        >
          <WeeklySchedule goToNextStep={goToNextStep} />
        </motion.div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>¿Necesitas ayuda? Contáctanos al +58 412-XXX-XXXX</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
