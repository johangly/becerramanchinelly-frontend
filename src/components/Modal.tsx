import React from "react";
import {XCircle} from "lucide-react";
import {motion, AnimatePresence} from "motion/react"

interface ModalProps {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    children: React.ReactNode;
}

export default function Modal({
                                  setShowModal,
                                  title,
                                  children,
                              }: ModalProps) {
    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 flex flex-col items-center justify-center z-50 mt-12 overflow-y-scroll hidden-scrollbar"
                onClick={() => setShowModal(false)}
            >
                <motion.div
                    className="absolute inset-0 bg-black"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowModal(false)}
                />
                <motion.div
                    className="bg-white rounded-lg opacity-100 shadow-lg p-6 w-auto relative flex flex-col items-center"
                    initial={{scale: 0.95, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    exit={{scale: 0.95, opacity: 0}}
                    transition={{duration: 0.2}}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="w-full border-b border-gray-200 pb-2 relative flex opacity-100">
                        <h2 className="text-2xl font-semibold mb-4 text-center">
                            {title}
                        </h2>
                        <button
                            title="close"
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                            onClick={() => setShowModal(false)}
                        >
                            <XCircle size={20}/>
                        </button>
                    </div>
                    <div className="p-2 relative flex flex-col items-center">
                        {children}
                    </div>
            </motion.div>
                </motion.div>
        </AnimatePresence>
    );
}
