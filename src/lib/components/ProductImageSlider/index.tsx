'use client';

import React, { useState } from 'react';
import { CldImage } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageSliderProps {
  imageUrls: string[];
  title: string;
}

export default function ProductImageSlider({ imageUrls, title }: ProductImageSliderProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1));
  };

  return (
    <div className="relative aspect-square">
      <CldImage
        alt={`${title} - Image ${currentImageIndex + 1}`}
        src={imageUrls[currentImageIndex]}
        width="1000"
        height="1000"
        crop={{
          type: 'auto',
          source: true,
        }}
      />
      <div className="absolute inset-0 flex items-center justify-between p-4 w-full bottom-0">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/80 backdrop-blur-sm"
          onClick={prevImage}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/80 backdrop-blur-sm"
          onClick={nextImage}
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {imageUrls.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
