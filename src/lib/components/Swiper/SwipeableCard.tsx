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

// Define the ref type for the card
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

  // Expose the triggerSwipe method to parent components via ref
  useImperativeHandle(ref, () => ({
    triggerSwipe: (direction: 'left' | 'right') => {
      if (!isActive || exitDirection) return;
      setExitDirection(direction);
      onSwiped && onSwiped(direction);
    },
  }));

  // Handle mouse/touch events only if this is the active card
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

    // Determine if the swipe was significant enough
    const threshold = 120; // Lower threshold to make swiping easier

    if (offsetX > threshold) {
      setExitDirection('right');
      onSwiped && onSwiped('right');
    } else if (offsetX < -threshold) {
      setExitDirection('left');
      onSwiped && onSwiped('left');
    } else {
      // Reset position if not swiped far enough
      setOffsetX(0);
    }
  };

  // Calculate card style based on state
  const getCardStyle = () => {
    // If card has been swiped out
    if (exitDirection === 'right') {
      return {
        transform: `translateX(200%) rotate(45deg)`,
        transition: 'all 600ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Slower animation (600ms)
        opacity: 0,
      };
    } else if (exitDirection === 'left') {
      return {
        transform: `translateX(-200%) rotate(-45deg)`,
        transition: 'all 600ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Slower animation (600ms)
        opacity: 0,
      };
    }
    // If card is being dragged
    else if (isActive) {
      // Calculate rotation based on drag distance, with a more natural feel
      const rotate = offsetX * 0.08; // Slightly reduced rotation for more subtlety

      // Calculate opacity reduction as card moves away from center
      const opacityFactor =
        Math.abs(offsetX) > 150 ? Math.max(1 - (Math.abs(offsetX) - 150) / 100, 0.5) : 1;

      return {
        transform: `translateX(${offsetX}px) rotate(${rotate}deg)`,
        transition: isDragging ? 'none' : 'all 300ms cubic-bezier(0.2, 0.8, 0.2, 1)', // Smoother return
        opacity: opacityFactor,
        zIndex: 20,
      };
    }
    // If card is in the stack but not active
    else {
      return {
        transform: `scale(${0.95 - stackPosition * 0.05}) translateY(${stackPosition * 10}px)`,
        opacity: 0.8 - stackPosition * 0.2,
        pointerEvents: 'none' as const,
        zIndex: 10 - stackPosition,
        transition: 'all 300ms ease', // Smooth transition when moving up in the stack
      };
    }
  };

  // Determine the color overlay based on swipe direction
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
        transition: 'opacity 600ms ease-out', // Match the exit animation duration
        borderRadius: '0.75rem',
      };
    } else if (offsetX > 120) {
      // Lower threshold for earlier feedback
      return {
        opacity: Math.min(offsetX / 80, 0.8), // More gradual opacity increase
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        transition: isDragging ? 'none' : 'opacity 200ms ease-out',
        borderRadius: '0.75rem', // Match the card's border radius
      };
    } else if (offsetX < -120) {
      // Lower threshold for earlier feedback
      return {
        opacity: Math.min(Math.abs(offsetX) / 80, 0.8), // More gradual opacity increase
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        transition: isDragging ? 'none' : 'opacity 200ms ease-out',
        borderRadius: '0.75rem', // Match the card's border radius
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
