import React, { useContext } from 'react';
import { DataContext } from '../App';
import { DataContextType, Category, Status } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AnalyticsPage: React.FC = () => {
  const { ideas } = useContext(DataContext) as DataContextType;

  // Prepare Data for Category Pie Chart
  const categoryData = Object.values(Category).map(cat => ({
    name: cat,
    value: ideas.filter(i => i.category === cat).length
  }));

  // Prepare Data for Status Bar Chart
  const statusData = Object.values(Status).map(stat => ({
    name: stat,
    count: ideas.filter(i => i.status === stat).length
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const STATUS_COLORS = {
    [Status.OPEN]: '#4B5563',
    [Status.PLANNED]: '#3B82F6',
    [Status.IN_PROGRESS]: '#EAB308',
    [Status.RELEASED]: '#10B981',
    [Status.REJECTED]: '#EF4444',
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1E1E1E] border border-gray-700 p-2 rounded shadow-lg">
          <p className="text-white font-bold">{`${label || payload[0].name} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Community Pulse</h1>
        <p className="text-gray-400">Data-driven insights from the board.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-6 border-l-4 border-[#FFD700] pl-3">Idea Categories</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="#1E1E1E"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-6 border-l-4 border-[#00FFFF] pl-3">Development Pipeline</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis stroke="#9CA3AF" />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name as Status]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Basic Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
         <div className="bg-[#1E1E1E] p-4 rounded-lg border border-gray-800 text-center">
            <p className="text-gray-400 text-xs uppercase tracking-wider">Total Ideas</p>
            <p className="text-2xl font-bold text-white">{ideas.length}</p>
         </div>
         <div className="bg-[#1E1E1E] p-4 rounded-lg border border-gray-800 text-center">
            <p className="text-gray-400 text-xs uppercase tracking-wider">Total Votes</p>
            <p className="text-2xl font-bold text-[#FFD700]">{ideas.reduce((acc, curr) => acc + curr.votes, 0).toLocaleString()}</p>
         </div>
         <div className="bg-[#1E1E1E] p-4 rounded-lg border border-gray-800 text-center">
            <p className="text-gray-400 text-xs uppercase tracking-wider">Shipped</p>
            <p className="text-2xl font-bold text-green-400">{ideas.filter(i => i.status === Status.RELEASED).length}</p>
         </div>
         <div className="bg-[#1E1E1E] p-4 rounded-lg border border-gray-800 text-center">
            <p className="text-gray-400 text-xs uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-bold text-blue-400">{ideas.filter(i => i.status === Status.OPEN).length}</p>
         </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;