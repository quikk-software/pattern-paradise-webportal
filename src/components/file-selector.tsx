'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Trash2, Upload } from 'lucide-react';
import { PDFFile } from '@/components/product-form';
import Link from 'next/link';
import LanguageSelect from '@/lib/components/LanguageSelect';

interface PdfSelectorProps {
  selectedFiles: PDFFile[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<PDFFile[]>>;
  isPro: boolean;
}

interface GroupedFiles {
  [key: string]: PDFFile[];
}

export default function FileSelector({ selectedFiles, setSelectedFiles, isPro }: PdfSelectorProps) {
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).map((file) => ({
        file,
        language: 'en',
      }));
      if (isPro) {
        setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
      } else {
        // set language to other files language or default to english
        setSelectedFiles((prevFiles) => [
          ...prevFiles,
          ...newFiles.map((file) => ({
            ...file,
            language: prevFiles.at(0)?.language ?? 'en',
          })),
        ]);
      }
    }
    event.target.value = '';
  };

  const handleLanguageChange = (newLanguage: string, oldLanguage?: string) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.language === oldLanguage ? { ...file, language: newLanguage } : file,
      ),
    );
  };

  const handleRemoveFile = (language: string, index: number) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter(
        (file) => !(file.language === language && groupedFiles[language].indexOf(file) === index),
      ),
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {isPro ? 'Select patterns' : 'Select pattern'} <span className="text-red-500">*</span>
        </CardTitle>
        {isPro ? (
          <CardTitle className="text-md font-medium">
            You can add multiple files at once. By default, all files will be automatically assigned
            to the &apos;English&apos; language group. However, you can select a different language
            for the entire group of files. After changing the language for that group, any new files
            you add will again be automatically assigned to the &apos;English&apos; language group.
          </CardTitle>
        ) : process.env.NEXT_PUBLIC_PATTERN_PARADISE_PRO_ACTIVE === 'true' ? (
          <CardTitle className="text-md font-medium">
            Upgrade to{' '}
            <Link href={'/pro'} className="text-blue-500 underline">
              Pattern Paradise Pro
            </Link>{' '}
            in order to upload multiple patterns in different languages.
          </CardTitle>
        ) : null}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="pdf-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span>
                </p>
              </div>
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
            </label>
          </div>

          {Object.keys(groupedFiles).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-md font-semibold">Selected Files</h3>
              {Object.entries(groupedFiles).map(([language, files]) => (
                <Card key={language} className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <LanguageSelect
                      language={language}
                      handleLanguageChange={handleLanguageChange}
                    />
                    <div className="flex-grow space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-6 h-6 text-blue-500" />
                            <span className="font-medium truncate max-w-[200px]">
                              {file.file.name}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(event) => {
                              event.preventDefault();
                              handleRemoveFile(language, index);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
