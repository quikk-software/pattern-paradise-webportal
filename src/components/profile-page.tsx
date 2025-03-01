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
import { useGetPayPalMerchantStatus, useRemovePayPalReferral, useUpdateUser } from '@/lib/api';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { handleImageUpload } from '@/lib/features/common/utils';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import RequestStatus from '@/lib/components/RequestStatus';
import EditPassword from '@/lib/components/EditPassword';
import InstagramIcon from '@/lib/icons/InstagramIcon';
import TikTokIcon from '@/lib/icons/TikTokIcon';
import { Textarea } from '@/components/ui/textarea';
import ProInfoBox from '@/lib/components/ProInfoBox';
import ResendCodeInfoBox from '@/lib/components/ResendCodeInfoBox';
import useAction from '@/lib/core/useAction';
import { Badge } from '@/components/ui/badge';
import { Store } from '@/lib/redux/store';
import { InfoBoxComponent } from '@/components/info-box';
import Link from 'next/link';
import ConfirmDrawer from '@/lib/components/ConfirmDrawer';
import OpenIncidentsInfoBox from '@/lib/components/OpenIncidentsInfoBox';
import { EMAIL_REGEX, SUPPORT_EMAIL } from '@/lib/constants';
import useAuth from '@/lib/auth/useAuth';
import PayPalMerchantStatus from '@/lib/components/PayPalMerchantStatus';
import ConnectPayPal from '@/lib/components/ConnectPayPal';
import { useSession } from 'next-auth/react';

interface ProfilePageProps {
  user: GetUserResponse;
}

export function ProfilePage({ user }: ProfilePageProps) {
  const [profileImage, setProfileImage] = useState(user.imageUrl);
  const [imageIsLoading, setImageIsLoading] = useState(false);
  const [imageError, setImageError] = useState<string | undefined>(undefined);
  const [updateUserIsError, setUpdateUserIsError] = useState(false);
  const [isDisconnectPayPalDrawerOpen, setIsDisconnectPayPalDrawerOpen] = useState(false);

  const { update } = useSession();

  const { action } = useAction();
  const {
    handleLogout,
    logoutStates: { isLoading, isSuccess, isError },
  } = useAuth();

  const dispatch = useDispatch();
  const { userId } = useSelector((s: Store) => s.auth);

  const router = useRouter();
  const {
    mutate: mutateUser,
    isLoading: updateUserIsLoading,
    isSuccess: updateUserIsSuccess,
  } = useUpdateUser();
  const {
    mutate: removePayPalReferral,
    isLoading: removePayPalReferralIsLoading,
    isSuccess: removePayPalReferralIsSuccess,
    isError: removePayPalReferralIsError,
    errorDetail,
  } = useRemovePayPalReferral();
  const {
    fetch: getPayPalMerchantStatus,
    data: paypalMerchantStatus,
    isLoading: checkPayPalMerchantStatusIsLoading,
    isError: checkPayPalMerchantStatusIsError,
  } = useGetPayPalMerchantStatus();

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
    if (!profileImage || profileImage === user.imageUrl) {
      return;
    }
    onPersonalDataSubmit({});
  }, [profileImage]);

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

    mutateUser(userId, {
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
        update().then();
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

  const handleDisconnectPayPal = (userId: string) => {
    removePayPalReferral(userId).then(() => {
      setIsDisconnectPayPalDrawerOpen(false);
      router.push('/app/secure/auth/confirm/paypal/referral-removed');
    });
  };

  const handleCheckPayPalMerchantStatus = (userId: string) => {
    getPayPalMerchantStatus(userId);
  };

  const initials =
    user.firstName && user.lastName ? `${user.firstName.at(0)}${user.lastName.at(0)}` : null;

  const roles = watch('roles');
  const highlightPayPal = action === 'scrollToPayPal';
  const highlightRoles = action === 'scrollToRoles';

  const hasOpenIncidents = user?.openIncidentsCount > 0;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            onClick={(e) => {
              e.preventDefault();
              router.push('/app/secure/auth/me/orders');
            }}
            className="w-full"
            variant={'outline'}
          >
            My Orders
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              router.push('/app/secure/auth/me/patterns');
            }}
            className="w-full"
            variant={'outline'}
          >
            My Patterns
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              router.push('/app/secure/chats');
            }}
            className="w-full"
            variant={'outline'}
          >
            My Chats
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              router.push('/app/secure/auth/me/reports');
            }}
            className={`w-full${hasOpenIncidents ? ' border-red-500 text-red-500' : ''}`}
            variant={'outline'}
          >
            Open Incidents{hasOpenIncidents ? ` (${user.openIncidentsCount})` : ''}
          </Button>
          <Button
            variant={'secondary'}
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinnerComponent size="sm" className="text-black" /> : null}
            Logout
          </Button>
          <RequestStatus
            isSuccess={isSuccess}
            isError={isError}
            errorMessage="Failed to log out. Please consider reloading the page and try again."
          />
        </CardContent>
      </Card>
      {user.roles?.includes('Seller') ? (
        <Card>
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
                      rel={'nofollow'}
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
                      rel={'nofollow'}
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

            {roles?.includes('Seller') && !user.paypalMerchantIsActive ? (
              <div className="space-y-2">
                {highlightPayPal ? (
                  <Badge variant="secondary" className="text-md">
                    {'❗️'} Connect PayPal
                  </Badge>
                ) : null}
                <ConnectPayPal highlight={highlightPayPal} />
              </div>
            ) : null}

            {user.paypalMerchantIsActive ? (
              <div className="flex flex-col gap-2">
                <InfoBoxComponent
                  message="Your PayPal is connected to your Pattern Paradise account."
                  severity={'success'}
                />
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsDisconnectPayPalDrawerOpen(true);
                  }}
                >
                  {removePayPalReferralIsLoading ? (
                    <LoadingSpinnerComponent size="sm" className="text-black" />
                  ) : null}
                  Disconnect PayPal
                </Button>
                <RequestStatus
                  isSuccess={removePayPalReferralIsSuccess}
                  isError={removePayPalReferralIsError}
                  errorMessage={
                    <>
                      Something went wrong while disconnecting your PayPal account from Pattern
                      Paradise{errorDetail ? `: ${errorDetail}` : ''}
                    </>
                  }
                />
                <p className="text-xs text-muted-foreground">
                  ⚠️ Note: You can also disconnect your PayPal from your Pattern Paradise account
                  from your{' '}
                  <Link
                    href="https://paypal.com"
                    rel={'nofollow'}
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
            <Button
              variant={'outline'}
              disabled={checkPayPalMerchantStatusIsLoading}
              onClick={(e) => {
                e.preventDefault();
                handleCheckPayPalMerchantStatus(userId);
              }}
            >
              {checkPayPalMerchantStatusIsLoading ? (
                <LoadingSpinnerComponent size="sm" className="text-black" />
              ) : null}
              Check PayPal merchant status
            </Button>
            {paypalMerchantStatus ? <PayPalMerchantStatus {...paypalMerchantStatus} /> : null}
            {checkPayPalMerchantStatusIsError ? (
              <p className="text-sm">
                There is currently no information available regarding your PayPal merchant status.
                Please connect to your PayPal profile above and try again. If you need assistance,
                you can also contact us using our{' '}
                <Link href="/help" className="text-blue-500 underline">
                  contact form
                </Link>
                .
              </p>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
      <Card>
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
            <ProInfoBox user={user} />

            {user.isBlocked ? (
              <InfoBoxComponent
                severity="error"
                message={
                  <span>
                    <strong>Attention:</strong> Due to several reports relating to your account, we
                    have blocked you from creating/selling patterns and participating in tester
                    calls until further notice. Our team will review your case as soon as possible.
                    In the meantime, please take a look at the open incidents here:{' '}
                    <Link
                      rel={'nofollow'}
                      href="/app/secure/auth/me/reports"
                      className="text-blue-500 underline"
                    >
                      Open Incidents ({user.openIncidentsCount})
                    </Link>
                    .<br />
                    <br />
                    If you have any questions, please do not hesitate to contact us by email:{' '}
                    <Link
                      rel={'nofollow'}
                      href={`mailto:${SUPPORT_EMAIL}`}
                      className="text-blue-500 underline"
                    >
                      {SUPPORT_EMAIL}
                    </Link>
                  </span>
                }
              />
            ) : null}

            {hasOpenIncidents ? (
              <OpenIncidentsInfoBox type="user" count={user.openIncidentsCount} />
            ) : null}

            {user.email && !user.isMailConfirmed ? (
              <ResendCodeInfoBox
                email={user.email}
                type={'email confirmation'}
                mailType={'UserConfirmEmail'}
              />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                      value: EMAIL_REGEX,
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
                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
