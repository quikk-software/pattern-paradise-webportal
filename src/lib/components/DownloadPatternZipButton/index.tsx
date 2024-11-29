'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useDownloadPatternsByProductId } from '@/lib/api/pattern';
import RequestStatus from '@/lib/components/RequestStatus';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { Download } from 'lucide-react';

interface DownloadPatternButtonProps {
  productId: string;
}

const DownloadPatternZipButton: React.FunctionComponent<DownloadPatternButtonProps> = ({
  productId,
}) => {
  const { fetch, isLoading, isSuccess, isError, data: file } = useDownloadPatternsByProductId();

  useEffect(() => {
    if (!file) {
      return;
    }
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_self';
    link.download = file.name ?? 'patterns';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }, 1000);
  }, [file]);

  const handleDownloadClick = async () => {
    await fetch(productId);
  };

  return (
    <div>
      <Button
        onClick={() => {
          handleDownloadClick();
        }}
        disabled={isLoading || isSuccess}
      >
        {isLoading ? (
          <LoadingSpinnerComponent size="sm" className="text-white w-full" />
        ) : (
          <Download />
        )}
        Download pattern
      </Button>
      <RequestStatus isSuccess={isSuccess} isError={isError} />
    </div>
  );
};

export default DownloadPatternZipButton;
