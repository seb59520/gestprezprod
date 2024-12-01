import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

const FullscreenToggle: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      title={isFullscreen ? 'Quitter le mode plein écran' : 'Mode plein écran'}
    >
      {isFullscreen ? (
        <Minimize2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      ) : (
        <Maximize2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      )}
    </button>
  );
};

export default FullscreenToggle;