'use client';

import React, { useState, ChangeEvent } from 'react';
import { CheckCircle2, FileIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useUpdateProduct } from '@/lib/api';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { handleImageUpload } from '@/lib/features/common/utils';
import RequestStatus from '@/lib/components/RequestStatus';
import { Checkbox } from '@/components/ui/checkbox';
import { CATEGORIES } from '@/lib/constants';
import { GetProductResponse } from '@/@types/api-types';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import GoBackButton from '@/lib/components/GoBackButton';
import PriceInput from '@/lib/components/PriceInput';

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
  console.log({ images });
  const [category, setCategory] = useState<string>('Crocheting');
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
    getValues,
  } = useForm({
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          imageUrls: initialData.imageUrls,
          price: String(initialData.price),
          category: initialData.category,
        }
      : {
          title: '',
          description: '',
          imageUrls: [],
          price: '0.0',
          category: '',
        },
  });

  const hasErrors = errors.title || errors.description || errors.price;

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
      }));
      setImages((prev) => [...prev, ...newImages].slice(0, 6));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: any) => {
    if (images.length === 0 || images.length > 6) {
      setImageError('Please add 1 to 6 images.');
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
      isFree,
      imageUrls: [
        ...new Set([
          ...images
            .filter((image) => image.url.startsWith('https://res.cloudinary.com/'))
            .map((image) => image.url),
          ...urls.map((fu) => fu.url),
        ]),
      ],
      category,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 space-y-8 bg-white rounded-lg shadow-lg"
      >
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
          <p className="text-sm text-gray-500 mt-1">
            {(getValues('title') ?? '')?.length}/30 characters
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

        <div>
          <Label htmlFor="category" className="block text-lg font-semibold mb-2">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <Label htmlFor="images" className="block text-lg font-semibold mb-2">
            Images (max. 6) <span className="text-red-500">*</span>
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
            disabled={images.length >= 6}
            className="cursor-pointer"
          />
          {images.length >= 6 && (
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
