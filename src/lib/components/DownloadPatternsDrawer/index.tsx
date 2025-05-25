import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import LanguageSelect from '@/lib/components/LanguageSelect';
import SendFilesButton from '@/lib/components/SendFilesButton';
import { DownloadIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface DownloadPatternsDrawerProps {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  isLoading: boolean;
  productId?: string;
  callbackFn?: (language: string) => void;
  languages: string[];
  downloadProgress: number;
}

export default function DownloadPatternsDrawer({
  isOpen,
  setIsOpen,
  isLoading,
  productId,
  callbackFn,
  languages,
  downloadProgress,
}: DownloadPatternsDrawerProps) {
  const [language, setLanguage] = useState<string | undefined>(undefined);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="p-4">
        <div className="flex flex-col gap-4">
          <DrawerHeader>
            <DrawerTitle>Download Pattern</DrawerTitle>
            <DrawerTitle className="text-sm font-medium">
              Select the language you want to download.
            </DrawerTitle>
          </DrawerHeader>
          <LanguageSelect
            language={language}
            handleLanguageChange={handleLanguageChange}
            fullWidth
            allowedLanguages={languages}
          />
          <Button
            onClick={() => {
              setIsOpen(false);
            }}
            variant={'outline'}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <SendFilesButton language={language} productId={productId} channel={'MAIL'} />
          <div className="space-y-2 w-full">
            <Button
              onClick={() => {
                if (!language) {
                  return;
                }
                callbackFn?.(language);
              }}
              variant={'default'}
              disabled={isLoading || !language}
              className="w-full"
            >
              {isLoading ? (
                <LoadingSpinnerComponent className="mr-4 h-4 w-4 text-white" />
              ) : (
                <DownloadIcon className="mr-4 h-4 w-4" />
              )}
              Download Pattern
            </Button>
            {downloadProgress > 0 && isLoading ? (
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
            {downloadProgress > 20 && isLoading ? (
              <p>Please hang tight. Just a couple of seconds left...</p>
            ) : null}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
