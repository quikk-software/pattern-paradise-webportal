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
import { useCreatePayPalReferral, useRemovePayPalReferral, useUpdateUser } from '@/lib/api';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { handleImageUpload } from '@/lib/features/common/utils';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/lib/features/auth/authSlice';
import RequestStatus from '@/lib/components/RequestStatus';
import EditPassword from '@/lib/components/EditPassword';
import InstagramIcon from '@/lib/icons/InstagramIcon';
import TikTokIcon from '@/lib/icons/TikTokIcon';
import { Textarea } from '@/components/ui/textarea';
import ProInfoBox from '@/lib/components/ProInfoBox';
import ResendCodeInfoBox from '@/lib/components/ResendCodeInfoBox';
import useAction from '@/lib/core/useAction';
import { Badge } from '@/components/ui/badge';
import { refreshAccessToken } from '@/lib/auth/auth.utils';
import { Store } from '@/lib/redux/store';
import { InfoBoxComponent } from '@/components/info-box';
import Link from 'next/link';
import ConfirmDrawer from '@/lib/components/ConfirmDrawer';

interface ProfilePageProps {
  user: GetUserResponse;
}

export function ProfilePage({ user }: ProfilePageProps) {
  const [profileImage, setProfileImage] = useState(user.imageUrl);
  const [imageIsLoading, setImageIsLoading] = useState(false);
  const [imageError, setImageError] = useState<string | undefined>(undefined);
  const [updateUserIsError, setUpdateUserIsError] = useState(false);
  const [isDisconnectPayPalDrawerOpen, setIsDisconnectPayPalDrawerOpen] = useState(false);

  const { action } = useAction();

  const dispatch = useDispatch();
  const { refreshToken, userId } = useSelector((s: Store) => s.auth);

  const router = useRouter();
  const {
    mutate: mutateUser,
    isLoading: updateUserIsLoading,
    isSuccess: updateUserIsSuccess,
  } = useUpdateUser();
  const {
    mutate: createPayPalReferral,
    isLoading: createPayPalReferralIsLoading,
    isSuccess: createPayPalReferralIsSuccess,
    data: paypalReferralData,
  } = useCreatePayPalReferral();
  const {
    mutate: removePayPalReferral,
    isLoading: removePayPalReferralIsLoading,
    isError: removePayPalReferralIsError,
    errorDetail,
  } = useRemovePayPalReferral();

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

  useEffect(() => {
    if (!createPayPalReferralIsSuccess || !paypalReferralData) {
      return;
    }
    router.push(paypalReferralData.actionUrl);
  }, [createPayPalReferralIsSuccess, paypalReferralData]);

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
    })
      .then(() => {
        refreshAccessToken(refreshToken, dispatch);
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

  const handleCreatePayPalReferralClick = async () => {
    const result = await createPayPalReferral();

    router.push(result.actionUrl);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleDisconnectPayPal = (userId: string) => {
    removePayPalReferral(userId).then(() => {
      setIsDisconnectPayPalDrawerOpen(false);
      router.push('/app/secure/auth/confirm/paypal/referral-removed');
    });
  };

  const initials =
    user.firstName && user.lastName ? `${user.firstName.at(0)}${user.lastName.at(0)}` : null;

  const roles = watch('roles');
  const highlightPayPal = action === 'scrollToPayPal';
  const highlightRoles = action === 'scrollToRoles';

  return (
    <div className="flex flex-col gap-4">
      <Card className="w-full max-w-2xl mx-auto border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            onClick={() => {
              router.push('/app/secure/auth/me/orders');
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
      {user.roles?.includes('Seller') ? (
        <Card className="w-full max-w-2xl mx-auto border-none">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Manage PayPal</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {user.paypalMerchantIsActive && !user.paypalPaymentsReceivable ? (
              <InfoBoxComponent
                severity="warning"
                message={
                  <span>
                    <strong>Attention:</strong> You currently cannot receive payments due to
                    restriction on your PayPal account. Please reach out to PayPal Customer Support
                    or connect to{' '}
                    <Link
                      href="https://www.paypal.com"
                      target="_blank"
                      className="text-blue-500 underline"
                    >
                      https://www.paypal.com
                    </Link>{' '}
                    for more information.
                  </span>
                }
              />
            ) : null}
            {user.paypalMerchantIsActive && !user.paypalPrimaryEmailConfirmed ? (
              <InfoBoxComponent
                severity="warning"
                message={
                  <span>
                    <strong>Attention:</strong> Please confirm your email address on{' '}
                    <Link
                      href="https://www.paypal.com/businessprofile/settings"
                      target="_blank"
                      className="text-blue-500 underline"
                    >
                      https://www.paypal.com/businessprofile/settings
                    </Link>{' '}
                    in order to receive payments! You currently cannot receive payments.
                  </span>
                }
              />
            ) : null}

            {user.paypalMerchantIsActive ? (
              <div className="flex flex-col gap-2">
                <InfoBoxComponent message="Your PayPal is connected to your Pattern Paradise account." />
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setIsDisconnectPayPalDrawerOpen(true)}
                >
                  {removePayPalReferralIsLoading ? (
                    <LoadingSpinnerComponent size="sm" className="text-black" />
                  ) : null}
                  Disconnect PayPal
                </Button>
                {removePayPalReferralIsError ? (
                  <p className="text-red-500 text-sm">
                    Something went wrong while disconnecting your PayPal account from Pattern
                    Paradise{errorDetail ? `: ${errorDetail}` : ''}
                  </p>
                ) : null}
                <p className="text-xs text-muted-foreground">
                  ⚠️ Note: You can also disconnect your PayPal from your Pattern Paradise account
                  from your{' '}
                  <Link
                    href="https://paypal.com"
                    target="_blank"
                    className="text-blue-500 underline"
                  >
                    PayPal dashboard
                  </Link>
                  . Please be aware that all your released products will be set to{' '}
                  <strong>&apos;Hidden&apos;</strong> status and will no longer be visible to
                  Pattern Paradise users after disconnecting.
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <Card className="w-full max-w-2xl mx-auto border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
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

            {roles !== undefined && roles.includes('Seller') && !user.paypalMerchantIsActive ? (
              <div className="space-y-2">
                {highlightPayPal ? (
                  <Badge variant="secondary" className="text-md">
                    {'❗️'} Connect PayPal
                  </Badge>
                ) : null}
                <div className="flex flex-col gap-2">
                  {!highlightPayPal ? <Label>Connect PayPal</Label> : null}
                  <Button
                    variant="default"
                    onClick={() => {
                      handleCreatePayPalReferralClick();
                    }}
                    disabled={createPayPalReferralIsLoading || createPayPalReferralIsSuccess}
                  >
                    {createPayPalReferralIsLoading ? (
                      <LoadingSpinnerComponent size="sm" className="text-white" />
                    ) : null}
                    Connect PayPal account
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    ⚠️ Note: You can disconnect your PayPal from Pattern Paradise after connection
                    anytime. Please be aware that all your released products will be set to{' '}
                    <strong>&apos;Hidden&apos;</strong> status and will no longer be visible to
                    Pattern Paradise users after disconnecting.
                  </p>
                </div>
              </div>
            ) : null}

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
                ⚠️ Note: Users with the role &apos;Seller&apos; are required to connect a valid
                PayPal account which is eligible of receiving money.
              </p>
            </div>

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
                  pattern: {
                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i,
                    message: 'Invalid email address',
                  },
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
      <ConfirmDrawer
        isOpen={isDisconnectPayPalDrawerOpen}
        setIsOpen={setIsDisconnectPayPalDrawerOpen}
        description="Disconnecting your PayPal account will prevent you from offering PayPal services and products on Pattern Paradise. Do you wish to continue?"
        callbackFn={() => handleDisconnectPayPal(userId)}
        isLoading={removePayPalReferralIsLoading}
      />
    </div>
  );
}
