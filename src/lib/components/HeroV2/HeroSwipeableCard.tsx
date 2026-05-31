'use client';

import type React from 'react';
import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { GetProductResponse } from '@/@types/api-types';
import { CldImage } from 'next-cloudinary';
import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface HeroSwipeableCardProps {
  product: GetProductResponse;
  isActive: boolean;
  stackPosition: number;
  onSwiped?: (direction: 'left' | 'right') => void;
}

export interface HeroSwipeableCardRef {
  triggerSwipe: (direction: 'left' | 'right') => void;
}

// Card rotations for handmade feel - applied based on stack position
const CARD_ROTATIONS = [-4, 5, -1];
const CARD_OFFSETS_X = [0, 32, 64];
const CARD_OFFSETS_Y = [0, -16, 8];

const HeroSwipeableCard = forwardRef<HeroSwipeableCardRef, HeroSwipeableCardProps>(
  function HeroSwipeableCard({ product, isActive, stackPosition, onSwiped }, ref) {
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [offsetX, setOffsetX] = useState(0);
    const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const t = useTranslations();

    useImperativeHandle(ref, () => ({
      triggerSwipe: (direction: 'left' | 'right') => {
        if (!isActive || exitDirection) return;
        setExitDirection(direction);
        onSwiped && onSwiped(direction);
      },
    }));

    const handleMouseDown = (e: React.MouseEvent) => {
      if (!isActive || exitDirection) return;
      e.preventDefault();
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

      const threshold = 80;

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

    const getCardStyle = (): React.CSSProperties => {
      const baseRotation = CARD_ROTATIONS[Math.min(stackPosition, 2)];
      const baseOffsetX = CARD_OFFSETS_X[Math.min(stackPosition, 2)];
      const baseOffsetY = CARD_OFFSETS_Y[Math.min(stackPosition, 2)];

      if (exitDirection === 'right') {
        return {
          transform: `translateX(400px) rotate(45deg)`,
          transition: 'all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          opacity: 0,
          zIndex: 30 - stackPosition * 10,
        };
      } else if (exitDirection === 'left') {
        return {
          transform: `translateX(-400px) rotate(-45deg)`,
          transition: 'all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          opacity: 0,
          zIndex: 30 - stackPosition * 10,
        };
      } else if (isActive) {
        const dragRotate = offsetX * 0.06;
        return {
          transform: `translateX(${baseOffsetX + offsetX}px) translateY(${baseOffsetY}px) rotate(${baseRotation + dragRotate}deg)`,
          transition: isDragging ? 'none' : 'all 300ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          zIndex: 30,
          cursor: 'grab',
        };
      } else {
        return {
          transform: `translateX(${baseOffsetX}px) translateY(${baseOffsetY}px) rotate(${baseRotation}deg)`,
          transition: 'all 300ms ease',
          zIndex: 30 - stackPosition * 10,
          pointerEvents: 'none',
        };
      }
    };

    const getOverlayStyle = (): React.CSSProperties => {
      if (!isActive) return { opacity: 0 };

      if (exitDirection === 'right') {
        return {
          opacity: 0.6,
          backgroundColor: 'rgba(34, 197, 94, 0.3)',
          transition: 'opacity 300ms ease-out',
        };
      } else if (exitDirection === 'left') {
        return {
          opacity: 0.6,
          backgroundColor: 'rgba(239, 68, 68, 0.3)',
          transition: 'opacity 300ms ease-out',
        };
      } else if (offsetX > 50) {
        return {
          opacity: Math.min(offsetX / 100, 0.6),
          backgroundColor: 'rgba(34, 197, 94, 0.3)',
          transition: isDragging ? 'none' : 'opacity 200ms ease-out',
        };
      } else if (offsetX < -50) {
        return {
          opacity: Math.min(Math.abs(offsetX) / 100, 0.6),
          backgroundColor: 'rgba(239, 68, 68, 0.3)',
          transition: isDragging ? 'none' : 'opacity 200ms ease-out',
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
        className="absolute top-0 left-0 select-none"
        style={getCardStyle()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
      >
        <div className="w-[200px] md:w-[220px] bg-card rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(43,33,24,0.08)] border border-border hover:shadow-[0_8px_30px_rgba(43,33,24,0.12)] transition-shadow duration-300 relative">
          {/* Swipe overlay */}
          <div
            className="absolute inset-0 rounded-2xl z-10 pointer-events-none"
            style={getOverlayStyle()}
          />

          {/* Product Image */}
          <div className="aspect-square overflow-hidden">
            <CldImage
              alt={`${product.category} Pattern '${product.title}' on Pattern Paradise`}
              src={product.imageUrls?.at(0) ?? ''}
              width={220}
              height={220}
              className="h-full w-full object-cover pointer-events-none"
              format="webp"
              draggable={false}
            />
          </div>

          {/* Product Info */}
          <div className="p-3 flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="font-serif text-sm font-medium text-foreground truncate">
                {product.title}
              </p>
              <p className="text-sm font-semibold text-primary">
                {product.isFree
                  ? t('landing.hero.free')
                  : `$${(product.salePrice || product.price).toFixed(2)}`}
              </p>
            </div>
            <Heart className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </div>
        </div>
      </div>
    );
  },
);

export default HeroSwipeableCard;
