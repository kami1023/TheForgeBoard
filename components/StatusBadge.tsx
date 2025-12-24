import React from 'react';
import { Status } from '../types';

interface StatusBadgeProps {
  status: Status;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles = {
    [Status.OPEN]: "bg-gray-800 text-gray-400 border-gray-700",
    [Status.PLANNED]: "bg-blue-900/40 text-blue-300 border-blue-800",
    [Status.IN_PROGRESS]: "bg-yellow-900/40 text-yellow-300 border-yellow-800",
    [Status.RELEASED]: "bg-green-900/40 text-green-400 border-green-800",
    [Status.REJECTED]: "bg-red-900/40 text-red-400 border-red-800",
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide border ${styles[status]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;