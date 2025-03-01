'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DragAndDropImage({
  imageUrl,
  index,
  removeImage,
}: {
  imageUrl: string;
  index: number;
  removeImage: (index: number) => void;
}) {
  const [pressing, setPressing] = useState(false);
  const [scale, setScale] = useState(1);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: imageUrl,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (pressing) {
      setScale(1.05);
    } else {
      setScale(1);
    }
  }, [pressing]);

  return (
    <div
      className="relative"
      style={{
        transform: `scale(${scale})`,
        transition: 'transform 0.2s ease',
      }}
    >
      <div
        className="touch-none select-none"
        onMouseDown={() => setPressing(true)}
        onMouseUp={() => setPressing(false)}
        onMouseLeave={() => setPressing(false)}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        <img
          src={imageUrl}
          alt={`Product ${index + 1}`}
          className="w-full h-32 object-cover rounded-md"
        />
      </div>
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute h-6 w-6"
        style={{
          top: 0,
          right: 0,
        }}
        onClick={() => removeImage(index)}
      >
        <X />
      </Button>
    </div>
  );
}
