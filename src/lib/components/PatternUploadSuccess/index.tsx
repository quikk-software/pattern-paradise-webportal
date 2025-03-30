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
import { useGetProduct } from '@/lib/api';
import NotFoundPage from '@/app/not-found';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { InfoBoxComponent } from '@/components/info-box';

interface PatternUploadSuccessProps {
  productId: string;
}

export default function PatternUploadSuccess({ productId }: PatternUploadSuccessProps) {
  const [isReleaseProductDrawerOpen, setIsReleaseProductDrawerOpen] = useState(false);

  const { fetch, data: product, isLoading, isError } = useGetProduct();

  useEffect(() => {
    fetch(productId).then();
  }, [productId]);

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

  const isReleased = product.status === 'Released';

  return (
    <div className="container max-w-3xl py-10 px-4 md:py-16">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Pattern Uploaded Successfully!</h1>
        {!isReleased ? (
          <p className="text-muted-foreground mt-2 max-w-md">
            Your pattern has been uploaded and is almost ready to share with the community.
          </p>
        ) : null}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pattern Status</CardTitle>
            {!isReleased ? (
              <Badge variant={'outline'} className="ml-2">
                {'In Testing'}
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
            {!isReleased ? (
              <div className="flex gap-3">
                <div className="mt-0.5">
                  <FileCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Testing Process</h3>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ve started a{' '}
                    <Link href="/app/secure/sell/testings" className="text-blue-500 underline">
                      test process
                    </Link>{' '}
                    for your pattern. We encourage you do the whole testing procedure and gather
                    tester reviews before releasing your pattern in order to ensure the quality and
                    minimize risk of customer complaints.
                  </p>
                </div>
              </div>
            ) : null}
            {!isReleased ? (
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
          {!isReleased ? (
            <Button onClick={() => setIsReleaseProductDrawerOpen(true)} variant="default">
              Release Pattern
            </Button>
          ) : null}
          <Link href={`/app/secure/sell/products/${productId}`}>
            <Button variant="ghost">Edit Pattern</Button>
          </Link>
        </CardFooter>
      </Card>

      {!isReleased ? (
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
              <Link href={`/app/secure/test/products/${productId}`}>
                <Button variant="secondary" className="w-full">
                  Tester Call
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      ) : null}

      <div className="mt-8 text-center">
        <Link
          href="/app/secure/sell"
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
    </div>
  );
}
