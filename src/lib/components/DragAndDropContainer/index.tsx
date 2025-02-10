'use client';

import React, { useEffect, useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
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
    Object.entries(groupedFiles).map(([language, files]) =>
      setFileOrder((fileOrder) => ({
        ...fileOrder,
        [language]: files.map((file) => file.id),
      })),
    );
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

      {Object.entries(groupedFiles).map(([language, files]) => (
        <div className="flex flex-col gap-2" key={language}>
          <div className="flex items-center">
            <ReactCountryFlag
              countryCode={LANGUAGES.find((lang) => lang.code === language)?.country ?? ''}
              svg
              className="mr-2"
            />
            {LANGUAGES.find((lang) => lang.code === language)?.name ?? ''}
          </div>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={(event) => handleDragEnd(event, language)}
          >
            <SortableContext items={files} strategy={verticalListSortingStrategy}>
              <ul className="space-y-2">
                {files.map((file) => (
                  <DragAndDropItem file={file} key={file.id} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </div>
      ))}
    </div>
  );
}
