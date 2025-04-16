import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import LanguageSelect from '@/lib/components/LanguageSelect';
import SendFilesButton from '@/lib/components/SendFilesButton';
import { DownloadIcon } from 'lucide-react';

interface DownloadPatternsDrawerProps {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  isLoading: boolean;
  productId?: string;
  callbackFn?: (language: string) => void;
  languages: string[];
}

export default function DownloadPatternsDrawer({
  isOpen,
  setIsOpen,
  isLoading,
  productId,
  callbackFn,
  languages,
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
          <Button
            onClick={() => {
              if (!language) {
                return;
              }
              callbackFn?.(language);
            }}
            variant={'default'}
            disabled={isLoading || !language}
          >
            {isLoading ? (
              <LoadingSpinnerComponent className="mr-4 h-4 w-4" />
            ) : (
              <DownloadIcon className="mr-4 h-4 w-4" />
            )}
            Download Pattern
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
