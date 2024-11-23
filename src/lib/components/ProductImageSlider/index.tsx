'use client';

import React, { useState } from 'react';
import { CldImage } from 'next-cloudinary';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { ChevronLeft, ChevronRight, HandIcon } from 'lucide-react';

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
    <div>
      <div className="grid grid-cols-1 gap-2">
        <Carousel
          className={`w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto`}
        >
          <CarouselContent>
            {imageUrls.map((src, index) => (
              <CarouselItem key={index}>
                <div className={`flex flex-col items-center`}>
                  <CldImage
                    key={src}
                    alt={`${title} view ${index + 1}`}
                    src={src}
                    width={400}
                    height={400}
                    className={`rounded-lg shadow-md`}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="flex justify-center gap-1">
          <ChevronLeft className="w-4 h-4 text-primary" />
          <HandIcon className="w-4 h-4 text-primary" />
          <ChevronRight className="w-4 h-4 text-primary" />
        </div>
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
