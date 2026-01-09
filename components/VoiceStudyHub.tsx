import React, { useState, useEffect, useRef } from 'react';
import { Card } from './ui/Card';
import { getVoiceAnswer } from '../services/geminiService';

export const VoiceStudyHub: React.FC = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [answer, setAnswer] = useState('');
  const [speaking, setSpeaking] = useState(false);
  
  // Refs for speech recognition
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'pt-BR';
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleQuery(text);
      };

      recognitionRef.current.onend = () => {
        setListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    } else {
      setTranscript('');
      setAnswer('');
      recognitionRef.current?.start();
      setListening(true);
    }
  };

  const handleQuery = async (text: string) => {
    const response = await getVoiceAnswer(text);
    setAnswer(response);
    speak(response);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      setSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] animate-fadeIn">
      <div className="relative mb-10">
        <div className={`absolute inset-0 bg-cobalt rounded-full blur-xl opacity-20 transition-all duration-500 ${listening || speaking ? 'scale-150 opacity-40' : 'scale-100'}`}></div>
        <button
          onClick={toggleListening}
          className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center text-4xl shadow-2xl transition-all duration-300 ${
            listening 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-white text-cobalt hover:scale-110'
          }`}
        >
          <i className={`fa-solid ${listening ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
        </button>
      </div>

      <div className="w-full max-w-2xl space-y-6 text-center">
        {transcript && (
          <div className="bg-white/60 backdrop-blur px-6 py-4 rounded-2xl shadow-sm inline-block">
            <p className="text-gray-500 text-sm mb-1 uppercase tracking-wide">Você perguntou:</p>
            <p className="text-xl font-medium text-gray-800">"{transcript}"</p>
          </div>
        )}

        {answer && (
          <Card className="text-left bg-cobalt/5 border-cobalt/20">
            <div className="flex justify-between items-start mb-2">
              <p className="text-cobalt text-xs font-bold uppercase tracking-wide">OdontoAI Responde:</p>
              {speaking && <i className="fa-solid fa-volume-high text-cobalt animate-pulse"></i>}
            </div>
            <p className="text-lg text-gray-800 leading-relaxed">{answer}</p>
          </Card>
        )}
        
        {!transcript && !listening && (
          <p className="text-gray-400">Toque no microfone e pergunte sobre protocolos (ex: "Protocolo para endocardite").</p>
        )}
      </div>
    </div>
  );
};