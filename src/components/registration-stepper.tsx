'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  Mail,
  UserPlus,
  UserCircle,
  CheckCircle2,
  HandCoins,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';
import { useCheckEmail, useCheckUsername, useCreateUser } from '@/lib/api';
import { Controller, useForm } from 'react-hook-form';
import Link from 'next/link';
import RequestStatus from '@/lib/components/RequestStatus';
import useRedirect from '@/lib/core/useRedirect';
import TikTokIcon from '@/lib/icons/TikTokIcon';
import InstagramIcon from '@/lib/icons/InstagramIcon';
import { EMAIL_REGEX, PASSWORD_REGEX, PASSWORD_REGEX_MESSAGE } from '@/lib/constants';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';

const ALLOWED_ROLES = ['Buyer', 'Seller', 'Tester'];

interface RegistrationStepperProps {
  preselectedRoles: string[];
}

export function RegistrationStepper({ preselectedRoles }: RegistrationStepperProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [roles, setRoles] = useState<string[]>(['Buyer', 'Tester']);
  const [debouncedUsername, setDebouncedUsername] = useState('');
  const [debouncedEmail, setDebouncedEmail] = useState('');
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const totalSteps = 3;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const { redirectUrl } = useRedirect();
  const router = useRouter();

  const { mutate, isSuccess, isError, isLoading, errorDetail } = useCreateUser();
  const {
    mutate: checkUsername,
    isSuccess: checkUsernameIsSuccess,
    isError: checkUsernameIsError,
    errorDetail: checkUsernameErrorDetail,
  } = useCheckUsername();
  const {
    mutate: checkEmail,
    isSuccess: checkEmailIsSuccess,
    isError: checkEmailIsError,
    errorDetail: checkEmailErrorDetail,
  } = useCheckEmail();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    watch,
    trigger,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      username: '',
      firstName: '',
      lastName: '',
      instagram: '',
      tiktok: '',
      hasAcceptedTerms: false,
      hasAcceptedPrivacy: false,
    },
  });

  const username = watch('username');
  const email = watch('email');
  const password = watch('password');

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (username) {
        setDebouncedUsername(username.toLowerCase().trim());
      }
    }, 500);

    return () => clearTimeout(timerId);
  }, [username]);

  useEffect(() => {
    if (!debouncedUsername) {
      return;
    }
    checkUsername(debouncedUsername).then();
  }, [debouncedUsername]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (email) {
        setDebouncedEmail(email.toLowerCase().trim());
      }
    }, 500);

    return () => clearTimeout(timerId);
  }, [email]);

  useEffect(() => {
    if (!debouncedEmail) {
      return;
    }
    checkEmail(debouncedEmail).then();
  }, [debouncedEmail]);

  useEffect(() => {
    if (preselectedRoles.length === 1 && preselectedRoles.at(0) === 'Seller') {
      setRoles(ALLOWED_ROLES);
    }
  }, [preselectedRoles]);

  const onSubmit = async (data: any) => {
    await mutate({
      email: data.email?.toLowerCase().trim(),
      password: data.password?.trim(),
      firstName: data.firstName?.trim(),
      lastName: data.lastName?.trim(),
      username: data.username?.toLowerCase().trim(),
      instagramRef: data.instagram?.trim(),
      tiktokRef: data.tiktok?.trim(),
      hasAcceptedTerms: data.hasAcceptedTerms,
      hasAcceptedPrivacy: data.hasAcceptedPrivacy,
      roles,
    });

    router.push(`/auth/registration/success?email=${data.email.trim()}&roles=${roles.join(',')}`);
  };

  const handleRoleChange = (role: string) => {
    setRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentStep < totalSteps) {
        handleNextStep();
      } else {
        handleSubmit(onSubmit)();
      }
    }
  };

  const handleNextStep = async () => {
    let canProceed = false;

    if (currentStep === 1) {
      const result = await trigger(['email', 'password']);
      canProceed = result;
    } else if (currentStep === 2) {
      canProceed = true;
    } else if (currentStep === 3) {
      const result = await trigger(['hasAcceptedTerms', 'hasAcceptedPrivacy']);
      canProceed = result;
    }

    if (canProceed && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const isNextButtonDisabled = () => {
    if (currentStep === 1) {
      return !email || !!errors.email || !password || !!errors.password;
    } else if (currentStep === 2) {
      return roles.length === 0;
    }
    return false;
  };

  return (
    <form id="registrationForm" className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      <Link rel={'nofollow'} href={`/auth/login?redirect=${redirectUrl}`} className="w-full mb-4">
        <Button variant="secondary" className="w-full">
          Go to login
        </Button>
      </Link>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <Progress value={progressPercentage} className="w-full" />
          </div>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Step {currentStep} of {totalSteps}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-primary text-primary-foreground rounded-full p-2">
                  <Mail className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-medium">Account Details</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: EMAIL_REGEX,
                      message: 'Invalid email address',
                    },
                    onChange: (e) => {
                      e.target.value = e.target.value.toLowerCase().trim();
                    },
                  })}
                  onKeyDown={handleKeyDown}
                />
                {debouncedEmail && checkEmailIsSuccess ? (
                  <p className="text-green-500 text-sm flex gap-1 items-center">
                    <Check className="h-4 w-4" /> Email is available
                  </p>
                ) : null}
                {debouncedEmail && checkEmailIsError ? (
                  <p className="text-red-500 text-sm flex gap-1 items-center">
                    <X className="h-4 w-4" /> {checkEmailErrorDetail ?? 'Email is not available'}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Create a password"
                  required
                  {...register('password', {
                    required: 'Password is required',
                    pattern: {
                      value: PASSWORD_REGEX,
                      message: PASSWORD_REGEX_MESSAGE,
                    },
                    onChange: (e) => {
                      e.target.value = e.target.value.trim();
                    },
                  })}
                  onKeyDown={handleKeyDown}
                />
                {errors.password ? (
                  <p className="text-sm text-red-500">{errors.password.message as string}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <div>
                  <Label htmlFor="username">Username (Optional)</Label>
                  <p className="text-xs text-gray-500">
                    If you leave this blank, a username will be automatically generated for you.
                  </p>
                </div>
                <Input
                  id="username"
                  placeholder="Choose a username"
                  required={false}
                  {...register('username', {
                    onChange: (e) => {
                      e.target.value = e.target.value.toLowerCase().trim();
                    },
                  })}
                  onKeyDown={handleKeyDown}
                />
                {debouncedUsername && checkUsernameIsSuccess ? (
                  <p className="text-green-500 text-sm flex gap-1 items-center">
                    <Check className="h-4 w-4" /> Username is available
                  </p>
                ) : null}
                {debouncedUsername && checkUsernameIsError ? (
                  <p className="text-red-500 text-sm flex gap-1 items-center">
                    <X className="h-4 w-4" />{' '}
                    {checkUsernameErrorDetail ?? 'Username is not available'}
                  </p>
                ) : null}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <UserCircle className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-medium">What should we call you?</h3>
                </div>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="First name"
                  required={false}
                  {...register('firstName', {
                    onChange: (e) => {
                      e.target.value = e.target.value.trim();
                    },
                  })}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-primary text-primary-foreground rounded-full p-2">
                  <HandCoins className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-medium">Do you plan to sell your patterns?</h3>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Card
                    className={`cursor-pointer transition-all ${
                      !roles.includes('Seller') ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleRoleChange('Seller')}
                  >
                    <CardContent className="flex flex-col items-center text-center p-4">
                      <ThumbsDown className="w-10 h-10 mb-2 text-primary" />
                      <h3 className="font-semibold">No</h3>
                      <p className="text-sm text-muted-foreground">
                        I just want to buy and test patterns
                      </p>
                      {!roles.includes('Seller') ? (
                        <div className="absolute top-2 right-2 text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                  <Card
                    className={`cursor-pointer transition-all ${
                      roles.includes('Seller') ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleRoleChange('Seller')}
                  >
                    <CardContent className="flex flex-col items-center text-center p-4">
                      <ThumbsUp className="w-10 h-10 mb-2 text-primary" />
                      <h3 className="font-semibold">Yes</h3>
                      <p className="text-sm text-muted-foreground">
                        I also want to sell my patterns
                      </p>
                      {roles.includes('Seller') ? (
                        <div className="absolute top-2 right-2 text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  ⚠️ Note: Users with the role &apos;Seller&apos; are required to connect a valid
                  PayPal account in their profile settings.
                </p>
              </div>

              <div className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowOptionalFields(!showOptionalFields)}
                  className="w-full"
                >
                  {showOptionalFields ? 'Hide' : 'Show'} Optional Information
                </Button>

                {showOptionalFields && (
                  <div className="space-y-4 mt-4 pt-4 border-t">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Last name"
                          required={false}
                          {...register('lastName', {
                            onChange: (e) => {
                              e.target.value = e.target.value.trim();
                            },
                          })}
                          onKeyDown={handleKeyDown}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="flex items-center gap-1">
                        <InstagramIcon className="w-4 h-4 inline" />
                        Instagram
                      </Label>
                      <Input
                        id="instagram"
                        placeholder="Your Instagram handle"
                        required={false}
                        {...register('instagram', {
                          onChange: (e) => {
                            e.target.value = e.target.value.toLowerCase().trim();
                          },
                        })}
                        onKeyDown={handleKeyDown}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tiktok" className="flex items-center gap-1">
                        <TikTokIcon className="w-4 h-4 inline" />
                        <span>TikTok</span>
                      </Label>
                      <Input
                        id="tiktok"
                        placeholder="Your TikTok handle"
                        required={false}
                        {...register('tiktok', {
                          onChange: (e) => {
                            e.target.value = e.target.value.toLowerCase().trim();
                          },
                        })}
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-primary text-primary-foreground rounded-full p-2">
                  <UserPlus className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-medium">Complete Registration</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex gap-4 items-center">
                    <Controller
                      name="hasAcceptedTerms"
                      control={control}
                      rules={{
                        required: 'You must accept the Terms and Conditions to proceed',
                      }}
                      render={({ field }) => (
                        <Checkbox
                          id="hasAcceptedTerms"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label htmlFor="hasAcceptedTerms" className="text-sm">
                      I confirm that I have read and agree to the{' '}
                      <Link
                        rel={'nofollow'}
                        href="/terms-and-privacy?action=scrollToTermsAndConditions"
                        target="_blank"
                        className="text-primary underline"
                      >
                        Terms and Conditions
                      </Link>
                      .
                    </Label>
                  </div>
                  {errors.hasAcceptedTerms ? (
                    <p className="text-sm text-red-500 ml-8">
                      {errors.hasAcceptedTerms.message as string}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <div className="flex gap-4 items-center">
                    <Controller
                      name="hasAcceptedPrivacy"
                      control={control}
                      rules={{
                        required: 'You must accept the Privacy Policy to proceed',
                      }}
                      render={({ field }) => (
                        <Checkbox
                          id="hasAcceptedPrivacy"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label htmlFor="hasAcceptedPrivacy" className="text-sm">
                      I confirm that I have read and agree to the{' '}
                      <Link
                        rel={'nofollow'}
                        href="/terms-and-privacy?action=scrollToPrivacyPolicy"
                        target="_blank"
                        className="text-primary underline"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </Label>
                  </div>
                  {errors.hasAcceptedPrivacy ? (
                    <p className="text-sm text-red-500 ml-8">
                      {errors.hasAcceptedPrivacy.message as string}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-wrap gap-2 justify-between">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          ) : (
            <div />
          )}
          {currentStep < totalSteps ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleNextStep}
              className="flex items-center gap-1"
              disabled={isNextButtonDisabled()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <div />
          )}
          {currentStep === totalSteps ? (
            <div className="space-y-1">
              <Button
                type="submit"
                variant="default"
                className="flex items-center gap-1"
                disabled={isLoading || isSuccess || !isValid}
              >
                {isLoading ? <LoadingSpinnerComponent size="sm" className="text-white" /> : null}
                Register
              </Button>
              <RequestStatus
                isSuccess={isSuccess}
                isError={isError}
                successMessage="Your account has been created. You can login to your account now."
                errorMessage={`Registration failed: ${errorDetail}`}
              />
            </div>
          ) : null}
        </CardFooter>
      </Card>
    </form>
  );
}
