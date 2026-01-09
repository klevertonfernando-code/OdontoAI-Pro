import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Appointment, Patient, ViewType, Notification, ClinicProfile } from '../types';

interface AgendaProps {
    patients: Patient[];
    appointments: Appointment[]; // Lifted state
    onAddAppointment: (apt: Appointment) => void;
    onUpdateAppointment: (apt: Appointment) => void;
    onNavigate: (view: ViewType) => void;
    onAddNotification: (n: Notification) => void;
    isReceptionist?: boolean;
    clinicSettings: ClinicProfile;
}

export const Agenda: React.FC<AgendaProps> = ({ 
    patients, 
    appointments, 
    onAddAppointment, 
    onUpdateAppointment,
    onNavigate, 
    onAddNotification, 
    isReceptionist,
    clinicSettings
}) => {
    const [viewMode, setViewMode] = useState<'day' | 'month'>('day');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    
    const [newApt, setNewApt] = useState<Partial<Appointment>>({
        time: '09:00',
        procedure: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [isNewPatient, setIsNewPatient] = useState(false);
    const [newPatientName, setNewPatientName] = useState('');

    const formattedDate = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(selectedDate);
    const selectedDateStr = selectedDate.toISOString().split('T')[0];

    const filteredAppointments = appointments.filter(a => a.date === selectedDateStr).sort((a,b) => a.time.localeCompare(b.time));

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
            case 'waiting': return 'bg-yellow-100 text-yellow-700 border-yellow-200 animate-pulse';
            case 'in_service': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'scheduled': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'completed': return 'bg-gray-200 text-gray-500 border-gray-300';
            case 'canceled': return 'bg-red-50 text-red-400 border-red-100';
            default: return 'bg-gray-50';
        }
    };

    const handlePatientSearch = (term: string) => {
        setSearchTerm(term);
        if (term.length > 0) {
            const found = patients.find(p => p.name.toLowerCase().includes(term.toLowerCase()));
            if (found) setSelectedPatient(found);
            else setSelectedPatient(null);
        }
    };

    const handleSaveAppointment = () => {
        const name = isNewPatient ? newPatientName : selectedPatient?.name;
        if (!name || !newApt.time || !newApt.procedure) return;

        const appointment: Appointment = {
            id: Date.now().toString(),
            patientId: !isNewPatient ? selectedPatient?.id : undefined,
            patientName: name,
            date: selectedDateStr,
            time: newApt.time!,
            procedure: newApt.procedure!,
            status: 'scheduled'
        };

        onAddAppointment(appointment);
        setShowModal(false);
        // Reset form
        setNewApt({ time: '09:00', procedure: '' });
        setSearchTerm('');
        setNewPatientName('');
        setIsNewPatient(false);
        setSelectedPatient(null);
    };

    const handleArrived = (apt: Appointment) => {
        onUpdateAppointment({ ...apt, status: 'waiting' });
        
        onAddNotification({
            id: Date.now().toString(),
            title: 'Paciente Chegou',
            message: `${apt.patientName} está aguardando na recepção.`,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            type: 'info'
        });
    };

    const handlePrint = () => {
        const printContent = document.getElementById('printable-agenda');
        if (printContent) {
            const win = window.open('', '', 'height=800,width=1000');
            if (win) {
                win.document.write('<html><head><title>Agenda Diária</title>');
                win.document.write('<script src="https://cdn.tailwindcss.com"></script>');
                win.document.write('</head><body class="bg-white p-8">');
                win.document.write(printContent.innerHTML);
                win.document.write('</body></html>');
                win.document.close();
                win.focus();
                setTimeout(() => {
                    win.print();
                    win.close();
                }, 1000);
            }
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn h-full flex flex-col">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Agenda Clínica</h2>
                    <p className="text-gray-500 capitalize">{formattedDate}</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-cobalt text-white rounded-lg hover:bg-blue-800 shadow-lg shadow-cobalt/20 flex items-center gap-2"
                    >
                        <i className="fa-solid fa-plus"></i> Novo
                    </button>
                    <button onClick={handlePrint} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"><i className="fa-solid fa-print"></i></button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Calendar Widget */}
                <Card className="h-fit">
                    <div className="text-center mb-4">
                        <h3 className="font-bold text-lg text-gray-700 capitalize">{new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(selectedDate)}</h3>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-sm">
                        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => <span key={d} className="font-bold text-gray-400 py-2">{d}</span>)}
                        {Array.from({length: 30}).map((_, i) => (
                            <button 
                                key={i} 
                                onClick={() => setSelectedDate(new Date(2024, selectedDate.getMonth(), i+1))}
                                className={`py-2 rounded-lg hover:bg-blue-50 ${i+1 === selectedDate.getDate() ? 'bg-cobalt text-white shadow-lg shadow-cobalt/30' : 'text-gray-700'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Appointments List */}
                <div className="lg:col-span-2 space-y-4">
                    {filteredAppointments.map((apt) => (
                        <div key={apt.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex justify-between items-center group relative overflow-hidden">
                            {/* Status Indicator Bar */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${apt.status === 'waiting' ? 'bg-yellow-400' : apt.status === 'confirmed' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            
                            <div className="flex items-center gap-6 pl-2">
                                <div className="text-center w-16">
                                    <p className="text-xl font-bold text-gray-800">{apt.time}</p>
                                    <p className="text-xs text-gray-500">Horário</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-gray-800">{apt.patientName}</h4>
                                    <p className="text-gray-500 text-sm">{apt.procedure}</p>
                                    {apt.status === 'waiting' && <span className="text-xs text-yellow-600 font-bold bg-yellow-50 px-2 py-0.5 rounded-full">Na Recepção</span>}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Receptionist Action: Mark Arrival */}
                                {(isReceptionist || !isReceptionist) && apt.status === 'scheduled' && (
                                    <button 
                                        onClick={() => handleArrived(apt)}
                                        className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-sm font-bold hover:bg-yellow-200"
                                    >
                                        <i className="fa-solid fa-bell mr-1"></i> Chegou
                                    </button>
                                )}

                                {/* Doctor Action: Open Record */}
                                {!isReceptionist && (
                                    <button 
                                        onClick={() => onNavigate(ViewType.PATIENT_RECORDS)} 
                                        className="w-10 h-10 rounded-full bg-blue-50 text-cobalt hover:bg-cobalt hover:text-white flex items-center justify-center transition-colors" 
                                        title="Abrir Prontuário"
                                    >
                                        <i className="fa-solid fa-folder-open"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {filteredAppointments.length === 0 && (
                         <div className="text-center py-20 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                            <i className="fa-solid fa-calendar-xmark text-4xl mb-4"></i>
                            <p>Sem consultas para este dia.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Hidden Printable Agenda */}
            <div id="printable-agenda" className="hidden">
                 <div className="max-w-[210mm] mx-auto">
                    <div className="flex justify-between items-center border-b-2 border-gray-800 pb-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center text-xl">
                                <i className="fa-solid fa-tooth"></i>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold uppercase">{clinicSettings.clinicName}</h1>
                                <p className="text-xs text-gray-600">{clinicSettings.address} | Tel: {clinicSettings.phone}</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <h2 className="text-xl font-bold">Agenda Diária</h2>
                             <p className="capitalize text-gray-600">{formattedDate}</p>
                        </div>
                    </div>

                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-300">
                                <th className="p-3 w-24">Horário</th>
                                <th className="p-3">Paciente</th>
                                <th className="p-3">Procedimento</th>
                                <th className="p-3 w-32">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.map((apt) => (
                                <tr key={apt.id} className="border-b border-gray-200">
                                    <td className="p-3 font-bold text-lg">{apt.time}</td>
                                    <td className="p-3 font-medium">{apt.patientName}</td>
                                    <td className="p-3 text-gray-600">{apt.procedure}</td>
                                    <td className="p-3">
                                        <span className="text-xs uppercase font-bold border px-2 py-1 rounded border-gray-300 text-gray-600">
                                            {apt.status === 'waiting' ? 'Na Recepção' : apt.status === 'scheduled' ? 'Agendado' : apt.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {filteredAppointments.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400 italic">Sem atendimentos agendados.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                 </div>
            </div>

            {/* Schedule Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scaleIn">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Novo Agendamento</h3>
                        
                        <div className="space-y-4">
                            {/* Patient Search / New */}
                            <div>
                                <div className="flex justify-between mb-1">
                                    <label className="text-sm font-bold text-gray-600">Paciente</label>
                                    <button 
                                        onClick={() => setIsNewPatient(!isNewPatient)} 
                                        className="text-xs text-cobalt underline"
                                    >
                                        {isNewPatient ? "Buscar Existente" : "Cadastrar Novo"}
                                    </button>
                                </div>
                                {isNewPatient ? (
                                    <input 
                                        type="text" 
                                        placeholder="Nome do Novo Paciente"
                                        className="w-full p-2 border rounded-lg"
                                        value={newPatientName}
                                        onChange={(e) => setNewPatientName(e.target.value)}
                                    />
                                ) : (
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            placeholder="Buscar por nome..."
                                            className="w-full p-2 border rounded-lg pr-8"
                                            value={searchTerm}
                                            onChange={(e) => handlePatientSearch(e.target.value)}
                                        />
                                        <i className="fa-solid fa-search absolute right-3 top-3 text-gray-400"></i>
                                        {selectedPatient && (
                                            <div className="mt-1 text-xs text-green-600 font-bold bg-green-50 p-1 rounded">
                                                <i className="fa-solid fa-check mr-1"></i> Selecionado: {selectedPatient.name}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Data</label>
                                    <input type="text" disabled value={selectedDate.toLocaleDateString('pt-BR')} className="w-full p-2 bg-gray-100 rounded-lg text-gray-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Hora</label>
                                    <input 
                                        type="time" 
                                        className="w-full p-2 border rounded-lg"
                                        value={newApt.time}
                                        onChange={(e) => setNewApt({...newApt, time: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Procedimento</label>
                                <input 
                                    type="text" 
                                    placeholder="Ex: Restauração, Limpeza..."
                                    className="w-full p-2 border rounded-lg"
                                    value={newApt.procedure}
                                    onChange={(e) => setNewApt({...newApt, procedure: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end mt-6">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Cancelar</button>
                            <button onClick={handleSaveAppointment} className="px-6 py-2 bg-cobalt text-white font-bold rounded-lg hover:bg-blue-800">Agendar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};