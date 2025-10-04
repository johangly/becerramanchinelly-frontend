import {useSettings} from "@/hooks/useSettings.tsx";
import {useSelectPlatform} from "@/hooks/useSelectPlatform.tsx";

export const SelectPlatfomOfAppointment = () => {
    const {allMeetingPlatforms}=useSettings()
    const {handleSubmitPlatform}=useSelectPlatform()
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {!allMeetingPlatforms ? <div>Cargando plataformas de reunión...</div> :
                allMeetingPlatforms.MeetingPlatforms.length === 0 ? <div>No hay plataformas de reunión disponibles.</div> :
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h1 className="text-2xl font-bold mb-6 text-center">Selecciona una plataforma de reunión</h1>
                        <ul className="space-y-4">
                            {allMeetingPlatforms.MeetingPlatforms.filter(met=>met.is_active === true ).map((platform) => (
                                <button key={platform.id} className="border p-4 rounded hover:bg-gray-50 cursor-pointer" value={platform.id} onClick={(e) => handleSubmitPlatform(e,platform.id)}>
                                    <h2 className="text-xl font-semibold">{platform.name}</h2>
                                    <p className="text-gray-600">{platform.description}</p>
                                </button>
                            ))}
                        </ul>
                    </div>


            }
        </div>
    );
};
