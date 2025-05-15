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
import { toPng } from 'html-to-image';

interface ShareModalProps {
  product: GetProductResponse;
  testing: GetTestingResponse;
  theme: string;
}

export function ShareModal({ product, testing, theme }: ShareModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const downloadImage = async () => {
    if (!cardRef.current) return;

    try {
      setIsGenerating(true);

      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `${product.title.replace(/\s+/g, '-').toLowerCase()}-tester-call.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
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
          onClick={downloadImage}
          disabled={isGenerating}
          size="lg"
          className={classNames(
            'mt-4 px-8 py-6 text-lg rounded-full',
            'hover:opacity-90 transition-opacity',
          )}
        >
          {isGenerating ? (
            'Generating Image...'
          ) : (
            <>
              <Download className="mr-2 h-5 w-5" />
              Download for Social Media
            </>
          )}
        </Button>

        <p className="text-sm text-gray-500 max-w-md text-center">
          This will generate a high-quality image perfect for Instagram stories and other social
          media platforms. The image includes all the important details about your tester call.
        </p>

        <SocialShareCard
          product={product}
          testing={testing}
          theme={theme}
          baseUrl={process.env.NEXT_PUBLIC_URL || 'https://patternparadise.com'}
        />

        <div className="sr-only">
          <div ref={cardRef} className="w-[1080px] h-[1920px]">
            <SocialShareCard
              product={product}
              testing={testing}
              theme={theme}
              baseUrl={process.env.NEXT_PUBLIC_URL || 'https://patternparadise.com'}
              isDownloadVersion
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
