'use client';

import React, { useState, ChangeEvent } from 'react';
import { ArrowLeft, X } from 'lucide-react';
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
import Link from 'next/link';
import { useCreateProduct } from '@/lib/api';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { handleImageUpload } from '@/lib/features/common/utils';
import logger from '@/lib/core/logger';

const CATEGORIES = ['Crocheting', 'Knitting'];

const FILE_SIZE_LIMIT = 5242880;

export function ProductFormComponent() {
  const [pattern, setPattern] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [category, setCategory] = useState<string>('Crocheting');
  const [imageError, setImageError] = useState<string | undefined>(undefined);
  const [patternError, setPatternError] = useState<string | undefined>(undefined);
  const [imageUploadIsLoading, setImageUploadIsLoading] = useState<boolean>(false);

  const { mutate, isLoading } = useCreateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const hasErrors =
    errors.title || errors.description || errors.price || imageError || patternError;

  const handlePatternChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        if (selectedFile.size <= FILE_SIZE_LIMIT) {
          setPattern(selectedFile);
          setPatternError(undefined);
        } else {
          setPattern(null);
          setPatternError(
            `Your PDF file is to large. Please ensure that the file is below 5MB. Your file has a size of ${(
              selectedFile.size /
              (1024 * 1024)
            ).toFixed(2)}MB`,
          );
        }
      } else {
        setPattern(null);
        setPatternError('Please select a PDF file.');
      }
    }
  };

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

  const convertFileToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (data: any) => {
    if (images.length === 0 || images.length > 6) {
      setImageError('Please add 1 to 6 images.');
      return;
    }
    setImageError(undefined);
    if (!pattern) {
      setPatternError('Please add a PDF with your pattern.');
      return;
    }
    setPatternError(undefined);

    const urls = await handleImageUpload(
      images,
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
    );

    if (!urls) {
      setImageError("Images couldn't be uploaded. Please try again later.");
      return;
    }

    const patternPdfBase64 = await convertFileToBase64(pattern);
    if (!patternPdfBase64) {
      setPatternError(
        "The pattern PDF couldn't be converted. Please check your file and try again.",
      );
      return;
    }
    await mutate({
      title: data.title,
      description: data.description,
      price: data.price,
      imageUrls: urls,
      category,
      patternPdfBase64,
    });
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
          />
          <p className="text-sm text-gray-500 mt-1">
            {(getValues('title') ?? '')?.length}/80 characters
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
          />
          {errors.description ? (
            <p className="text-sm text-red-500 mb-2">{errors.description.message as string}</p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="price" className="block text-lg font-semibold mb-2">
            Price <span className="text-red-500">*</span>
          </Label>
          <Input
            id="price"
            type="number"
            placeholder="Enter price"
            {...register('price', {
              required: 'Price is required',
              min: {
                value: 0,
                message: 'Price has to be greater than 0',
              },
            })}
            step="0.01"
            className="w-full"
          />
          {errors.price ? (
            <p className="text-sm text-red-500 mb-2">{errors.price.message as string}</p>
          ) : null}
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
          {imageError ? <p className="text-yellow-600 text-sm mt-2">{imageError}</p> : null}
        </div>

        <div className="flex flex-col">
          <Label htmlFor="pattern" className="block text-lg font-semibold mb-2">
            Your pattern (PDF) <span className="text-red-500">*</span>
          </Label>
          <Input type="file" accept=".pdf" onChange={handlePatternChange} />
          {patternError ? <p className="text-yellow-600 text-sm mt-2">{patternError}</p> : null}
        </div>

        <Button type="submit" className="w-full">
          {imageUploadIsLoading || isLoading ? (
            <LoadingSpinnerComponent size="sm" className="text-white" />
          ) : null}
          Submit pattern
        </Button>
        {!!hasErrors ? (
          <p className="text-sm text-red-500 mb-2">Please check all fields with a * mark.</p>
        ) : null}
      </form>
      <Button asChild className="flex items-center space-x-2" variant="outline">
        <Link href="/sell">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go back
        </Link>
      </Button>
    </div>
  );
}
