
import { motion } from 'framer-motion';
import WeeklySchedule from '@/components/WeeklySchedule';

export const Home = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-white py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#1e1e1e] sm:text-4xl">
              Bienvenido a <span className='text-[#bd9554]'>Becerra Manchinelly</span>
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
          <WeeklySchedule />
        </motion.div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>¿Necesitas ayuda? Contáctanos al +58 412-XXX-XXXX</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
