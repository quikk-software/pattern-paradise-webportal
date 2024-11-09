import React from 'react';
import classNames from 'classnames';
import { themeShadesDark, themeShadesLight, themeShadesMedium } from '@/lib/core/themes';

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
  return (
    <div
      key={theme}
      className={`w-12 h-12 rounded-md overflow-hidden cursor-pointer ${
        selectedTheme === theme ? 'ring-2 ring-offset-2 ring-blue-500' : ''
      }`}
      style={{
        justifySelf: 'center',
      }}
      onClick={() => handleColorSelect?.(theme)}
      onKeyDown={(e) => handleKeyDown?.(e, theme)}
      tabIndex={0}
      role="button"
      aria-pressed={selectedTheme === theme}
      aria-label={`Select ${theme}`}
    >
      <div
        style={{
          height: '33.33%',
        }}
        className={classNames(themeShadesLight[theme] || 'bg-neutral-200')}
      ></div>
      <div
        style={{
          height: '33.33%',
        }}
        className={classNames(themeShadesMedium[theme] || 'bg-neutral-500')}
      ></div>
      <div
        style={{
          height: '33.33%',
        }}
        className={classNames(themeShadesDark[theme] || 'bg-neutral-800')}
      ></div>
    </div>
  );
}
