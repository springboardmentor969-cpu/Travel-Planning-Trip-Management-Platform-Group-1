import React from 'react';
import { Compass } from 'lucide-react';

const LoadingSpinner = ({ text = 'Loading...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <div className="relative">
        <Compass className="w-12 h-12 text-emerald-500 animate-spin" />
        <div className="absolute inset-0 rounded-full border-4 border-emerald-200 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-sm font-medium text-slate-500 animate-pulse">{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
