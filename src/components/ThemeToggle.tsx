
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="relative h-9 w-16 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-all duration-300 hover:scale-105"
    >
      <div className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-gradient-to-r transition-all duration-300 ${
        isDark 
          ? 'translate-x-7 from-blue-400 to-purple-500' 
          : 'translate-x-0 from-yellow-400 to-orange-500'
      }`}>
        <div className="w-full h-full flex items-center justify-center text-white text-xs">
          {isDark ? '🌙' : '☀️'}
        </div>
      </div>
    </Button>
  );
};
