import { GoogleGenAI } from "@google/genai";
import { SimulationPersona, AnamnesisForm, LabData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using gemini-2.5-flash-image for Vision tasks
export const analyzeDentalImage = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType
            }
          },
          {
            text: "Atue como Radiologista Odontológico Sênior. Analise esta imagem (RX Panorâmica ou Foto Intraoral). Identifique indícios de cáries, reabsorções ósseas, lesões periapicais, cálculo ou outras patologias. Liste as áreas de atenção com precisão técnica. Formate a resposta em Markdown."
          }
        ]
      }
    });
    return response.text || "Não foi possível analisar a imagem.";
  } catch (error) {
    console.error("Vision Error:", error);
    return "Erro ao processar imagem. Verifique a conexão.";
  }
};

// Expanded Lab Analysis
export const analyzeLabRisks = async (labData: LabData): Promise<string> => {
  try {
    const prompt = `
      Atue como um Cirurgião Bucomaxilofacial e Clínico Geral.
      Analise os seguintes exames laboratoriais completos de um paciente odontológico:
      ${JSON.stringify(labData)}
      
      Tarefa:
      1. Identifique valores fora da referência normal.
      2. Cruze os dados (ex: Creatinina alta + Ureia alta = Risco Renal).
      3. Emita um "Alerta de Risco Cirúrgico" detalhado.
      4. Sugira protocolos de precaução para cirurgias (extrações/implantes).
      
      Formate em Markdown. Seja direto.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Sem análise disponível.";
  } catch (error) {
    console.error("Lab Error:", error);
    return "Erro na análise laboratorial.";
  }
};

export const getPharmacoAdvice = async (patientHistory: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Switched to Flash for reliability/speed on text tasks
      contents: `Atue como Farmacologista Clínico. Analise esta anamnese de paciente odontológico: "${patientHistory}".
      
      Sugira um protocolo farmacológico COMPLETO pós-operatório para uma cirurgia de médio porte:
      1. Analgesia
      2. Anti-inflamatório
      3. Antibiótico (apenas se justificado pela anamnese, considere profilaxia se necessário)
      
      LEMBRE-SE DE CHECAR ALERGIAS DESCRITAS. Se o paciente for alérgico, sugira alternativas seguras.`,
    });
    return response.text || "Sem sugestão.";
  } catch (error) {
    console.error("Pharmaco Error", error);
    return "Erro ao obter protocolo. Tente novamente.";
  }
};

export const generateSalesScript = async (diagnosis: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Transforme este diagnóstico técnico odontológico em um Script de Venda Educativo para o paciente. Use linguagem simples, empática e persuasiva. Explique os riscos de não tratar e os benefícios do tratamento. Diagnóstico: "${diagnosis}"`,
    });
    return response.text || "Erro ao gerar script.";
  } catch (error) {
    return "Erro no motor de vendas.";
  }
};

export const getVoiceAnswer = async (question: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: `Responda de forma concisa (máximo 3 frases) para leitura em voz alta. Pergunta de um dentista: "${question}"`,
    });
    return response.text || "Não entendi.";
  } catch (error) {
    return "Erro de conexão.";
  }
};

export const analyzeAnamnesis = async (data: AnamnesisForm): Promise<string> => {
  try {
    const prompt = `
    Atue como um Especialista em Diagnóstico Oral e Estomatologia.
    Analise os dados desta Anamnese (Padrão SUS Brasil):
    
    DADOS PESSOAIS: ${JSON.stringify(data.personal)}
    HISTÓRICO DE SAÚDE (SUS): ${JSON.stringify(data.susInfo)}
    QUEIXA PRINCIPAL: "${data.complaint}"
    
    Gere um relatório estruturado contendo:
    1. **Hipótese Diagnóstica**: Baseado na queixa e histórico.
    2. **Fatores de Risco Sistêmico**: Baseado nas respostas do questionário de saúde (ex: Hipertensão, Diabetes).
    3. **Plano de Tratamento Sugerido**: Etapas iniciais.
    4. **Exames Complementares Necessários**: O que pedir para confirmar o diagnóstico.
    
    Use linguagem técnica profissional, formatado em Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text || "Erro na análise da anamnese.";
  } catch (error) {
    return "Erro ao processar anamnese.";
  }
};

// Returns a chat session for the simulator
export const createSimulationChat = (persona: SimulationPersona) => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      temperature: 1, // Higher creativity for human-like behavior
      systemInstruction: `IMPORTANTE: Você NÃO é uma IA. Você é ${persona.name}. 
      ${persona.systemPrompt}
      
      Diretrizes de Personalidade:
      1. Fale como um HUMANO brasileiro comum. Use linguagem coloquial, pausas, e até erros gramaticais leves se condizer com o perfil.
      2. NÃO dê respostas longas ou "palestras". Pacientes reais respondem de forma curta.
      3. Expresse emoções (medo, dúvida, pressa, irritação) no texto.
      4. Se o dentista usar termos muito técnicos, diga que não entendeu.
      5. Nunca saia do personagem.
      `,
    }
  });
};