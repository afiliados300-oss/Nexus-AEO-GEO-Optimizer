import React, { useState } from 'react';
import { Send, Loader2, CheckCircle, AlertTriangle, Copy, Sparkles, Zap, FileCode, HelpCircle, BrainCircuit, Terminal, Check } from 'lucide-react';
import { AnalysisResult } from '../types';

interface OptimizerProps {
  onAnalyze: (content: string) => Promise<void>;
  isAnalyzing: boolean;
  lastResult: AnalysisResult | null;
}

// Power Prompts: Atalhos para criar conteúdo "Hackeável" por IAs
const POWER_PROMPTS = [
  { 
    id: 'faq-aeo', 
    label: 'FAQ para Voice Search (AEO)', 
    icon: HelpCircle, 
    color: 'bg-indigo-100 text-indigo-700',
    prompt: 'Crie uma lista de Perguntas Frequentes (FAQ) altamente estruturada para Voice Search sobre [TEMA]. Use perguntas diretas (Quem, O que, Onde, Como) e respostas concisas de 40-50 palavras. Adicione Schema Markup JSON-LD.' 
  },
  { 
    id: 'geo-snippet', 
    label: 'Snippets para SGE (GEO)', 
    icon: BrainCircuit, 
    color: 'bg-purple-100 text-purple-700',
    prompt: 'Escreva um parágrafo de definição autoritativa sobre [TEMA] projetado para aparecer no topo do Google SGE e Bing Chat. Use linguagem enciclopédica, listas com bullets para fácil leitura e destaque entidades semânticas principais.' 
  },
  { 
    id: 'seo-article', 
    label: 'Estrutura de Artigo (SEO)', 
    icon: FileCode, 
    color: 'bg-blue-100 text-blue-700',
    prompt: 'Gere a estrutura de headings (H1, H2, H3) perfeita para um artigo sobre [TEMA]. Inclua LSI Keywords, Title Tag otimizada e Meta Description com alto CTR.' 
  }
];

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-8 w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-slate-700 bg-[#0f172a]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#1e293b] border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-3 text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Terminal size={12} /> {language || 'CODE'}
          </span>
        </div>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
      <div className="p-6 overflow-x-auto bg-[#0f172a]">
        <pre className="font-mono text-sm leading-relaxed text-blue-100">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

const Optimizer: React.FC<OptimizerProps> = ({ onAnalyze, isAnalyzing, lastResult }) => {
  const [inputContent, setInputContent] = useState('');
  const [activeTab, setActiveTab] = useState<'report' | 'raw'>('report');

  const handleSubmit = () => {
    if (!inputContent.trim()) return;
    onAnalyze(inputContent);
  };

  const applyTemplate = (templatePrompt: string) => {
    setInputContent(templatePrompt);
  };

  // Enhanced Content Parser & Renderer
  const renderFormattedText = (text: string) => {
    const cleanText = text.replace(/\[SCORES\][\s\S]*?\[\/SCORES\]/g, '');
    const parts = cleanText.split(/(```[\s\S]*?```)/g); // Split by code blocks

    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        // Render Code Block
        const match = part.match(/```(\w*)?\n?([\s\S]*?)```/);
        const language = match ? match[1] : '';
        const code = match ? match[2] : part.replace(/```/g, '');
        return <CodeBlock key={index} code={code.trim()} language={language} />;
      } else {
        // Render Markdown-like Text
        return (
          <div key={index} className="max-w-4xl mx-auto">
            {part.split('\n').map((line, lineIdx) => {
              if (line.startsWith('## ')) {
                return (
                  <div key={`${index}-${lineIdx}`} className="mt-10 mb-6 pb-2 border-b border-slate-200 flex items-center gap-3">
                    <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
                      <Sparkles size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{line.replace('## ', '')}</h2>
                  </div>
                );
              }
              if (line.startsWith('### ')) {
                return <h3 key={`${index}-${lineIdx}`} className="text-lg font-bold text-indigo-700 mt-8 mb-3 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>{line.replace('### ', '')}</h3>;
              }
              if (line.startsWith('- ') || line.startsWith('* ')) {
                return (
                  <div key={`${index}-${lineIdx}`} className="flex items-start gap-3 ml-1 mb-3 text-slate-600 hover:bg-slate-50 p-2 rounded-lg transition-colors border-l-2 border-transparent hover:border-blue-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0"></div>
                    <span className="leading-relaxed">{line.replace(/^[-*]\s/, '')}</span>
                  </div>
                );
              }
              if (line.trim() === '') return null;
              
              return <p key={`${index}-${lineIdx}`} className="text-slate-600 mb-4 leading-relaxed text-base">{line}</p>;
            })}
          </div>
        );
      }
    });
  };

  return (
    <div className="p-8 bg-slate-50/50 min-h-screen flex gap-8">
      {/* Input Section */}
      <div className={`flex flex-col transition-all duration-500 ${lastResult ? 'w-5/12' : 'w-full max-w-5xl mx-auto'}`}>
        
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Nexus <span className="text-blue-600">Otimizador</span></h2>
          <p className="text-slate-500 mt-1">Engine de IA para reestruturação semântica e técnica.</p>
        </div>

        {/* Power Prompts Bar */}
        <div className="mb-4 grid grid-cols-3 gap-3">
          {POWER_PROMPTS.map((template) => (
            <button 
              key={template.id}
              onClick={() => applyTemplate(template.prompt)}
              className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-left flex flex-col gap-2 group"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${template.color}`}>
                <template.icon size={16} />
              </div>
              <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600">{template.label}</span>
            </button>
          ))}
        </div>
        
        <div className="bg-white rounded-3xl shadow-card border border-slate-200 p-1 flex flex-col h-[calc(100vh-300px)] relative group focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <div className="absolute top-4 right-4 z-10 bg-slate-100 px-3 py-1 rounded-full text-xs font-mono text-slate-500">Editor de Código/Texto</div>
          <textarea
            className="flex-1 w-full resize-none outline-none font-mono text-sm p-6 bg-transparent text-black placeholder-slate-400 rounded-3xl"
            placeholder="Cole seu conteúdo, código HTML ou digite um tópico aqui para gerar uma estrutura otimizada..."
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
          />
          
          <div className="p-4 bg-slate-50 rounded-b-[20px] border-t border-slate-100 flex justify-between items-center">
             <span className="text-xs font-semibold text-slate-400 pl-2">
               {inputContent.length} caracteres
             </span>
             <button
              onClick={handleSubmit}
              disabled={isAnalyzing || !inputContent}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-95"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processando IA...
                </>
              ) : (
                <>
                  <Zap size={20} className="fill-current" />
                  Executar Otimização
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {lastResult && (
        <div className="flex-1 flex flex-col animate-in slide-in-from-right-10 fade-in duration-500 h-[calc(100vh-64px)]">
           <div className="mb-6 flex items-end justify-between shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Diagnóstico & Estratégia</h2>
                <p className="text-sm text-slate-500">Relatório gerado com foco em indexabilidade.</p>
              </div>
              
              {/* Score Cards Mini */}
              <div className="flex gap-3">
                  <div className="flex flex-col items-center bg-white px-4 py-2 rounded-xl border border-blue-100 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">SEO</span>
                    <span className="text-lg font-bold text-blue-600">{lastResult.seoScore}</span>
                  </div>
                  <div className="flex flex-col items-center bg-white px-4 py-2 rounded-xl border border-indigo-100 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">AEO</span>
                    <span className="text-lg font-bold text-indigo-600">{lastResult.aeoScore}</span>
                  </div>
                  <div className="flex flex-col items-center bg-white px-4 py-2 rounded-xl border border-purple-100 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">GEO</span>
                    <span className="text-lg font-bold text-purple-600">{lastResult.geoScore}</span>
                  </div>
              </div>
           </div>

           <div className="flex-1 bg-white rounded-3xl shadow-card border border-slate-200 overflow-hidden flex flex-col relative">
              {/* Tabs */}
              <div className="flex border-b border-slate-100 shrink-0">
                <button 
                  onClick={() => setActiveTab('report')}
                  className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'report' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Relatório Visual
                </button>
                <button 
                  onClick={() => setActiveTab('raw')}
                  className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'raw' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Texto Puro / Markdown
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-white">
                  {activeTab === 'report' ? (
                    <div className="prose prose-slate max-w-none pb-20">
                      {renderFormattedText(lastResult.fullResponse)}
                    </div>
                  ) : (
                    <pre className="font-mono text-sm text-slate-600 whitespace-pre-wrap bg-slate-50 p-6 rounded-xl border border-slate-100">
                      {lastResult.fullResponse}
                    </pre>
                  )}
              </div>

              <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center shrink-0">
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <CheckCircle size={12} className="text-green-500" /> Otimização concluída com sucesso
                  </div>
                  <button 
                    className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-sm"
                    onClick={() => navigator.clipboard.writeText(lastResult.fullResponse)}
                  >
                      <Copy size={16} /> Copiar Estratégia Completa
                  </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Optimizer;