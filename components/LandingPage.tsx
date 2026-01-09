import React from 'react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-cobalt rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-cobalt/20">
                <i className="fa-solid fa-tooth"></i>
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cobalt to-blue-500">
                OdontoAI Pro
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
              <a href="#features" className="hover:text-cobalt transition-colors">Funcionalidades</a>
              <a href="#about" className="hover:text-cobalt transition-colors">Sobre</a>
              <a href="#pricing" className="hover:text-cobalt transition-colors">Planos</a>
            </div>
            <button 
              onClick={onLoginClick}
              className="bg-cobalt text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-800 transition-all shadow-lg shadow-cobalt/20 hover:scale-105 active:scale-95"
            >
              Acessar Sistema
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-100/50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-purple-100/50 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-cobalt text-xs font-bold tracking-wide mb-6 border border-blue-100">
              🚀 A Revolução da Inteligência Odontológica
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-8">
              Diagnósticos Precisos com <br />
              <span className="text-cobalt">Inteligência Artificial</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Transforme sua clínica com análise de raio-x via IA, transcrição de voz para prontuário e simuladores de atendimento. O futuro da odontologia chegou.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <button 
                onClick={onLoginClick}
                className="w-full md:w-auto px-8 py-4 bg-cobalt text-white text-lg font-bold rounded-2xl shadow-xl shadow-cobalt/30 hover:bg-blue-800 transition-all hover:-translate-y-1"
              >
                Começar Agora
              </button>
              <button className="w-full md:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 text-lg font-bold rounded-2xl hover:bg-gray-50 transition-all">
                Ver Demonstração
              </button>
            </div>
          </motion.div>

          {/* Hero Image / Dashboard Preview */}
          <motion.div 
             initial={{ opacity: 0, y: 40 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="rounded-2xl border border-gray-200 shadow-2xl overflow-hidden bg-white">
               <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-400"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                 <div className="w-3 h-3 rounded-full bg-green-400"></div>
               </div>
               <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000&auto=format&fit=crop" alt="Dashboard Preview" className="w-full opacity-90" />
               <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent h-full"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Funcionalidades Poderosas</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tudo o que você precisa para elevar o nível do seu atendimento clínico e gestão.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="fa-x-ray"
              title="Vision Diagnostic"
              desc="Envie radiografias e receba uma análise de segunda opinião instantânea com IA generativa."
            />
            <FeatureCard 
              icon="fa-microphone-lines"
              title="Voice Study Hub"
              desc="Consulte protocolos e tire dúvidas clínicas usando apenas sua voz. Respostas baseadas em evidências."
            />
            <FeatureCard 
              icon="fa-masks-theater"
              title="Patient Simulator"
              desc="Treine atendimento com pacientes virtuais (personas) que reagem emocionalmente."
            />
            <FeatureCard 
              icon="fa-flask"
              title="Lab Analyzer"
              desc="Interpretação automática de exames de sangue com cruzamento de dados para risco cirúrgico."
            />
            <FeatureCard 
              icon="fa-comments-dollar"
              title="Smart Sales"
              desc="Transforme diagnósticos técnicos em scripts de vendas persuasivos e educativos."
            />
             <FeatureCard 
              icon="fa-file-signature"
              title="Prontuário Inteligente"
              desc="Anamneses completas, assinatura digital e gestão de histórico clínico em um só lugar."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
               <i className="fa-solid fa-tooth text-cobalt text-2xl"></i>
               <span className="text-xl font-bold">OdontoAI Pro</span>
            </div>
            <p className="text-gray-400 max-w-sm">
              SaaS líder em inteligência artificial para clínicas odontológicas. Potencialize seus diagnósticos e gestão.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Produto</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white">Funcionalidades</a></li>
              <li><a href="#" className="hover:text-white">Segurança</a></li>
              <li><a href="#" className="hover:text-white">Preços</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-white">Privacidade</a></li>
              <li><a href="#" className="hover:text-white">Contato</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          © 2024 OdontoAI Pro. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
    <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-cobalt text-2xl mb-6 group-hover:bg-cobalt group-hover:text-white transition-colors">
      <i className={`fa-solid ${icon}`}></i>
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{desc}</p>
  </div>
);