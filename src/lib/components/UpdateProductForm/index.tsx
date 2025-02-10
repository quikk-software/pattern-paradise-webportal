'use client';

import React, { useState, ChangeEvent } from 'react';
import { CheckCircle2, FileIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useUpdateProduct } from '@/lib/api';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { handleImageUpload } from '@/lib/features/common/utils';
import RequestStatus from '@/lib/components/RequestStatus';
import { Checkbox } from '@/components/ui/checkbox';
import { CATEGORIES, ExperienceLevel, HASHTAG_LIMIT, IMAGE_LIMIT } from '@/lib/constants';
import { GetProductResponse } from '@/@types/api-types';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import GoBackButton from '@/lib/components/GoBackButton';
import PriceInput from '@/lib/components/PriceInput';
import HashtagInput from '@/components/hashtag-input';
import { MultiSelect } from '@/components/multi-select';
import { SelectedOptions } from '@/components/selected-options';
import ExperienceSelect from '@/lib/components/ExperienceSelect';
import { updateSelectedFlags } from '@/lib/utils';

interface UpdateProductFormProps {
  initialData: GetProductResponse;
}

export function UpdateProductForm({ initialData }: UpdateProductFormProps) {
  const [images, setImages] = useState<{ url: string; name: string }[]>(
    initialData.imageUrls.map((url) => ({
      url,
      name: url?.split('/').at(-1) ?? 'image',
    })),
  );
  const [hashtags, setHashtags] = useState<string[]>(initialData.hashtags);
  const [category, setCategory] = useState<{
    craft: string;
    options: { [key: string]: { name: string; selected: boolean }[] };
  }>({
    craft: initialData.category,
    options: {},
  });
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState<ExperienceLevel>(
    initialData.experience as ExperienceLevel,
  );
  const [imageError, setImageError] = useState<string | undefined>(undefined);
  const [imageUploadIsLoading, setImageUploadIsLoading] = useState<boolean>(false);
  const [isFree, setIsFree] = useState<boolean>(initialData.isFree);
  const [uploadProgress, setUploadProgress] = useState<{ fileIndex: number; progress: number }[]>(
    [],
  );

  const { mutate, isLoading, isSuccess, isError, errorDetail } = useUpdateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          imageUrls: initialData.imageUrls,
          hashtags: initialData.hashtags,
          price: String(initialData.price),
          category: initialData.category,
        }
      : {
          title: '',
          description: '',
          imageUrls: [],
          hashtags: [],
          price: '0.0',
          category: '',
        },
  });

  const hasErrors = errors.title || errors.description || errors.price;

  const updatedCategories = updateSelectedFlags(
    CATEGORIES,
    initialData.category,
    initialData.subCategories.map((subCategory) => ({ name: subCategory, selected: true })),
  );

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

    const newImages = images
      .filter((image) => !initialData.imageUrls.includes(image.url))
      .map((image) => image.url);

    const urls = await handleImageUpload(
      newImages,
      () => {
        if (hasErrors) {
          setImageError('Please fill out the form before uploading');
          return;
        }
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

    await mutate(initialData.id, {
      title: data.title.trim(),
      description: data.description.trim(),
      price: isFree ? 0.0 : parseFloat(data.price.replace(',', '.')),
      experience: selectedExperienceLevel,
      isFree,
      hashtags,
      subCategories: Object.values(category.options)
        .map((options) => options.map((option) => option.name))
        .flat(),
      imageUrls: [
        ...new Set([
          ...images
            .filter((image) => image.url.startsWith('https://res.cloudinary.com/'))
            .map((image) => image.url),
          ...urls.map((fu) => fu.url),
        ]),
      ],
      category: category.craft,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const titleWatch = watch('title');

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
            {(titleWatch ?? '').length}/30 characters
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
            <PriceInput
              isFree={isFree}
              handleKeyDown={handleKeyDown}
              register={register}
              defaultValue={initialData.price}
            />
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
              initialCategories={updatedCategories}
              injectCategories={true}
              initialCraft={initialData.category}
            />
          </div>
          <SelectedOptions selectedOptions={{ craft: category.craft, options: category.options }} />
        </div>

        <div className="flex flex-col">
          <Label htmlFor="images" className="block text-lg font-semibold mb-2">
            Images (max. {IMAGE_LIMIT}) <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img.url}
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
            disabled={images.length >= IMAGE_LIMIT}
            className="cursor-pointer"
          />
          {images.length >= IMAGE_LIMIT && (
            <p className="text-yellow-600 text-sm mt-2">Maximum number of images reached.</p>
          )}
          {imageError ? <p className="text-yellow-600 text-sm mt-2">{imageError}</p> : null}
        </div>

        <Button type="submit" className="w-full" disabled={imageUploadIsLoading || isLoading}>
          {imageUploadIsLoading || isLoading ? (
            <LoadingSpinnerComponent size="sm" className="text-white" />
          ) : null}
          Update pattern
        </Button>

        {uploadProgress.map((up) => (
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
          successMessage={<span>Your listing has been updated successfully!</span>}
          errorMessage={errorDetail}
        />
      </form>
      <GoBackButton />
    </div>
  );
}
