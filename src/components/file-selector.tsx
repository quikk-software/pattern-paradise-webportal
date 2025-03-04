'use client';

import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Trash2, Upload } from 'lucide-react';
import { PDFFile } from '@/components/product-form';
import LanguageSelect from '@/lib/components/LanguageSelect';
import { Input } from '@/components/ui/input';

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
  const [uploadLanguage, setUploadLanguage] = useState('en');

  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, language: string) => {
    event.preventDefault();
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).map((file) => {
        const id = uuid();
        const splittedFileName = file.name.split('.');
        const fileSuffix = splittedFileName?.[splittedFileName.length - 1];
        return {
          file: new File([file], `${id}${fileSuffix ? `.${fileSuffix}` : ''}`, { type: file.type }),
          originalFilename: file.name,
          language,
          id,
        };
      });
      if (isPro) {
        setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
      } else {
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

  const handleFilenameChange = (id: string, newFilename: string) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.map((file) => {
        if (file.id === id) {
          const suffix = file.originalFilename.split('.').pop();
          return { ...file, originalFilename: `${newFilename}${suffix ? `.${suffix}` : ''}` };
        }
        return file;
      }),
    );
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

  const handleUploadFilesButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {isPro ? 'Select patterns' : 'Select pattern'} <span className="text-red-500">*</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-2">
            {isPro ? (
              <LanguageSelect
                language={uploadLanguage}
                handleLanguageChange={(language) => setUploadLanguage(language)}
              />
            ) : null}
            <Button
              onClick={(e) => {
                handleUploadFilesButtonClick(e);
              }}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload PDFs and Images
            </Button>
            <input
              ref={fileInputRef}
              id="pdf-upload"
              type="file"
              accept=".pdf,image/*"
              onChange={(event) => handleFileChange(event, uploadLanguage)}
              className="hidden"
              multiple
            />
          </div>

          {Object.keys(groupedFiles).length > 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-md font-semibold">Selected Files</h3>
                <p className="text-xs text-muted-foreground">
                  ⚠️ Note: Leave the text field for a file empty if you want to use default document
                  names.
                </p>
              </div>
              {Object.entries(groupedFiles).map(([language, files]) => (
                <Card key={language} className="p-4">
                  <div className="flex flex-col gap-4">
                    <LanguageSelect
                      language={language}
                      handleLanguageChange={handleLanguageChange}
                    />
                    <div className="flex-grow space-y-2">
                      {files.map((fileData, index) => {
                        const splittedFilename = fileData.originalFilename.split('.');
                        if (splittedFilename.length > 1) {
                          splittedFilename.pop();
                        }
                        const filenameWithoutSuffix = splittedFilename.join('');
                        return (
                          <div
                            key={fileData.id}
                            className="flex items-center justify-between space-x-3 overflow-hidden"
                          >
                            <div className="flex items-center space-x-3 min-w-0 w-full">
                              {fileData.file.type.startsWith('image') ? (
                                <img
                                  className="w-12 h-12 object-cover rounded"
                                  alt={fileData.file.name}
                                  src={URL.createObjectURL(fileData.file)}
                                />
                              ) : (
                                <FileText className="w-6 h-6 text-blue-500 flex-shrink-0" />
                              )}
                              <Input
                                className="w-full"
                                ref={(el) => {
                                  inputRefs.current[fileData.id] = el;
                                }}
                                value={filenameWithoutSuffix}
                                onChange={(e) => {
                                  const input = inputRefs.current[fileData.id];
                                  const start = input?.selectionStart;
                                  handleFilenameChange(fileData.id, e.target.value);
                                  if (input && start !== null) {
                                    requestAnimationFrame(() =>
                                      input.setSelectionRange(start ?? null, start ?? null),
                                    );
                                  }
                                }}
                              />
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
                        );
                      })}
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
