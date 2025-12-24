import React, { useContext, useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { Idea, DataContextType } from '../types';
import { DataContext } from '../App';
import CategoryBadge from './CategoryBadge';
import StatusBadge from './StatusBadge';

interface IdeaCardProps {
  idea: Idea;
  rank: number;
  onClick: (idea: Idea) => void;
  onVote: (e: React.MouseEvent, id: string) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, rank, onClick, onVote }) => {
  const { hasVoted } = useContext(DataContext) as DataContextType;
  const isVoted = hasVoted(idea.id);
  const [animate, setAnimate] = useState(false);

  // Trigger animation when votes change
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 300);
    return () => clearTimeout(timer);
  }, [idea.votes]);

  return (
    <div 
      onClick={() => onClick(idea)}
      className="bg-[#18181b] border border-white/5 rounded-xl p-3 flex gap-3 hover:bg-[#202022] hover:border-gray-600 transition-all cursor-pointer group h-full"
    >
      {/* Left Column: Rank & Votes */}
      <div className="flex flex-col gap-2 w-14 shrink-0">
        {/* Rank Box */}
        <div className={`w-full aspect-square rounded-lg flex items-center justify-center font-bold text-sm shadow-inner ${rank <= 10 ? 'bg-[#FFD700] text-black' : 'bg-[#27272a] text-gray-400'}`}>
            {rank}
        </div>
        
        {/* Vote Box */}
        <div 
            onClick={(e) => onVote(e, idea.id)}
            className={`w-full py-2 rounded-lg flex flex-col items-center justify-center gap-0.5 border transition-colors ${isVoted ? 'bg-[#FFD700]/10 border-[#FFD700]/50' : 'bg-[#27272a] border-transparent hover:bg-[#323235]'}`}
        >
            <ChevronUp className={`w-3 h-3 ${isVoted ? 'text-[#FFD700]' : 'text-gray-500'}`} />
            <span className={`text-xs font-bold ${animate ? 'animate-jump' : ''} ${isVoted ? 'text-[#FFD700]' : 'text-gray-300'}`}>
                {idea.votes}
            </span>
        </div>
      </div>

      {/* Right Column: Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 mb-2 group-hover:text-[#FFD700] transition-colors">
            {idea.title}
        </h3>
        
        <div className="mt-auto flex flex-wrap gap-2">
            <CategoryBadge category={idea.category} />
            {idea.status !== 'Open' && <StatusBadge status={idea.status} />}
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;