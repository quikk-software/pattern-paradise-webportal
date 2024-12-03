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
import { useRouter } from 'next/navigation';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';

interface ReviewDrawerProps {
  drawerIsOpen: boolean;
  setDrawerIsOpen: (isOpen: boolean) => void;
  testingId: string;
}

export default function ReviewDrawer({
  drawerIsOpen,
  setDrawerIsOpen,
  testingId,
}: ReviewDrawerProps) {
  const [likeState, setLikeState] = useState<'Approved' | 'Declined' | null>(null);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);

  const router = useRouter();

  const { fetch: approveTesting, isLoading: approveTestingIsLoading } = useApproveTesting();
  const { fetch: declineTesting, isLoading: declineTestingIsLoading } = useDeclineTesting();

  const { mutate, isLoading: createTestingCommentIsLoading } = useCreateTestingComment();

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
    if (likeState === 'Approved') {
      await approveTesting(testingId);
    } else if (likeState === 'Declined') {
      await declineTesting(testingId);
    } else {
      return;
    }

    try {
      const urls = await handleImageUpload(
        images,
        () => {},
        () => {},
        () => {},
        // TODO: Add progress handler
        () => {},
      );

      await mutate({
        type: 'Review',
        testingId,
        files: urls,
        comment: reviewMessage ?? '',
      });
    } finally {
      setDrawerIsOpen(false);
      router.push(`/app/secure/test/chats?testingId=${testingId}`);
    }
  };

  const isLoading =
    approveTestingIsLoading || declineTestingIsLoading || createTestingCommentIsLoading;

  return (
    <Drawer open={drawerIsOpen} onOpenChange={setDrawerIsOpen}>
      <DrawerContent className="p-4">
        <div className="mx-auto w-full max-w-sm flex flex-col gap-8 max-h-[60vh] overflow-y-auto">
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
