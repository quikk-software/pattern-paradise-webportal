'use client';

import ReactCountryFlag from 'react-country-flag';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Trash2, Upload } from 'lucide-react';
import { PDFFile } from '@/components/product-form';
import Link from 'next/link';
import React from 'react';

const languages = [
  { code: 'ar', name: 'Arabic', country: 'SA' },
  { code: 'cs', name: 'Czech', country: 'CZ' },
  { code: 'da', name: 'Danish', country: 'DK' },
  { code: 'en', name: 'English', country: 'GB' },
  { code: 'nl', name: 'Dutch', country: 'NL' },
  { code: 'de', name: 'German', country: 'DE' },
  { code: 'ru', name: 'Russian', country: 'RU' },
  { code: 'fr', name: 'French', country: 'FR' },
  { code: 'fi', name: 'Finnish', country: 'FI' },
  { code: 'el', name: 'Greek', country: 'GR' },
  { code: 'iw', name: 'Hebrew', country: 'IL' },
  { code: 'it', name: 'Italian', country: 'IT' },
  { code: 'jp', name: 'Japanese', country: 'JP' },
  { code: 'ko', name: 'Korean', country: 'KR' },
  { code: 'no', name: 'Norwegian', country: 'NO' },
  { code: 'pl', name: 'Polish', country: 'PL' },
  { code: 'es', name: 'Spanish', country: 'ES' },
  { code: 'sv', name: 'Swedish', country: 'SE' },
  { code: 'tr', name: 'Turkish', country: 'TR' },
  { code: 'uk', name: 'Ukrainian', country: 'UA' },
];

interface PdfSelectorProps {
  pdfFiles: PDFFile[];
  setPdfFiles: React.Dispatch<React.SetStateAction<PDFFile[]>>;
  isPro: boolean;
}

export default function PdfSelector({ pdfFiles, setPdfFiles, isPro }: PdfSelectorProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const files = event.target.files;
    if (files) {
      const newPdfFiles = Array.from(files)
        .filter((file) => file.type === 'application/pdf')
        .map((file) => ({
          file,
          language: 'en',
        }));
      if (isPro) {
        setPdfFiles((prevFiles) => [...prevFiles, ...newPdfFiles]);
      } else {
        setPdfFiles(newPdfFiles?.at(0) ? [newPdfFiles.at(0)!] : []);
      }
    }
    event.target.value = '';
  };

  const handleLanguageChange = (index: number, language: string) => {
    setPdfFiles((prevFiles) =>
      prevFiles.map((file, i) => (i === index ? { ...file, language } : file)),
    );
  };

  const handleRemoveFile = (index: number) => {
    setPdfFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {isPro ? 'Select patterns' : 'Select pattern'} <span className="text-red-500">*</span>
        </CardTitle>
        {isPro ? (
          <CardTitle className="text-md font-medium">
            Select multiple patterns and add different languages.
          </CardTitle>
        ) : (
          <CardTitle className="text-md font-medium">
            Upgrade to{' '}
            <Link href={'/pro'} className="text-blue-500 underline">
              Pattern Paradise Pro
            </Link>{' '}
            in order to upload multiple patterns in different languages.
          </CardTitle>
        )}
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
                <p className="text-xs text-gray-500">PDF files only</p>
              </div>
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
            </label>
          </div>

          {pdfFiles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-md font-semibold">Selected Files</h3>
              {pdfFiles.map((pdfFile, index) => (
                <Card key={index} className="p-4">
                  <div className="flex flex-col justify-center md:flex-row md:items-center md:justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-6 h-6 text-blue-500" />
                      <span className="font-medium truncate max-w-[200px]">
                        {pdfFile.file.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center space-x-3">
                      <Select
                        value={pdfFile.language}
                        disabled={!isPro}
                        onValueChange={(value) => handleLanguageChange(index, value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              <div className="flex items-center">
                                <ReactCountryFlag countryCode={lang.country} svg className="mr-2" />
                                {lang.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(event) => {
                          event.preventDefault();
                          handleRemoveFile(index);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
