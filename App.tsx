import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { VisionDiagnostic } from './components/VisionDiagnostic';
import { LabAnalyzer } from './components/LabAnalyzer';
import { PatientRecords } from './components/PatientRecords';
import { VoiceStudyHub } from './components/VoiceStudyHub';
import { PatientSimulator } from './components/PatientSimulator';
import { SalesEngine } from './components/SalesEngine';
import { Anamnesis } from './components/Anamnesis';
import { Agenda } from './components/Agenda';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { ViewType, Patient, LabData, Notification, User, Appointment, ClinicProfile } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import { MOCK_PATIENTS } from './constants';

// Internal component for dashboard navigation cards
const DashboardCard = ({ icon, label, onClick }: { icon: string, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-cobalt transition-all group flex flex-col items-center gap-3 h-40 justify-center"
  >
    <div className="w-14 h-14 bg-blue-50 text-cobalt rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-sm">
      <i className={`fa-solid ${icon}`}></i>
    </div>
    <span className="font-bold text-gray-700 group-hover:text-cobalt text-sm uppercase tracking-wide text-center">{label}</span>
  </button>
);

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // App Data State
  // Initialize empty or with mock data if preferred. 
  // We start empty to demonstrate the "Create Central Account" feature if desired, 
  // OR we can keep the mock users but allow adding more.
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Dr. Silva (Admin)', role: 'ADMIN', email: 'admin@odontoai.com', pin: '1234' },
    { id: '2', name: 'Recepção', role: 'RECEPTIONIST', email: 'recepcao@odontoai.com', pin: '0000' }
  ]);
  
  const [clinicSettings, setClinicSettings] = useState<ClinicProfile>({
    clinicName: 'Clínica OdontoAI Pro',
    mainDoctorName: 'Dr. Silva',
    cro: 'CRO/SP 12345',
    address: 'Av. Paulista, 1000 - São Paulo/SP',
    phone: '(11) 99999-8888',
    primaryColor: '#0047AB'
  });

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', patientId: '1', patientName: 'Ana Silva', date: new Date().toISOString().split('T')[0], time: '09:00', procedure: 'Restauração 46', status: 'confirmed' },
  ]);

  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS.map(p => ({ ...p, labAnalyses: [] })));

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Handlers ---

  const handleSetupAdmin = (user: User) => {
      setUsers([user]);
      setCurrentUser(user);
      setCurrentView(ViewType.DASHBOARD);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'RECEPTIONIST') {
        setCurrentView(ViewType.AGENDA);
    } else {
        setCurrentView(ViewType.DASHBOARD);
    }
  }

  const handleLogout = () => {
    setCurrentUser(null);
  }

  const handleAddUser = (user: User) => {
    setUsers([...users, user]);
  }

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  }

  // --- Notification Logic ---
  const notifyAdmin = (title: string, message: string) => {
     // If the current user is NOT admin, we create a notification that the Admin will see when they login/check dashboard
     const newNotif: Notification = {
         id: Date.now().toString(),
         title: title,
         message: message,
         time: new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
         type: 'info'
     };
     setNotifications(prev => [newNotif, ...prev]);
  };

  const handleAddPatient = (newPatient: Patient) => {
    setPatients([newPatient, ...patients]);
    
    // Logic: If Receptionist adds patient, notify Admin
    if (currentUser?.role === 'RECEPTIONIST') {
        notifyAdmin('Novo Paciente Cadastrado', `Recepção cadastrou ${newPatient.name}.`);
        alert("Pré-cadastro realizado! O Doutor foi notificado.");
        setCurrentView(ViewType.AGENDA);
    } else if (currentUser?.role === 'DOCTOR') {
        // Integrated Doctor added patient
        notifyAdmin('Paciente Cadastrado', `${currentUser.name} cadastrou ${newPatient.name}.`);
        setCurrentView(ViewType.PATIENT_RECORDS);
    } else {
        // Admin added
        setCurrentView(ViewType.PATIENT_RECORDS);
    }
  };

  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatients(patients.map(p => p.id === updatedPatient.id ? updatedPatient : p));
  };

  const handleAddAppointment = (apt: Appointment) => {
    setAppointments([...appointments, apt]);
    if (currentUser?.role !== 'ADMIN') {
        notifyAdmin('Novo Agendamento', `${currentUser?.name} agendou ${apt.patientName} para ${apt.time}.`);
    }
  }

  const handleUpdateAppointment = (apt: Appointment) => {
    setAppointments(appointments.map(a => a.id === apt.id ? apt : a));
    // Check if status changed to waiting (Receptionist action)
    if (apt.status === 'waiting' && currentUser?.role === 'RECEPTIONIST') {
        notifyAdmin('Paciente na Recepção', `${apt.patientName} chegou para atendimento.`);
    }
  }

  const handleSaveImageToRecord = (patientId: string, imageUrl: string, analysis: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      handleUpdatePatient({
        ...patient,
        images: [{ id: Date.now().toString(), date: new Date().toLocaleDateString('pt-BR'), imageUrl, analysis }, ...patient.images]
      });
      if (currentUser?.role === 'DOCTOR') {
          notifyAdmin('Exame Adicionado', `${currentUser.name} salvou uma análise de imagem para ${patient.name}.`);
      }
    }
  };

  const handleSaveLabToRecord = (patientId: string, labData: LabData, analysis: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      handleUpdatePatient({
        ...patient,
        labAnalyses: [{ id: Date.now().toString(), date: new Date().toLocaleDateString('pt-BR'), rawValues: labData, summary: analysis }, ...(patient.labAnalyses || [])]
      });
    }
  };

  const handleAddNotification = (n: Notification) => setNotifications(prev => [n, ...prev]);
  const removeNotification = (id: string) => setNotifications(notifications.filter(n => n.id !== id));

  if (!currentUser) {
    return <Login users={users} onLogin={handleLogin} onSetupAdmin={handleSetupAdmin} />;
  }

  const renderContent = () => {
    // Shared Props
    const agendaProps = {
        patients,
        appointments,
        onAddAppointment: handleAddAppointment,
        onUpdateAppointment: handleUpdateAppointment,
        onNavigate: setCurrentView,
        onAddNotification: handleAddNotification,
        clinicSettings
    };

    if (currentUser.role === 'RECEPTIONIST') {
        // Limited View for Receptionist
        if (currentView === ViewType.ANAMNESIS) {
             return <Anamnesis onSavePatient={handleAddPatient} currentUser={currentUser.name} />;
        }
        // Default to Agenda
        return <Agenda {...agendaProps} isReceptionist={true} />;
    }

    switch (currentView) {
      case ViewType.AGENDA:
        return <Agenda {...agendaProps} />;
      case ViewType.ANAMNESIS: 
        return <Anamnesis onSavePatient={handleAddPatient} currentUser={currentUser.name} />;
      case ViewType.VISION_DIAGNOSTIC: 
        return <VisionDiagnostic patients={patients} onSaveToRecord={handleSaveImageToRecord} />;
      case ViewType.LAB_ANALYZER: 
        return <LabAnalyzer patients={patients} onSaveToRecord={handleSaveLabToRecord} />;
      case ViewType.PATIENT_RECORDS: 
        return <PatientRecords patients={patients} onUpdatePatient={handleUpdatePatient} clinicSettings={clinicSettings} />;
      case ViewType.VOICE_STUDY: 
        return <VoiceStudyHub />;
      case ViewType.SIMULATOR: 
        return <PatientSimulator />;
      case ViewType.SALES_ENGINE: 
        return <SalesEngine />;
      case ViewType.SETTINGS:
        return <Settings 
            clinicProfile={clinicSettings} 
            onUpdateProfile={setClinicSettings}
            users={users}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
            currentUserRole={currentUser.role}
        />;
      default:
        return (
          <div className="text-center mt-10 animate-fadeIn">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Olá, {currentUser.name}</h2>
            <p className="text-gray-500 mb-8">{clinicSettings.clinicName}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-5xl mx-auto">
                <DashboardCard icon="fa-calendar-days" label="Agenda do Dia" onClick={() => setCurrentView(ViewType.AGENDA)} />
                <DashboardCard icon="fa-clipboard-user" label="Nova Anamnese" onClick={() => setCurrentView(ViewType.ANAMNESIS)} />
                <DashboardCard icon="fa-eye" label="Diagnóstico RX" onClick={() => setCurrentView(ViewType.VISION_DIAGNOSTIC)} />
                <DashboardCard icon="fa-comments-dollar" label="Smart Sales" onClick={() => setCurrentView(ViewType.SALES_ENGINE)} />
            </div>

            {/* Notifications Panel - Only Admin/Main Doctor sees alerts from others */}
            {currentUser.role === 'ADMIN' && notifications.length > 0 && (
                <div className="max-w-md mx-auto mt-12 text-left bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-slideUp">
                    <div className="flex justify-between items-center mb-3 border-b pb-2">
                         <h3 className="text-sm font-bold text-gray-400 uppercase">Central de Notificações</h3>
                         <button onClick={() => setNotifications([])} className="text-xs text-cobalt hover:underline">Limpar tudo</button>
                    </div>
                    {notifications.map(n => (
                        <div key={n.id} className="flex justify-between items-start mb-3 last:mb-0 border-l-2 border-cobalt pl-3 py-1 hover:bg-gray-50 rounded-r transition-colors">
                            <div>
                                <p className="font-bold text-gray-800 text-sm">{n.title}</p>
                                <p className="text-xs text-gray-500">{n.message}</p>
                            </div>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{n.time}</span>
                        </div>
                    ))}
                </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-ice overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        currentUser={currentUser} 
        onLogout={handleLogout}
      />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent opacity-60 pointer-events-none"></div>
        
        <div className="z-20 px-8 py-4 flex justify-between items-center">
            <div className="text-xs font-medium text-gray-400 bg-white/50 backdrop-blur px-3 py-1 rounded-full border border-gray-100">
                {currentTime.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex items-center gap-4">
                 <div className="text-right">
                     <p className="text-sm font-bold text-gray-700">{currentUser.name}</p>
                     <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                        {currentUser.role === 'ADMIN' ? 'Conta Central' : currentUser.role === 'DOCTOR' ? 'Dentista' : 'Recepção'}
                     </p>
                 </div>
                 <div className="text-xl font-bold text-cobalt bg-white/50 backdrop-blur px-4 py-1 rounded-full border border-blue-100 shadow-sm">
                    {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })} <span className="text-xs font-normal text-gray-400 ml-1">BRT</span>
                </div>
            </div>
        </div>
        
        <div className="flex-1 px-8 pb-8 overflow-y-auto z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Real-time Popups for Admin */}
        {currentUser.role === 'ADMIN' && (
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
                <AnimatePresence>
                    {notifications.slice(0, 3).map((notif) => (
                        <motion.div 
                            key={notif.id}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            className="bg-white border-l-4 border-cobalt p-4 rounded-lg shadow-2xl flex items-start gap-3 w-80 relative"
                        >
                            <div className="bg-blue-50 w-8 h-8 rounded-full flex items-center justify-center text-cobalt flex-shrink-0">
                                <i className="fa-solid fa-bell"></i>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">{notif.title}</h4>
                                <p className="text-xs text-gray-600">{notif.message}</p>
                                <span className="text-[10px] text-gray-400 mt-1 block">{notif.time}</span>
                            </div>
                            <button 
                                onClick={() => removeNotification(notif.id)}
                                className="absolute top-2 right-2 text-gray-300 hover:text-red-400"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        )}
      </main>
    </div>
  );
};

export default App;