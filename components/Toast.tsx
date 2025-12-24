import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'border-[#FFD700] bg-[#1E1E1E] text-white shadow-[0_0_20px_rgba(255,215,0,0.2)]',
    error: 'border-red-500 bg-[#1E1E1E] text-white shadow-[0_0_20px_rgba(239,68,68,0.2)]',
    info: 'border-blue-500 bg-[#1E1E1E] text-white'
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-[#FFD700]" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  return (
    <div className={`fixed top-24 right-1/2 translate-x-1/2 sm:right-6 sm:translate-x-0 z-50 flex items-center gap-3 px-6 py-4 rounded-lg border ${styles[type]} animate-in slide-in-from-top-4 fade-in duration-300`}>
      {icons[type]}
      <span className="font-bold">{message}</span>
    </div>
  );
};

export default Toast;