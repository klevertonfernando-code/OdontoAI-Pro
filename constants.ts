import { SimulationPersona, Patient } from "./types";

export const MOCK_PATIENTS: Patient[] = [
  { 
    id: '1', 
    name: 'Ana Silva', 
    age: 34, 
    history: 'Alérgica a Penicilina. Diabética controlada.', 
    notes: 'Queixa de dor no 46.', 
    lastVisit: '2023-10-15',
    complaint: 'Dor pulsátil na região inferior direita.',
    visits: [],
    examRequests: [],
    images: [],
    labAnalyses: []
  },
  { 
    id: '2', 
    name: 'Carlos Oliveira', 
    age: 58, 
    history: 'Hipertenso. Uso de AAS.', 
    notes: 'Necessita exodontia do 18.', 
    lastVisit: '2024-01-20',
    complaint: 'Incômodo na região posterior superior.',
    visits: [],
    examRequests: [],
    images: [],
    labAnalyses: []
  },
  { 
    id: '3', 
    name: 'Beatriz Costa', 
    age: 7, 
    history: 'Sem comorbidades. Alto consumo de açúcar.', 
    notes: 'Cárie incipiente no 55.', 
    lastVisit: '2024-03-10',
    complaint: 'Mancha escura no dente.',
    visits: [],
    examRequests: [],
    images: [],
    labAnalyses: []
  },
];

export const PERSONAS: SimulationPersona[] = [
  {
    id: 'phobia',
    name: 'Paciente com Odontofobia',
    description: 'Tem medo de agulhas e do som do motor. Faz muitas perguntas sobre dor.',
    systemPrompt: 'Você é um paciente com medo extremo de dentista. Questione se vai doer, se a anestesia pega mesmo. Mostre ansiedade.'
  },
  {
    id: 'skeptic',
    name: 'Paciente Cético (Preço)',
    description: 'Acha tudo caro e questiona a necessidade real dos procedimentos.',
    systemPrompt: 'Você é um paciente que acha o tratamento caro. Peça descontos, pergunte se não dá para fazer algo mais barato ou esperar mais tempo.'
  },
  {
    id: 'pediatric',
    name: 'Mãe de Paciente Pediátrico',
    description: 'Preocupada com a estética e o trauma da criança.',
    systemPrompt: 'Você é a mãe de uma criança de 6 anos. Você está preocupada se o filho vai chorar e se o dente vai nascer torto depois.'
  }
];