import React, { useState, useEffect } from 'react';
import { Header } from './components/Header'; // New Header
import { LandingPage } from './components/LandingPage'; // New Landing Page
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

const DashboardCard = ({ icon, label, desc, onClick }: { icon: string, label: string, desc?: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-cobalt transition-all group flex flex-col items-start gap-4 h-full text-left relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
    <div className="w-14 h-14 bg-white border border-gray-100 text-cobalt rounded-2xl flex items-center justify-center text-2xl group-hover:bg-cobalt group-hover:text-white transition-colors shadow-sm z-10">
      <i className={`fa-solid ${icon}`}></i>
    </div>
    <div className="z-10">
      <span className="font-bold text-gray-800 text-lg group-hover:text-cobalt transition-colors block mb-1">{label}</span>
      {desc && <span className="text-sm text-gray-500 font-normal leading-tight">{desc}</span>}
    </div>
  </button>
);

const App: React.FC = () => {
  // State: 'landing' | 'login' | 'app'
  const [appState, setAppState] = useState<'landing' | 'login' | 'app'>('landing');
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS.map(p => ({ ...p, labAnalyses: [] })));

  // --- Handlers ---

  const handleSetupAdmin = (user: User) => {
      setUsers([user]);
      setCurrentUser(user);
      setAppState('app');
      setCurrentView(ViewType.DASHBOARD);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setAppState('app');
    if (user.role === 'RECEPTIONIST') {
        setCurrentView(ViewType.AGENDA);
    } else {
        setCurrentView(ViewType.DASHBOARD);
    }
  }

  const handleLogout = () => {
    setCurrentUser(null);
    setAppState('landing'); // Go back to website home
  }

  const handleAddUser = (user: User) => setUsers([...users, user]);
  const handleDeleteUser = (id: string) => setUsers(users.filter(u => u.id !== id));

  const notifyAdmin = (title: string, message: string) => {
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
    if (currentUser?.role === 'RECEPTIONIST') {
        notifyAdmin('Novo Paciente Cadastrado', `Recepção cadastrou ${newPatient.name}.`);
        alert("Pré-cadastro realizado! O Doutor foi notificado.");
        setCurrentView(ViewType.AGENDA);
    } else {
        setCurrentView(ViewType.PATIENT_RECORDS);
    }
  };

  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatients(patients.map(p => p.id === updatedPatient.id ? updatedPatient : p));
  };

  const handleAddAppointment = (apt: Appointment) => {
    setAppointments([...appointments, apt]);
    if (currentUser?.role !== 'ADMIN') notifyAdmin('Novo Agendamento', `${currentUser?.name} agendou ${apt.patientName}.`);
  }

  const handleUpdateAppointment = (apt: Appointment) => {
    setAppointments(appointments.map(a => a.id === apt.id ? apt : a));
    if (apt.status === 'waiting' && currentUser?.role === 'RECEPTIONIST') notifyAdmin('Paciente na Recepção', `${apt.patientName} chegou.`);
  }

  const handleSaveImageToRecord = (patientId: string, imageUrl: string, analysis: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      handleUpdatePatient({
        ...patient,
        images: [{ id: Date.now().toString(), date: new Date().toLocaleDateString('pt-BR'), imageUrl, analysis }, ...patient.images]
      });
      if (currentUser?.role === 'DOCTOR') notifyAdmin('Exame Adicionado', `${currentUser.name} salvou uma análise.`);
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

  // --- Views Renders ---

  if (appState === 'landing') {
      return <LandingPage onLoginClick={() => setAppState('login')} />;
  }

  if (appState === 'login') {
      return (
          <div className="relative">
              <button onClick={() => setAppState('landing')} className="absolute top-6 left-6 text-gray-500 hover:text-cobalt flex items-center gap-2 z-50">
                  <i className="fa-solid fa-arrow-left"></i> Voltar ao Site
              </button>
              <Login users={users} onLogin={handleLogin} onSetupAdmin={handleSetupAdmin} />
          </div>
      );
  }

  const renderContent = () => {
    const agendaProps = {
        patients,
        appointments,
        onAddAppointment: handleAddAppointment,
        onUpdateAppointment: handleUpdateAppointment,
        onNavigate: setCurrentView,
        onAddNotification: handleAddNotification,
        clinicSettings
    };

    // Receptionist logic
    if (currentUser?.role === 'RECEPTIONIST') {
        if (currentView === ViewType.ANAMNESIS) return <Anamnesis onSavePatient={handleAddPatient} currentUser={currentUser.name} />;
        return <Agenda {...agendaProps} isReceptionist={true} />;
    }

    switch (currentView) {
      case ViewType.AGENDA: return <Agenda {...agendaProps} />;
      case ViewType.ANAMNESIS: return <Anamnesis onSavePatient={handleAddPatient} currentUser={currentUser?.name} />;
      case ViewType.VISION_DIAGNOSTIC: return <VisionDiagnostic patients={patients} onSaveToRecord={handleSaveImageToRecord} />;
      case ViewType.LAB_ANALYZER: return <LabAnalyzer patients={patients} onSaveToRecord={handleSaveLabToRecord} />;
      case ViewType.PATIENT_RECORDS: return <PatientRecords patients={patients} onUpdatePatient={handleUpdatePatient} clinicSettings={clinicSettings} />;
      case ViewType.VOICE_STUDY: return <VoiceStudyHub />;
      case ViewType.SIMULATOR: return <PatientSimulator />;
      case ViewType.SALES_ENGINE: return <SalesEngine />;
      case ViewType.SETTINGS: return <Settings clinicProfile={clinicSettings} onUpdateProfile={setClinicSettings} users={users} onAddUser={handleAddUser} onDeleteUser={handleDeleteUser} currentUserRole={currentUser!.role} />;
      default:
        return (
          <div className="mt-6 animate-fadeIn pb-20">
            <div className="bg-gradient-to-r from-cobalt to-blue-600 rounded-3xl p-10 text-white mb-10 shadow-xl shadow-blue-900/20 relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-4xl font-bold mb-2">Bem-vindo, {currentUser?.name}</h2>
                    <p className="opacity-90 text-lg">{clinicSettings.clinicName} • Painel de Controle</p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
                    <i className="fa-solid fa-tooth text-9xl"></i>
                </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-6 pl-2">Acesso Rápido</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                <DashboardCard icon="fa-calendar-days" label="Agenda Clínica" desc="Gerencie consultas e horários" onClick={() => setCurrentView(ViewType.AGENDA)} />
                <DashboardCard icon="fa-clipboard-user" label="Nova Anamnese" desc="Cadastro e entrevista inicial" onClick={() => setCurrentView(ViewType.ANAMNESIS)} />
                <DashboardCard icon="fa-eye" label="Vision AI" desc="Análise radiográfica inteligente" onClick={() => setCurrentView(ViewType.VISION_DIAGNOSTIC)} />
                <DashboardCard icon="fa-comments-dollar" label="Smart Sales" desc="Scripts de vendas personalizados" onClick={() => setCurrentView(ViewType.SALES_ENGINE)} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {currentUser && (
         <Header 
            currentView={currentView} 
            onChangeView={setCurrentView} 
            currentUser={currentUser} 
            onLogout={handleLogout}
         />
      )}
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
      </main>

      {/* Notifications Toast */}
      {currentUser?.role === 'ADMIN' && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {notifications.slice(0, 3).map((notif) => (
                    <motion.div 
                        key={notif.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="bg-white border-l-4 border-cobalt p-4 rounded-lg shadow-2xl flex items-start gap-3 w-80 relative pointer-events-auto"
                    >
                        <div className="bg-blue-50 w-8 h-8 rounded-full flex items-center justify-center text-cobalt flex-shrink-0">
                            <i className="fa-solid fa-bell"></i>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 text-sm">{notif.title}</h4>
                            <p className="text-xs text-gray-600">{notif.message}</p>
                            <span className="text-[10px] text-gray-400 mt-1 block">{notif.time}</span>
                        </div>
                        <button onClick={() => removeNotification(notif.id)} className="absolute top-2 right-2 text-gray-300 hover:text-red-400">
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default App;