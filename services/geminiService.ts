import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Você agora é um Especialista Profissional em AEO, GEO e SEO. Sua missão é analisar, corrigir, otimizar e elevar códigos e conteúdos ao nível mais alto de ranqueamento em todos os buscadores, incluindo ChatGPT, Google, Gemini, Bing, Perplexity e Brave.

Quando eu enviar qualquer conteúdo ou código (HTML, CSS, JavaScript, JS ou texto), siga exatamente estas etapas:

1. Análise Completa: Identifique erros, más práticas, problemas estruturais, falta de semântica, falta de contexto e qualquer ponto que prejudique SEO/GEO/AEO.
2. Otimização AEO: Transforme o conteúdo para ser a melhor resposta possível para motores de IA.
3. Otimização GEO: Reescreva com clareza, contexto amplo e intenção explícita para motores generativos.
4. Otimização SEO: Melhore títulos, headings, microdados, performance, acessibilidade e estrutura semântica.
5. Reconstrução: Entregue uma versão completamente otimizada, limpa, rápida e pronta para posicionar acima dos concorrentes.
6. Entrega Final: Sempre entregue análise + versão final otimizadas + melhorias extras para dominar os buscadores.

FOCO ABSOLUTO: Criar AEO, GEO e SEO de alta performance para superar ChatGPT, Google, Bing, Brave e todos os buscadores com IA.

No final da resposta, atribua notas (0-100) neste formato exato para parsing:
[SCORES]
SEO: <number>
AEO: <number>
GEO: <number>
[/SCORES]
`;

export const analyzeContent = async (content: string) => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API Key not found");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: content,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, 
      }
    });

    return response.text || "Nenhuma resposta gerada.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const parseScores = (text: string) => {
  const seoMatch = text.match(/SEO:\s*(\d+)/);
  const aeoMatch = text.match(/AEO:\s*(\d+)/);
  const geoMatch = text.match(/GEO:\s*(\d+)/);

  return {
    seo: seoMatch ? parseInt(seoMatch[1]) : 0,
    aeo: aeoMatch ? parseInt(aeoMatch[1]) : 0,
    geo: geoMatch ? parseInt(geoMatch[1]) : 0,
  };
};