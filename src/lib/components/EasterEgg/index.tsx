import React, { HTMLAttributes, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useGetEventCampaign, useUpdateEventCampaign } from '@/lib/api/event-campaign';
import { EventCampaignConfirmationDrawer } from '@/lib/components/EventCampaignConfirmationDrawer';
import BasicDrawer from '@/lib/components/BasicDrawer';

const eggColors = [
  'bg-gradient-to-b from-pink-300 to-pink-400',
  'bg-gradient-to-b from-blue-300 to-blue-400',
  'bg-gradient-to-b from-yellow-300 to-yellow-400',
  'bg-gradient-to-b from-green-300 to-green-400',
  'bg-gradient-to-b from-purple-300 to-purple-400',
  'bg-gradient-to-b from-red-300 to-red-400',
  'bg-gradient-to-b from-teal-300 to-teal-400',
];

const eggPatterns = [
  "after:content-[''] after:absolute after:top-1/4 after:left-1/4 after:w-1/2 after:h-1/2 after:rounded-full after:bg-white/20",
  "after:content-[''] after:absolute after:top-1/3 after:left-1/3 after:w-1/3 after:h-1/3 after:rounded-full after:bg-white/20",
  "after:content-[''] after:absolute after:top-1/4 after:left-1/4 after:w-1/2 after:h-1/2 after:bg-white/10 after:rounded-full",
  "after:content-[''] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_center,_transparent_50%,_rgba(255,255,255,0.2)_50%)]",
  "after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(45deg,_transparent_45%,_rgba(255,255,255,0.2)_45%,_rgba(255,255,255,0.2)_55%,_transparent_55%)]",
  "after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(to_right,_transparent_45%,_rgba(255,255,255,0.2)_45%,_rgba(255,255,255,0.2)_55%,_transparent_55%)]",
];

export interface EasterEggProps extends HTMLAttributes<HTMLDivElement> {
  eventCampaignId: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  randomColor?: boolean;
  pattern?: number;
  randomPattern?: boolean;
}

export function EasterEgg({
  eventCampaignId,
  size = 'md',
  color,
  randomColor = true,
  pattern,
  randomPattern = true,
  className,
  ...props
}: EasterEggProps) {
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const { fetch, data } = useGetEventCampaign();
  const { mutate, errorDetail } = useUpdateEventCampaign();

  useEffect(() => {
    fetch(eventCampaignId).then();
  }, [eventCampaignId]);

  const sizeClasses = {
    xs: 'w-4 h-5',
    sm: 'w-8 h-10',
    md: 'w-12 h-16',
    lg: 'w-16 h-20',
    xl: 'w-24 h-32',
  };

  const eggColor = color
    ? color
    : randomColor
      ? eggColors[Math.floor(Math.random() * eggColors.length)]
      : eggColors[0];

  const eggPattern =
    typeof pattern === 'number' && pattern >= 0 && pattern < eggPatterns.length
      ? eggPatterns[pattern]
      : randomPattern
        ? eggPatterns[Math.floor(Math.random() * eggPatterns.length)]
        : '';

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();

    mutate(eventCampaignId)
      .then(() => {
        setIsSuccessOpen(true);
      })
      .catch(() => {
        setIsErrorOpen(true);
      });
  };

  if (!data) {
    return null;
  }

  return (
    <>
      <div
        onClick={handleClick}
        className={cn(
          'relative inline-block',
          "before:content-[''] before:absolute before:top-[5%] before:left-[30%] before:w-[40%] before:h-[15%] before:bg-white/30 before:rounded-full before:rotate-[-20deg]",
          sizeClasses[size],
          eggColor,
          eggPattern,
          'rounded-[50%_50%_50%_50%/60%_60%_40%_40%]',
          className,
        )}
        {...props}
      />
      <EventCampaignConfirmationDrawer
        isOpen={isSuccessOpen}
        setIsOpen={setIsSuccessOpen}
        description={data.description}
      />
      <BasicDrawer
        isOpen={isErrorOpen}
        setIsOpen={setIsErrorOpen}
        title={'Sorry!'}
        description={
          errorDetail ??
          'This prize has already been claimed, but keep your eyes open for other prizes 👀'
        }
      />
    </>
  );
}
