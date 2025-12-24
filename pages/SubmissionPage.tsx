import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../App';
import { DataContextType, Category } from '../types';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { Upload, Lightbulb } from 'lucide-react';

const SubmissionPage: React.FC = () => {
  const { addIdea, user } = useContext(DataContext) as DataContextType;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: Category.IMPROVEMENTS,
    author: '',
    imageUrl: ''
  });

  // Auto-fill author if user is logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, author: user.username }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    addIdea({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      author: formData.author || 'Anonymous',
      imageUrl: formData.imageUrl || undefined
    });

    setIsLoading(false);
    navigate('/');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, imageUrl: url });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-2xl bg-[#1E1E1E] p-8 rounded-2xl border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#FFD700]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FFD700]/30">
            <Lightbulb className="w-6 h-6 text-[#FFD700]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Submit an Idea</h1>
          <p className="text-gray-400">Make your voice heard. Shape the future of The Forge.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Title</label>
            <input 
              required
              maxLength={80}
              type="text" 
              className="w-full bg-[#121212] border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none transition-colors"
              placeholder="e.g., Guild Housing System"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Category</label>
            <div className="flex flex-wrap gap-2">
              {Object.values(Category).map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                    formData.category === cat 
                      ? 'bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]' 
                      : 'bg-[#121212] border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Description</label>
            <textarea 
              required
              className="w-full h-32 bg-[#121212] border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none transition-colors resize-none"
              placeholder="Describe your idea in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Image Upload (Mock) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Screenshot (Optional)</label>
            <div className="relative border-2 border-dashed border-gray-700 rounded-lg p-4 hover:border-[#FFD700] transition-colors bg-[#121212]">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                <Upload className="w-5 h-5" />
                <span className="text-sm">{formData.imageUrl ? 'Image Selected (Click to change)' : 'Click to upload an image'}</span>
              </div>
            </div>
            {formData.imageUrl && (
              <img src={formData.imageUrl} alt="Preview" className="h-20 w-auto rounded border border-gray-700 mt-2 object-cover" />
            )}
          </div>

          {/* Author */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Username</label>
            <input 
              required
              maxLength={20}
              type="text" 
              className={`w-full bg-[#121212] border border-gray-700 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none transition-colors ${user ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="Enter your display name"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              readOnly={!!user}
              title={user ? "Logged in as " + user.username : ""}
            />
          </div>

          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? 'Transmitting...' : 'Submit Idea'}
          </Button>

        </form>
      </div>
    </div>
  );
};

export default SubmissionPage;