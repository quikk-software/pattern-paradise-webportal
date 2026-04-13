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
import { Progress } from '@/components/ui/progress';
import RequestStatus from '@/lib/components/RequestStatus';

interface Pattern {
  language: string;
  filename: string;
}

interface PatternCardProps {
  pattern: GetPatternResponse;
}

export default function PatternCard({ pattern }: PatternCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [currentlyDownloading, setCurrentlyDownloading] = useState<string | undefined>(undefined);
  const [downloadIsDone, setDownloadIsDone] = useState(false);

  const {
    fetch: downloadPattern,
    data: fileData,
    isError,
    downloadProgress,
  } = useDownloadPattern();

  useEffect(() => {
    if (!fileData || typeof window === 'undefined') {
      return;
    }

    const url = URL.createObjectURL(fileData.file);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_self';
    link.download = fileData.objectName;

    document.body.appendChild(link);
    link.click();

    let isCancelled = false;

    const cleanup = () => {
      URL.revokeObjectURL(url);
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
      if (!isCancelled) {
        setDownloadIsDone(true);
      }
      setCurrentlyDownloading(undefined);
    };

    const timeoutId = setTimeout(cleanup, 1000);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
      URL.revokeObjectURL(url);
      setCurrentlyDownloading(undefined);
    };
  }, [fileData]);

  const handleDownload = (fileId: string) => {
    setDownloadIsDone(false);
    setCurrentlyDownloading(fileId);
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
    <div className="rounded-clay bg-card/80 backdrop-blur-md shadow-clay-card p-5 flex flex-col hover:shadow-clay-card-hover transition-all duration-500">
      <div className="flex flex-row gap-5 h-full">
        {imageSrc ? (
          <Link href={`/app/secure/auth/me/orders/${pattern.orderId}`} rel={'nofollow'} className="flex-shrink-0">
            <CldImage
              key={imageSrc}
              alt={`${pattern.productTitle} on Pattern Paradise`}
              src={imageSrc}
              width={100}
              height={100}
              className="rounded-2xl shadow-clay-card object-cover"
              format="webp"
            />
          </Link>
        ) : null}
        <div className="flex-1 flex flex-col justify-between gap-4">
          <Link
            href={`/app/secure/auth/me/orders/${pattern.orderId}`}
            rel={'nofollow'}
            className="flex flex-col gap-2 group"
          >
            <h2 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{pattern.productTitle}</h2>
            <p className="text-muted-foreground line-clamp-2 leading-relaxed">{pattern.productDescription}</p>
          </Link>
          <div className="flex-1 flex items-end">
            <Button onClick={() => setExpanded(!expanded)} className="w-full" variant="secondary">
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
              <div key={language} className="mb-6 border-t-2 border-dashed border-border pt-6">
                <h3 className="font-display font-semibold text-lg text-foreground mb-3 flex items-center gap-2">
                  <CountryFlag languageCode={language} />{' '}
                  {LANGUAGES.find((lang) => lang.code === language)?.name ?? language}
                </h3>
                <div className="space-y-4">
                  <div>
                    <h5 className="mb-2 text-sm text-muted-foreground font-medium">Download as ZIP file</h5>
                    <DownloadPatternZipButton
                      productId={pattern.productId}
                      productTitle={pattern.productTitle}
                      files={pattern.patterns.filter((p) => p.language === language)}
                      buttonLabel={'Download all files'}
                    />
                  </div>
                  <div>
                    <h5 className="mb-2 text-sm text-muted-foreground font-medium">Send as mail</h5>
                    <SendFilesButton
                      productId={pattern.productId}
                      channel={'MAIL'}
                      language={language}
                    />
                  </div>
                  <div>
                    <h5 className="mb-2 text-sm text-muted-foreground font-medium">Download single files</h5>
                    <div className="space-y-2">
                      {(files as GetFileResponse[])
                        .sort((a, b) => fileOrder.indexOf(a.id) - fileOrder.indexOf(b.id))
                        .map((file) => {
                          return (
                            <div className="space-y-2" key={file.objectName}>
                              <Button
                                disabled={currentlyDownloading === file.id}
                                onClick={() => handleDownload(file.id)}
                                className="w-full"
                                variant="secondary"
                                size="sm"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                <span className="line-clamp-1">{file.objectName.split('/').pop()}</span>
                              </Button>
                              {currentlyDownloading === file.id ? (
                                <>
                                  {downloadProgress > 0 ? (
                                    <Progress
                                      value={downloadProgress}
                                      className="h-2 transition-all duration-300 ease-in-out rounded-full"
                                      style={{
                                        background: `linear-gradient(90deg, 
                                        var(--primary) 0%, 
                                        var(--primary) ${downloadProgress}%, 
                                        var(--muted) ${downloadProgress}%, 
                                        var(--muted) 100%)`,
                                      }}
                                    />
                                  ) : null}
                                  {downloadProgress > 20 && !downloadIsDone ? (
                                    <p className="text-sm text-muted-foreground">Please hang tight. Just a couple of seconds left...</p>
                                  ) : null}
                                  <RequestStatus
                                    isSuccess={downloadIsDone}
                                    isError={isError}
                                    successMessage={
                                      'Your pattern has been successfully downloaded! Check your Downloads folder to access it.'
                                    }
                                    errorMessage={
                                      <span>
                                        Something went wrong while downloading this pattern. Please try
                                        again or{' '}
                                        <Link className="text-primary underline" href="/help">
                                          contact us
                                        </Link>{' '}
                                        for assistance.
                                      </span>
                                    }
                                  />
                                </>
                              ) : null}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
