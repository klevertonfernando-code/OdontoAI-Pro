import React, { useState } from 'react';
import { Card } from './ui/Card';
import { ClinicProfile, User, UserRole } from '../types';

interface SettingsProps {
    clinicProfile: ClinicProfile;
    onUpdateProfile: (p: ClinicProfile) => void;
    users: User[];
    onAddUser: (u: User) => void;
    onDeleteUser: (id: string) => void;
    currentUserRole: UserRole;
}

export const Settings: React.FC<SettingsProps> = ({ 
    clinicProfile, 
    onUpdateProfile, 
    users, 
    onAddUser, 
    onDeleteUser,
    currentUserRole 
}) => {
    const [profileForm, setProfileForm] = useState(clinicProfile);
    const [activeTab, setActiveTab] = useState<'profile' | 'users'>('profile');
    
    // New User Form
    const [newUser, setNewUser] = useState({ name: '', role: 'DOCTOR' as UserRole, email: '', pin: '' });
    const [newUserAvatar, setNewUserAvatar] = useState<string>('');

    const handleSaveProfile = () => {
        onUpdateProfile(profileForm);
        alert("Perfil da clínica atualizado com sucesso!");
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewUserAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreateUser = () => {
        if (!newUser.name || !newUser.pin) return;
        const user: User = {
            id: Date.now().toString(),
            name: newUser.name,
            role: newUser.role,
            email: newUser.email,
            pin: newUser.pin,
            avatar: newUserAvatar || `https://ui-avatars.com/api/?name=${newUser.name}&background=random`
        };
        onAddUser(user);
        setNewUser({ name: '', role: 'DOCTOR', email: '', pin: '' });
        setNewUserAvatar('');
        alert(`Usuário ${newUser.name} criado e integrado ao sistema central.`);
    };

    if (currentUserRole !== 'ADMIN') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 animate-fadeIn">
                <i className="fa-solid fa-lock text-4xl mb-4 text-gray-300"></i>
                <p>Acesso restrito à Conta Central (Admin).</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-fadeIn pb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Configurações & Gestão</h2>

            <div className="flex gap-4 mb-6 border-b border-gray-200">
                <button 
                    onClick={() => setActiveTab('profile')}
                    className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'profile' ? 'border-b-2 border-cobalt text-cobalt' : 'text-gray-500'}`}
                >
                    Perfil da Clínica
                </button>
                <button 
                    onClick={() => setActiveTab('users')}
                    className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'users' ? 'border-b-2 border-cobalt text-cobalt' : 'text-gray-500'}`}
                >
                    Gestão de Usuários
                </button>
            </div>

            {activeTab === 'profile' && (
                <div className="space-y-6">
                    <Card title="Dados da Clínica (Cabeçalho de Relatórios)" icon="fa-solid fa-hospital">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Nome da Clínica</label>
                                <input 
                                    type="text" 
                                    value={profileForm.clinicName} 
                                    onChange={e => setProfileForm({...profileForm, clinicName: e.target.value})}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Responsável Técnico</label>
                                <input 
                                    type="text" 
                                    value={profileForm.mainDoctorName} 
                                    onChange={e => setProfileForm({...profileForm, mainDoctorName: e.target.value})}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">CRO / Registro</label>
                                <input 
                                    type="text" 
                                    value={profileForm.cro} 
                                    onChange={e => setProfileForm({...profileForm, cro: e.target.value})}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Telefone</label>
                                <input 
                                    type="text" 
                                    value={profileForm.phone} 
                                    onChange={e => setProfileForm({...profileForm, phone: e.target.value})}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-600 mb-1">Endereço Completo</label>
                                <input 
                                    type="text" 
                                    value={profileForm.address} 
                                    onChange={e => setProfileForm({...profileForm, address: e.target.value})}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button onClick={handleSaveProfile} className="bg-cobalt text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-800">
                                Salvar Alterações
                            </button>
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="space-y-6">
                    <Card title="Adicionar Usuário Integrado" icon="fa-solid fa-user-plus">
                        <p className="text-sm text-gray-500 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <i className="fa-solid fa-info-circle mr-2 text-cobalt"></i>
                            Usuários criados aqui terão acesso restrito. Todas as ações realizadas por eles (agendamentos, cadastros) enviarão notificações para sua Conta Central.
                        </p>
                        
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Avatar Upload */}
                            <div className="flex flex-col items-center justify-center gap-2">
                                <div className="relative w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-cobalt transition-colors group">
                                    {newUserAvatar ? (
                                        <img src={newUserAvatar} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <i className="fa-solid fa-camera text-gray-400 text-2xl group-hover:text-cobalt"></i>
                                    )}
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleAvatarChange} 
                                        className="absolute inset-0 opacity-0 cursor-pointer" 
                                        title="Clique para enviar uma foto"
                                    />
                                </div>
                                <span className="text-xs text-gray-500">Foto (Opcional)</span>
                            </div>

                            {/* Inputs */}
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Nome do Profissional</label>
                                    <input 
                                        type="text" 
                                        value={newUser.name}
                                        onChange={e => setNewUser({...newUser, name: e.target.value})}
                                        className="w-full p-2 border rounded-lg"
                                        placeholder="Ex: Dra. Ana"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Função / Permissão</label>
                                    <select 
                                        value={newUser.role}
                                        onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
                                        className="w-full p-2 border rounded-lg"
                                    >
                                        <option value="DOCTOR">Cirurgião-Dentista (Integrado)</option>
                                        <option value="RECEPTIONIST">Recepção / Secretária</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">PIN de Acesso (4 dígitos)</label>
                                    <input 
                                        type="password"
                                        maxLength={4} 
                                        value={newUser.pin}
                                        onChange={e => setNewUser({...newUser, pin: e.target.value})}
                                        className="w-full p-2 border rounded-lg tracking-widest"
                                        placeholder="0000"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button onClick={handleCreateUser} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 shadow-lg shadow-green-600/20">
                                <i className="fa-solid fa-plus mr-2"></i> Criar Acesso
                            </button>
                        </div>
                    </Card>

                    <Card title="Equipe Cadastrada" icon="fa-solid fa-users">
                        <div className="space-y-3">
                            {users.map(u => (
                                <div key={u.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        {/* Avatar or Fallback Icon */}
                                        {u.avatar && !u.avatar.includes('ui-avatars') ? (
                                             <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-200" />
                                        ) : (
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${u.role === 'ADMIN' ? 'bg-cobalt' : u.role === 'RECEPTIONIST' ? 'bg-purple-500' : 'bg-teal-500'}`}>
                                                <i className={`fa-solid ${u.role === 'RECEPTIONIST' ? 'fa-headset' : 'fa-user-doctor'}`}></i>
                                            </div>
                                        )}
                                        
                                        <div>
                                            <p className="font-bold text-gray-800">{u.name}</p>
                                            <p className="text-xs text-gray-500 uppercase font-semibold">
                                                {u.role === 'ADMIN' ? 'Conta Central' : u.role === 'DOCTOR' ? 'Dentista Integrado' : 'Recepção'}
                                            </p>
                                        </div>
                                    </div>
                                    {u.role !== 'ADMIN' ? (
                                        <button onClick={() => onDeleteUser(u.id)} className="text-red-400 hover:text-red-600 p-2" title="Remover Acesso">
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    ) : <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">Principal</span>}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};