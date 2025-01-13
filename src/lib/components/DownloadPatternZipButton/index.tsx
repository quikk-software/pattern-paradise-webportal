'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDownloadPatternsByProductId } from '@/lib/api/pattern';
import RequestStatus from '@/lib/components/RequestStatus';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { Download } from 'lucide-react';
import CountryFlag from '@/lib/components/CountryFlag';
import { GetOrderResponse, GetProductResponse } from '@/@types/api-types';

interface DownloadPatternButtonProps {
  productId: string;
  productTitle: string;
  files: GetOrderResponse['files'] | GetProductResponse['files'];
}

const DownloadPatternZipButton: React.FunctionComponent<DownloadPatternButtonProps> = ({
  productId,
  productTitle,
  files,
}) => {
  const [language, setLanguage] = useState<string | undefined>(undefined);

  const {
    fetch: downloadPattern,
    isLoading: downloadPatternIsLoading,
    isSuccess: downloadPatternIsSuccess,
    isError: downloadPatternIsError,
    data: file,
  } = useDownloadPatternsByProductId();

  useEffect(() => {
    if (!file || !language) {
      return;
    }
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_self';
    link.download =
      file.name ??
      `${productTitle.toLowerCase().replace(/\s/g, '')}_${
        language ? `${language}_` : ''
      }patterns.zip`;
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }, 1000);

    setLanguage(undefined);
  }, [file, language, productTitle]);

  const handleDownloadClick = async () => {
    await fetch(productId);
  };

  const filesGroupedByLanguage = files.reduce(
    (acc, file) => {
      if (!acc[file.language]) {
        acc[file.language] = [];
      }

      const isDuplicate = acc[file.language].some((existingFile) => existingFile.id === file.id);
      if (!isDuplicate) {
        acc[file.language].push(file);
      }

      return acc;
    },
    {} as { [language: string]: typeof files },
  );

  return (
    <div className="flex flex-col gap-2">
      {Object.keys(filesGroupedByLanguage).map((fileLanguage) => (
        <Button
          key={fileLanguage}
          className="w-full sm:w-auto"
          onClick={() => {
            setLanguage(fileLanguage);
            downloadPattern(productId, fileLanguage);
          }}
          disabled={downloadPatternIsLoading}
        >
          {downloadPatternIsLoading && fileLanguage === language ? (
            <LoadingSpinnerComponent size="sm" className="text-white" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Download pattern <CountryFlag languageCode={fileLanguage} />
        </Button>
      ))}
      <RequestStatus
        isSuccess={downloadPatternIsSuccess}
        isError={downloadPatternIsError}
        successMessage={''}
      />
    </div>
  );
};

export default DownloadPatternZipButton;
