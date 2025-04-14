import React, { ChangeEvent, MutableRefObject, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RequestStatus from '@/lib/components/RequestStatus';
import { useUpdateUser } from '@/lib/api';
import UpdateImageFeed from '@/lib/components/UpdateImageFeed';
import { arrayMove } from '@dnd-kit/sortable';
import { FEED_IMAGE_LIMIT } from '@/lib/constants';
import { handleImageUpload } from '@/lib/features/common/utils';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { Button } from '@/components/ui/button';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface ProfileImageGalleryProps {
  gallery: string[];
  highlight: boolean;
}

export default function ProfileImageGallery({ gallery, highlight }: ProfileImageGalleryProps) {
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | undefined>(undefined);
  const [imageUploadIsLoading, setImageUploadIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ fileIndex: number; progress: number }[]>(
    [],
  );

  const { userId } = useSelector((s: Store) => s.auth);

  const { mutate, isLoading, isSuccess, isError, errorDetail } = useUpdateUser();

  useEffect(() => {
    setImages(gallery);
  }, [gallery]);

  const handleGallery = async () => {
    if (images.length > FEED_IMAGE_LIMIT) {
      setImageError(`You can upload up to ${FEED_IMAGE_LIMIT} gallery images`);
      return;
    }
    setImageError(undefined);

    const newImageIndices: number[] = [];
    const newImages = images.filter((image, index) => {
      if (!gallery.includes(image)) {
        newImageIndices.push(index);
        return true;
      }
      return false;
    });

    const urls = await handleImageUpload(
      newImages,
      () => {
        setImageUploadIsLoading(true);
      },
      () => {
        setImageUploadIsLoading(false);
      },
      () => {
        setImageError('Error uploading images. Please try again.');
      },
      (fileIndex, progress) => {
        const currentProgress = {
          fileIndex,
          progress,
        };
        const uploadProgressCopy = [...uploadProgress];
        uploadProgressCopy.push(currentProgress);
        setUploadProgress(uploadProgressCopy);
      },
    );

    if (!urls) {
      setImageError("Images couldn't be uploaded. Please try again later.");
      return;
    }

    const uploadedUrlsMap = new Map();
    newImageIndices.forEach((index, i) => {
      uploadedUrlsMap.set(index, urls[i]?.url);
    });

    const imageUrls = images.map((image, index) => {
      if (uploadedUrlsMap.has(index)) {
        return uploadedUrlsMap.get(index)!;
      }
      return image;
    });

    await mutate(userId, {
      gallery: imageUrls,
    });

    setUploadProgress([]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item === active.id);
        const newIndex = items.findIndex((item) => item === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newImages].slice(0, FEED_IMAGE_LIMIT));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {highlight ? (
            <Badge variant="secondary" className="text-md">
              {'❗️'} Image Gallery
            </Badge>
          ) : (
            'Image Gallery'
          )}
        </CardTitle>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Upload Images to your Gallery. Drag and Drop them to update the order.
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <UpdateImageFeed
          images={images}
          removeImage={removeImage}
          handleDragEnd={handleDragEnd}
          handleImageSelect={handleImageSelect}
        />
        <Button disabled={isLoading || imageUploadIsLoading} onClick={handleGallery}>
          {isLoading || imageUploadIsLoading ? (
            <LoadingSpinnerComponent size={`sm`} className={`text-white`} />
          ) : null}
          Save Gallery
        </Button>
        {imageError ? <p className="text-yellow-600 text-sm mt-2">{imageError}</p> : null}
        <RequestStatus
          isSuccess={isSuccess}
          isError={isError}
          errorMessage="Couldn't add images to gallery"
        />
        {uploadProgress.map((up) => (
          <Progress
            key={up.fileIndex}
            value={up.progress}
            className="h-2 transition-all duration-300 ease-in-out"
            style={{
              background: `linear-gradient(90deg, 
                                var(--primary) 0%, 
                                var(--primary) ${up.progress}%, 
                                var(--muted) ${up.progress}%, 
                                var(--muted) 100%)`,
            }}
          />
        ))}
      </CardContent>
    </Card>
  );
}
