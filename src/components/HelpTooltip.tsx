import React from 'react';
import { HelpCircle } from 'lucide-react';
import Tooltip from './ui/Tooltip';

interface HelpTooltipProps {
  title: string;
  content: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({ 
  title, 
  content,
  position = 'top'
}) => {
  return (
    <Tooltip
      content={
        <div className="w-64">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h4>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {content}
          </div>
        </div>
      }
      position={position}
    >
      <button className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <HelpCircle className="h-4 w-4" />
      </button>
    </Tooltip>
  );
};

export default HelpTooltip;