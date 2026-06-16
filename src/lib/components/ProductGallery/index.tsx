'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
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

  const hasMultiple = imageUrls.length > 1;

  // Track whether the thumbnail strip can scroll further left/right so we can
  // show a soft fade indicator on each scrollable side (and hide it at the edges).
  const thumbsRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });
  const updateEdges = useCallback(() => {
    const el = thumbsRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setEdges({
      left: scrollLeft > 1,
      right: scrollLeft + clientWidth < scrollWidth - 1,
    });
  }, []);

  useEffect(() => {
    if (!hasMultiple) return;
    updateEdges();
    const el = thumbsRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges);
    return () => {
      el.removeEventListener('scroll', updateEdges);
      window.removeEventListener('resize', updateEdges);
    };
  }, [hasMultiple, updateEdges, imageUrls.length]);

  const altText = `${title} in ${category}${
    subCategories?.length ? ` – styles: ${subCategories.join(', ')}` : ''
  } on Pattern Paradise`;

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
                  format="auto"
                  quality="auto:eco"
                  sizes="(max-width: 1024px) 100vw, 400px"
                  priority={index === 0}
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

      {/* Thumbnail strip — horizontally scrollable (no visible scrollbar); soft
          fade hints when there are more images off-screen left/right. The py-1
          keeps the active thumbnail's 2px ring from being clipped. */}
      {hasMultiple ? (
        <div className="relative">
          <div
            ref={thumbsRef}
            className="no-scrollbar flex snap-x gap-2 overflow-x-auto px-0.5 py-1"
          >
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
                  format="auto"
                  quality="auto:eco"
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
          <div
            aria-hidden
            className={cn(
              'pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent transition-opacity duration-200',
              edges.left ? 'opacity-100' : 'opacity-0',
            )}
          />
          <div
            aria-hidden
            className={cn(
              'pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent transition-opacity duration-200',
              edges.right ? 'opacity-100' : 'opacity-0',
            )}
          />
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
