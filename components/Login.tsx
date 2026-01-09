import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
  onSetupAdmin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ users, onLogin, onSetupAdmin }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  // Setup State
  const [setupName, setSetupName] = useState('');
  const [setupPin, setSetupPin] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (pin === selectedUser.pin) {
        onLogin(selectedUser);
    } else {
        setError("PIN incorreto. Tente novamente.");
        setPin('');
    }
  };

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (setupName && setupPin.length === 4) {
        const adminUser: User = {
            id: '1',
            name: setupName,
            role: 'ADMIN',
            email: 'admin@clinica.com',
            pin: setupPin,
            avatar: `https://ui-avatars.com/api/?name=${setupName}&background=0047AB&color=fff`
        };
        onSetupAdmin(adminUser);
    } else {
        alert("Preencha o nome e um PIN de 4 dígitos.");
    }
  };

  // IF NO USERS EXIST -> SHOW SETUP SCREEN
  if (users.length === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ice to-blue-100">
            <div className="glass-card p-8 rounded-2xl w-full max-w-md shadow-2xl animate-fadeIn">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-cobalt rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cobalt/30">
                        <i className="fa-solid fa-tooth text-3xl text-white"></i>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">OdontoAI Pro</h1>
                    <p className="text-gray-500">Configuração Inicial</p>
                </div>

                <form onSubmit={handleSetup} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Doutor(a) (Admin)</label>
                        <input
                            type="text"
                            required
                            value={setupName}
                            onChange={(e) => setSetupName(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-200 focus:border-cobalt outline-none"
                            placeholder="Ex: Dr. Silva"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Crie seu PIN (4 dígitos)</label>
                        <input
                            type="password"
                            maxLength={4}
                            required
                            value={setupPin}
                            onChange={(e) => setSetupPin(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-200 focus:border-cobalt outline-none text-center tracking-widest text-lg"
                            placeholder="0000"
                        />
                    </div>
                    <button type="submit" className="w-full bg-cobalt text-white py-3 rounded-xl font-bold hover:scale-[1.02] transition-transform">
                        Criar Conta Central
                    </button>
                </form>
            </div>
        </div>
      );
  }

  // NORMAL LOGIN FLOW
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ice to-blue-100">
      <div className="glass-card p-8 rounded-2xl w-full max-w-md shadow-2xl animate-fadeIn">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-cobalt rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cobalt/30">
            <i className="fa-solid fa-tooth text-3xl text-white"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">OdontoAI Pro</h1>
          <p className="text-gray-500">
            {selectedUser ? 'Digite seu PIN de acesso' : 'Selecione quem está acessando'}
          </p>
        </div>

        {!selectedUser ? (
            <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar pr-1">
                {users.map(u => (
                    <button 
                        key={u.id}
                        onClick={() => setSelectedUser(u)}
                        className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-cobalt hover:shadow-md transition-all text-left group"
                    >
                        {u.avatar && !u.avatar.includes('ui-avatars') ? (
                            <img 
                                src={u.avatar} 
                                alt={u.name} 
                                className="w-12 h-12 rounded-full object-cover shadow-sm transition-transform group-hover:scale-110 border border-gray-200" 
                            />
                        ) : (
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-sm transition-transform group-hover:scale-110 ${u.role === 'ADMIN' ? 'bg-cobalt' : u.role === 'RECEPTIONIST' ? 'bg-purple-500' : 'bg-teal-500'}`}>
                                <i className={`fa-solid ${u.role === 'RECEPTIONIST' ? 'fa-headset' : 'fa-user-doctor'}`}></i>
                            </div>
                        )}
                        
                        <div className="flex-1">
                            <p className="font-bold text-gray-800">{u.name}</p>
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-500 uppercase font-semibold">
                                    {u.role === 'ADMIN' ? 'Conta Central' : u.role === 'DOCTOR' ? 'Dentista Integrado' : 'Recepção'}
                                </p>
                                {u.role === 'ADMIN' && <i className="fa-solid fa-crown text-yellow-500 text-xs ml-2" title="Admin"></i>}
                            </div>
                        </div>
                        <i className="fa-solid fa-chevron-right ml-auto text-gray-300"></i>
                    </button>
                ))}
            </div>
        ) : (
            <form onSubmit={handleLogin} className="space-y-6 animate-slideUp">
                <div className="text-center">
                    {selectedUser.avatar && !selectedUser.avatar.includes('ui-avatars') ? (
                        <img 
                            src={selectedUser.avatar} 
                            alt={selectedUser.name} 
                            className="w-20 h-20 rounded-full object-cover shadow-md mx-auto mb-3 border-2 border-white" 
                        />
                    ) : (
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-3 shadow-md ${selectedUser.role === 'ADMIN' ? 'bg-cobalt' : selectedUser.role === 'RECEPTIONIST' ? 'bg-purple-500' : 'bg-teal-500'}`}>
                            <i className={`fa-solid ${selectedUser.role === 'RECEPTIONIST' ? 'fa-headset' : 'fa-user-doctor'}`}></i>
                        </div>
                    )}
                    
                    <p className="text-xl font-bold text-gray-800">{selectedUser.name}</p>
                    <p className="text-xs text-gray-500 uppercase mb-4">{selectedUser.role === 'ADMIN' ? 'Administrador' : selectedUser.role === 'RECEPTIONIST' ? 'Recepção' : 'Dentista'}</p>
                    
                    <button 
                        type="button"
                        onClick={() => { setSelectedUser(null); setPin(''); setError(''); }} 
                        className="text-sm text-cobalt hover:underline"
                    >
                        ← Trocar usuário
                    </button>
                </div>
                
                <div>
                    <div className="flex justify-center">
                        <input
                            type="password"
                            autoFocus
                            maxLength={4}
                            value={pin}
                            onChange={(e) => { setPin(e.target.value); setError(''); }}
                            className="w-40 text-center text-3xl tracking-[0.5em] p-4 rounded-xl border border-gray-200 focus:border-cobalt focus:ring-4 focus:ring-cobalt/10 outline-none transition-all"
                            placeholder="••••"
                        />
                    </div>
                    {error && <p className="text-center text-red-500 text-sm mt-3 font-medium bg-red-50 py-1 rounded-lg">{error}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-cobalt text-white py-4 rounded-xl font-bold shadow-lg shadow-cobalt/20 hover:scale-[1.05] transition-transform active:scale-95"
                >
                    Acessar Sistema
                </button>
            </form>
        )}
      </div>
    </div>
  );
};