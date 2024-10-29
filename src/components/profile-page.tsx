'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { GetUserResponse } from '@/@types/api-types';
import { useUpdateUser } from '@/lib/api';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { handleImageUpload } from '@/lib/features/common/utils';

interface ProfilePageProps {
  user: GetUserResponse;
}

export function ProfilePage({ user }: ProfilePageProps) {
  const [profileImage, setProfileImage] = useState(user.imageUrl);
  const [imageIsLoading, setImageIsLoading] = useState(false);
  const [imageError, setImageError] = useState<string | undefined>(undefined);

  const { mutate, isLoading } = useUpdateUser();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ defaultValues: user });

  const onSubmit = async (data: any) => {
    setImageError(undefined);
    let urls: string[] = [];
    if (!!profileImage) {
      [urls] = await Promise.all([
        handleImageUpload(
          [profileImage],
          () => {
            setImageIsLoading(true);
          },
          () => {
            setImageIsLoading(false);
          },
          () => {
            setImageError('Image upload failed. Please use another image or try again later.');
            setImageIsLoading(false);
          },
        ),
      ]);
    }
    await mutate({
      email: data.email,
      firstName: data.firstName ?? undefined,
      lastName: data.lastName ?? undefined,
      imageUrl: urls.length > 0 ? urls[0] : undefined,
      instagramRef: data.instagramRef,
      tiktokRef: data.tiktokRef,
      username: data.username,
      roles: data.roles,
    });
  };

  const selectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) =>
        setProfileImage((e.target?.result as string) ?? '/placeholder.svg?height=100&width=100');
      reader.readAsDataURL(file);
    }
  };

  const initials =
    user.firstName && user.lastName ? `${user.firstName.at(0)}${user.lastName.at(0)}` : null;

  return (
    <Card className="w-full max-w-2xl mx-auto border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-2 flex flex-col items-center">
            <Avatar className="w-32 h-32">
              <AvatarImage src={profileImage} alt="Profile" />
              {initials ? <AvatarFallback>{initials}</AvatarFallback> : null}
            </Avatar>
            <Label
              htmlFor="picture"
              className="cursor-pointer text-sm text-blue-500 hover:text-blue-600"
            >
              Change Picture
            </Label>
            <Input
              id="picture"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={selectImage}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...register('firstName')} />
              {errors.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register('lastName')} />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" {...register('username', { required: 'Username is required' })} />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instagramRef">Instagram Handle</Label>
              <Input id="instagramRef" {...register('instagramRef')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiktokRef">TikTok Handle</Label>
              <Input id="tiktokRef" {...register('tiktokRef')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Roles</Label>
            <div className="flex space-x-4">
              <Controller
                name="roles"
                control={control}
                render={({ field }) => (
                  <>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="Buyer"
                        checked={field.value?.includes('Buyer')}
                        onCheckedChange={(checked) => {
                          const updatedRoles = checked
                            ? [...(field?.value ?? []), 'Buyer']
                            : field?.value?.filter((role) => role !== 'Buyer');
                          field.onChange(updatedRoles);
                        }}
                      />
                      <label
                        htmlFor="buyer"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Buyer
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="Seller"
                        checked={field?.value?.includes('Seller')}
                        onCheckedChange={(checked) => {
                          const updatedRoles = checked
                            ? [...(field?.value ?? []), 'Seller']
                            : field?.value?.filter((role) => role !== 'Seller');
                          field.onChange(updatedRoles);
                        }}
                      />
                      <label
                        htmlFor="seller"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Seller
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="Tester"
                        checked={field.value?.includes('Tester')}
                        onCheckedChange={(checked) => {
                          const updatedRoles = checked
                            ? [...(field?.value ?? []), 'Tester']
                            : field?.value?.filter((role) => role !== 'Tester');
                          field.onChange(updatedRoles);
                        }}
                      />
                      <label
                        htmlFor="tester"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Tester
                      </label>
                    </div>
                  </>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || imageIsLoading}>
            {isLoading || imageIsLoading ? (
              <LoadingSpinnerComponent size="sm" className="text-white" />
            ) : null}
            Save Changes
          </Button>
          {imageError ? <p className="text-yellow-600 text-sm mt-2">{imageError}</p> : null}
        </form>
      </CardContent>
    </Card>
  );
}
