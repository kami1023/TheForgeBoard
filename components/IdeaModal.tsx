import React, { useContext, useState, useEffect } from 'react';
import { X, ChevronUp, User, Calendar, MessageSquare, ChevronDown } from 'lucide-react';
import { Idea, Status, DataContextType } from '../types';
import CategoryBadge from './CategoryBadge';
import StatusBadge from './StatusBadge';
import { DataContext } from '../App';
import Button from './Button';

interface IdeaModalProps {
  idea: Idea;
  onClose: () => void;
}

const IdeaModal: React.FC<IdeaModalProps> = ({ idea, onClose }) => {
  const { voteIdea, isAdmin, updateStatus, hasVoted } = useContext(DataContext) as DataContextType;
  const [localDevNote, setLocalDevNote] = useState(idea.devNote || '');
  const [animateVote, setAnimateVote] = useState(false);
  const isVoted = hasVoted(idea.id);

  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Trigger animation when votes change
  useEffect(() => {
    setAnimateVote(true);
    const timer = setTimeout(() => setAnimateVote(false), 300);
    return () => clearTimeout(timer);
  }, [idea.votes]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleStatusChange = (newStatus: Status) => {
    updateStatus(idea.id, newStatus, localDevNote);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#1E1E1E] border border-[#FFD700] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_30px_rgba(255,215,0,0.15)] relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Hero Image (if exists) */}
        {idea.imageUrl && (
          <div className="w-full h-48 sm:h-64 overflow-hidden rounded-t-xl">
            <img src={idea.imageUrl} alt={idea.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <CategoryBadge category={idea.category} size="md" />
              <StatusBadge status={idea.status} />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {idea.title}
            </h2>

            <div className="flex items-center gap-4 text-sm text-[#CCCCCC]">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4 text-[#FFD700]" />
                {idea.author}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-[#FFD700]" />
                {new Date(idea.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
             <h3 className="text-lg font-semibold text-[#FFD700] mb-2 border-b border-gray-700 pb-2">Description</h3>
             <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
               {idea.description}
             </p>
          </div>

          {/* Dev Note / Rejection Reason */}
          {(idea.devNote || (isAdmin && idea.status === Status.REJECTED)) && (
             <div className="mb-8 p-4 bg-red-900/20 border border-red-900/50 rounded-lg">
                <h3 className="text-sm font-bold text-red-400 mb-1 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Developer Response
                </h3>
                <p className="text-gray-300 text-sm">{idea.devNote || "No response yet."}</p>
             </div>
          )}

          {/* Admin Controls */}
          {isAdmin && (
            <div className="mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-[#FFD700] font-bold mb-3 text-sm uppercase tracking-wide">Dev Console</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {Object.values(Status).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`px-3 py-2 text-xs rounded border transition-colors ${
                      idea.status === status 
                        ? 'bg-[#FFD700] text-black border-[#FFD700] font-bold' 
                        : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <textarea
                className="w-full bg-[#121212] border border-gray-700 rounded p-2 text-sm text-white focus:border-[#FFD700] outline-none"
                placeholder="Add a dev note (required for rejections)..."
                value={localDevNote}
                onChange={(e) => setLocalDevNote(e.target.value)}
                onBlur={() => updateStatus(idea.id, idea.status, localDevNote)}
              />
            </div>
          )}

          {/* Action Footer */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-800">
             <div className="flex flex-col relative p-1">
                <span className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total Votes</span>
                {/* Animated Vote Count */}
                <div className="relative">
                  <span className={`text-3xl font-bold text-white glow-text-gold block transition-transform origin-left ${animateVote ? 'animate-number-pop text-[#FFD700]' : ''}`}>
                    {idea.votes.toLocaleString()}
                  </span>
                </div>
             </div>
             
             {isVoted ? (
               <button 
                  onClick={() => voteIdea(idea.id)}
                  className="px-6 py-3 rounded-lg font-bold transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 bg-transparent border border-red-500 text-red-500 hover:bg-red-500/10 min-w-[140px] relative overflow-hidden group"
               >
                  <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                  Unvote
               </button>
             ) : (
               <Button 
                  variant="primary" 
                  onClick={() => voteIdea(idea.id)}
                  className="min-w-[140px] relative group"
               >
                  <span className="absolute inset-0 bg-white/20 scale-0 group-active:scale-150 transition-transform rounded-lg opacity-0 group-active:opacity-100 duration-300"></span>
                  <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                  Vote Up
               </Button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaModal;