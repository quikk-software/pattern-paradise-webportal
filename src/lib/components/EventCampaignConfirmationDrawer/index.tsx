'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useElementHeight } from '@/lib/core/useElementHeight';

interface PrizeDrawerProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  description?: string;
  position?: 'bottom' | 'right';
  onClose?: () => void;
}

export function EventCampaignConfirmationDrawer({
  isOpen,
  setIsOpen,
  description,
  position = 'bottom',
  onClose,
}: PrizeDrawerProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  const bottomNavHeight = useElementHeight('bottom-navigation');

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="relative">
      <div
        className={cn(
          'fixed z-50 bg-white rounded-t-2xl shadow-2xl transition-all duration-500 ease-in-out',
          position === 'bottom'
            ? 'left-0 right-0 bottom-0 max-h-[80vh]'
            : 'top-0 bottom-0 right-0 max-w-md w-full',
          isOpen
            ? position === 'bottom'
              ? 'translate-y-0'
              : 'translate-x-0'
            : position === 'bottom'
              ? 'translate-y-full'
              : 'translate-x-full',
        )}
        style={{
          marginBottom: bottomNavHeight,
        }}
      >
        <div className="relative bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 p-6 rounded-t-2xl">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="flex justify-center -mt-12 mb-2">
            <div className="bg-white p-2 rounded-full shadow-lg">
              <div className="w-16 h-16 flex items-center justify-center">
                <span className="text-4xl">🎁</span>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800">Congratulations!</h2>
          <p className="text-center text-gray-700">You found a special prize!</p>
        </div>

        <div className="p-6 bg-gradient-to-b from-white to-pink-50">
          <div className="bg-white rounded-xl p-6 shadow-inner border border-pink-100 mb-6">
            <h3 className="text-xl font-bold text-center text-pink-600 mb-2">
              {description ?? 'We will get in touch in you with more details!'}
            </h3>
            {description ? (
              <p>We just saved that you have won and will get in touch with you soon!</p>
            ) : null}
          </div>
        </div>
      </div>

      {showConfetti ? <Confetti /> : null}
    </div>
  );
}

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 100 }).map((_, index) => (
        <span
          key={index}
          className="absolute block"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-5%`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            background: `hsl(${Math.random() * 360}, 100%, 50%)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            animation: `confetti ${Math.random() * 3 + 2}s linear forwards`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
