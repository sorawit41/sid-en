import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('chTheme');
    if (theme === 'light') {
      setIsLight(true);
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggleTheme = () => {
    setIsLight((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('light');
        localStorage.setItem('chTheme', 'light');
      } else {
        document.documentElement.classList.remove('light');
        localStorage.setItem('chTheme', 'dark');
      }
      return next;
    });
  };

  return (
    <button
      className="fixed top-4 right-4 z-50 bg-card border border-border rounded-[40px] py-1.5 pr-3.5 pl-2.5 flex items-center gap-2 cursor-pointer font-sans text-xs text-muted shadow-[0_2px_16px_rgba(0,0,0,0.35)] transition-all duration-300 select-none hover:border-accent hover:text-text"
      onClick={toggleTheme}
    >
      <span>{isLight ? '☀️' : '🌙'}</span>
      <div className={`w-[34px] h-[18px] rounded-[9px] relative transition-colors duration-300 ${isLight ? 'bg-accent' : 'bg-track'}`}>
        <div className={`w-3 h-3 rounded-full bg-white absolute top-[3px] left-[3px] transition-transform duration-300 shadow-[0_1px_4px_rgba(0,0,0,0.3)] ${isLight ? 'translate-x-[16px]' : ''}`}></div>
      </div>
      <span>{isLight ? 'Light' : 'Dark'}</span>
    </button>
  );
}
