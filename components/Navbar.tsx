import React, { useContext, useState } from 'react';
import { Flame, BarChart3, Plus, LogIn, LogOut, User, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { DataContext } from '../App';
import { DataContextType } from '../types';

interface NavbarProps {
  isAdmin: boolean;
  onToggleAdmin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAdmin, onToggleAdmin }) => {
  const location = useLocation();
  const { user, login, logout } = useContext(DataContext) as DataContextType;
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      await login();
    } catch (e) {
      console.error("Login failed", e);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <nav className="w-full py-4 px-6 md:px-10 flex flex-col md:flex-row items-center justify-between bg-transparent z-50 gap-4">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="text-[#FFD700] transition-transform group-hover:scale-110">
          <Flame className="w-8 h-8 fill-current" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl tracking-tight text-white leading-none">
            Forge Board
          </span>
          <span className="text-[10px] text-gray-500 italic tracking-wide hidden sm:block">
            the voice of the community, not hidden, but shining
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        {/* Navigation Buttons */}
        <Link to="/">
            <button className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${location.pathname === '/' ? 'bg-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]' : 'bg-[#1E1E1E] text-gray-300 hover:text-white border border-gray-700'}`}>
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Rankings</span>
            </button>
        </Link>
        
        <Link to="/submit">
            <button className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all border ${location.pathname === '/submit' ? 'bg-[#FFD700] text-black border-[#FFD700]' : 'bg-[#18181b] text-white border-white/10 hover:bg-[#27272a]'}`}>
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Submit Idea</span>
            </button>
        </Link>

        <div className="h-6 w-[1px] bg-gray-800 mx-2"></div>

        {/* User / Login Section */}
        {user ? (
          <div className="flex items-center gap-3 bg-[#18181b] border border-white/10 rounded-full px-2 py-1 pr-4">
            <img 
              src={user.avatar} 
              alt={user.username} 
              className="w-8 h-8 rounded-full border border-gray-700"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white leading-none">{user.username}</span>
              <span className="text-[10px] text-gray-500 leading-none">#{user.discriminator}</span>
            </div>
            <button 
              onClick={logout}
              className="ml-2 text-gray-500 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button 
            onClick={handleLogin}
            disabled={isLoggingIn}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-[#5865F2]/20 ${
              isLoggingIn 
              ? 'bg-[#404EED] text-white/80 cursor-wait'
              : 'bg-[#5865F2] hover:bg-[#4752C4] text-white'
            }`}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Verifying Membership...</span>
                <span className="sm:hidden">Verifying...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Login with Discord</span>
                <span className="sm:hidden">Login</span>
              </>
            )}
          </button>
        )}

        {/* Secret Admin Toggle */}
        <button 
          onClick={onToggleAdmin}
          className={`text-[10px] px-2 py-1 rounded border border-white/5 text-gray-700 hover:text-gray-500 uppercase tracking-wider transition-colors ml-2 ${isAdmin ? 'text-[#FFD700] border-[#FFD700]' : ''}`}
        >
          {isAdmin ? 'Dev Mode' : 'v1.0'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;