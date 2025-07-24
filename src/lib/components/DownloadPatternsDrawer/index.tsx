import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import DownloadPatternArea from '@/lib/components/DownloadPatternArea';
import { GetProductResponse } from '@/@types/api-types';

interface DownloadPatternsDrawerProps {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  isLoading: boolean;
  product: GetProductResponse;
}

export default function DownloadPatternsDrawer({
  isOpen,
  setIsOpen,
  isLoading,
  product,
}: DownloadPatternsDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="p-4">
        <div className="flex flex-col gap-4">
          <DrawerHeader>
            <DrawerTitle>Download Pattern</DrawerTitle>
            <DrawerTitle className="text-sm font-medium">
              Download single files or send via mail.
            </DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto max-h-64">
            <DownloadPatternArea product={product} disableZip />
          </div>
          <Button
            onClick={() => {
              setIsOpen(false);
            }}
            variant={'outline'}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
