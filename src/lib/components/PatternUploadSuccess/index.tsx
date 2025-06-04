'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle2, Eye, FileCheck, Info } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import React, { useEffect, useState } from 'react';
import ReleasePatternDrawer from '@/lib/components/ReleasePatternDrawer';
import { useGetProduct, useUndraftProduct } from '@/lib/api';
import NotFoundPage from '@/app/not-found';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { InfoBoxComponent } from '@/components/info-box';
import ShareButton from '@/lib/components/ShareButton';
import ConfirmDrawer from '@/lib/components/ConfirmDrawer';
import { useRouter } from 'next/navigation';

interface PatternUploadSuccessProps {
  productId: string;
}

export default function PatternUploadSuccess({ productId }: PatternUploadSuccessProps) {
  const [isReleaseProductDrawerOpen, setIsReleaseProductDrawerOpen] = useState(false);
  const [isUndraftProductDrawerOpen, setIsUndraftProductDrawerOpen] = useState(false);

  const { fetch, data: product, isLoading, isError } = useGetProduct();
  const {
    mutate: undraftPattern,
    isLoading: undraftPatternnIsLoading,
    errorDetail: undraftPatternErrorDetail,
  } = useUndraftProduct();

  const router = useRouter();

  useEffect(() => {
    fetch(productId).then();
  }, [productId]);

  const handleStartTesterCallClick = () => {
    undraftPattern(productId).then(() => {
      router.push(`/app/tester-calls/${productId}`);
    });
  };

  if (isError) {
    return <NotFoundPage />;
  }

  if (isLoading || !product) {
    return (
      <div className="flex justify-center items-center h-dvh">
        <LoadingSpinnerComponent />
      </div>
    );
  }

  const isDraft = product.status === 'Draft';
  const isTesterCall = product.status === 'Created';
  const isReleased = product.status === 'Released';

  return (
    <div>
      <div className="flex flex-col items-center text-center mb-8">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Pattern Uploaded Successfully!</h1>
        {isDraft ? (
          <div className="space-y-4">
            <p>Your pattern has been saved successfully.</p>
            <div className="flex flex-row gap-2">
              <div className="space-y-2 w-full">
                <Button variant="secondary" onClick={() => setIsReleaseProductDrawerOpen(true)}>
                  Release Pattern
                </Button>
              </div>
              <div className="space-y-2 w-full">
                <Button onClick={() => setIsUndraftProductDrawerOpen(true)}>
                  Start Tester Call
                </Button>
              </div>
            </div>
          </div>
        ) : null}
        {isTesterCall ? (
          <p className="text-muted-foreground mt-2 max-w-md">
            Your pattern has been uploaded and is almost ready to share with the community.
          </p>
        ) : null}
        {isReleased ? (
          <div className="space-y-2">
            <p className="text-muted-foreground mt-2 max-w-md">
              Your pattern has been released and is ready to be shared with the community.
            </p>
            <ShareButton
              url={`${process.env.NEXT_PUBLIC_URL}/app/products/${productId}`}
              shareText={'Check out this pattern on Pattern Paradise!'}
            />
          </div>
        ) : null}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pattern Status</CardTitle>
            {isDraft ? (
              <Badge variant={'outline'} className="ml-2">
                {'Draft'}
              </Badge>
            ) : null}
            {isTesterCall ? (
              <Badge variant={'outline'} className="ml-2">
                {'In Testing'}
              </Badge>
            ) : null}
            {isReleased ? (
              <Badge variant={'outline'} className="ml-2">
                {'Released'}
              </Badge>
            ) : null}
          </div>
          <CardDescription>Here&apos;s what happens next with your pattern</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isReleased ? (
              <InfoBoxComponent
                severity={'success'}
                message={`Your pattern '${product.title}' has been successfully released!`}
              />
            ) : null}
            {isTesterCall ? (
              <div className="flex gap-3">
                <div className="mt-0.5">
                  <FileCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Testing Process</h3>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ve started a{' '}
                    <Link
                      href="/%5Blang%5D/app/secure/sell/testings"
                      className="text-blue-500 underline"
                    >
                      test process
                    </Link>{' '}
                    for your pattern. We encourage you do the whole testing procedure and gather
                    tester reviews before releasing your pattern in order to ensure the quality and
                    minimize risk of customer complaints.
                  </p>
                </div>
              </div>
            ) : null}
            {isTesterCall || isDraft ? (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Want to release now?</AlertTitle>
                <AlertDescription>
                  You can release your pattern to the public immediately, but we recommend to wait
                  for the testing process to complete.
                </AlertDescription>
              </Alert>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          {isTesterCall || isDraft ? (
            <Button onClick={() => setIsReleaseProductDrawerOpen(true)} variant="default">
              Release Pattern
            </Button>
          ) : null}
          <Link href={`/app/secure/sell/products/${productId}`}>
            <Button variant="ghost">Edit Pattern</Button>
          </Link>
        </CardFooter>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pattern Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">See how your pattern will appear to customers</span>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/app/products/${productId}`}>
              <Button variant="secondary" className="w-full">
                Preview Pattern
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {isTesterCall ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">What&apos;s Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Share your pattern&apos;s tester call on social media
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/app/tester-calls/${productId}`}>
                <Button variant="secondary" className="w-full">
                  Tester Call
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ) : null}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/%5Blang%5D/app/secure/sell"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
      <ReleasePatternDrawer
        isOpen={isReleaseProductDrawerOpen}
        setIsOpen={setIsReleaseProductDrawerOpen}
        productId={productId}
      />
      <ConfirmDrawer
        isOpen={isUndraftProductDrawerOpen}
        setIsOpen={setIsUndraftProductDrawerOpen}
        isLoading={undraftPatternnIsLoading}
        errorDetail={undraftPatternErrorDetail}
        description={'From now on, users will be able to apply to your tester call.'}
        callbackFn={handleStartTesterCallClick}
      />
    </div>
  );
}
