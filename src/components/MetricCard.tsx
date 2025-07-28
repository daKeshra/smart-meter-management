import React from 'react';
import { TrendingUp } from 'lucide-react';

const MetricCard = ({ title, value, subtitle, icon: Icon, trend, color = 'emerald' }) => (
  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <Icon className={`w-5 h-5 text-${color}-400`} />
        <h3 className="text-gray-300 text-sm font-medium">{title}</h3>
      </div>
      {trend && <TrendingUp className="w-4 h-4 text-gray-500" />}
    </div>
    <div className="space-y-1">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-gray-400">{subtitle}</div>
    </div>
  </div>
);

export default MetricCard;
