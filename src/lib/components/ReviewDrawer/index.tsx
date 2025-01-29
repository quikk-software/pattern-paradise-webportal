import React, { ChangeEvent, useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { MessageCircleHeartIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LikeDislikeButtons } from '@/components/like-dislike-buttons';
import { handleImageUpload } from '@/lib/features/common/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useApproveTesting, useCreateTestingComment, useDeclineTesting } from '@/lib/api/testing';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import RequestStatus from '@/lib/components/RequestStatus';
import { Progress } from '@/components/ui/progress';

interface ReviewDrawerProps {
  drawerIsOpen: boolean;
  setDrawerIsOpen: (isOpen: boolean) => void;
  testingId: string;
  skipRating?: boolean;
}

export default function ReviewDrawer({
  drawerIsOpen,
  setDrawerIsOpen,
  testingId,
  skipRating = false,
}: ReviewDrawerProps) {
  const [likeState, setLikeState] = useState<'Approved' | 'Declined' | null>(null);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ fileIndex: number; progress: number }[]>(
    [],
  );

  const {
    fetch: approveTesting,
    isLoading: approveTestingIsLoading,
    isSuccess: approveTestingIsSuccess,
    isError: approveTestingIsError,
    errorDetail: approveTestingErrorDetail,
  } = useApproveTesting();
  const {
    fetch: declineTesting,
    isLoading: declineTestingIsLoading,
    isSuccess: declineTestingIsSuccess,
    isError: declineTestingIsError,
    errorDetail: declineTestingErrorDetail,
  } = useDeclineTesting();

  const {
    mutate,
    isLoading: createTestingCommentIsLoading,
    isSuccess,
    isError,
    errorDetail,
  } = useCreateTestingComment();

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newImages].slice(0, 6));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReviewClick = async (
    likeState: 'Approved' | 'Declined' | null,
    reviewMessage: string | null,
    images: string[],
    testingId: string,
  ) => {
    if (!skipRating) {
      if (likeState === 'Approved') {
        await approveTesting(testingId);
      } else if (likeState === 'Declined') {
        await declineTesting(testingId);
      } else {
        return;
      }
    }

    try {
      const urls = await handleImageUpload(
        images,
        () => {},
        () => {},
        () => {},
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

      await mutate({
        type: 'Review',
        testingId,
        files: urls,
        comment: reviewMessage ?? '',
        testerStatus:
          likeState === 'Approved' ? 'Approved' : likeState === 'Declined' ? 'Declined' : undefined,
      });
    } finally {
      setDrawerIsOpen(false);
      window.location.reload();
    }
  };

  const isLoading =
    approveTestingIsLoading || declineTestingIsLoading || createTestingCommentIsLoading;

  return (
    <Drawer open={drawerIsOpen} onOpenChange={setDrawerIsOpen}>
      <DrawerContent className="p-4">
        <div className="flex flex-col gap-8 max-h-[60vh] overflow-y-auto">
          <DrawerHeader className="flex flex-col gap-8 items-center mt-4">
            <MessageCircleHeartIcon className="w-20 h-20" />
            <DrawerTitle>Leave a Review</DrawerTitle>
            <DrawerTitle className="text-sm font-medium">
              You can add a Review for this testing here! Choose if you want to approve or decline
              below and leave a message and final images.
            </DrawerTitle>
          </DrawerHeader>
          <LikeDislikeButtons likeState={likeState} setLikeState={setLikeState} />
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col">
              <Label htmlFor="images" className="block text-lg font-semibold mb-2">
                Images (max. 6) <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {images.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <X />
                    </Button>
                  </div>
                ))}
              </div>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                disabled={images.length >= 6}
                className="cursor-pointer"
              />
              {images.length >= 6 && (
                <p className="text-yellow-600 text-sm mt-2">Maximum number of images reached.</p>
              )}
            </div>
            <Textarea
              id="review-message"
              placeholder="Enter a review message"
              className="w-full"
              rows={4}
              onChange={(e) => setReviewMessage(e.target.value ?? null)}
            />
          </div>
          <div className="flex flex-col gap-4 w-full">
            <p className="text-sm">
              ⚠️ Note: Reviews will be publicly available to all users of Pattern Paradise. This
              includes your review images, message and like/dislike choice.
            </p>

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

            <RequestStatus
              isSuccess={approveTestingIsSuccess}
              isError={approveTestingIsError}
              errorMessage={
                <>
                  Something went wrong while approving testing
                  {approveTestingErrorDetail ? `: ${approveTestingErrorDetail}` : ''}
                </>
              }
            />
            <RequestStatus
              isSuccess={declineTestingIsSuccess}
              isError={declineTestingIsError}
              errorMessage={
                <>
                  Something went wrong while declining testing
                  {declineTestingErrorDetail ? `: ${declineTestingErrorDetail}` : ''}
                </>
              }
            />
            <RequestStatus
              isSuccess={isSuccess}
              isError={isError}
              errorMessage={
                <>
                  Something went wrong while removing testers
                  {errorDetail ? `: ${errorDetail}` : ''}
                </>
              }
            />
            <Button
              onClick={() => {
                setDrawerIsOpen(false);
              }}
              variant={'outline'}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleReviewClick(likeState, reviewMessage, images, testingId);
              }}
              disabled={likeState === null || isLoading}
            >
              {isLoading ? <LoadingSpinnerComponent size={`sm`} className={`text-white`} /> : null}
              Add review
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
