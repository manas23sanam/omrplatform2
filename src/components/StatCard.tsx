import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  dark?: boolean;
  icon?: React.ReactNode;
}

export const StatCard = ({ title, value, subtitle, trend, dark, icon }: StatCardProps) => {
  return (
    <div className={`p-6 rounded-2xl flex flex-col justify-between ${dark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 shadow-sm border border-gray-100'}`}>
      <div className="flex items-start justify-between">
        <h3 className={`font-medium text-sm ${dark ? 'text-gray-300' : 'text-gray-500'}`}>{title}</h3>
        {icon && <div className={dark ? 'text-gray-400' : 'text-gray-400'}>{icon}</div>}
      </div>
      <div className="mt-4">
        <div className="text-3xl font-bold">{value}</div>
        {(subtitle || trend) && (
          <div className={`mt-1 text-sm flex items-center gap-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            {subtitle && <span>{subtitle}</span>}
            {trend && <span className="text-primary-500 font-medium flex items-center">{trend}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
