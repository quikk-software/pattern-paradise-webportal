import React from 'react';
import { FEED_IMAGE_LIMIT } from '@/lib/constants';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import DragAndDropImage from '@/lib/components/DragAndDropImage';
import { Input } from '@/components/ui/input';
import type { DragEndEvent } from '@dnd-kit/core/dist/types';

interface UpdateImageFeedProps {
  images: string[];
  removeImage: (index: number) => void;
  handleDragEnd: (e: DragEndEvent) => void;
  handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imageError?: string;
}

export default function UpdateImageFeed({
  images,
  removeImage,
  handleDragEnd,
  imageError,
  handleImageSelect,
}: UpdateImageFeedProps) {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <DndContext collisionDetection={closestCenter} onDragEnd={(event) => handleDragEnd(event)}>
          <SortableContext
            key={images.map((img) => img).join('-')}
            items={images.map((img) => img)}
            strategy={rectSortingStrategy}
          >
            {images.map((img, index) => (
              <DragAndDropImage
                imageUrl={img}
                index={index}
                removeImage={removeImage}
                key={index}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      <Input
        id="images"
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageSelect}
        disabled={images.length >= FEED_IMAGE_LIMIT}
        className="cursor-pointer"
      />
      {images.length >= FEED_IMAGE_LIMIT && (
        <p className="text-yellow-600 text-sm mt-2">Maximum number of images reached.</p>
      )}
      {imageError ? <p className="text-yellow-600 text-sm mt-2">{imageError}</p> : null}
    </div>
  );
}
