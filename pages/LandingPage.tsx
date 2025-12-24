import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from '../App';
import { DataContextType, Category, Status, SortOption, Idea } from '../types';
import Podium from '../components/Podium';
import IdeaCard from '../components/IdeaCard';
import IdeaModal from '../components/IdeaModal';
import { Sparkles, Tag } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { ideas, voteIdea } = useContext(DataContext) as DataContextType;
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  
  // CHANGED: Store ID instead of object to prevent stale data
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);

  // Derive the selected idea object from the live ideas array
  const selectedIdea = useMemo(() => 
    ideas.find(i => i.id === selectedIdeaId) || null
  , [ideas, selectedIdeaId]);

  // Sorting Logic (Default by votes for main view)
  const filteredIdeas = useMemo(() => {
    let result = [...ideas];

    if (selectedCategory !== 'All') {
      result = result.filter(idea => idea.category === selectedCategory);
    }

    // Always sort by votes desc
    result.sort((a, b) => b.votes - a.votes);

    return result;
  }, [ideas, selectedCategory]);

  // Split into Top 3 and Rest
  const topIdeas = filteredIdeas.slice(0, 3);
  const remainingIdeas = filteredIdeas.slice(3);

  const handleVote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    voteIdea(id);
  };

  const handleOpenIdea = (idea: Idea) => {
    setSelectedIdeaId(idea.id);
  };

  return (
    <div className="flex flex-col items-center w-full px-4 pb-12">
      
      {/* Tagline Pill */}
      <div className="mt-4 mb-8">
        <div className="flex items-center gap-2 px-6 py-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5 text-[#FFD700] text-sm font-medium italic animate-pulse">
            <Sparkles className="w-3 h-3" />
            the voice of the community, not hidden, but shining
        </div>
      </div>

      {/* Filter Section (Outside Board) */}
      <div className="w-full max-w-[1400px] mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest font-bold">
                <Tag className="w-3 h-3" />
                Filter by Tag
            </div>
            <div className="flex flex-wrap gap-2">
                <button
                onClick={() => setSelectedCategory('All')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === 'All' ? 'bg-[#FFD700] text-black shadow-[0_0_10px_rgba(255,215,0,0.4)]' : 'bg-[#18181b] text-gray-400 hover:text-white border border-white/10'}`}
                >
                All
                </button>
                {Object.values(Category).map((cat) => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-[#FFD700] text-black shadow-[0_0_10px_rgba(255,215,0,0.4)]' : 'bg-[#18181b] text-gray-400 hover:text-white border border-white/10'}`}
                >
                    {cat}
                </button>
                ))}
            </div>
        </div>
      </div>

      <div className="w-full max-w-[1400px] mb-2 text-sm text-[#FFD700] font-medium">
        Showing: <span className="text-white">All community ideas</span>
      </div>

      {/* THE RANKING BOARD (Top 3 Only) */}
      <div className="board-wrapper w-full max-w-[1400px] p-6 sm:p-10 relative mb-12">
        <div className="board-vignette"></div>
        
        <div className="relative z-10">
            <div className="w-full flex justify-center mb-8">
                <div className="bg-[#0f0f0f] px-8 py-3 border border-[#FFD700] rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.2)] flex flex-col items-center">
                    <h2 className="text-[#FFD700] font-bold tracking-widest uppercase text-xl text-center">
                        Community Forge
                    </h2>
                    <div className="text-[10px] text-gray-500 text-center uppercase tracking-wider">All Ideas Ranked</div>
                </div>
            </div>

            <Podium topIdeas={topIdeas} onOpenIdea={handleOpenIdea} onVote={handleVote} />
        </div>
      </div>

      {/* Grid List Section (Outside the board) */}
      <div className="w-full max-w-[1400px]">
          {remainingIdeas.length > 0 && (
            <div className="flex items-center gap-4 mb-6">
                 <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                 <span className="text-xs uppercase tracking-[0.2em] text-gray-500">
                     Ideas #{4}-{filteredIdeas.length}
                 </span>
                 <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {remainingIdeas.map((idea, index) => (
                  <IdeaCard 
                      key={idea.id}
                      idea={idea}
                      rank={index + 4}
                      onClick={handleOpenIdea}
                      onVote={handleVote}
                  />
              ))}
          </div>
      </div>

      {/* Footer Stat */}
      <div className="mt-8 flex items-center gap-2 text-gray-500 text-sm">
        <div className="w-2 h-2 rounded-full bg-[#FFD700]"></div>
        Total: <span className="text-white font-bold">{ideas.length} ideas</span>
      </div>

      {/* Modal - only render if we have a valid selectedIdea */}
      {selectedIdea && (
        <IdeaModal idea={selectedIdea} onClose={() => setSelectedIdeaId(null)} />
      )}
    </div>
  );
};

export default LandingPage;