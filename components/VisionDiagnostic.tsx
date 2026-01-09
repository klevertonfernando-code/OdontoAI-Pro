import React, { useState } from 'react';
import { Card } from './ui/Card';
import { analyzeDentalImage } from '../services/geminiService';
import { Patient } from '../types';
import ReactMarkdown from 'react-markdown';

interface VisionProps {
  patients: Patient[];
  onSaveToRecord: (patientId: string, imageUrl: string, analysis: string) => void;
}

export const VisionDiagnostic: React.FC<VisionProps> = ({ patients, onSaveToRecord }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    // Extract base64 data and mime type
    const mimeType = image.split(';')[0].split(':')[1];
    const base64Data = image.split(',')[1];
    
    const result = await analyzeDentalImage(base64Data, mimeType);
    setAnalysis(result);
    setLoading(false);
  };

  const handleSave = () => {
    if (selectedPatientId && image && analysis) {
      onSaveToRecord(selectedPatientId, image, analysis);
      alert('Imagem e Análise salvas no prontuário do paciente!');
      setAnalysis('');
      setImage(null);
      setSelectedPatientId('');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Upload de Imagem" icon="fa-solid fa-x-ray">
          {/* Patient Selector */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">Vincular ao Paciente (Opcional)</label>
            <select 
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:border-cobalt outline-none"
            >
              <option value="">Selecione um paciente...</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} (CNS: {p.cns || 'N/A'})</option>
              ))}
            </select>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-cobalt transition-colors bg-white/50 relative">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden" 
              id="vision-upload"
            />
            <label htmlFor="vision-upload" className="cursor-pointer flex flex-col items-center">
              {image ? (
                <img src={image} alt="Preview" className="max-h-64 rounded-lg shadow-sm" />
              ) : (
                <>
                  <i className="fa-solid fa-cloud-arrow-up text-4xl text-gray-400 mb-4"></i>
                  <p className="font-medium text-gray-600">Clique para enviar RX ou Foto</p>
                  <p className="text-xs text-gray-400 mt-2">Suporta JPG, PNG</p>
                </>
              )}
            </label>
            {image && (
              <button 
                onClick={() => setImage(null)}
                className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded-full"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            )}
          </div>
          
          {image && (
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full mt-4 bg-cobalt text-white py-3 rounded-xl font-medium shadow-lg shadow-cobalt/20 hover:bg-blue-800 transition-all flex justify-center items-center gap-2"
            >
              {loading ? (
                <><i className="fa-solid fa-circle-notch fa-spin"></i> Processando IA...</>
              ) : (
                <><i className="fa-solid fa-wand-magic-sparkles"></i> Analisar Imagem</>
              )}
            </button>
          )}
        </Card>

        {analysis && (
          <Card title="Laudo Radiológico (IA)" icon="fa-solid fa-file-medical-alt" className="h-full flex flex-col">
            <div className="prose prose-sm prose-blue max-w-none max-h-[400px] overflow-y-auto no-scrollbar flex-1">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                <p className="text-xs text-amber-600 font-semibold bg-amber-50 p-2 rounded">
                    <i className="fa-solid fa-triangle-exclamation mr-1"></i>
                    Atenção: Valide clinicamente todos os achados.
                </p>

                {selectedPatientId && (
                  <button 
                    onClick={handleSave}
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition-colors"
                  >
                    <i className="fa-solid fa-floppy-disk mr-2"></i> Salvar no Prontuário
                  </button>
                )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};