'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { CldImage } from 'next-cloudinary';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductLightbox from './Lightbox';

interface ProductGalleryProps {
  imageUrls: string[];
  title: string;
  category?: string;
  subCategories?: string[];
}

/**
 * Product detail gallery: a responsive 4:5 main image (object-cover, never
 * overflows thanks to the aspect-ratio box + CldImage `fill`), active/clickable
 * dots, a horizontally scrollable thumbnail strip, and a fullscreen lightbox
 * (opened by clicking the main image or any thumbnail).
 *
 * Note: this is intentionally separate from `ProductImageSlider`, which is still
 * used by `ReviewCard` with the `grids` prop and must keep its behavior.
 */
export default function ProductGallery({
  imageUrls,
  title,
  category,
  subCategories,
}: ProductGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    setSelected(api.selectedScrollSnap());
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const altText = `${title} in ${category}${
    subCategories?.length ? ` – styles: ${subCategories.join(', ')}` : ''
  } on Pattern Paradise`;

  const hasMultiple = imageUrls.length > 1;

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
        <CarouselContent>
          {imageUrls.map((src, index) => (
            <CarouselItem key={src}>
              <button
                type="button"
                onClick={() => openLightbox(index)}
                aria-label="View image fullscreen"
                className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl bg-card shadow-card"
              >
                <CldImage
                  src={src}
                  alt={altText}
                  fill
                  format="webp"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-foreground/55 text-background opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
                  <Maximize2 className="h-4 w-4" />
                </span>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Active, clickable dots */}
      {hasMultiple ? (
        <div className="flex justify-center gap-1.5">
          {imageUrls.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to image ${index + 1}`}
              className={cn(
                'h-2 rounded-full transition-all duration-200',
                index === selected ? 'w-5 bg-primary' : 'w-2 bg-border hover:bg-muted-foreground/40',
              )}
            />
          ))}
        </div>
      ) : null}

      {/* Thumbnail strip — horizontally scrollable so many images never overflow */}
      {hasMultiple ? (
        <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]">
          {imageUrls.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => openLightbox(index)}
              aria-label={`Open image ${index + 1} fullscreen`}
              className={cn(
                'relative h-16 w-16 shrink-0 snap-start overflow-hidden rounded-lg ring-2 transition-all sm:h-20 sm:w-20',
                index === selected ? 'ring-primary' : 'ring-transparent hover:ring-border',
              )}
            >
              <CldImage
                src={src}
                alt=""
                fill
                format="webp"
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      {lightboxOpen ? (
        <ProductLightbox
          imageUrls={imageUrls}
          startIndex={lightboxIndex}
          alt={altText}
          onClose={() => setLightboxOpen(false)}
        />
      ) : null}
    </div>
  );
}
