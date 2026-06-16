'use client';

import React, { useEffect, useState } from 'react';
import { CldImage } from 'next-cloudinary';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';

interface ProductLightboxProps {
  imageUrls: string[];
  startIndex: number;
  alt: string;
  onClose: () => void;
}

/**
 * Fullscreen image viewer for the product gallery. Shows every image at full
 * size (object-contain → nothing is cropped and images never overflow the
 * viewport), swipeable, with keyboard (Esc / arrows) and backdrop-click close.
 */
export default function ProductLightbox({
  imageUrls,
  startIndex,
  alt,
  onClose,
}: ProductLightboxProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(startIndex);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});

  const hasMultiple = imageUrls.length > 1;

  // Keyboard controls + lock body scroll while the lightbox is open.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') api?.scrollPrev();
      if (event.key === 'ArrowRight') api?.scrollNext();
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [api, onClose]);

  // Track the active slide for the counter.
  useEffect(() => {
    if (!api) return;
    setSelected(api.selectedScrollSnap());
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/15 text-background transition-colors hover:bg-background/25"
      >
        <X className="h-5 w-5" />
      </button>

      {hasMultiple ? (
        <span className="absolute left-1/2 top-5 -translate-x-1/2 text-sm font-medium text-background/90">
          {selected + 1} / {imageUrls.length}
        </span>
      ) : null}

      <div className="w-full">
        <Carousel setApi={setApi} opts={{ loop: true, startIndex }} className="w-full">
          <CarouselContent>
            {imageUrls.map((src) => (
              <CarouselItem key={src} className="flex items-center justify-center">
                <div className="relative flex min-h-[50vh] items-center justify-center">
                  {!loaded[src] ? (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <LoadingSpinnerComponent className="text-background" />
                    </span>
                  ) : null}
                  <CldImage
                    src={src}
                    alt={alt}
                    width={1280}
                    height={1600}
                    crop="limit"
                    format="auto"
                    quality="auto:good"
                    onLoad={() => setLoaded((prev) => ({ ...prev, [src]: true }))}
                    onClick={(event) => event.stopPropagation()}
                    className={`h-auto max-h-[86vh] w-auto max-w-[92vw] rounded-lg object-contain transition-opacity duration-300 ${
                      loaded[src] ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {hasMultiple ? (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                api?.scrollPrev();
              }}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/15 text-background transition-colors hover:bg-background/25 sm:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                api?.scrollNext();
              }}
              aria-label="Next image"
              className="absolute right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/15 text-background transition-colors hover:bg-background/25 sm:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
