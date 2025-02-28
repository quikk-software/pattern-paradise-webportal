import { cn } from '@/lib/utils';

interface PulsatingDotProps {
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'custom';
  customColor?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PulsatingDot({
  color = 'primary',
  customColor,
  size = 'md',
  className,
}: PulsatingDotProps) {
  const sizeMap = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  const colorMap = {
    primary: 'bg-primary',
    secondary: 'bg-slate-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    custom: '',
  };

  return (
    <span className="relative flex">
      <span
        className={cn(
          'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
          color === 'custom' ? '' : colorMap[color],
          className,
        )}
        style={customColor ? { backgroundColor: customColor } : undefined}
      />
      <span
        className={cn(
          'relative inline-flex rounded-full',
          sizeMap[size],
          color === 'custom' ? '' : colorMap[color],
          className,
        )}
        style={customColor ? { backgroundColor: customColor } : undefined}
      />
    </span>
  );
}
