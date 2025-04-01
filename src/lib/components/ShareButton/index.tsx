'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, Facebook, Share } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ShareButtonProps {
  url: string;
  shareText?: string;
  onCopy?: (success: boolean) => void;
  className?: string;
}

export default function ShareButton({
  url,
  shareText = 'Check this out!',
  onCopy,
  className = '',
}: ShareButtonProps) {
  const [copyStatus, setCopyStatus] = useState('');

  const router = useRouter();

  useEffect(() => {
    if (copyStatus) {
      const timer = setTimeout(() => setCopyStatus(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [copyStatus]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus('Copied!');
      onCopy?.(true);
    } catch (err) {
      setCopyStatus('Failed to copy');
      onCopy?.(false);
    }
  };

  const shareToSocial = (platform: string) => {
    let shareUrl = '';

    switch (platform) {
      case 'x':
        shareUrl = `https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&t=${encodeURIComponent(shareText)}`;
        break;
      default:
        return;
    }

    shareUrl && router.push(shareUrl);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {copyStatus && <span className="ml-2 text-xs text-muted-foreground">{copyStatus}</span>}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon">
            <Share className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => shareToSocial('x')}>
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => shareToSocial('facebook')}>
            <Facebook className="h-4 w-4 mr-2" />
            Share on Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-2" />
            Copy link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
