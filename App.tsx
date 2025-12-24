import React, { createContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import SubmissionPage from './pages/SubmissionPage';
import AnalyticsPage from './pages/AnalyticsPage';
import Toast from './components/Toast';
import { DataContextType, Idea, Status, Category, User } from './types';
import { INITIAL_IDEAS, DISCORD_CONFIG } from './constants';
import { ExternalLink } from 'lucide-react';

export const DataContext = createContext<DataContextType | null>(null);

const App: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>(INITIAL_IDEAS);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  // Check for saved user on load
  useEffect(() => {
    const savedUser = localStorage.getItem('forge_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async () => {
    // SIMULATION MODE
    // Since we don't have real keys, we simulate the experience.
    
    // 1. Simulate connecting to Discord
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // 2. Simulate "Verifying Guild Membership"
    // This gives the user feedback that we are checking if they are in the server
    showToast("Verifying membership in 'The Forge Official'...", "info");
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 3. Success State
    const mockUser: User = {
        id: '847382',
        username: 'ForgedSoul', 
        discriminator: '9921',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
    };
    
    setUser(mockUser);
    localStorage.setItem('forge_user', JSON.stringify(mockUser));
    showToast("Verified! Welcome to the Forge.", "success");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('forge_user');
    showToast('Logged out successfully', 'info');
  };

  const addIdea = (newIdeaData: Omit<Idea, 'id' | 'votes' | 'createdAt' | 'status'>) => {
    const newIdea: Idea = {
      ...newIdeaData,
      id: Math.random().toString(36).substr(2, 9),
      votes: 1, // Self vote
      status: Status.OPEN,
      createdAt: new Date().toISOString()
    };
    setIdeas(prev => [newIdea, ...prev]);
    showToast("Idea Submitted Successfully!");
  };

  const voteIdea = (id: string) => {
    if (!user) {
      showToast("Please login with Discord to vote", "error");
      return;
    }

    const isVoted = votedIds.has(id);

    // Update Ideas State
    setIdeas(prevIdeas => prevIdeas.map(idea => {
      if (idea.id === id) {
        return { 
          ...idea, 
          votes: idea.votes + (isVoted ? -1 : 1) 
        };
      }
      return idea;
    }));
    
    // Update Voted IDs
    setVotedIds(prev => {
      const next = new Set(prev);
      if (isVoted) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    if (!isVoted) {
      showToast("Vote Recorded!", "success");
    }
  };

  const updateStatus = (id: string, status: Status, devNote?: string) => {
    setIdeas(prev => prev.map(idea => {
      if (idea.id === id) {
        return { ...idea, status, devNote };
      }
      return idea;
    }));
    showToast(`Status updated to ${status}`);
  };

  const toggleAdmin = () => {
    setIsAdmin(prev => !prev);
  };

  const hasVoted = (id: string) => {
    return votedIds.has(id);
  };

  const contextValue: DataContextType = {
    ideas,
    user,
    login,
    logout,
    addIdea,
    voteIdea,
    updateStatus,
    isAdmin,
    toggleAdmin,
    hasVoted
  };

  return (
    <DataContext.Provider value={contextValue}>
      <HashRouter>
        <div className="min-h-screen w-full bg-[#09090b] text-white font-sans selection:bg-[#FFD700] selection:text-black flex flex-col">
          <Navbar isAdmin={isAdmin} onToggleAdmin={toggleAdmin} />
          
          <main className="flex-1 w-full relative z-0">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/submit" element={<SubmissionPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Routes>
          </main>

          {/* Footer - Made by Kami */}
          <footer className="w-full py-10 mt-12 border-t border-white/5 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-6">
            
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Forged By</span>
              
              <a 
                href="https://discord.gg/theforgers" 
                target="_blank" 
                rel="noreferrer"
                className="group flex items-center gap-4 bg-[#1E1E1E] hover:bg-[#252525] border border-white/10 hover:border-[#FFD700]/50 pl-2 pr-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-[#FFD700]/10"
              >
                <div className="relative">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kami&backgroundColor=b6e3f4" 
                    alt="Kami" 
                    className="w-10 h-10 rounded-full border-2 border-[#1E1E1E] group-hover:border-[#FFD700] transition-colors"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#10B981] w-3 h-3 rounded-full border-2 border-[#1E1E1E]"></div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-white font-bold leading-none group-hover:text-[#FFD700] transition-colors">Kami</span>
                  <span className="text-[10px] text-gray-500 group-hover:text-gray-400">System Architect</span>
                </div>

                <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors ml-2" />
              </a>
            </div>

            <p className="text-[10px] text-gray-700">© 2024 Forge Board. All rights reserved.</p>
          </footer>
          
          {toast && (
            <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
            />
          )}
        </div>
      </HashRouter>
    </DataContext.Provider>
  );
};

export default App;