import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-lg font-bold transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-[#FFD700] text-black hover:bg-[#FFE55C] hover:shadow-[0_0_15px_rgba(255,215,0,0.4)] border border-[#FFD700]",
    secondary: "bg-transparent border border-[#00FFFF] text-[#00FFFF] hover:bg-[rgba(0,255,255,0.1)] hover:shadow-[0_0_10px_rgba(0,255,255,0.3)]",
    danger: "bg-transparent border border-red-500 text-red-500 hover:bg-red-500/10 hover:shadow-[0_0_10px_rgba(239,68,68,0.3)]",
    ghost: "bg-transparent text-gray-400 hover:text-white"
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;