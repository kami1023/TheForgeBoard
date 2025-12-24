import React, { createContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import SubmissionPage from './pages/SubmissionPage';
import AnalyticsPage from './pages/AnalyticsPage';
import Toast from './components/Toast';
import { DataContextType, Idea, Status, Category, User } from './types';
import { INITIAL_IDEAS, DISCORD_CONFIG } from './constants';

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

  // Check for saved user on load and handle OAuth callback
  useEffect(() => {
    // 1. Check Local Storage
    const savedUser = localStorage.getItem('forge_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // 2. Check for OAuth Fragment (Discord Redirect)
    // The fragment looks like: #access_token=...&token_type=Bearer&expires_in=...
    // Note: Since we use HashRouter, the browser might mix the router hash with the OAuth hash if not careful.
    // Standard OAuth Implicit Grant returns parameters in the hash.
    // If the URL is http://localhost/#access_token=..., HashRouter might try to route to /access_token=...
    
    // We explicitly check window.location.hash before React Router processes it fully, 
    // or we check if the current hash contains access_token.
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
        const params = new URLSearchParams(hash.replace('#', '')); // basic parse
        // If using HashRouter, the hash might look like "#/access_token=..." or just "#access_token=..." depending on redirect URI
        // Let's try to extract access_token regardless of position
        const accessTokenMatch = hash.match(/access_token=([^&]*)/);
        
        if (accessTokenMatch && accessTokenMatch[1]) {
            const token = accessTokenMatch[1];
            handleAuthSuccess(token);
            
            // Clear the hash so the user doesn't see the ugly token and Router works
            window.location.hash = ''; 
        }
    }
    
    if (hash.includes('error')) {
        showToast("Discord Authorization Failed", "error");
        window.location.hash = '';
    }

  }, []);

  const handleAuthSuccess = async (token: string) => {
    // In a real production app, you would use this token to fetch:
    // https://discord.com/api/users/@me
    
    // For this demo, we simulate a successful fetch using the received token
    // to prove the flow completed.
    
    // Simulating API latency
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockUser: User = {
        id: '847382',
        username: 'ForgedSoul', 
        discriminator: '9921',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
    };
    setUser(mockUser);
    localStorage.setItem('forge_user', JSON.stringify(mockUser));
    showToast("Login Successful! Welcome back.");
  };

  const login = async () => {
    // ACTUAL DISCORD OAUTH REDIRECT
    // We use window.location.origin as the redirect_uri. 
    // You must add this exact URL (e.g. http://localhost:3000) to your Discord Developer Portal > OAuth2 > Redirects.
    
    const redirectUri = window.location.origin; 
    const scope = encodeURIComponent('identify guilds.join');
    const clientId = DISCORD_CONFIG.CLIENT_ID;

    if (clientId === '123456789012345678') {
        showToast("Dev Warning: Please set a valid CLIENT_ID in constants.ts", "error");
        // We proceed anyway to show the redirect happens, but Discord will show an error page.
    }
    
    // Using Implicit Grant (response_type=token) so we don't need a backend to swap code for token
    const url = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scope}`;
    
    // Redirect
    window.location.href = url;
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

          {/* Creator Footer */}
          <footer className="w-full py-8 mt-12 border-t border-white/5 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>Forged with fire by</span>
              <a 
                href="https://discord.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 px-3 py-1 rounded-full border border-[#5865F2]/30 text-[#5865F2] transition-colors group"
              >
                <div className="w-5 h-5 rounded-full bg-[#5865F2] flex items-center justify-center text-white text-[10px] font-bold">K</div>
                <span className="font-medium group-hover:underline">Kami</span>
              </a>
            </div>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest">The Voice of the Community</p>
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