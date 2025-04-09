import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CopyClipboardProps {
  value: string;
  title: string;
}

export default function CopyClipboard({ value, title }: CopyClipboardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-md bg-muted p-4">
      <div className="text-sm text-muted-foreground mb-1">{title}</div>
      <div className="flex items-center justify-between">
        <code className="rounded bg-muted-foreground/20 px-2 py-1 font-mono text-sm">{value}</code>

        <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 text-xs">
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
    </div>
  );
}
