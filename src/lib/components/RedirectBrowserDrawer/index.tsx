'use client';

import { useEffect, useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { ExternalLink, X } from 'lucide-react';

interface RedirectBrowserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRedirect: () => void;
  subtitle: string;
  description: string;
  countdownTime?: number;
}

export function RedirectBrowserDrawer({
  isOpen,
  onClose,
  onRedirect,
  subtitle,
  description,
  countdownTime = 3,
}: RedirectBrowserDrawerProps) {
  const [timeLeft, setTimeLeft] = useState(countdownTime);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(countdownTime);
      setProgress(100);
      return;
    }

    if (timeLeft <= 0) {
      onRedirect();
      onClose();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 0.1);
      setProgress((prev) => (timeLeft - 0.1) * (100 / countdownTime));
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, timeLeft, countdownTime, onRedirect, onClose]);

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader className="text-center">
          <div className="absolute right-4 top-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <DrawerTitle className="text-xl font-bold">Redirecting to Browser</DrawerTitle>
          <DrawerDescription>{subtitle}</DrawerDescription>
        </DrawerHeader>

        <div className="p-6 flex flex-col items-center">
          <div className="relative w-32 h-32 mb-6">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-gray-200"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
              />
              <circle
                className="text-primary"
                strokeWidth="8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
                strokeDasharray="264"
                strokeDashoffset={264 - (progress * 264) / 100}
                style={{
                  transition: 'stroke-dashoffset 0.1s ease-in-out',
                }}
              />
            </svg>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <span className="text-3xl font-bold">{Math.ceil(timeLeft)}</span>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4 w-full">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-500">{description}</p>
            </div>

            <div className="flex gap-4 w-full">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  onRedirect();
                  onClose();
                }}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Continue Now
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
