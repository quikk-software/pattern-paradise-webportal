'use client';

import React, { useState, ChangeEvent } from 'react';
import { CheckCircle2, FileIcon, X } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import GoBackButton from '@/lib/components/GoBackButton';
import PriceInput from '@/lib/components/PriceInput';
import HashtagInput from '@/components/hashtag-input';
import { MultiSelect } from '@/components/multi-select';
import { SelectedOptions } from '@/components/selected-options';
import ExperienceSelect from '@/lib/components/ExperienceSelect';
import { checkProStatus } from '@/lib/core/utils';
import DragAndDropContainer from '@/lib/components/DragAndDropContainer';
import { InfoBoxComponent } from '@/components/info-box';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import DragAndDropImage from '@/lib/components/DragAndDropImage';

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
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState<ExperienceLevel>(
    ExperienceLevels.Intermediate,
  );
  const [showResetDrawer, setShowResetDrawer] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<
    | {
        status: string;
        type: string;
      }
    | undefined
  >(undefined);
  const [uploadProgress, setUploadProgress] = useState<{ fileIndex: number; progress: number }[]>(
    [],
  );
  const [fileOrder, setFileOrder] = useState<{ [key: string]: string[] }>({});

  const { subscriptionStatus } = useSelector((s: Store) => s.auth);

  const { mutate, isLoading, isSuccess, isError, errorDetail } = useCreateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

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
    setUploadStatus(undefined);
    if (patterns.length === 0) {
      setPatternError('Please add a PDF with your pattern.');
      return;
    }
    setPatternError(undefined);

    const urls = await handleImageUpload(
      images.map((image) => image.url),
      () => {
        if (hasErrors) {
          setImageError('Please fill out the form before uploading');
          return;
        }
        setImageUploadIsLoading(true);
      },
      () => {
        setImageUploadIsLoading(false);
        setUploadStatus({
          type: 'info',
          status: 'Image upload successful',
        });
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
      setUploadStatus({
        type: 'error',
        status: 'Image upload failed',
      });
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

    await mutate(formData);

    setUploadStatus({
      type: 'success',
      status: 'Upload successful',
    });

    handleResetFormClick();
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
    setUploadStatus(undefined);
    setUploadProgress([]);

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

  const titleWatch = watch('title');

  const isPro = checkProStatus(subscriptionStatus);

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
          <>
            <div className="w-full">
              <DragAndDropContainer selectedFiles={patterns} setFileOrder={setFileOrder} />
            </div>
            <InfoBoxComponent
              message={
                'You can only change the file order after uploading this pattern. Files and their names cannot be changed after uploading.'
              }
              severity={'info'}
            />
          </>
        ) : null}

        <div className="flex flex-col gap-2">
          <Button
            className="w-full"
            variant="outline"
            disabled={imageUploadIsLoading || isLoading}
            onClick={() => {
              setShowResetDrawer(true);
            }}
            type="button"
          >
            Reset form
          </Button>
          <Button type="submit" className="w-full" disabled={imageUploadIsLoading || isLoading}>
            {imageUploadIsLoading || isLoading ? (
              <LoadingSpinnerComponent size="sm" className="text-white" />
            ) : null}
            Upload pattern
          </Button>
        </div>

        {uploadStatus ? (
          <Badge
            variant="secondary"
            className={`text-lg bg-${
              uploadStatus.type === 'success'
                ? 'green'
                : uploadStatus.type === 'error'
                  ? 'red'
                  : 'blue'
            }-400 text-white`}
          >
            {uploadStatus.status}
          </Badge>
        ) : null}

        {!uploadStatus &&
          uploadProgress.map((up) => (
            <div key={up.fileIndex} className="p-1">
              <Card className="w-full mb-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <FileIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium truncate max-w-[200px]">
                        {images[up.fileIndex]?.name}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {up.progress === 100 ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        `${Math.round(up.progress)}%`
                      )}
                    </span>
                  </div>
                  <Progress
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
                </CardContent>
              </Card>
            </div>
          ))}

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
