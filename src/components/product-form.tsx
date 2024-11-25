'use client';

import React, { useState, ChangeEvent } from 'react';
import { ArrowLeft, CheckCircle2, FileIcon, X } from 'lucide-react';
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
import RequestStatus from '@/lib/components/RequestStatus';
import { Checkbox } from '@/components/ui/checkbox';
import PdfSelector from '@/components/pdf-selector';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { CATEGORIES } from '@/lib/constants';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export interface PDFFile {
  file: File;
  language: string;
}

export function ProductFormComponent() {
  const [patterns, setPatterns] = useState<PDFFile[]>([]);
  const [images, setImages] = useState<{ url: string; name: string }[]>([]);
  const [category, setCategory] = useState<string>('Crocheting');
  const [imageError, setImageError] = useState<string | undefined>(undefined);
  const [patternError, setPatternError] = useState<string | undefined>(undefined);
  const [imageUploadIsLoading, setImageUploadIsLoading] = useState<boolean>(false);
  const [isFree, setIsFree] = useState<boolean>(false);
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

  const { roles } = useSelector((s: Store) => s.auth);

  const { mutate, isLoading, isSuccess, isError, errorDetail } = useCreateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
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
      setImages((prev) => [...prev, ...newImages].slice(0, 6));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const convertFileToBase64 = (pdf: PDFFile) => {
    return new Promise<{ base64: string; language: string }>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(pdf.file);

      reader.onload = () =>
        resolve({
          base64: reader.result as string,
          language: pdf.language,
        });
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (data: any) => {
    if (images.length === 0 || images.length > 6) {
      setImageError('Please add 1 to 6 images.');
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

    const promises: Promise<{ base64: string; language: string }>[] = [];
    patterns.forEach((pattern) => {
      promises.push(convertFileToBase64(pattern));
    });
    const patternPdfsBase64 = await Promise.all(promises);

    await mutate({
      title: data.title.trim(),
      description: data.description.trim(),
      price: isFree ? 0.0 : data.price,
      isFree,
      imageUrls: urls.map((fu) => fu.url),
      category,
      patternPdfsBase64,
    });

    setUploadStatus({
      type: 'success',
      status: 'Upload successful',
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
            <Input
              id="price"
              type="number"
              placeholder="Enter price"
              {...register('price', {
                required: !isFree ? 'Price is required' : undefined,
                min: {
                  value: 3.0,
                  message: 'Price has to be greater than or equal to 3.00$',
                },
              })}
              step="0.01"
              className="w-full"
              onKeyDown={handleKeyDown}
              disabled={isFree}
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

        <div className="w-full">
          <PdfSelector
            pdfFiles={patterns}
            setPdfFiles={setPatterns}
            isPro={roles.includes('Pro')}
          />
        </div>

        <Button type="submit" className="w-full" disabled={imageUploadIsLoading || isLoading}>
          {imageUploadIsLoading || isLoading ? (
            <LoadingSpinnerComponent size="sm" className="text-white" />
          ) : null}
          Submit pattern
        </Button>

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
              <Link href="/app/sell/testings" className="text-blue-500 underline">
                start a tester call
              </Link>
              .
            </span>
          }
          errorMessage={errorDetail}
        />
      </form>
      <Button asChild className="flex items-center space-x-2" variant="outline">
        <Link href="/app/sell">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go back
        </Link>
      </Button>
    </div>
  );
}
