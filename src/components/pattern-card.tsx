'use client';

import { Button } from '@/components/ui/button';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { GetFileResponse, GetPatternResponse } from '@/@types/api-types';
import CountryFlag from '@/lib/components/CountryFlag';
import { LANGUAGES } from '@/lib/constants';
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';
import { useDownloadPattern } from '@/lib/api/pattern';
import DownloadPatternZipButton from '@/lib/components/DownloadPatternZipButton';
import SendFilesButton from '@/lib/components/SendFilesButton';

interface Pattern {
  language: string;
  filename: string;
}

interface PatternCardProps {
  pattern: GetPatternResponse;
}

export default function PatternCard({ pattern }: PatternCardProps) {
  const [expanded, setExpanded] = useState(false);

  const { fetch: downloadPattern, data: fileData, isLoading } = useDownloadPattern();

  useEffect(() => {
    if (!fileData) {
      return;
    }
    if (typeof window !== 'undefined') {
      const url = URL.createObjectURL(fileData.file);
      const link = document.createElement('a');
      link.href = url;
      link.target = '_self';
      link.download = fileData.objectName;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 1000);
    }
  }, [fileData]);

  const handleDownload = (fileId: string) => {
    downloadPattern(fileId);
  };

  const groupedPatterns = pattern.patterns.reduce(
    (acc, curr) => {
      if (!acc[curr.language]) {
        acc[curr.language] = [];
      }
      acc[curr.language].push(curr);
      return acc;
    },
    {} as Record<string, Pattern[]>,
  );

  const imageSrc = pattern.productImageUrls.at(0);

  return (
    <div className="rounded-lg shadow-md p-4 flex flex-col">
      <div className="flex flex-row gap-4 bg-white h-full">
        {imageSrc ? (
          <Link href={`/app/secure/auth/me/orders/${pattern.orderId}`} rel={'nofollow'}>
            <CldImage
              key={imageSrc}
              alt={pattern.productTitle}
              src={imageSrc}
              width={100}
              height={100}
              className={`rounded-lg shadow-md`}
            />
          </Link>
        ) : null}
        <div className="flex-1 flex flex-col justify-between gap-4">
          <Link
            href={`/app/secure/auth/me/orders/${pattern.orderId}`}
            rel={'nofollow'}
            className="flex flex-col gap-2"
          >
            <h2 className="text-xl font-semibold">{pattern.productTitle}</h2>
            <p className="text-gray-600 line-clamp-2">{pattern.productDescription}</p>
          </Link>
          <div className="flex-1 flex items-end">
            <Button onClick={() => setExpanded(!expanded)} className="w-full" variant="outline">
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Hide Files
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Show Files
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      {expanded ? (
        <div className="mt-8">
          {Object.entries(groupedPatterns).map(([language, files]) => {
            const fileOrder = pattern.productFileOrder
              .filter((fo) => fo.language === language)
              .map((fo) => fo.fileId);
            return (
              <div key={language} className="mb-4 border-t-2 border-dashed border-muted">
                <h3 className="font-semibold mt-4 mb-2">
                  <CountryFlag languageCode={language} />{' '}
                  {LANGUAGES.find((lang) => lang.code === language)?.name ?? language}
                </h3>
                <h5 className="mb-1 text-muted-foreground">Download as ZIP file</h5>
                <div className="mb-2">
                  <DownloadPatternZipButton
                    productId={pattern.productId}
                    productTitle={pattern.productTitle}
                    files={pattern.patterns.filter((p) => p.language === language)}
                    buttonLabel={'Download all files'}
                  />
                </div>
                <h5 className="mb-1 text-muted-foreground">Send as mail</h5>
                <div className="mb-2">
                  <SendFilesButton
                    productId={pattern.productId}
                    channel={'MAIL'}
                    language={language}
                  />
                </div>
                <h5 className="mb-1 text-muted-foreground">Download single files</h5>
                {(files as GetFileResponse[])
                  .sort((a, b) => fileOrder.indexOf(a.id) - fileOrder.indexOf(b.id))
                  .map((file) => {
                    return (
                      <Button
                        disabled={isLoading}
                        key={file.objectName}
                        onClick={() => handleDownload(file.id)}
                        className="w-full mb-2"
                        variant="secondary"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        <span className="line-clamp-1">{file.objectName.split('/').pop()}</span>
                      </Button>
                    );
                  })}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
