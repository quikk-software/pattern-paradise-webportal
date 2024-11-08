import React from 'react';
import classNames from 'classnames';

interface ColorPaletteProps {
  theme: string;
  selectedTheme: string | null;
  handleColorSelect?: (theme: string) => void;
  handleKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>, theme: string) => void;
}

export default function ColorPalette({
  theme,
  selectedTheme,
  handleColorSelect,
  handleKeyDown,
}: ColorPaletteProps) {
  const themeShadesLight: any = {
    slate: 'bg-slate-200',
    gray: 'bg-gray-200',
    zinc: 'bg-zinc-200',
    neutral: 'bg-neutral-200',
    stone: 'bg-stone-200',
    red: 'bg-red-200',
    orange: 'bg-orange-200',
    amber: 'bg-amber-200',
    yellow: 'bg-yellow-200',
    lime: 'bg-lime-200',
    green: 'bg-green-200',
    emerald: 'bg-emerald-200',
    teal: 'bg-teal-200',
    cyan: 'bg-cyan-200',
    sky: 'bg-sky-200',
    blue: 'bg-blue-200',
    indigo: 'bg-indigo-200',
    violet: 'bg-violet-200',
    purple: 'bg-purple-200',
    fuchsia: 'bg-fuchsia-200',
    pink: 'bg-pink-200',
    rose: 'bg-rose-200',
  };

  const themeShadesMedium: any = {
    slate: 'bg-slate-500',
    gray: 'bg-gray-500',
    zinc: 'bg-zinc-500',
    neutral: 'bg-neutral-500',
    stone: 'bg-stone-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    amber: 'bg-amber-500',
    yellow: 'bg-yellow-500',
    lime: 'bg-lime-500',
    green: 'bg-green-500',
    emerald: 'bg-emerald-500',
    teal: 'bg-teal-500',
    cyan: 'bg-cyan-500',
    sky: 'bg-sky-500',
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500',
    violet: 'bg-violet-500',
    purple: 'bg-purple-500',
    fuchsia: 'bg-fuchsia-500',
    pink: 'bg-pink-500',
    rose: 'bg-rose-500',
  };

  const themeShadesDark: any = {
    slate: 'bg-slate-800',
    gray: 'bg-gray-800',
    zinc: 'bg-zinc-800',
    neutral: 'bg-neutral-800',
    stone: 'bg-stone-800',
    red: 'bg-red-800',
    orange: 'bg-orange-800',
    amber: 'bg-amber-800',
    yellow: 'bg-yellow-800',
    lime: 'bg-lime-800',
    green: 'bg-green-800',
    emerald: 'bg-emerald-800',
    teal: 'bg-teal-800',
    cyan: 'bg-cyan-800',
    sky: 'bg-sky-800',
    blue: 'bg-blue-800',
    indigo: 'bg-indigo-800',
    violet: 'bg-violet-800',
    purple: 'bg-purple-800',
    fuchsia: 'bg-fuchsia-800',
    pink: 'bg-pink-800',
    rose: 'bg-rose-800',
  };

  return (
    <div
      key={theme}
      className={`w-12 h-12 rounded-md overflow-hidden cursor-pointer justify-self-center ${
        selectedTheme === theme ? 'ring-2 ring-offset-2 ring-blue-500' : ''
      }`}
      onClick={() => handleColorSelect?.(theme)}
      onKeyDown={(e) => handleKeyDown?.(e, theme)}
      tabIndex={0}
      role="button"
      aria-pressed={selectedTheme === theme}
      aria-label={`Select ${theme}`}
    >
      <div className={classNames('h-1/3', themeShadesLight[theme] || 'text-neutral-200')}></div>
      <div className={classNames('h-1/3', themeShadesMedium[theme] || 'text-neutral-500')}></div>
      <div className={classNames('h-1/3', themeShadesDark[theme] || 'text-neutral-800')}></div>
    </div>
  );
}
