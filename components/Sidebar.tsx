import React, { useState } from 'react';
import { UserRole, ViewType, User } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
  currentUser: User;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, currentUser, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);

  const allItems = [
    { id: ViewType.DASHBOARD, label: 'Dashboard', icon: 'fa-chart-pie', roles: ['ADMIN', 'DOCTOR'] },
    { id: ViewType.AGENDA, label: 'Agenda Clínica', icon: 'fa-calendar-days', roles: ['ADMIN', 'DOCTOR', 'RECEPTIONIST'] },
    { id: ViewType.ANAMNESIS, label: 'Anamnese & Cadastro', icon: 'fa-clipboard-user', roles: ['ADMIN', 'DOCTOR', 'RECEPTIONIST'] },
    { id: ViewType.PATIENT_RECORDS, label: 'Prontuário & IA', icon: 'fa-folder-open', roles: ['ADMIN', 'DOCTOR'] },
    { id: ViewType.VISION_DIAGNOSTIC, label: 'Vision Diagnostic', icon: 'fa-eye', roles: ['ADMIN', 'DOCTOR'] },
    { id: ViewType.LAB_ANALYZER, label: 'Lab Analyzer', icon: 'fa-flask', roles: ['ADMIN', 'DOCTOR'] },
    { id: ViewType.VOICE_STUDY, label: 'Voice Study Hub', icon: 'fa-microphone-lines', roles: ['ADMIN', 'DOCTOR'] },
    { id: ViewType.SIMULATOR, label: 'Patient Simulator', icon: 'fa-masks-theater', roles: ['ADMIN', 'DOCTOR'] },
    { id: ViewType.SALES_ENGINE, label: 'Smart Sales', icon: 'fa-money-bill-trend-up', roles: ['ADMIN', 'DOCTOR'] },
    { id: ViewType.SETTINGS, label: 'Configurações', icon: 'fa-gear', roles: ['ADMIN', 'DOCTOR'] },
  ];

  const visibleItems = allItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <aside 
      className={`bg-white border-r border-gray-200 h-screen transition-all duration-300 flex flex-col z-20 shadow-xl ${collapsed ? 'w-20' : 'w-72'}`}
    >
      <div className="p-6 flex items-center justify-between border-b border-gray-100">
        {!collapsed && (
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cobalt to-blue-500 whitespace-nowrap">
            OdontoAI Pro
          </h1>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="text-gray-400 hover:text-cobalt">
          <i className={`fa-solid ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
        </button>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto no-scrollbar">
        {visibleItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 ${
              currentView === item.id
                ? 'bg-cobalt text-white shadow-lg shadow-cobalt/30'
                : 'text-gray-500 hover:bg-blue-50 hover:text-cobalt'
            }`}
          >
            <div className={`w-8 flex justify-center text-lg ${currentView === item.id ? 'text-white' : ''}`}>
              <i className={`fa-solid ${item.icon}`}></i>
            </div>
            {!collapsed && (
              <span className="ml-3 font-medium whitespace-nowrap">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      <div className={`p-4 border-t border-gray-100 ${collapsed ? 'text-center' : ''}`}>
        <div className="flex items-center gap-3">
          {currentUser.avatar && !currentUser.avatar.includes('ui-avatars') ? (
               <img src={currentUser.avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm" />
          ) : (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${currentUser.role === 'RECEPTIONIST' ? 'bg-purple-500' : 'bg-cobalt'}`}>
                 <i className={`fa-solid ${currentUser.role === 'RECEPTIONIST' ? 'fa-headset' : 'fa-user-doctor'}`}></i>
              </div>
          )}
          
          {!collapsed && (
            <div className="text-left overflow-hidden flex-1">
              <p className="text-sm font-bold text-gray-800 uppercase truncate">{currentUser.name}</p>
              <button onClick={onLogout} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 mt-1">
                <i className="fa-solid fa-right-from-bracket"></i> Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};