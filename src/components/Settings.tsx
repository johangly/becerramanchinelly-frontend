import {motion} from "motion/react";
import {useSettings} from "@/hooks/useSettings.tsx";
import {useState} from "react";
import {
    CreditCard,
    CheckCircle,
    XCircle,
    Mail,
    User,
    Phone,
    FileInputIcon,
    Settings,
    ChevronUp,
    ChevronDown
} from "lucide-react";
import Modal from "@/components/Modal.tsx";

export const SettingsAdmin = () => {
    const {
        allPaymentsMethods,
        loading,
        FetchChangeStatusPaymentMethod,
        showModal,
        setShowModal,
        allMeetingPlatforms,
        inputsRegisterPlatform,
        handleChange,
        formData,
        RegisterNewMeetingPlatform,
        FetchChangeStatusPlatform,
        allSettings,
        allCurrencies, valueOfCurrencyMain, handleSelectChange, changePhone, setValueOfPhone
    } = useSettings();
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        pagos: false,
        plataformas: false,
        monedas: false,
        telefono: false,
    });


    const toggleSection = (section: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <motion.div
                initial={{y: -100, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                className="max-w-7xl w-full mx-auto rounded-lg flex flex-col items-center bg-white dark:bg-gray-900 shadow-lg p-8"
            >
                {
                    showModal && (

                        <Modal setShowModal={setShowModal} title={'Registrar nueva plataforma'}>
                            <div className='max-w-md w-full mx-auto mb-4'>
                                {inputsRegisterPlatform.map((input) => {
                                    // Selecciona el icono según el tipo de input
                                    let IconComponent = FileInputIcon;
                                    if (input.type === "email") IconComponent = Mail;
                                    if (input.type === "text" && input.name.toLowerCase().includes("nombre")) IconComponent = User;
                                    if (input.type === "tel") IconComponent = Phone;

                                    return (
                                        <div key={input.name} className="mb-4">
                                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                                                   htmlFor={input.name}>
                                                {input.label}
                                            </label>
                                            <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500">
              <IconComponent size={18}/>
            </span>
                                                <input
                                                    type={input.type}
                                                    name={input.name}
                                                    placeholder={input.placeholder}
                                                    value={formData[input.name as keyof typeof formData] || ''}
                                                    onChange={handleChange}
                                                    className="pl-10 pr-3 py-2 w-full rounded border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                                <button
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
                                    onClick={() => RegisterNewMeetingPlatform()}
                                >
                                    Registrar plataforma
                                </button>
                            </div>
                        </Modal>
                    )
                }
                <h2 className="text-4xl font-bold text-blue-700 dark:text-blue-300 mb-6 flex items-center gap-2">
                    <Settings className="text-blue-500"/>
                    Configuraciones del sistema
                </h2>
                <div className="w-full">
                    <div className="flex justify-between items-center mb-4">
                        <span
                            className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                            Métodos de pago disponibles
                        </span>
                        <button
                            onClick={() => toggleSection("pagos")}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
                            title={openSections.pagos ? "Cerrar" : "Abrir"}
                        >
                            {openSections.pagos ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                        </button>
                    </div>
                    <div
                        className={`transition-all duration-500 overflow-hidden ${openSections.pagos ? 'max-h-0' : 'max-h-screen'} mb-4`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {allPaymentsMethods?.data?.map((method) => (
                                <div
                                    key={method.id}
                                    className="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-gray-800 p-5 rounded-lg shadow flex flex-col gap-2"
                                >
                                    <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                                        <CreditCard size={20}/>
                                        {method.name}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">{method.description}</p>
                                    <div className="flex items-center gap-2">
                                        {method.is_active ? (
                                            <>
                                                <CheckCircle className="text-green-500" size={18}/>
                                                <span className="text-green-700 font-medium">Activo</span>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="text-red-500" size={18}/>
                                                <span className="text-red-700 font-medium">Inactivo</span>
                                            </>
                                        )}
                                    </div>
                                    <button
                                        className={`mt-3 px-4 py-2 rounded text-white transition ${method.is_active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                                        onClick={(e) =>
                                            (
                                                e.stopPropagation(),
                                                    FetchChangeStatusPaymentMethod(
                                                        method.id,
                                                        method.is_active
                                                    )
                                            )}
                                    >
                                        {method.is_active ? "Desactivar" : "Activar"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <div className="flex justify-between items-center mb-4">
                        <span
                            className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                            Plataformas de reuniones disponibles
                        </span>
                        <button
                            onClick={() => toggleSection("plataformas")}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
                            title={openSections.pagos ? "Cerrar" : "Abrir"}
                        >
                            {openSections.pagos ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                        </button>
                    </div>
                    <div
                        className={`transition-all duration-500 overflow-hidden ${openSections.plataformas ? 'max-h-0' : 'max-h-screen'} mb-4`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {
                                allMeetingPlatforms?.MeetingPlatforms?.map((platform) => (
                                    <div
                                        key={platform.id}
                                        className="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-gray-800 p-5 rounded-lg shadow flex flex-col gap-2"
                                    >
                                        <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                                            {platform.name}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">{platform.description}</p>
                                        <div className="flex items-center gap-2">
                                            {platform.is_active ? (
                                                <>
                                                    <CheckCircle className="text-green-500" size={18}/>
                                                    <span className="text-green-700 font-medium">Activo</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="text-red-500" size={18}/>
                                                    <span className="text-red-700 font-medium">Inactivo</span>
                                                </>
                                            )}
                                        </div>
                                        <button
                                            className={`mt-3 px-4 py-2 rounded text-white transition ${platform.is_active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                                            onClick={(e) =>
                                                (
                                                    e.stopPropagation(),
                                                        FetchChangeStatusPlatform(
                                                            platform.id,
                                                            platform.is_active
                                                        )
                                                )}
                                        >
                                            {platform.is_active ? "Desactivar" : "Activar"}
                                        </button>
                                    </div>
                                ))
                            }
                        </div>
                        <button
                            className="
                                bg-blue-400 hover:bg-blue-500
                                text-white
                                font-semibold
                                py-2
                                px-4
                                rounded
                                mt-4
                            "
                            onClick={() => setShowModal(true)}
                        >
                            Registrar nueva plataforma
                        </button>
                    </div>


                </div>
                <div className="w-full">
                    <div className="flex justify-between items-center mb-4">
                        <span
                            className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                            Selecciona la moneda del Sistema
                        </span>
                        <button
                            onClick={() => toggleSection("monedas")}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
                            title={openSections.monedas ? "Cerrar" : "Abrir"}
                        >
                            {openSections.monedas ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                        </button>
                    </div>
                    <div
                        className={`transition-all duration-500 overflow-hidden ${openSections.monedas ? 'max-h-0' : 'max-h-screen'} mb-4`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div
                                className="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-gray-800 p-5 rounded-lg shadow flex flex-col gap-2">
                                <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                                    {allSettings?.configs?.find(set => set.key === 'currency')?.value}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="text-green-500" size={18}/>
                                    <span className="text-green-700 font-medium">Moneda actual</span>
                                </div>
                            </div>
                            <div
                                className="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-gray-800 p-5 rounded-lg shadow flex flex-col gap-2"
                            >
                                <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                                    Cambia la moneda del sistema
                                </h3>
                                <select
                                    className="w-full p-2 rounded-md bg-white"
                                    onChange={handleSelectChange}
                                    value={valueOfCurrencyMain ?? ''}
                                >

                                    {allCurrencies?.currencies?.map((item) => (
                                        <option
                                            value={item.code}
                                        >
                                            {item.name} - {item.code}
                                        </option>
                                    ))

                                    }
                                </select>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="w-full">
                    <div className="flex justify-between items-center mb-4">
                        <span
                            className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                            Telefono del sistema
                        </span>
                        <button
                            onClick={() => toggleSection("telefono")}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
                            title={openSections.telefono ? "Cerrar" : "Abrir"}
                        >
                            {openSections.telefono ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                        </button>
                    </div>
                    <div
                        className={`transition-all duration-500 overflow-hidden ${openSections.telefono ? 'max-h-0' : 'max-h-screen'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div
                                className="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-gray-800 p-5 rounded-lg shadow flex flex-col gap-2">
                                <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                                    {allSettings?.configs?.find(set => set.key === 'phone')?.value}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="text-green-500" size={18}/>
                                    <span className="text-green-700 font-medium">Teléfono actual</span>
                                </div>
                            </div>
                            <div
                                className="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-gray-800 p-5 rounded-lg shadow flex flex-col gap-2"
                            >
                                <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                                    Cambia el telefono del sistema
                                </h3>
                                <input
                                    onChange={(e) => setValueOfPhone(e.target.value)}
                                    className="w-full p-2 rounded-md bg-white"
                                    placeholder="Nuevo telefono"
                                    type='number'
                                />
                                <button
                                    className="w-full p-2 rounded-md bg-[#1e1e1e] text-white hover:bg-gray-800 transition mt-2"
                                    onClick={
                                        changePhone}
                                >
                                    Enviar
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </motion.div>
        </div>
    );
};
