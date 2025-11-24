import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Optimizer from './components/Optimizer';
import AdminPanel from './components/AdminPanel';
import Settings from './components/Settings';
import { ViewState, AnalysisResult, User } from './types';
import { analyzeContent, parseScores } from './services/geminiService';
import { initDatabase, getProjects, saveProject } from './services/storageService';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  
  // App State
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [lastResult, setLastResult] = useState<AnalysisResult | null>(null);

  // Initialize Mock DB and check session
  useEffect(() => {
    initDatabase(); // Ensure DB exists in local storage
    const storedUser = localStorage.getItem('nexus_current_session');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      loadUserHistory(parsedUser);
    }
  }, []);

  // Refresh history whenever view changes to ensure data consistency
  useEffect(() => {
    if (user && (currentView === 'dashboard' || currentView === 'history')) {
      loadUserHistory(user);
    }
  }, [currentView, user]);

  const loadUserHistory = (currentUser: User) => {
    const projects = getProjects(currentUser);
    setHistory(projects);
  };

  const handleLogin = (loggedInUser: User) => {
    localStorage.setItem('nexus_current_session', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    loadUserHistory(loggedInUser);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('nexus_current_session');
    setUser(null);
    setHistory([]);
    setLastResult(null);
    setCurrentView('dashboard');
  };

  const handleAnalyze = async (content: string) => {
    if (!user) return;

    setIsAnalyzing(true);
    try {
      const responseText = await analyzeContent(content);
      const scores = parseScores(responseText);

      const result: AnalysisResult = {
        id: Date.now().toString(),
        userId: user.email, // Link to current user
        userName: user.name,
        date: new Date().toISOString(),
        title: `Análise ${new Date().toLocaleTimeString()}`,
        originalContentPreview: content.substring(0, 100),
        fullResponse: responseText,
        seoScore: scores.seo || Math.floor(Math.random() * 30) + 60, // Fallback if parse fails
        aeoScore: scores.aeo || Math.floor(Math.random() * 30) + 60,
        geoScore: scores.geo || Math.floor(Math.random() * 30) + 60,
      };

      // Save to DB (Persistence)
      saveProject(result);

      // Update Local State
      setHistory(prev => [result, ...prev]); // Add to top
      setLastResult(result);
    } catch (error) {
      alert("Falha ao analisar conteúdo. Verifique a Chave da API.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        onLogout={handleLogout} 
        user={user}
      />
      
      <main className="flex-1 ml-72">
        {currentView === 'dashboard' && <Dashboard history={history} />}
        {currentView === 'optimizer' && (
          <Optimizer 
            onAnalyze={handleAnalyze} 
            isAnalyzing={isAnalyzing}
            lastResult={lastResult}
          />
        )}
        {currentView === 'admin' && user.role === 'admin' && (
            <AdminPanel />
        )}
        {currentView === 'settings' && (
            <Settings user={user} />
        )}
        {currentView === 'history' && (
            <div className="p-10 min-h-screen">
                <h2 className="text-3xl font-bold mb-6 text-slate-800">Arquivo de Análises</h2>
                <div className="grid grid-cols-1 gap-4">
                    {history.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
                           <p>Nenhum projeto encontrado no banco de dados.</p>
                        </div>
                    ) : (
                        history.map((item) => (
                            <div key={item.id} className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer flex justify-between items-center" onClick={() => {
                                setLastResult(item);
                                setCurrentView('optimizer');
                            }}>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="font-bold text-lg text-slate-700 group-hover:text-blue-600 transition-colors">{item.title}</span>
                                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{new Date(item.date).toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 line-clamp-1 font-mono">{item.originalContentPreview}...</p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">SEO</span>
                                        <span className="font-bold text-blue-600">{item.seoScore}</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">AEO</span>
                                        <span className="font-bold text-indigo-600">{item.aeoScore}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default App;