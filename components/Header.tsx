import React, { useState } from 'react';
import { ViewType, User } from '../types';

interface HeaderProps {
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
  currentUser: User;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onChangeView, currentUser, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const allItems = [
    { id: ViewType.DASHBOARD, label: 'Dashboard', icon: 'fa-chart-pie', roles: ['ADMIN', 'DOCTOR'] },
    { id: ViewType.AGENDA, label: 'Agenda', icon: 'fa-calendar-days', roles: ['ADMIN', 'DOCTOR', 'RECEPTIONIST'] },
    { id: ViewType.PATIENT_RECORDS, label: 'Prontuários', icon: 'fa-folder-open', roles: ['ADMIN', 'DOCTOR'] },
    { id: ViewType.VISION_DIAGNOSTIC, label: 'Vision AI', icon: 'fa-eye', roles: ['ADMIN', 'DOCTOR'] },
    { id: ViewType.LAB_ANALYZER, label: 'Lab', icon: 'fa-flask', roles: ['ADMIN', 'DOCTOR'] },
    { id: ViewType.SALES_ENGINE, label: 'Vendas', icon: 'fa-money-bill-trend-up', roles: ['ADMIN', 'DOCTOR'] },
    { id: ViewType.SETTINGS, label: 'Config', icon: 'fa-gear', roles: ['ADMIN', 'DOCTOR'] },
  ];

  const visibleItems = allItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onChangeView(ViewType.DASHBOARD)}>
            <div className="w-8 h-8 bg-cobalt rounded-lg flex items-center justify-center text-white shadow-md">
               <i className="fa-solid fa-tooth"></i>
            </div>
            <span className="text-lg font-bold text-gray-800 hidden md:block">OdontoAI Pro</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 overflow-x-auto no-scrollbar items-center mx-4">
            {visibleItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                  currentView === item.id
                    ? 'bg-blue-50 text-cobalt'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <i className={`fa-solid ${item.icon}`}></i>
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Profile */}
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-right">
                <div className="hidden md:block">
                    <p className="text-sm font-bold text-gray-800 leading-none">{currentUser.name}</p>
                    <p className="text-[10px] text-gray-500 uppercase">{currentUser.role === 'ADMIN' ? 'Conta Central' : 'Membro'}</p>
                </div>
                {currentUser.avatar && !currentUser.avatar.includes('ui-avatars') ? (
                     <img src={currentUser.avatar} alt="Profile" className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                ) : (
                    <div className="w-9 h-9 rounded-full bg-cobalt text-white flex items-center justify-center text-sm">
                       <i className="fa-solid fa-user"></i>
                    </div>
                )}
             </div>
             
             <button 
                onClick={onLogout} 
                className="text-gray-400 hover:text-red-500 transition-colors p-2"
                title="Sair"
             >
                <i className="fa-solid fa-right-from-bracket"></i>
             </button>

             {/* Mobile Menu Button */}
             <button 
                className="md:hidden text-gray-600 p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
             >
                <i className="fa-solid fa-bars text-xl"></i>
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-2 px-4 shadow-lg absolute w-full left-0 animate-slideUp">
           <div className="space-y-1">
             {visibleItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => { onChangeView(item.id); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3 py-3 rounded-lg text-base font-medium flex items-center gap-3 ${
                    currentView === item.id
                        ? 'bg-blue-50 text-cobalt'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <div className="w-6 text-center"><i className={`fa-solid ${item.icon}`}></i></div>
                    {item.label}
                </button>
             ))}
           </div>
        </div>
      )}
    </header>
  );
};