import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { analyzeLabRisks } from '../services/geminiService';
import { LabData, Patient } from '../types';
import ReactMarkdown from 'react-markdown';

interface LabProps {
  patients?: Patient[];
  onSaveToRecord?: (patientId: string, labData: LabData, analysis: string) => void;
}

type TabType = 'hematology' | 'biochemistry' | 'coagulation' | 'others';

export const LabAnalyzer: React.FC<LabProps> = ({ patients = [], onSaveToRecord }) => {
  const [activeTab, setActiveTab] = useState<TabType>('hematology');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [labData, setLabData] = useState<LabData>({
    erythrocytes: '', hemoglobin: '', hematocrit: '', leukocytes: '', platelets: '',
    glucose: '', hba1c: '', urea: '', creatinine: '',
    tap_inr: '', ttpa: '',
    calcium: '', vitamin_d: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [pendingExams, setPendingExams] = useState<string[]>([]);

  // Update pending exams when patient selected
  useEffect(() => {
    if (selectedPatientId) {
      const p = patients.find(pat => pat.id === selectedPatientId);
      if (p) {
        // Map common exam names from Anamnesis strings to keys/groups
        const requested = p.examRequests.filter(e => e.status === 'requested').map(e => e.type.toLowerCase());
        setPendingExams(requested);
      }
    } else {
      setPendingExams([]);
    }
  }, [selectedPatientId, patients]);

  const isPending = (keyword: string) => {
    return pendingExams.some(e => e.includes(keyword.toLowerCase()));
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabData({ ...labData, [e.target.name]: e.target.value });
  };

  const handleAnalyze = async () => {
    setLoading(true);
    const analysis = await analyzeLabRisks(labData);
    setResult(analysis);
    setLoading(false);
  };

  const handleSave = () => {
    if (selectedPatientId && result && onSaveToRecord) {
      onSaveToRecord(selectedPatientId, labData, result);
      alert('Resultado laboratorial salvo no prontuário do paciente!');
      setResult('');
      setSelectedPatientId('');
    }
  };

  const renderTabButton = (id: TabType, label: string, icon: string) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        activeTab === id
          ? 'bg-cobalt text-white shadow-md'
          : 'bg-white text-gray-500 hover:bg-gray-50'
      }`}
    >
      <i className={`fa-solid ${icon}`}></i> {label}
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn h-[calc(100vh-100px)] overflow-y-auto no-scrollbar pb-10">
      
      <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto pb-2">
        {renderTabButton('hematology', 'Hematologia', 'fa-droplet')}
        {renderTabButton('biochemistry', 'Bioquímica', 'fa-flask')}
        {renderTabButton('coagulation', 'Coagulação', 'fa-heart-pulse')}
        {renderTabButton('others', 'Hormonal & Outros', 'fa-dna')}
      </div>

      <Card title="Entrada de Exames Laboratoriais" icon="fa-solid fa-file-medical">
        
        {/* Patient Selector */}
        <div className="mb-6 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
           <label className="block text-sm font-bold text-gray-700 mb-1">Vincular Paciente</label>
           <div className="flex gap-2">
             <div className="relative flex-1">
               <i className="fa-solid fa-user absolute left-3 top-3 text-gray-400"></i>
               <select 
                 value={selectedPatientId}
                 onChange={(e) => setSelectedPatientId(e.target.value)}
                 className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:border-cobalt outline-none bg-white"
               >
                 <option value="">Não vincular a paciente (Apenas análise)</option>
                 {patients.map(p => (
                   <option key={p.id} value={p.id}>{p.name} (CNS: {p.cns || 'N/A'})</option>
                 ))}
               </select>
             </div>
           </div>
           {pendingExams.length > 0 && (
             <div className="mt-2 flex flex-wrap gap-2 animate-fadeIn">
                <span className="text-xs font-bold text-blue-700 self-center">Solicitados:</span>
                {pendingExams.map((e, idx) => (
                  <span key={idx} className="bg-white text-blue-600 px-2 py-1 rounded border border-blue-200 text-xs shadow-sm capitalize">{e}</span>
                ))}
             </div>
           )}
        </div>

        <div className="min-h-[300px]">
          {activeTab === 'hematology' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
              <InputGroup label="Eritrócitos (milhões/mm³)" name="erythrocytes" value={labData.erythrocytes} onChange={handleChange} ph="4.5" highlight={isPending('hemograma')} />
              <InputGroup label="Hemoglobina (g/dL)" name="hemoglobin" value={labData.hemoglobin} onChange={handleChange} ph="13.5" highlight={isPending('hemograma')} />
              <InputGroup label="Hematócrito (%)" name="hematocrit" value={labData.hematocrit} onChange={handleChange} ph="40" highlight={isPending('hemograma')} />
              <InputGroup label="Leucócitos (/mm³)" name="leukocytes" value={labData.leukocytes} onChange={handleChange} ph="6000" highlight={isPending('hemograma')} />
              <InputGroup label="Plaquetas (/mm³)" name="platelets" value={labData.platelets} onChange={handleChange} ph="250000" highlight={isPending('hemograma')} />
            </div>
          )}

          {activeTab === 'biochemistry' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
              <InputGroup label="Glicemia Jejum (mg/dL)" name="glucose" value={labData.glucose} onChange={handleChange} ph="90" highlight={isPending('glicemia')} />
              <InputGroup label="Hemoglobina Glicada (%)" name="hba1c" value={labData.hba1c} onChange={handleChange} ph="5.5" highlight={isPending('glicemia')} />
              <InputGroup label="Ureia (mg/dL)" name="urea" value={labData.urea} onChange={handleChange} ph="30" />
              <InputGroup label="Creatinina (mg/dL)" name="creatinine" value={labData.creatinine} onChange={handleChange} ph="0.9" />
            </div>
          )}

          {activeTab === 'coagulation' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
              <InputGroup label="TAP / INR" name="tap_inr" value={labData.tap_inr} onChange={handleChange} ph="1.0" highlight={isPending('coagulograma')} />
              <InputGroup label="TTPA (segundos)" name="ttpa" value={labData.ttpa} onChange={handleChange} ph="30" highlight={isPending('coagulograma')} />
            </div>
          )}

          {activeTab === 'others' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
              <InputGroup label="Cálcio (mg/dL)" name="calcium" value={labData.calcium} onChange={handleChange} ph="9.5" />
              <InputGroup label="Vitamina D (ng/mL)" name="vitamin_d" value={labData.vitamin_d} onChange={handleChange} ph="30" />
            </div>
          )}
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-100">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-cobalt text-white py-3 rounded-xl font-bold shadow-lg shadow-cobalt/20 hover:bg-blue-800 transition-all flex justify-center items-center gap-2"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-microscope"></i>}
            Processar Análise Cruzada (IA)
          </button>
        </div>
      </Card>

      {result && (
        <Card title="Análise de Risco & Protocolos" icon="fa-solid fa-clipboard-check" className="border-l-4 border-l-cobalt mb-10">
          <div className="prose prose-blue max-w-none">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
          
          {selectedPatientId && (
            <div className="mt-6 pt-4 border-t border-gray-100">
               <button 
                 onClick={handleSave}
                 className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
               >
                 <i className="fa-solid fa-floppy-disk mr-2"></i> Salvar no Prontuário do Paciente
               </button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

const InputGroup = ({ label, name, value, onChange, ph, highlight }: any) => (
  <div className="space-y-1 relative">
    <label className={`text-xs font-bold uppercase flex justify-between ${highlight ? 'text-cobalt' : 'text-gray-500'}`}>
        {label}
        {highlight && <i className="fa-solid fa-star text-yellow-400 animate-pulse" title="Solicitado na Anamnese"></i>}
    </label>
    <input
      type="number"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={ph}
      className={`w-full p-3 rounded-lg border outline-none transition-all bg-gray-50 focus:bg-white ${highlight ? 'border-cobalt ring-1 ring-cobalt/30' : 'border-gray-200 focus:border-cobalt focus:ring-2 focus:ring-cobalt/20'}`}
    />
  </div>
);