import { CldImage } from 'next-cloudinary';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

interface GalleryGridProps {
  images: string[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  const [expanded, setExpanded] = useState(false);

  const visibleImages = expanded ? images : images.slice(0, 6);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-1">
        {visibleImages.map((image, index) => (
          <Link
            href={image}
            target={'_blank'}
            rel={'nofollow'}
            key={`${image}-${index}`}
            className="aspect-square relative"
          >
            <CldImage
              src={image}
              alt={`Gallery image ${index + 1}`}
              fill
              sizes="(max-width: 768px) 33vw, 300px"
              className="object-cover rounded-lg"
              format="webp"
            />
          </Link>
        ))}
      </div>

      {images.length > 6 && (
        <div className="flex justify-center">
          <Button
            variant="secondary"
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center gap-2 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            {expanded ? (
              <>
                Show Less <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
