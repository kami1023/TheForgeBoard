import React, { useContext } from 'react';
import { Idea, DataContextType } from '../types';
import { DataContext } from '../App';
import { Crown, Trophy, ChevronUp } from 'lucide-react';
import CategoryBadge from './CategoryBadge';

interface PodiumProps {
  topIdeas: Idea[];
  onOpenIdea: (idea: Idea) => void;
  onVote: (e: React.MouseEvent, id: string) => void;
}

const Podium: React.FC<PodiumProps> = ({ topIdeas, onOpenIdea, onVote }) => {
  const { hasVoted } = useContext(DataContext) as DataContextType;

  // Ensure we have 3 slots even if fewer ideas
  const first = topIdeas[0];
  const second = topIdeas[1];
  const third = topIdeas[2];

  if (!first) return null;

  const renderCard = (idea: Idea | undefined, position: 1 | 2 | 3) => {
    if (!idea) return (
        <div className="w-full sm:w-1/3 h-40 opacity-10 bg-white/5 rounded-xl border border-white/10"></div>
    );
    
    const isVoted = hasVoted(idea.id);

    // Styles config
    const config = {
      1: {
        borderColor: 'border-[#FFD700]',
        textColor: 'text-[#FFD700]',
        glow: 'shadow-[0_0_30px_rgba(255,215,0,0.15)]',
        icon: <Crown className="w-5 h-5 text-[#FFD700]" />,
        rankText: '1st',
        height: 'min-h-[280px]',
        bg: 'bg-[#1A1A1A]'
      },
      2: {
        borderColor: 'border-[#A1A1AA]', // Silver
        textColor: 'text-[#A1A1AA]',
        glow: 'shadow-[0_0_20px_rgba(161,161,170,0.1)]',
        icon: <Trophy className="w-4 h-4 text-[#A1A1AA]" />,
        rankText: '2nd',
        height: 'min-h-[240px] mt-4 sm:mt-12',
        bg: 'bg-[#151515]'
      },
      3: {
        borderColor: 'border-[#B45309]', // Bronze
        textColor: 'text-[#B45309]',
        glow: 'shadow-[0_0_20px_rgba(180,83,9,0.1)]',
        icon: <Trophy className="w-4 h-4 text-[#B45309]" />,
        rankText: '3rd',
        height: 'min-h-[240px] mt-4 sm:mt-12',
        bg: 'bg-[#151515]'
      }
    };

    const s = config[position];

    return (
      <div 
        onClick={() => onOpenIdea(idea)}
        className={`relative flex-1 ${s.bg} rounded-xl border ${s.borderColor} ${s.glow} p-4 flex flex-col items-center text-center cursor-pointer transition-transform hover:-translate-y-1 group ${s.height}`}
      >
        {/* Floating Icon Badge */}
        <div className={`absolute -top-4 w-8 h-8 rounded-full bg-[#09090b] border ${s.borderColor} flex items-center justify-center z-10`}>
            {s.icon}
        </div>

        <div className="mt-4 mb-2">
            <CategoryBadge category={idea.category} />
        </div>

        <h3 className="text-white font-bold text-sm leading-tight line-clamp-3 mb-4 flex-1 flex items-center justify-center">
            {idea.title}
        </h3>

        {/* Votes */}
        <div className="flex flex-col items-center gap-1 mb-4">
            <button 
               onClick={(e) => onVote(e, idea.id)}
               className={`transition-colors ${isVoted ? 'text-[#FFD700]' : 'text-gray-500 hover:text-white'}`}
            >
               <ChevronUp className={`w-6 h-6 ${isVoted ? 'stroke-[3px]' : ''}`} />
            </button>
            <span className={`text-xl font-bold ${s.textColor} animate-in zoom-in`}>{idea.votes}</span>
        </div>

        {/* Rank Footer */}
        <div className="w-full pt-2 border-t border-white/5">
            <span className={`font-black text-2xl opacity-20 ${s.textColor}`}>{s.rankText}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6">
        {/* Layout: 2nd - 1st - 3rd */}
        {renderCard(second, 2)}
        {renderCard(first, 1)}
        {renderCard(third, 3)}
    </div>
  );
};

export default Podium;