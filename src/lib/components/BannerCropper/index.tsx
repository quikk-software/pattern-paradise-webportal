'use client';

import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { getCroppedImg } from '@/lib/utils/cropImage';

interface BannerCropperProps {
  /** Data URL of the freshly selected image, or null when closed. */
  image: string | null;
  open: boolean;
  onCancel: () => void;
  /** Receives the cropped image as a data URL at the target dimensions. */
  onCropped: (dataUrl: string) => void;
  aspect?: number;
  outputWidth?: number;
  outputHeight?: number;
}

/**
 * Lets the user position and zoom their banner into the binding aspect ratio
 * (default 4:1) before upload, so banners always render consistently.
 */
export default function BannerCropper({
  image,
  open,
  onCancel,
  onCropped,
  aspect = 4,
  outputWidth = 1600,
  outputHeight = 400,
}: BannerCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPixels, setAreaPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_area: Area, areaPx: Area) => {
    setAreaPixels(areaPx);
  }, []);

  const handleSave = async () => {
    if (!image || !areaPixels) {
      return;
    }
    setSaving(true);
    try {
      const cropped = await getCroppedImg(image, areaPixels, outputWidth, outputHeight);
      onCropped(cropped);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onCancel();
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Position your banner</DialogTitle>
        </DialogHeader>

        <div className="relative h-56 w-full overflow-hidden rounded-lg bg-foreground/90 sm:h-64">
          {image ? (
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              objectFit="contain"
            />
          ) : null}
        </div>

        <div className="flex items-center gap-3 pt-1">
          <span className="text-sm text-muted-foreground">Zoom</span>
          <Slider
            min={1}
            max={3}
            step={0.01}
            value={[zoom]}
            onValueChange={(value) => setZoom(value[0])}
            className="flex-1"
          />
        </div>
        <p className="text-xs text-muted-foreground">Recommended size 1600 x 400 px (4:1).</p>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !areaPixels}>
            {saving ? <LoadingSpinnerComponent size="sm" className="text-white" /> : null}
            Save crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
