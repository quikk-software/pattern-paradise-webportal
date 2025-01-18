'use client';

import React from 'react';
import { CldImage } from 'next-cloudinary';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { ChevronLeft, ChevronRight, HandIcon } from 'lucide-react';

interface ProductImageSliderProps {
  imageUrls: string[];
  title: string;
  grids?: number;
}

export default function ProductImageSlider({
  imageUrls,
  title,
  grids = 1,
}: ProductImageSliderProps) {
  const chunkImages = (images: string[], chunkSize: number) =>
    images.reduce<string[][]>((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / chunkSize);
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []; // start a new chunk
      }
      resultArray[chunkIndex].push(item);
      return resultArray;
    }, []);

  const groupedImages = chunkImages(imageUrls, grids);

  return (
    <div>
      <div className={`grid grid-cols-1 gap-2`}>
        <Carousel
          className={`w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto`}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {groupedImages.map((group, groupIndex) => (
              <CarouselItem key={groupIndex}>
                <div className="flex justify-center gap-2">
                  {group.map((src, index) => (
                    <CldImage
                      key={src}
                      alt={`${title} view ${groupIndex * grids + index + 1}`}
                      src={src}
                      width={grids > 1 ? 200 / grids : 400}
                      height={grids > 1 ? 200 : 400}
                      className={`rounded-lg shadow-md`}
                    />
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="flex justify-center gap-1 mt-2">
          <ChevronLeft className="w-4 h-4 text-primary" />
          <HandIcon className="w-4 h-4 text-primary" />
          <ChevronRight className="w-4 h-4 text-primary" />
        </div>
      </div>
      <div className="flex justify-center mt-2 gap-2">
        {groupedImages.map((_, index) => (
          <div key={index} className="h-2 w-2 rounded-full bg-gray-300" />
        ))}
      </div>
    </div>
  );
}
