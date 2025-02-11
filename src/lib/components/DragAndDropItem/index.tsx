'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, FileIcon, VideoIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { PDFFile } from '@/components/product-form';

export default function DragAndDropItem({ file }: { file: PDFFile }) {
  const { file: fileData } = file;

  const [pressing, setPressing] = useState(false);
  const [scale, setScale] = useState(1);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: file.id });

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
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        className="hover:bg-accent touch-none"
        onMouseDown={() => setPressing(true)}
        onMouseUp={() => setPressing(false)}
        onMouseLeave={() => setPressing(false)}
        style={{
          transform: `scale(${scale})`,
          transition: 'transform 0.2s ease',
        }}
      >
        <CardContent className="p-4 flex items-center space-x-4 overflow-hidden">
          {fileData.type === 'image' && (
            <img alt={fileData.name} className="w-12 h-12 object-cover rounded" />
          )}
          {fileData.type === 'pdf' && (
            <div className="w-12 h-12 bg-red-100 rounded flex items-center justify-center">
              <FileIcon className="text-red-500" />
            </div>
          )}
          {fileData.type === 'video' && (
            <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
              <VideoIcon className="text-blue-500" />
            </div>
          )}
          <div className="flex-grow min-w-0 overflow-hidden">
            <p className="font-medium truncate whitespace-nowrap overflow-hidden">
              {file.originalFilename}
            </p>
            <p className="text-sm text-muted-foreground capitalize">{fileData.type}</p>
          </div>
          <div className="cursor-move flex-shrink-0" {...listeners}>
            <GripVertical className="text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </li>
  );
}
