import React, { useState } from 'react';
import { Card } from './ui/Card';
import { analyzeAnamnesis } from '../services/geminiService';
import { AnamnesisForm, Patient, Tooth, AuditMetadata } from '../types';
import { Odontogram } from './ui/Odontogram';
import ReactMarkdown from 'react-markdown';

interface AnamnesisProps {
  onSavePatient: (patient: Patient) => void;
  currentUser?: string;
}

export const Anamnesis: React.FC<AnamnesisProps> = ({ onSavePatient, currentUser = "Dr. Silva" }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  
  const [formData, setFormData] = useState<AnamnesisForm>({
    personal: { name: '', age: '', cns: '', occupation: '' },
    susInfo: {
      hypertension: false, diabetes: false, heartDisease: false, smoker: false, pregnant: false, bleedingHistory: false,
      allergies: '', medications: '', hospitalizations: '', otherDiseases: ''
    },
    complaint: ''
  });

  const [odontogramData, setOdontogramData] = useState<Tooth[]>([]);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);

  const toggleExam = (exam: string) => {
    if (selectedExams.includes(exam)) {
      setSelectedExams(selectedExams.filter(e => e !== exam));
    } else {
      setSelectedExams([...selectedExams, exam]);
    }
  };

  const updatePersonal = (f: string, v: string) => setFormData(prev => ({ ...prev, personal: { ...prev.personal, [f]: v } }));
  const updateSusBool = (f: string) => setFormData(prev => ({ ...prev, susInfo: { ...prev.susInfo, [f]: !(prev.susInfo as any)[f] } }));
  const updateSusText = (f: string, v: string) => setFormData(prev => ({ ...prev, susInfo: { ...prev.susInfo, [f]: v } }));

  const handleAnalyze = async () => {
    setLoading(true);
    setStep(6); // Move to final step
    const result = await analyzeAnamnesis(formData);
    setAiResult(result);
    setLoading(false);
  };

  const generateAudit = (): AuditMetadata => {
    const now = new Date().toLocaleString('pt-BR');
    return {
      createdBy: currentUser,
      createdAt: now,
      lastModifiedBy: currentUser,
      lastModifiedAt: now,
      signatureHash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    };
  };

  const handleSave = () => {
    if (!formData.personal.name) {
        alert("Nome do paciente é obrigatório.");
        return;
    }

    const newPatient: Patient = {
      id: Date.now().toString(),
      name: formData.personal.name,
      age: parseInt(formData.personal.age) || 0,
      cns: formData.personal.cns,
      occupation: formData.personal.occupation,
      history: `Alergias: ${formData.susInfo.allergies || 'Nega'}. Meds: ${formData.susInfo.medications || 'Nega'}. Comorbidades: ${formData.susInfo.hypertension ? 'Hipertensão ' : ''}${formData.susInfo.diabetes ? 'Diabetes' : ''}. Outros: ${formData.susInfo.otherDiseases || 'Nega'}.`,
      complaint: formData.complaint,
      diagnosis: aiResult,
      notes: 'Paciente cadastrado via Anamnese Digital.',
      lastVisit: new Date().toLocaleDateString('pt-BR'),
      visits: [],
      examRequests: selectedExams.map(ex => ({
        id: Math.random().toString(36).substr(2, 9),
        type: ex,
        status: 'requested',
        dateRequested: new Date().toLocaleDateString('pt-BR')
      })),
      images: [],
      labAnalyses: [],
      odontogram: odontogramData,
      susInfo: formData.susInfo,
      audit: generateAudit()
    };
    onSavePatient(newPatient);
    alert('Paciente salvo e assinado digitalmente com sucesso!');
  };

  const steps = [
    { id: 1, label: 'Cadastro', icon: 'fa-user' },
    { id: 2, label: 'Anamnese', icon: 'fa-file-contract' },
    { id: 3, label: 'Queixa', icon: 'fa-comment-medical' },
    { id: 4, label: 'Odontograma', icon: 'fa-tooth' },
    { id: 5, label: 'Exames', icon: 'fa-file-prescription' },
    { id: 6, label: 'Conclusão', icon: 'fa-clipboard-check' },
  ];

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col animate-fadeIn">
      {/* Horizontal Stepper */}
      <div className="flex justify-between items-center px-6 mb-6 overflow-x-auto pb-2">
        {steps.map((s) => (
          <div key={s.id} 
               onClick={() => setStep(s.id)}
               className={`flex flex-col items-center gap-2 cursor-pointer transition-all min-w-[80px] ${step === s.id ? 'text-cobalt opacity-100' : 'text-gray-400 opacity-60 hover:opacity-80'}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 shadow-sm transition-all ${step === s.id ? 'border-cobalt bg-white -translate-y-1 shadow-cobalt/20' : 'border-gray-200 bg-gray-50'}`}>
              <i className={`fa-solid ${s.icon} text-lg`}></i>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">{s.label}</span>
          </div>
        ))}
      </div>

      <Card className="flex-1 overflow-y-auto no-scrollbar relative mx-4 mb-4">
        {step === 1 && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Identificação do Paciente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Nome Completo *" value={formData.personal.name} onChange={(e) => updatePersonal('name', e.target.value)} />
              <InputGroup label="Idade" value={formData.personal.age} onChange={(e) => updatePersonal('age', e.target.value)} type="number" />
              <InputGroup label="CNS (Cartão SUS)" value={formData.personal.cns} onChange={(e) => updatePersonal('cns', e.target.value)} />
              <InputGroup label="Profissão" value={formData.personal.occupation} onChange={(e) => updatePersonal('occupation', e.target.value)} />
            </div>
            <div className="flex justify-end mt-8">
              <button onClick={() => setStep(2)} className="bg-cobalt text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 shadow-lg shadow-cobalt/20">
                Próximo
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Anamnese de Saúde (Padrão SUS)</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
               <ToggleBox label="Hipertensão" checked={formData.susInfo.hypertension} onClick={() => updateSusBool('hypertension')} />
               <ToggleBox label="Diabetes" checked={formData.susInfo.diabetes} onClick={() => updateSusBool('diabetes')} />
               <ToggleBox label="Cardiopatia" checked={formData.susInfo.heartDisease} onClick={() => updateSusBool('heartDisease')} />
               <ToggleBox label="Fumante" checked={formData.susInfo.smoker} onClick={() => updateSusBool('smoker')} />
               <ToggleBox label="Gestante" checked={formData.susInfo.pregnant} onClick={() => updateSusBool('pregnant')} />
               <ToggleBox label="Hemorragia" checked={formData.susInfo.bleedingHistory} onClick={() => updateSusBool('bleedingHistory')} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Alergias Conhecidas" value={formData.susInfo.allergies} onChange={(e) => updateSusText('allergies', e.target.value)} />
                <InputGroup label="Medicamentos em Uso" value={formData.susInfo.medications} onChange={(e) => updateSusText('medications', e.target.value)} />
                <InputGroup label="Histórico Cirúrgico" value={formData.susInfo.hospitalizations} onChange={(e) => updateSusText('hospitalizations', e.target.value)} />
                <InputGroup label="Outras Observações" value={formData.susInfo.otherDiseases} onChange={(e) => updateSusText('otherDiseases', e.target.value)} />
            </div>

            <div className="flex justify-between mt-8">
              <button onClick={() => setStep(1)} className="text-gray-500 hover:text-cobalt px-4">Voltar</button>
              <button onClick={() => setStep(3)} className="bg-cobalt text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 shadow-lg shadow-cobalt/20">Próximo</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn h-full flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Queixa Principal & HDA</h3>
            <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <textarea
                className="w-full h-full bg-transparent outline-none resize-none text-gray-700 leading-relaxed"
                placeholder="Descreva em detalhes o relato do paciente..."
                value={formData.complaint}
                onChange={(e) => setFormData({...formData, complaint: e.target.value})}
                ></textarea>
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={() => setStep(2)} className="text-gray-500 hover:text-cobalt px-4">Voltar</button>
              <button onClick={() => setStep(4)} className="bg-cobalt text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 shadow-lg shadow-cobalt/20">Próximo</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="max-w-4xl mx-auto animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold text-gray-800">Odontograma Digital Interativo</h3>
                 <p className="text-xs text-gray-500">Clique nos dentes para alterar o status</p>
            </div>
            <Odontogram value={odontogramData} onChange={setOdontogramData} />
            <div className="flex justify-between mt-8">
              <button onClick={() => setStep(3)} className="text-gray-500 hover:text-cobalt px-4">Voltar</button>
              <button onClick={() => setStep(5)} className="bg-cobalt text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 shadow-lg shadow-cobalt/20">Próximo</button>
            </div>
          </div>
        )}

        {step === 5 && (
            <div className="max-w-3xl mx-auto animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-6">Solicitação de Exames Complementares</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {['RX Panorâmica', 'RX Periapical', 'RX Interproximal', 'Tomografia Cone Beam', 'Hemograma Completo', 'Coagulograma', 'Glicemia Jejum', 'Fotografia Intraoral', 'Fotografia Extraoral'].map(ex => (
                    <div key={ex} onClick={() => toggleExam(ex)} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${selectedExams.includes(ex) ? 'bg-cobalt text-white border-cobalt shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        <div className={`w-6 h-6 rounded flex items-center justify-center border ${selectedExams.includes(ex) ? 'bg-white text-cobalt border-white' : 'border-gray-400'}`}>
                        {selectedExams.includes(ex) && <i className="fa-solid fa-check text-xs"></i>}
                        </div>
                        <span className="font-medium">{ex}</span>
                    </div>
                    ))}
                </div>
                <div className="flex justify-between mt-8">
                    <button onClick={() => setStep(4)} className="text-gray-500 hover:text-cobalt px-4">Voltar</button>
                    <button 
                        onClick={handleAnalyze}
                        disabled={loading || !formData.complaint}
                        className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-600/20 flex items-center gap-2"
                    >
                        {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                        Gerar Diagnóstico IA
                    </button>
                </div>
            </div>
        )}

        {step === 6 && (
          <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn h-full flex flex-col">
             <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-xl font-bold text-gray-800">Conclusão e Diagnóstico</h3>
                <button onClick={() => setStep(1)} className="text-sm text-cobalt hover:underline">Reiniciar</button>
             </div>
             
             {loading ? (
               <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                  <i className="fa-solid fa-brain fa-bounce text-6xl text-cobalt mb-4"></i>
                  <p className="text-lg font-medium mt-4">Nossa IA está analisando os dados clínicos...</p>
               </div>
             ) : (
               <div className="flex-1 flex flex-col lg:flex-row gap-8">
                 <div className="flex-1 bg-blue-50/50 p-6 rounded-2xl border border-blue-100 overflow-y-auto">
                    <h4 className="text-cobalt font-bold mb-4 flex items-center gap-2">
                        <i className="fa-solid fa-robot"></i> Hipótese Diagnóstica & Plano
                    </h4>
                    <div className="prose prose-sm prose-blue max-w-none">
                        <ReactMarkdown>{aiResult}</ReactMarkdown>
                    </div>
                 </div>
                 
                 <div className="w-full lg:w-80 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <h5 className="font-bold text-gray-600 text-sm mb-2 uppercase">Resumo</h5>
                        <ul className="text-sm space-y-2 text-gray-600">
                            <li><i className="fa-solid fa-tooth mr-2 text-cobalt"></i>Odontograma: {odontogramData.length > 0 ? `${odontogramData.length} alterações` : 'Sem alterações'}</li>
                            <li><i className="fa-solid fa-file-prescription mr-2 text-cobalt"></i>Exames: {selectedExams.length} solicitados</li>
                        </ul>
                    </div>

                    <button 
                      onClick={handleSave}
                      className="w-full bg-cobalt text-white py-4 rounded-xl font-bold shadow-xl shadow-cobalt/30 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                    >
                      <i className="fa-solid fa-file-signature"></i> Salvar e Assinar
                    </button>
                 </div>
               </div>
             )}
          </div>
        )}
      </Card>
    </div>
  );
};

const InputGroup = ({ label, value, onChange, type = "text" }: any) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-3 rounded-lg border border-gray-200 focus:border-cobalt focus:ring-2 focus:ring-cobalt/20 outline-none bg-white transition-all"
    />
  </div>
);

const ToggleBox = ({ label, checked, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all select-none ${checked ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
  >
    <span className={`font-medium ${checked ? 'text-red-700' : 'text-gray-600'}`}>{label}</span>
    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${checked ? 'bg-red-500 text-white' : 'bg-gray-100 text-transparent'}`}>
       <i className="fa-solid fa-check text-xs"></i>
    </div>
  </div>
);