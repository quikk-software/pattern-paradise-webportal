'use client';

import React, { useEffect, useState } from 'react';
import { DndContext, closestCenter, useSensors, PointerSensor, useSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import DragAndDropItem from '@/lib/components/DragAndDropItem';
import { PDFFile } from '@/components/product-form';
import ReactCountryFlag from 'react-country-flag';
import { LANGUAGES } from '@/lib/constants';

interface GroupedFiles {
  [key: string]: PDFFile[];
}

interface DragAndDropContainerProps {
  selectedFiles: PDFFile[];
  setFileOrder: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
}

export default function DragAndDropContainer({
  selectedFiles,
  setFileOrder,
}: DragAndDropContainerProps) {
  const [groupedFiles, setGroupedFiles] = useState<GroupedFiles>({});

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  );

  useEffect(() => {
    const grouped = selectedFiles.reduce((acc: GroupedFiles, file) => {
      if (!acc[file.language]) {
        acc[file.language] = [];
      }
      acc[file.language].push(file);
      return acc;
    }, {});
    setGroupedFiles(grouped);
  }, [selectedFiles]);

  useEffect(() => {
    if (groupedFiles) {
      Object.entries(groupedFiles).map(([language, files]) =>
        setFileOrder((fileOrder) => ({
          ...fileOrder,
          [language]: files.map((file) => file.id),
        })),
      );
    } else {
      setFileOrder({});
    }
  }, [groupedFiles]);

  const handleDragEnd = (event: any, language: string) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setGroupedFiles((items) => {
        const oldIndex = items[language].findIndex((item) => item.id === active.id);
        const newIndex = items[language].findIndex((item) => item.id === over.id);
        return { ...items, [language]: arrayMove(items[language], oldIndex, newIndex) };
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Order Files</h2>
        <p>Press and hold files to update the order.</p>
      </div>

      {Object.entries(groupedFiles).map(([language, files]) => {
        const matchingLanguage = LANGUAGES.find((lang) => lang.code === language);
        return (
          <div className="flex flex-col gap-2" key={language}>
            <div className="flex items-center">
              <ReactCountryFlag
                countryCode={matchingLanguage?.country ?? ''}
                svg
                className="mr-2"
              />
              {matchingLanguage?.name ?? ''}
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleDragEnd(event, language)}
            >
              <SortableContext items={files} strategy={verticalListSortingStrategy}>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <DragAndDropItem file={file} index={index} key={file.id} />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          </div>
        );
      })}
    </div>
  );
}
