import React from 'react';
import { Category } from '../types';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md';
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1';
  
  const styles = {
    [Category.IMPROVEMENTS]: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    [Category.BUG]: "bg-red-500/10 text-red-400 border border-red-500/20",
    [Category.CONTENT]: "bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20",
    [Category.BALANCE]: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    [Category.UI_UX]: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  };

  return (
    <span className={`inline-flex items-center rounded-md font-medium ${styles[category]} ${sizeClasses}`}>
      {category}
    </span>
  );
};

export default CategoryBadge;