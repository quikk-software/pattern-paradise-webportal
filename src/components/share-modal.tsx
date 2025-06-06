'use client';

import { useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import type { GetProductResponse, GetTestingResponse } from '@/@types/api-types';
import { SocialShareCard } from '@/components/social-share-card';
import classNames from 'classnames';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { useGetTesterCallPreviewImage } from '@/lib/api/testing';

interface ShareModalProps {
  product: GetProductResponse;
  testing: GetTestingResponse;
  theme: string;
}

export function ShareModal({ product, testing, theme }: ShareModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { fetch } = useGetTesterCallPreviewImage();

  const cardRef = useRef<HTMLDivElement>(null);

  const generateServerImage = async () => {
    setIsGenerating(true);
    try {
      const file = await fetch(product.id, theme);

      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = 'tester-call.png';
      link.click();
    } catch (error) {
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 rounded-full px-4 py-2 border-2 hover:bg-gray-50"
        >
          <Share2 className="h-5 w-5" />
          <span>Create Shareable Image</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Share on Social Media</DialogTitle>
        </DialogHeader>
        <Button
          onClick={generateServerImage}
          disabled={isGenerating}
          size="lg"
          className={classNames(
            'mt-4 px-8 py-6 text-lg rounded-full',
            'hover:opacity-90 transition-opacity',
          )}
        >
          {isGenerating ? (
            <>
              <LoadingSpinnerComponent className="mr-2 h-5 w-5 text-white" />
              Generating Image...
            </>
          ) : (
            <>
              <Download className="mr-2 h-5 w-5" />
              Download for Social Media
            </>
          )}
        </Button>

        {isGenerating ? (
          <p className="text-sm text-gray-700 text-center">
            Please hang thight, this might take a moment...
          </p>
        ) : null}

        <p className="text-sm text-gray-500 text-center">
          This will generate a high-quality image perfect for Instagram stories and other social
          media platforms. The image includes all the important details about your tester call.
        </p>

        <SocialShareCard
          product={product}
          testing={testing}
          theme={theme}
          baseUrl={process.env.NEXT_PUBLIC_URL || 'https://pattern-paradise.shop'}
        />

        <div
          ref={cardRef}
          style={{
            opacity: 0,
            pointerEvents: 'none',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: -1,
            width: '1080px',
            height: '1920px',
          }}
        >
          <SocialShareCard
            product={product}
            testing={testing}
            theme={theme}
            baseUrl={process.env.NEXT_PUBLIC_URL || 'https://pattern-paradise.shop'}
            isDownloadVersion
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
