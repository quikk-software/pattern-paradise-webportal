'use client';

import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { GetUserResponse } from '@/@types/api-types';
import {
  useGetPayPalMerchantStatus,
  useRemovePayPalReferral,
  useUpdateUser,
  useUpdateUserExcludedCountries,
} from '@/lib/api';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { handleImageUpload } from '@/lib/features/common/utils';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
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
import { useValidSession } from '@/hooks/useValidSession';
import ProfileImageGallery from '@/lib/components/ProfileImageGallery';
import ProfileQuickLinks from '../lib/components/ProfileQuickLinks';
import StripeOnboarding from '@/lib/components/StripeOnboarding';
import StripeManagement from '@/lib/components/StripeManagement';
import { CheckCircle2 } from 'lucide-react';
import CopyClipboard from '@/lib/components/CopyClipboard';
import Image from 'next/image';
import CountrySelect from '@/lib/components/CountrySelect';
import { ProfilePreviewDrawer } from '@/lib/components/ProfilePreviewDrawer';
import ColorPalette from '@/lib/components/ColorPalette';
import { themes } from '@/lib/core/themes';
import CountryGroupSelector from '@/lib/components/CountryGroupSelector';
import CurrencySelect from '@/lib/components/CurrencySelect';
import DeleteAccountButton from '@/lib/components/DeleteAccountButton';

interface ProfilePageProps {
  user: GetUserResponse;
}

export function ProfilePage({ user }: ProfilePageProps) {
  const [profileImage, setProfileImage] = useState(user.imageUrl);
  const [bannerImage, setBannerImage] = useState(user.bannerImageUrl);
  const [selectedTheme, setSelectedTheme] = useState(user.theme);
  const [imageIsLoading, setImageIsLoading] = useState(false);
  const [imageError, setImageError] = useState<string | undefined>(undefined);
  const [updateUserIsError, setUpdateUserIsError] = useState(false);
  const [isDisconnectPayPalDrawerOpen, setIsDisconnectPayPalDrawerOpen] = useState(false);
  const [country, setCountry] = useState<string | undefined>(user.country);
  const [highlightCountry, setHighlightCountry] = useState<boolean>(false);
  const [showPreviewDrawer, setShowPreviewDrawer] = useState<boolean>(false);
  const [excludedCountries, setExcludedCountries] = useState<string[]>([]);

  const { update } = useValidSession();

  const { action } = useAction();
  const {
    handleLogout,
    logoutStates: { isLoading, isSuccess, isError },
  } = useAuth();

  const { userId } = useSelector((s: Store) => s.auth);

  const router = useRouter();
  const {
    mutate: mutateUser,
    isLoading: updateUserIsLoading,
    isSuccess: updateUserIsSuccess,
  } = useUpdateUser();
  const { mutate: mutateUserExcludedCountries, isLoading: mutateUserExcludedCountriesIsLoading } =
    useUpdateUserExcludedCountries();
  const {
    mutate: removePayPalReferral,
    isLoading: removePayPalReferralIsLoading,
    isSuccess: removePayPalReferralIsSuccess,
    isError: removePayPalReferralIsError,
    errorDetail: removePayPalReferralErrorDetail,
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
  const paypalRef = useRef<HTMLDivElement | null>(null);
  const stripeRef = useRef<HTMLDivElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const countryRef = useRef<HTMLDivElement | null>(null);
  const settingsRef = useRef<HTMLDivElement | null>(null);

  const executeScroll = (ref: MutableRefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    switch (action) {
      case 'scrollToRoles':
        executeScroll(rolesRef);
        break;
      case 'scrollToPayPal':
        executeScroll(paypalRef);
        break;
      case 'scrollToStripe':
        executeScroll(stripeRef);
        break;
      case 'scrollToGallery':
        executeScroll(galleryRef);
        break;
      case 'scrollToCountry':
        executeScroll(countryRef);
        break;
      case 'scrollToSettings':
        executeScroll(settingsRef);
        break;
      default:
        break;
    }
  }, [action, rolesRef, paypalRef, stripeRef, galleryRef, countryRef, settingsRef]);

  useEffect(() => {
    if (!user.excludedCountries) {
      return;
    }
    setExcludedCountries(user.excludedCountries);
  }, [user.excludedCountries]);

  useEffect(() => {
    if (!profileImage || profileImage === user.imageUrl) {
      return;
    }
    onPersonalDataSubmit(user);
  }, [profileImage]);

  useEffect(() => {
    if (!bannerImage || bannerImage === user.bannerImageUrl) {
      return;
    }
    onPersonalDataSubmit(user);
  }, [bannerImage]);

  const onPersonalDataSubmit = async (data: any) => {
    if (data.roles?.includes('Seller') && !country && !user?.country) {
      setHighlightCountry(true);
      executeScroll(countryRef);
      return;
    }

    setHighlightCountry(false);
    setImageError(undefined);
    setUpdateUserIsError(false);
    let profileImageUrls: { url: string; mimeType: string }[] = [];
    if (!!profileImage && profileImage !== user.imageUrl) {
      [profileImageUrls] = await Promise.all([
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

    let bannerImageUrls: { url: string; mimeType: string }[] = [];
    if (!!bannerImage && bannerImage !== user.bannerImageUrl) {
      [bannerImageUrls] = await Promise.all([
        handleImageUpload(
          [bannerImage],
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
      firstName: data.firstName?.trim() ? data.firstName.trim() : undefined,
      lastName: data.lastName?.trim() ? data.lastName.trim() : undefined,
      description: data.description?.trim() ? data.description.trim() : undefined,
      imageUrl: profileImageUrls.length > 0 ? profileImageUrls[0].url : undefined,
      bannerImageUrl: bannerImageUrls.length > 0 ? bannerImageUrls[0].url : undefined,
      instagramRef: data.instagramRef?.trim() ? data.instagramRef.toLowerCase().trim() : undefined,
      tiktokRef: data.tiktokRef?.trim() ? data.tiktokRef.toLowerCase().trim() : undefined,
      username: data.username?.trim() ? data.username.toLowerCase().trim() : undefined,
      roles: data.roles ?? undefined,
      theme: selectedTheme !== user.theme ? selectedTheme : undefined,
      isLightTheme: data.isLightTheme,
      country: data.roles?.includes('Seller') ? country : undefined,
    })
      .then(() => {
        update().then();
      })
      .catch(() => {
        setUpdateUserIsError(true);
      });
  };

  const selectProfileImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const selectBannerImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setBannerImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
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

  const handleSaveExcludedCountries = async (excludedCountries: string[]) => {
    await mutateUserExcludedCountries(userId, {
      countryCodes: excludedCountries,
    });
  };

  const initials =
    user.firstName && user.lastName ? `${user.firstName.at(0)}${user.lastName.at(0)}` : null;

  const roles = watch('roles');
  const userData = watch();
  const highlightPayPal = action === 'scrollToPayPal';
  const highlightStripe = action === 'scrollToStripe';
  const highlightGallery = action === 'scrollToGallery';
  const highlightRoles = action === 'scrollToRoles';
  const isSeller = user.roles?.includes('Seller');

  const hasOpenIncidents = user?.openIncidentsCount > 0;

  return (
    <div className="flex flex-col gap-4">
      <ProfileQuickLinks
        user={user}
        handleLogout={handleLogout}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
      />
      {isSeller ? (
        <Card ref={paypalRef}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {highlightPayPal ? '❗️' : null}
                {user.paypalMerchantIsActive ? 'Manage PayPal' : 'Connect PayPal'}
              </CardTitle>
              {user.paypalMerchantIsActive ? (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 px-3 py-1"
                >
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  Active
                </Badge>
              ) : null}
            </div>
            {user.paypalMerchantIsActive ? (
              <CardDescription>
                Your PayPal account is connected and ready to process payments
              </CardDescription>
            ) : null}
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

            {roles?.includes('Seller') && !user.paypalMerchantIsActive ? <ConnectPayPal /> : null}

            {user.paypalMerchantIsActive ? (
              <div className="space-y-4">
                {user.paypalMerchantId ? (
                  <CopyClipboard value={user.paypalMerchantId} title="PayPal Merchant ID" />
                ) : null}
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsDisconnectPayPalDrawerOpen(true);
                    }}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    {removePayPalReferralIsLoading ? (
                      <LoadingSpinnerComponent size="sm" className="text-black" />
                    ) : null}
                    Disconnect PayPal Account
                  </Button>
                </div>
                <RequestStatus
                  isSuccess={removePayPalReferralIsSuccess}
                  isError={removePayPalReferralIsError}
                  errorMessage={
                    <>
                      Something went wrong while disconnecting your PayPal account from Pattern
                      Paradise
                      {removePayPalReferralErrorDetail
                        ? `: ${removePayPalReferralErrorDetail}`
                        : ''}
                    </>
                  }
                />
              </div>
            ) : null}
            {user.paypalMerchantIsActive ? (
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
            ) : null}
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

      {isSeller ? (
        <>
          {user.stripeAccountId && !user.stripeCardPaymentActive ? (
            <InfoBoxComponent
              severity="warning"
              message={
                <span>
                  <strong>Attention:</strong> Your account is not yet ready to accept credit card
                  payments with Stripe. Please check your{' '}
                  <Link
                    href={'https://dashboard.stripe.com/'}
                    target={'_blank'}
                    rel={'nofollow'}
                    className={'text-blue-500 underline'}
                  >
                    Stripe Dashboard
                  </Link>{' '}
                  to verify your identity and enable credit card payments.
                </span>
              }
            />
          ) : null}
          {user.stripeAccountId ? (
            <StripeManagement
              stripeAccountId={user.stripeAccountId}
              stripeOnboardingCompleted={user.stripeOnboardingCompleted}
            />
          ) : (
            <Card ref={stripeRef}>
              <CardHeader>
                <CardTitle>{highlightStripe ? '❗️' : null}Connect Stripe</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <StripeOnboarding />
              </CardContent>
            </Card>
          )}

          {roles?.includes('Seller') ? (
            <Card>
              <CardHeader>
                <CardTitle>Currency</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <CurrencySelect userId={userId} initialCurrency={user.currency} />
              </CardContent>
            </Card>
          ) : null}
        </>
      ) : null}

      <Card ref={settingsRef}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onPersonalDataSubmit)} className="space-y-8">
            <div className="space-y-2 flex flex-col items-center">
              {bannerImage ? (
                <div className="relative w-full h-32">
                  <Image
                    src={bannerImage}
                    alt="Profile banner"
                    fill
                    className="object-cover rounded-md"
                    priority
                  />
                </div>
              ) : (
                <div className="w-full h-32 bg-gray-300 rounded-md" />
              )}
              <Label
                htmlFor="banner"
                className="cursor-pointer text-sm text-blue-500 hover:text-blue-600"
              >
                Change Banner Picture
              </Label>
              <Input
                id="banner"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={selectBannerImage}
              />
            </div>

            <div className="space-y-2 flex flex-col items-center">
              <Avatar className="w-32 h-32">
                <AvatarImage src={profileImage} alt="Profile" />
                <AvatarFallback>{initials ? initials : ''}</AvatarFallback>
              </Avatar>
              <Label
                htmlFor="picture"
                className="cursor-pointer text-sm text-blue-500 hover:text-blue-600"
              >
                Change Profile Picture
              </Label>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={selectProfileImage}
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
              {!highlightRoles ? (
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Roles
                </Label>
              ) : null}
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
                          disabled={true}
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
                          id="Tester"
                          checked={field.value?.includes('Tester')}
                          onCheckedChange={(checked) => {
                            const updatedRoles = checked
                              ? [...(field?.value ?? []), 'Tester']
                              : field?.value?.filter((role) => role !== 'Tester');
                            field.onChange(updatedRoles);
                          }}
                          disabled={true}
                        />
                        <label
                          htmlFor="tester"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Tester
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
                    </>
                  )}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                ⚠️ Note: Users with the role &apos;Seller&apos; are required to connect a valid
                PayPal or Stripe account which is eligible of receiving money.
              </p>
            </div>

            {roles?.includes('Seller') ? (
              <div className="space-y-2" ref={countryRef}>
                {highlightCountry ? (
                  <Badge variant="secondary" className="text-md">
                    {'❗️'} Country
                  </Badge>
                ) : null}
                {!highlightCountry ? (
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Country
                  </Label>
                ) : null}
                <div className="space-y-2">
                  <CountrySelect
                    country={country}
                    handleCountryChange={handleCountryChange}
                    fullWidth
                  />
                  <p className="text-xs text-muted-foreground">
                    ⚠️ Note: Please provide your country of residence or business registration.
                  </p>
                </div>
              </div>
            ) : null}

            {roles?.includes('Seller') ? (
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Exclude Countries from Purchasing
                </Label>
                <CountryGroupSelector
                  excludedCountries={excludedCountries}
                  setExcludedCountries={setExcludedCountries}
                  callback={(countries) => handleSaveExcludedCountries(countries)}
                  isLoading={mutateUserExcludedCountriesIsLoading}
                />
              </div>
            ) : null}

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Profile description
              </Label>
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
                <Label
                  htmlFor="firstName"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  First Name
                </Label>
                <Input id="firstName" {...register('firstName')} onKeyDown={handleKeyDown} />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Last Name
                </Label>
                <Input id="lastName" {...register('lastName')} onKeyDown={handleKeyDown} />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
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
                <Label
                  htmlFor="username"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
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
                <Label
                  htmlFor="instagramRef"
                  className="flex gap-1 items-center text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
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
                <Label
                  htmlFor="tiktokRef"
                  className="flex gap-1 items-center text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
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

            <div className="grid grid-cols-1 gap-2">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Selected Theme <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2 items-center">
                <Controller
                  name="isLightTheme"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="isLightTheme"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="isLightTheme" className="text-sm cursor-pointer">
                  Use light theming
                </Label>
              </div>
              <div className="space-y-4">
                <ColorPalette theme={selectedTheme} selectedTheme={user.theme} />
                <div className="grid grid-cols-4 gap-2">
                  {themes.map((theme) => (
                    <ColorPalette
                      key={theme}
                      theme={theme}
                      selectedTheme={selectedTheme}
                      handleColorSelect={(theme) => setSelectedTheme(theme)}
                      handleKeyDown={() => null}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPreviewDrawer(true);
                }}
              >
                Show Preview
              </Button>
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
      <div ref={galleryRef}>
        <ProfileImageGallery gallery={user.gallery} highlight={highlightGallery} />
      </div>
      <EditPassword />
      <div className="h-10" />
      <DeleteAccountButton />
      <ConfirmDrawer
        isOpen={isDisconnectPayPalDrawerOpen}
        setIsOpen={setIsDisconnectPayPalDrawerOpen}
        description="Disconnecting your PayPal account will prevent you from offering PayPal services and products on Pattern Paradise. Do you wish to continue?"
        callbackFn={() => handleDisconnectPayPal(userId)}
        isLoading={removePayPalReferralIsLoading}
      />
      <ProfilePreviewDrawer
        isOpen={showPreviewDrawer}
        onClose={() => setShowPreviewDrawer(false)}
        user={{
          ...userData,
          stripeMerchantIsActive: !!userData.stripeAccountId,
          theme: selectedTheme,
          imageUrl: profileImage,
          bannerImageUrl: bannerImage,
        }}
      />
    </div>
  );
}
