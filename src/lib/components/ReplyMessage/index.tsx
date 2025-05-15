import React, { PropsWithChildren, useState, useRef } from 'react';
import { GetTestingCommentResponse } from '@/@types/api-types';

interface ReplyMessageProps {
  onSwipe: () => void;
}

export default function ReplyMessage({ onSwipe, children }: PropsWithChildren<ReplyMessageProps>) {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const diff = e.touches[0].clientX - startX;
    if (diff > 0) {
      setCurrentX(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    if (currentX > 50) {
      onSwipe();
    }
    setCurrentX(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsSwiping(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSwiping) return;
    const diff = e.clientX - startX;
    if (diff > 0) {
      setCurrentX(diff);
    }
  };

  const handleMouseUp = () => {
    setIsSwiping(false);
    if (currentX > 50) {
      onSwipe();
    }
    setCurrentX(0);
  };

  const handleMouseLeave = () => {
    if (isSwiping) {
      setIsSwiping(false);
      setCurrentX(0);
    }
  };

  return (
    <div
      ref={messageRef}
      className="group cursor-pointer"
      style={{
        transform: `translateX(${currentX}px)`,
        transition: isSwiping ? 'none' : 'transform 0.3s ease',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
