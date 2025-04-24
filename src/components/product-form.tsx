'use client';

import React, { useState, ChangeEvent } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useCreateProduct } from '@/lib/api';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { handleImageUpload } from '@/lib/features/common/utils';
import RequestStatus from '@/lib/components/RequestStatus';
import { Checkbox } from '@/components/ui/checkbox';
import FileSelector from '@/components/file-selector';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import {
  CATEGORIES,
  ExperienceLevel,
  ExperienceLevels,
  HASHTAG_LIMIT,
  IMAGE_LIMIT,
} from '@/lib/constants';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import GoBackButton from '@/lib/components/GoBackButton';
import PriceInput from '@/lib/components/PriceInput';
import HashtagInput from '@/components/hashtag-input';
import { MultiSelect } from '@/components/multi-select';
import { SelectedOptions } from '@/components/selected-options';
import ExperienceSelect from '@/lib/components/ExperienceSelect';
import { checkProStatus } from '@/lib/core/utils';
import DragAndDropContainer from '@/lib/components/DragAndDropContainer';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import DragAndDropImage from '@/lib/components/DragAndDropImage';
import UploadFeedback from '@/components/upload-feedback';
import { useRouter } from 'next/navigation';
import CardRadioGroup from '@/components/card-radio-group';

export interface PDFFile {
  file: File;
  language: string;
  id: string;
  originalFilename: string;
}

export function ProductFormComponent() {
  const [patterns, setPatterns] = useState<PDFFile[]>([]);
  const [images, setImages] = useState<{ url: string; name: string }[]>([]);
  const [category, setCategory] = useState<{
    craft: string;
    options: { [key: string]: { name: string; selected: boolean }[] };
  }>({
    craft: 'Crocheting',
    options: {},
  });
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | undefined>(undefined);
  const [patternError, setPatternError] = useState<string | undefined>(undefined);
  const [imageUploadIsLoading, setImageUploadIsLoading] = useState<boolean>(false);
  const [isFree, setIsFree] = useState<boolean>(false);
  const [isMystery, setIsMystery] = useState<string | null>('yes');
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState<ExperienceLevel>(
    ExperienceLevels.Intermediate,
  );
  const [showResetDrawer, setShowResetDrawer] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<
    {
      status: string;
      type: string;
      id: number;
    }[]
  >([]);
  const [uploadProgress, setUploadProgress] = useState<{ fileIndex: number; progress: number }[]>(
    [],
  );
  const [fileOrder, setFileOrder] = useState<{ [key: string]: string[] }>({});

  const [uploadStage, setUploadStage] = useState<'idle' | 'running' | 'complete' | 'error'>('idle');
  const [cloudinaryProgress, setCloudinaryProgress] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);

  const { subscriptionStatus } = useSelector((s: Store) => s.auth);

  const {
    mutate,
    isLoading,
    isSuccess,
    isError,
    errorDetail,
    uploadProgress: backendProgress,
    setUploadProgress: setBackendProgress,
  } = useCreateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const router = useRouter();

  const hasErrors =
    errors.title || errors.description || errors.price || imageError || patternError;

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
      }));
      setImages((prev) => [...prev, ...newImages].slice(0, IMAGE_LIMIT));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: any) => {
    if (images.length === 0 || images.length > IMAGE_LIMIT) {
      setImageError(`Please add 1 to ${IMAGE_LIMIT} images.`);
      return;
    }
    setImageError(undefined);
    setUploadStatus([]);
    if (patterns.length === 0) {
      setPatternError('Please add a PDF with your pattern.');
      return;
    }
    setPatternError(undefined);

    if (uploadStage !== 'idle') {
      return;
    }

    try {
      setUploadStage('running');

      const urls = await handleImageUpload(
        images.map((image) => image.url),
        (fileIndex) => {
          if (hasErrors) {
            setImageError('Please fill out the form before uploading');
            return;
          }
          setImageUploadIsLoading(true);
          setUploadStatus((prev) => {
            const existingIndex = prev.findIndex((item) => item.id === fileIndex);

            if (existingIndex !== -1) {
              return prev.map((item, index) =>
                index === existingIndex
                  ? { ...item, type: 'info', status: 'Image upload started' }
                  : item,
              );
            } else {
              return [
                ...prev,
                {
                  type: 'info',
                  status: 'Image upload started',
                  id: fileIndex,
                },
              ];
            }
          });
        },
        (fileIndex) => {
          setImageUploadIsLoading(false);
          setUploadStatus((prev) => {
            const existingIndex = prev.findIndex((item) => item.id === fileIndex);

            setCloudinaryProgress(((fileIndex + 1) / images.length) * 100);

            if (existingIndex !== -1) {
              return prev.map((item, index) =>
                index === existingIndex
                  ? { ...item, type: 'info', status: 'Image upload successful' }
                  : item,
              );
            } else {
              return [
                ...prev,
                {
                  type: 'info',
                  status: 'Image upload successful',
                  id: fileIndex,
                },
              ];
            }
          });
        },
        (fileIndex) => {
          setImageError('Error uploading images. Please try again.');
          setUploadStatus((prev) => {
            const existingIndex = prev.findIndex((item) => item.id === fileIndex);

            if (existingIndex !== -1) {
              return prev.map((item, index) =>
                index === existingIndex
                  ? { ...item, type: 'error', status: 'Image upload failed' }
                  : item,
              );
            } else {
              return [
                ...prev,
                {
                  type: 'error',
                  status: 'Image upload failed',
                  id: fileIndex,
                },
              ];
            }
          });
        },
        (fileIndex, progress) => {
          setUploadProgress((prev) => {
            const existingIndex = prev.findIndex((item) => item.fileIndex === fileIndex);
            let updatedProgress;

            if (existingIndex !== -1) {
              updatedProgress = prev.map((item, index) =>
                index === existingIndex ? { fileIndex, progress } : item,
              );
            } else {
              updatedProgress = [...prev, { fileIndex, progress }];
            }

            return updatedProgress.sort((a, b) => a.fileIndex - b.fileIndex);
          });
        },
      );

      if (!urls) {
        setImageError("Images couldn't be uploaded. Please try again later.");
        return;
      }

      const formData = new FormData();

      patterns.forEach((pattern) => formData.append('files', pattern.file));
      formData.append(
        'fileNames',
        JSON.stringify(
          patterns.map((pattern, index) => {
            const splittedFilename = pattern.originalFilename.split('.');
            let suffix;
            if (splittedFilename.length > 1) {
              suffix = splittedFilename.pop();
            }
            const filenameWithoutSuffix = splittedFilename.join('');
            return {
              filename: pattern.file.name,
              originalFilename: filenameWithoutSuffix.trim()
                ? pattern.originalFilename
                : `Page ${index + 1}${suffix ? `.${suffix}` : ''}`,
              fileId: pattern.id,
            };
          }),
        ),
      );

      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('experience', selectedExperienceLevel);
      formData.append('category', category.craft);
      formData.append('price', String(isFree ? 0.0 : parseFloat(data.price.replace(',', '.'))));
      formData.append('isFree', isFree ? 'true' : 'false');
      formData.append('isPhysical', 'false');
      formData.append('isMystery', !isFree && isMystery === 'yes' ? 'true' : 'false');

      formData.append(
        'subCategories',
        JSON.stringify(
          Object.values(category.options)
            .map((options) => options.map((option) => option.name))
            .flat(),
        ),
      );
      formData.append('imageUrls', JSON.stringify(urls.map(({ url }) => url)));
      formData.append('hashtags', JSON.stringify(hashtags));
      formData.append(
        'fileOrder',
        JSON.stringify(
          Object.entries(fileOrder)
            .map(([language, fileIds]) =>
              fileIds.map((fileId) => ({
                language,
                fileId,
              })),
            )
            .flat(1),
        ),
      );
      formData.append(
        'languages',
        JSON.stringify(patterns.map(({ language, file }) => ({ language, fileName: file.name }))),
      );

      const { productId } = await mutate(formData);

      handleResetFormClick();

      setUploadStage('complete');

      router.push(`/app/secure/sell/submit/success?productId=${productId}`);
    } catch (error) {
      setUploadStage('error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleResetFormClick = () => {
    setImages([]);
    setPatterns([]);
    setHashtags([]);
    setCategory({
      craft: 'Crocheting',
      options: {},
    });
    setImageError(undefined);
    setPatternError(undefined);
    setImageUploadIsLoading(false);
    setIsFree(false);
    setUploadStatus([]);
    setUploadProgress([]);
    setUploadStage('idle');
    setCloudinaryProgress(0);
    setBackendProgress(0);
    setOverallProgress(0);

    setShowResetDrawer(false);

    reset();
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.url === active.id);
        const newIndex = items.findIndex((item) => item.url === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const getButtonText = () => {
    switch (uploadStage) {
      case 'idle':
        return 'Start Upload';
      case 'running':
        return 'Uploading...';
      case 'complete':
        return 'Upload Complete';
      case 'error':
        return 'Retry Upload';
      default:
        return '';
    }
  };

  const titleWatch = watch('title');

  const isPro = checkProStatus(subscriptionStatus);

  const isUploading = imageUploadIsLoading || isLoading || uploadStage === 'running';

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <Label htmlFor="title" className="block text-lg font-semibold mb-2">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            placeholder="Enter a title"
            className="w-full"
            {...register('title', {
              required: 'Title is required',
              maxLength: {
                value: 30,
                message: 'Please choose a title with no more than 30 characters',
              },
            })}
            onKeyDown={handleKeyDown}
          />
          <p
            className={`text-sm ${!titleWatch || titleWatch?.length <= 30 ? 'text-gray-500' : 'text-red-500'} mt-1`}
          >
            {(titleWatch ?? '')?.length}/30 characters
          </p>
          {errors.title ? (
            <p className="text-sm text-red-500 mb-2">{errors.title.message as string}</p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="description" className="block text-lg font-semibold mb-2">
            Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Enter a description"
            className="w-full"
            rows={4}
            {...register('description', {
              required: 'Description is required',
            })}
            onKeyDown={handleKeyDown}
          />
          {errors.description ? (
            <p className="text-sm text-red-500 mb-2">{errors.description.message as string}</p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="hashtags" className="block text-lg font-semibold mb-2">
            Hashtags (max. {HASHTAG_LIMIT})
          </Label>
          <HashtagInput hashtags={hashtags} setHashtags={setHashtags} limit={HASHTAG_LIMIT} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="price" className="block text-lg font-semibold mb-2">
              Price (in $) <span className="text-red-500">*</span>
            </Label>
            <PriceInput isFree={isFree} handleKeyDown={handleKeyDown} register={register} />
            {errors.price ? (
              <p className="text-sm text-red-500 mb-2">{errors.price.message as string}</p>
            ) : null}
          </div>

          <div className="flex gap-1">
            <Checkbox
              id="isfree-checkbox"
              checked={isFree}
              onCheckedChange={() => setIsFree((isFree) => !isFree)}
            />
            <Label htmlFor="isfree-checkbox" className="block text-sm">
              Offer this pattern free of charge
            </Label>
          </div>
        </div>

        {!isFree ? (
          <CardRadioGroup
            selectedOption={isMystery}
            setSelectedOption={setIsMystery}
            question={'Enroll in mystery patterns?'}
            description={
              <span>
                Patterns included in{' '}
                <Link href="/app/mystery" target="_blank" className="text-blue-500 underline">
                  Mystery Patterns
                </Link>{' '}
                may receive additional exposure to customers. Each mystery box is sold for a{' '}
                <strong>flat rate of $3</strong>.
              </span>
            }
            options={[
              {
                id: 'yes',
                title: 'Yes',
                description: 'My pattern will be eligible to appear in mystery patterns',
              },
              {
                id: 'no',
                title: 'No',
                description: 'My pattern will not be included in any mystery patterns',
              },
            ]}
          />
        ) : null}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="experienceLevel" className="block text-lg font-semibold mb-2">
              Experience Level <span className="text-red-500">*</span>
            </Label>
            <ExperienceSelect
              selectedExperienceLevel={selectedExperienceLevel}
              setSelectedExperienceLevel={setSelectedExperienceLevel}
            />
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Label htmlFor="category" className="block text-lg font-semibold mb-2">
              Category <span className="text-red-500">*</span>
            </Label>
            <MultiSelect
              onChange={(value) => setCategory(value)}
              initialCategories={CATEGORIES}
              injectCategories={false}
              initialCraft={'Crocheting'}
            />
          </div>
          <SelectedOptions selectedOptions={{ craft: category.craft, options: category.options }} />
        </div>

        <div className="flex flex-col">
          <Label htmlFor="images" className="block text-lg font-semibold mb-2">
            Images (max. {IMAGE_LIMIT}) <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleDragEnd(event)}
            >
              <SortableContext
                key={images.map((img) => img.url).join('-')}
                items={images.map((img) => img.url)}
                strategy={rectSortingStrategy}
              >
                {images.map((img, index) => (
                  <DragAndDropImage
                    imageUrl={img.url}
                    index={index}
                    removeImage={removeImage}
                    key={index}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
          <Input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            disabled={images.length >= IMAGE_LIMIT}
            className="cursor-pointer"
          />
          {images.length >= IMAGE_LIMIT && (
            <p className="text-yellow-600 text-sm mt-2">Maximum number of images reached.</p>
          )}
          {imageError ? <p className="text-yellow-600 text-sm mt-2">{imageError}</p> : null}
        </div>

        <div className="w-full">
          <FileSelector selectedFiles={patterns} setSelectedFiles={setPatterns} isPro={isPro} />
        </div>

        {patterns.length > 0 ? (
          <div className="w-full">
            <DragAndDropContainer selectedFiles={patterns} setFileOrder={setFileOrder} />
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <Button
            className="w-full"
            variant="outline"
            disabled={isUploading}
            onClick={() => {
              setShowResetDrawer(true);
            }}
            type="button"
          >
            Reset form
          </Button>
        </div>

        <UploadFeedback
          uploadStage={uploadStage}
          images={images.map((image, index) => ({
            ...image,
            status: uploadStatus.at(index)?.status,
            progress: uploadProgress.at(index)?.progress,
          }))}
          patterns={patterns}
          cloudinaryProgress={cloudinaryProgress}
          backendProgress={backendProgress}
          overallProgress={overallProgress}
          setOverallProgress={setOverallProgress}
        />

        <Button type="submit" disabled={isUploading} className="gap-2 w-full">
          {isUploading && <LoadingSpinnerComponent size="sm" className="text-white" />}
          {uploadStage === 'complete' && <CheckCircle2 className="h-4 w-4" />}
          {uploadStage === 'error' && <AlertCircle className="h-4 w-4" />}
          {getButtonText()}
        </Button>

        {!!hasErrors ? (
          <p className="text-sm text-red-500 mb-2">Please check all fields with a * mark.</p>
        ) : null}
        <RequestStatus
          isSuccess={isSuccess}
          isError={isError}
          successMessage={
            <span>
              Your listing has been created successfully!
              <br />
              You can now{' '}
              <Link
                rel={'nofollow'}
                href="/app/secure/sell/testings"
                className="text-blue-500 underline"
              >
                start a tester call
              </Link>
              .
            </span>
          }
          errorMessage={errorDetail}
        />
      </form>
      <GoBackButton />
      <Drawer open={showResetDrawer} onOpenChange={setShowResetDrawer}>
        <DrawerContent className="p-4">
          <div className="mx-auto flex flex-col gap-4">
            <DrawerHeader className="flex flex-col gap-8 items-center mt-4">
              <DrawerTitle>Reset form</DrawerTitle>
              <DrawerTitle className="text-sm font-medium">
                Are you sure you want to reset the form?
              </DrawerTitle>
            </DrawerHeader>
            <Button
              variant="outline"
              onClick={() => {
                setShowResetDrawer(false);
              }}
            >
              Go to login
            </Button>
            <Button variant="destructive" onClick={handleResetFormClick}>
              Reset form
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
