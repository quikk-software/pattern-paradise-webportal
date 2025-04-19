'use client';

import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

interface PrizeDrawerProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  description?: string;
}

export function EventCampaignConfirmationDrawer({
  isOpen,
  setIsOpen,
  description,
}: PrizeDrawerProps) {
  const [showConfetti, setShowConfetti] = useState(false);

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
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="p-4">
          <div className="flex flex-col gap-4 mt-10">
            <DrawerHeader className="relative bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 p-6 rounded-t-2xl">
              <div className="flex justify-center -mt-12 mb-2">
                <div className="bg-white p-2 rounded-full shadow-lg">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <span className="text-4xl">🎁</span>
                  </div>
                </div>
              </div>

              <DrawerTitle>Congratulations!</DrawerTitle>
              <DrawerTitle className="text-sm font-medium">You found a special prize!</DrawerTitle>
            </DrawerHeader>
            <div className="bg-white rounded-xl p-6 shadow-inner border border-pink-100 mb-6">
              <h3 className="text-xl font-bold text-center text-pink-600 mb-2">
                {description ?? 'We will get in touch in you with more details!'}
              </h3>
              {description ? (
                <p className="text-center">
                  We just saved that you have won and will get in touch with you soon!
                </p>
              ) : null}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

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
