import React, { useEffect, useState } from 'react';
import CountryFlag from '@/lib/components/CountryFlag';
import { LANGUAGES } from '@/lib/constants';
import DownloadPatternZipButton from '@/lib/components/DownloadPatternZipButton';
import SendFilesButton from '@/lib/components/SendFilesButton';
import { GetFileResponse, GetProductResponse } from '@/@types/api-types';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import RequestStatus from '@/lib/components/RequestStatus';
import Link from 'next/link';
import { useDownloadPattern } from '@/lib/api/pattern';

interface DownloadPatternAreaProps {
  product: GetProductResponse;
}

export default function DownloadPatternArea({ product }: DownloadPatternAreaProps) {
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

  const groupedPatterns = product.files.reduce(
    (acc, curr) => {
      if (!acc[curr.language]) {
        acc[curr.language] = [];
      }
      acc[curr.language].push(curr);
      return acc;
    },
    {} as Record<string, GetFileResponse[]>,
  );

  return (
    <>
      {Object.entries(groupedPatterns).map(([language, files]) => {
        const fileOrder = product.fileOrder
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
                productId={product.id}
                productTitle={product.title}
                files={product.files.filter((p) => p.language === language)}
                buttonLabel={'Download all files'}
              />
            </div>
            <h5 className="mb-1 text-muted-foreground">Send as mail</h5>
            <div className="mb-2">
              <SendFilesButton productId={product.id} channel={'MAIL'} language={language} />
            </div>
            <h5 className="mb-1 text-muted-foreground">Download single files</h5>
            {files
              .sort((a, b) => fileOrder.indexOf(a.id) - fileOrder.indexOf(b.id))
              .map((file) => {
                return (
                  <div className="space-y-1" key={file.objectName}>
                    <Button
                      disabled={currentlyDownloading === file.id}
                      onClick={() => handleDownload(file.id)}
                      className="w-full mb-2"
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
                            className="h-2 transition-all duration-300 ease-in-out"
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
                          <p>Please hang tight. Just a couple of seconds left...</p>
                        ) : null}
                        <RequestStatus
                          isSuccess={downloadIsDone}
                          isError={isError}
                          successMessage={
                            'Your pattern has been successfully downloaded! Check your Downloads folder to access it.'
                          }
                          errorMessage={
                            <span>
                              Something went wrong while downloading this pattern. Please try again
                              or{' '}
                              <Link className="text-blue-500 underline" href="/help">
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
        );
      })}
    </>
  );
}
