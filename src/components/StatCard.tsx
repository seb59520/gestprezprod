import React from 'react';
import { Link } from 'react-router-dom';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  link: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, link }) => {
  return (
    <Link 
      to={link} 
      className={`card p-6 hover:scale-[1.02] transition-all duration-200 cursor-pointer ${color}`}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-xl shadow-lg">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
        </div>
      </div>
    </Link>
  );
};

export default StatCard;