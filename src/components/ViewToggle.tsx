import React from 'react';
import { LayoutGrid, Table } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ViewToggle: React.FC = () => {
  const { userPreferences, setViewMode } = useTheme();

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <button
        onClick={() => setViewMode('table')}
        className={`p-2 rounded-lg transition-colors ${
          userPreferences.viewMode === 'table'
            ? 'bg-white dark:bg-gray-700 shadow-sm'
            : 'hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        title="Vue tableau"
      >
        <Table className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </button>
      <button
        onClick={() => setViewMode('gallery')}
        className={`p-2 rounded-lg transition-colors ${
          userPreferences.viewMode === 'gallery'
            ? 'bg-white dark:bg-gray-700 shadow-sm'
            : 'hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        title="Vue galerie"
      >
        <LayoutGrid className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </button>
    </div>
  );
};

export default ViewToggle;