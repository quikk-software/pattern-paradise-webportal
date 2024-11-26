'use client';

import React, { useEffect, useRef, useState } from 'react';
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
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { reset, setRoles, setUsername } from '@/lib/features/auth/authSlice';
import RequestStatus from '@/lib/components/RequestStatus';
import EditPassword from '@/lib/components/EditPassword';
import InstagramIcon from '@/lib/icons/InstagramIcon';
import TikTokIcon from '@/lib/icons/TikTokIcon';
import { Textarea } from '@/components/ui/textarea';
import ProInfoBox from '@/lib/components/ProInfoBox';
import ResendCodeInfoBox from '@/lib/components/ResendCodeInfoBox';
import useAction from '@/lib/core/useAction';
import { Badge } from '@/components/ui/badge';

interface ProfilePageProps {
  user: GetUserResponse;
}

export function ProfilePage({ user }: ProfilePageProps) {
  const [profileImage, setProfileImage] = useState(user.imageUrl);
  const [imageIsLoading, setImageIsLoading] = useState(false);
  const [imageError, setImageError] = useState<string | undefined>(undefined);
  const [updateUserIsError, setUpdateUserIsError] = useState(false);

  const { action } = useAction();

  const dispatch = useDispatch();
  const router = useRouter();
  const {
    mutate: mutateUser,
    isLoading: updateUserIsLoading,
    isSuccess: updateUserIsSuccess,
  } = useUpdateUser();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: user });

  const rolesRef = useRef<HTMLDivElement | null>(null);

  const executeScroll = () => {
    rolesRef.current?.scrollIntoView();
  };

  useEffect(() => {
    switch (action) {
      case 'scrollToRoles':
        executeScroll();
        break;
      default:
        break;
    }
  }, [action]);

  const onPersonalDataSubmit = async (data: any) => {
    setImageError(undefined);
    setUpdateUserIsError(false);
    let urls: { url: string; mimeType: string }[] = [];
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
          // TODO: Add progress handler
          () => {},
        ),
      ]);
    }
    mutateUser({
      email: data.email ? data.email.toLowerCase().trim() : undefined,
      firstName: data.firstName ? data.firstName.trim() : undefined,
      lastName: data.lastName ? data.lastName.trim() : undefined,
      description: data.description ? data.description.trim() : undefined,
      imageUrl: urls.length > 0 ? urls[0].url : undefined,
      instagramRef: data.instagramRef ? data.instagramRef.toLowerCase().trim() : undefined,
      tiktokRef: data.tiktokRef ? data.tiktokRef.toLowerCase().trim() : undefined,
      username: data.username ? data.username.toLowerCase().trim() : undefined,
      roles: data.roles ?? undefined,
      paypalEmail: data.paypalEmail ? data.paypalEmail.toLowerCase().trim() : undefined,
    })
      .then(() => {
        if (data.roles) {
          dispatch(setRoles(data.roles));
        }
        if (data.username) {
          dispatch(setUsername(data.username.toLowerCase().trim()));
        }
      })
      .catch(() => {
        setUpdateUserIsError(true);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const initials =
    user.firstName && user.lastName ? `${user.firstName.at(0)}${user.lastName.at(0)}` : null;

  const roles = watch('roles');
  const highlightRoles = action === 'scrollToRoles';

  return (
    <div className="flex flex-col gap-4">
      <Card className="w-full max-w-2xl mx-auto border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            onClick={() => {
              router.push('/app/auth/me/orders');
            }}
            className="w-full"
            variant={'outline'}
          >
            My orders
          </Button>
          <Button
            variant={'secondary'}
            onClick={() => {
              dispatch(reset());
            }}
          >
            Logout
          </Button>
        </CardContent>
      </Card>
      <Card className="w-full max-w-2xl mx-auto border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onPersonalDataSubmit)} className="space-y-8">
            <div className="space-y-2 flex flex-col items-center">
              <Avatar className="w-32 h-32">
                <AvatarImage src={profileImage} alt="Profile" />
                <AvatarFallback>{initials ? initials : ''}</AvatarFallback>
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
            <div className="space-y-2">
              <ProInfoBox user={user} />
            </div>

            {user.email && !user.isMailConfirmed ? (
              <div className="space-y-2">
                <ResendCodeInfoBox
                  email={user.email}
                  type={'email confirmation'}
                  mailType={'UserConfirmEmail'}
                />
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="description">Profile description</Label>
              <Textarea
                id="description"
                placeholder="Write something about yourself..."
                className="w-full"
                rows={4}
                {...register('description')}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...register('firstName')} onKeyDown={handleKeyDown} />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...register('lastName')} onKeyDown={handleKeyDown} />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                })}
                onKeyDown={handleKeyDown}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">
                Username <span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                {...register('username', {
                  required: 'Username is required',
                })}
                onKeyDown={handleKeyDown}
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instagramRef" className="flex gap-1 items-center">
                  <InstagramIcon className="w-4 h-4" />
                  Instagram username
                </Label>
                <Input
                  id="instagramRef"
                  {...register('instagramRef')}
                  onKeyDown={handleKeyDown}
                  placeholder="the.patternparadise"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiktokRef" className="flex gap-1 items-center">
                  <TikTokIcon className="w-4 h-4" />
                  TikTok username
                </Label>
                <Input
                  id="tiktokRef"
                  {...register('tiktokRef')}
                  onKeyDown={handleKeyDown}
                  placeholder="the.patternparadise"
                />
              </div>
            </div>

            <div className="space-y-2" ref={rolesRef}>
              {highlightRoles ? (
                <Badge variant="secondary" className="text-md">
                  {'❗️'} Roles
                </Badge>
              ) : null}
              {!highlightRoles ? <Label>Roles</Label> : null}
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
              <p className="text-xs text-muted-foreground">
                ⚠️ Note: Users with the role &apos;Seller&apos; are required to add a valid PayPal
                email which is eligible of receiving money.{' '}
                <a href="https://paypal.com" target="_blank" className="text-blue-500">
                  Create a PayPal account for free here!
                </a>
              </p>
            </div>

            {roles !== undefined && roles.includes('Seller') ? (
              <div className="space-y-2">
                <Label htmlFor="paypalEmail">
                  PayPal Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="paypalEmail"
                  type="text"
                  placeholder="Add a valid PayPal email"
                  required
                  {...register('paypalEmail', {
                    required: 'PayPal email is required',
                    pattern: {
                      value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i,
                      message: 'Invalid PayPal email address',
                    },
                  })}
                  onKeyDown={handleKeyDown}
                />
                <p className="text-xs text-muted-foreground">
                  ⚠️ Note: If you change your PayPal email address, you will need to{' '}
                  <strong>confirm</strong> it again by clicking on the link in the{' '}
                  <strong>email</strong> we send you. In the meantime, all your released products
                  will be set to <strong>&apos;Hidden&apos;</strong> status and will no longer be
                  displayed to Pattern Paradise users.
                </p>
                {user.paypalEmail &&
                !user.isPayPalMailConfirmed &&
                user.roles?.includes('Seller') ? (
                  <ResendCodeInfoBox
                    email={user.paypalEmail}
                    type={'PayPal email confirmation'}
                    mailType={'UserConfirmPaypalEmail'}
                  />
                ) : null}
                {errors.paypalEmail ? (
                  <p className="text-sm text-red-500 mb-2">
                    {errors.paypalEmail.message as string}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                className="w-full"
                disabled={updateUserIsLoading || imageIsLoading}
              >
                {updateUserIsLoading || imageIsLoading ? (
                  <LoadingSpinnerComponent size="sm" className="text-white" />
                ) : null}
                Save Changes
              </Button>
              <RequestStatus isSuccess={updateUserIsSuccess} isError={updateUserIsError} />
              {imageError ? <p className="text-yellow-600 text-sm mt-2">{imageError}</p> : null}
            </div>
          </form>
        </CardContent>
      </Card>
      <EditPassword />
    </div>
  );
}
