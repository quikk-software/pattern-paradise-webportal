'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDownloadPatternsByProductId } from '@/lib/api/pattern';
import RequestStatus from '@/lib/components/RequestStatus';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { Download } from 'lucide-react';
import { GetOrderResponse, GetProductResponse } from '@/@types/api-types';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import CountryFlag from '@/lib/components/CountryFlag';
import QuickSignUp from '@/lib/components/QuickSignUp';
import Link from 'next/link';

interface DownloadPatternButtonProps {
  productId: string;
  productTitle: string;
  files: GetOrderResponse['files'] | GetProductResponse['files'];
  buttonLabel?: string;
}

const DownloadPatternZipButton: React.FunctionComponent<DownloadPatternButtonProps> = ({
  productId,
  productTitle,
  files,
  buttonLabel,
}) => {
  const [language, setLanguage] = useState<string | undefined>(undefined);
  const [isQuickSignupDrawerOpen, setIsQuickSignupDrawerOpen] = useState(false);
  const [isQuickSignupSuccess, setIsQuickSignupSuccess] = useState(false);

  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

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

  useEffect(() => {
    if (!isQuickSignupSuccess || !pathname) {
      return;
    }
    router.push(`/auth/login?redirect=${pathname}`);
  }, [isQuickSignupSuccess, router, pathname]);

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

  const handleDownloadClick = (productId: string, fileLanguage: string, isLoggedIn: boolean) => {
    setLanguage(fileLanguage);
    if (isLoggedIn) {
      downloadPattern(productId, fileLanguage);
    } else {
      setIsQuickSignupDrawerOpen(true);
    }
  };

  const isLoggedIn = status === 'authenticated';

  return (
    <div className="flex flex-col gap-2">
      {Object.keys(filesGroupedByLanguage).map((fileLanguage) => (
        <Button
          key={fileLanguage}
          onClick={() => handleDownloadClick(productId, fileLanguage, isLoggedIn)}
          disabled={downloadPatternIsLoading || downloadPatternIsSuccess}
        >
          {downloadPatternIsLoading && fileLanguage === language ? (
            <LoadingSpinnerComponent size="sm" className="text-white" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {buttonLabel ? (
            buttonLabel
          ) : (
            <>
              Download Pattern
              <CountryFlag languageCode={fileLanguage} />
            </>
          )}
        </Button>
      ))}
      <RequestStatus
        isSuccess={downloadPatternIsSuccess}
        isError={downloadPatternIsError}
        successMessage={
          'Your pattern has been successfully downloaded! Check your Downloads folder to access it.'
        }
        errorMessage={
          <span>
            Something went wrong while downloading this pattern. Please try again or{' '}
            <Link className="text-blue-500 underline" href="/help">
              contact us
            </Link>{' '}
            for assistance.
          </span>
        }
      />
      {isQuickSignupDrawerOpen ? (
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Almost there!🎉</h3>
            <p>
              Sign up for instant access to this beautiful pattern!
              <br />
              <br />
              Once you&apos;re registered, we&apos;ll bring you right back here so you can start
              creating in no time.✨
            </p>
          </div>
          <QuickSignUp redirect={pathname} signupCallback={setIsQuickSignupSuccess} />
        </div>
      ) : null}
    </div>
  );
};

export default DownloadPatternZipButton;
