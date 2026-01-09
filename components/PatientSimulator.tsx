import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/Card';
import { PERSONAS } from '../constants';
import { createSimulationChat } from '../services/geminiService';
import { ChatMessage, SimulationPersona } from '../types';
import ReactMarkdown from 'react-markdown';

export const PatientSimulator: React.FC = () => {
  const [selectedPersona, setSelectedPersona] = useState<SimulationPersona | null>(null);
  const [chatSession, setChatSession] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const startSimulation = (persona: SimulationPersona) => {
    setSelectedPersona(persona);
    const chat = createSimulationChat(persona);
    setChatSession(chat);
    setMessages([{ id: 'init', sender: 'ai', text: `(Iniciando simulação como ${persona.name}). Olá doutor(a), vim para a consulta mas...` }]);
  };

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Use correct sendMessage format for @google/genai
      const result = await chatSession.sendMessage({ message: userMsg.text });
      const text = result.text; // Access text property directly
      
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: text };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: "(Erro na simulação. Tente novamente.)" };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedPersona) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
        {PERSONAS.map(persona => (
          <Card 
            key={persona.id} 
            title={persona.name} 
            icon="fa-solid fa-user-tag"
            className="cursor-pointer hover:border-cobalt border border-transparent"
          >
            <p className="text-gray-600 mb-4 h-12">{persona.description}</p>
            <button 
              onClick={() => startSimulation(persona)}
              className="w-full py-2 bg-white border border-cobalt text-cobalt rounded-lg font-medium hover:bg-cobalt hover:text-white transition-colors"
            >
              Iniciar Roleplay
            </button>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          <span className="text-cobalt mr-2"><i className="fa-solid fa-masks-theater"></i></span>
          Treinamento: {selectedPersona.name}
        </h2>
        <button 
          onClick={() => setSelectedPersona(null)} 
          className="text-sm text-gray-500 hover:text-red-500 underline"
        >
          Encerrar Simulação
        </button>
      </div>

      <div className="flex-1 bg-white/60 backdrop-blur rounded-2xl border border-white p-4 overflow-y-auto no-scrollbar mb-4 shadow-inner">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-cobalt text-white rounded-tr-none' 
                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
            }`}>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white text-gray-400 p-3 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Digite sua resposta ao paciente..."
          className="flex-1 p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cobalt/30 shadow-sm"
        />
        <button 
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-cobalt text-white px-6 rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50"
        >
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};