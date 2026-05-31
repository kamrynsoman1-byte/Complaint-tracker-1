import React from 'react';

export const StatsCard = ({ icon: Icon, label, value, iconColor, borderColor }) => (
  <div className={`rounded-xl p-4 border ${borderColor} bg-slate-800/50`}>
    <div className="flex items-center gap-2">
      <Icon className={`w-5 h-5 ${iconColor}`} />
      <span className="text-sm text-slate-400">{label}</span>
    </div>
    <div className="text-2xl font-bold text-white mt-1">{value}</div>
  </div>
);