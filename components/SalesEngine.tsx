import React, { useState } from 'react';
import { Card } from './ui/Card';
import { generateSalesScript } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export const SalesEngine: React.FC = () => {
  const [diagnosis, setDiagnosis] = useState('');
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!diagnosis.trim()) return;
    setLoading(true);
    const result = await generateSalesScript(diagnosis);
    setScript(result);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn h-full">
      <div className="space-y-6">
        <Card title="Entrada Técnica" icon="fa-solid fa-file-prescription">
          <p className="text-sm text-gray-500 mb-2">Cole o diagnóstico ou plano de tratamento técnico:</p>
          <textarea
            className="w-full h-48 p-4 rounded-xl border border-gray-200 focus:border-cobalt focus:ring-2 focus:ring-cobalt/20 outline-none resize-none bg-white/50"
            placeholder="Ex: Paciente apresenta classe II de Angle, apinhamento anterior inferior e mordida profunda. Sugiro tratamento ortodôntico com alinhadores invisíveis por 18 meses."
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          ></textarea>
          <button
            onClick={handleGenerate}
            disabled={loading || !diagnosis}
            className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-500/20 hover:scale-[1.02] transition-transform"
          >
            {loading ? 'Gerando Script...' : 'Criar Argumento de Venda'}
          </button>
        </Card>
      </div>

      <div className="h-full">
        {script ? (
          <Card title="Script Educativo & Venda" icon="fa-solid fa-comments-dollar" className="h-full border-green-100 bg-green-50/30">
             <div className="prose prose-sm prose-green max-w-none h-[calc(100%-60px)] overflow-y-auto no-scrollbar">
                <ReactMarkdown>{script}</ReactMarkdown>
             </div>
          </Card>
        ) : (
          <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-white/30 text-gray-400">
             <div className="text-center p-6">
                <i className="fa-solid fa-lightbulb text-4xl mb-4"></i>
                <p>A IA vai transformar o "tatanês" em uma linguagem que o paciente entende e compra.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};