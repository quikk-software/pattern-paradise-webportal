'use client';

import type React from 'react';
import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import ProductCard from './SwipeableProductCard';
import { GetProductResponse } from '@/@types/api-types';

interface SwipeableCardProps {
  product: GetProductResponse;
  isActive: boolean;
  stackPosition: number;
  onSwiped?: (direction: 'left' | 'right') => void;
}

export interface SwipeableCardRef {
  triggerSwipe: (direction: 'left' | 'right') => void;
}

const SwipeableCard = forwardRef<SwipeableCardRef, SwipeableCardProps>(function SwipeableCard(
  { product, isActive, stackPosition, onSwiped },
  ref,
) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    triggerSwipe: (direction: 'left' | 'right') => {
      if (!isActive || exitDirection) return;
      setExitDirection(direction);
      onSwiped && onSwiped(direction);
    },
  }));

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isActive || exitDirection) return;
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isActive || exitDirection) return;
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isActive || exitDirection) return;
    const currentX = e.clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !isActive || exitDirection) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging || !isActive || exitDirection) return;
    setIsDragging(false);

    const threshold = 120;

    if (offsetX > threshold) {
      setExitDirection('right');
      onSwiped && onSwiped('right');
    } else if (offsetX < -threshold) {
      setExitDirection('left');
      onSwiped && onSwiped('left');
    } else {
      setOffsetX(0);
    }
  };

  const getCardStyle = () => {
    if (exitDirection === 'right') {
      return {
        transform: `translateX(200%) rotate(45deg)`,
        transition: 'all 1300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        opacity: 0,
      };
    } else if (exitDirection === 'left') {
      return {
        transform: `translateX(-200%) rotate(-45deg)`,
        transition: 'all 1300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        opacity: 0,
      };
    } else if (isActive) {
      const rotate = offsetX * 0.08; // Slightly reduced rotation for more subtlety

      const opacityFactor =
        Math.abs(offsetX) > 150 ? Math.max(1 - (Math.abs(offsetX) - 150) / 100, 0.5) : 1;

      return {
        transform: `translateX(${offsetX}px) rotate(${rotate}deg)`,
        transition: isDragging ? 'none' : 'all 300ms cubic-bezier(0.2, 0.8, 0.2, 1)', // Smoother return
        opacity: opacityFactor,
        zIndex: 20,
      };
    } else {
      return {
        transform: `scale(${0.95 - stackPosition * 0.05}) translateY(${stackPosition * 10}px)`,
        opacity: 0.8 - stackPosition * 0.2,
        pointerEvents: 'none' as const,
        zIndex: 10 - stackPosition,
        transition: 'all 300ms ease', // Smooth transition when moving up in the stack
      };
    }
  };

  const getOverlayStyle = () => {
    if (!isActive) return { opacity: 0 };

    if (exitDirection === 'right') {
      return {
        opacity: 0.8,
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        transition: 'opacity 600ms ease-out', // Match the exit animation duration
        borderRadius: '0.75rem',
      };
    } else if (exitDirection === 'left') {
      return {
        opacity: 0.8,
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        transition: 'opacity 600ms ease-out',
        borderRadius: '0.75rem',
      };
    } else if (offsetX > 120) {
      return {
        opacity: Math.min(offsetX / 80, 0.8),
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        transition: isDragging ? 'none' : 'opacity 200ms ease-out',
        borderRadius: '0.75rem',
      };
    } else if (offsetX < -120) {
      return {
        opacity: Math.min(Math.abs(offsetX) / 80, 0.8),
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        transition: isDragging ? 'none' : 'opacity 200ms ease-out',
        borderRadius: '0.75rem',
      };
    }
    return {
      opacity: 0,
      transition: isDragging ? 'none' : 'opacity 200ms ease-out',
    };
  };

  return (
    <div
      ref={cardRef}
      className="absolute top-0 left-0 w-full"
      style={getCardStyle()}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleDragEnd}
    >
      <div className="absolute inset-0 rounded-xl z-10" style={getOverlayStyle()} />
      <ProductCard product={product} />
    </div>
  );
});

export default SwipeableCard;
