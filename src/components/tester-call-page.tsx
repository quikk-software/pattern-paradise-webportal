'use client';

import classNames from 'classnames';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { GetProductResponse, GetTestingResponse } from '@/@types/api-types';
import { useApplyTesting, useRevokeTesterApplication } from '@/lib/api/testing';
import { CldImage } from 'next-cloudinary';
import React, { useMemo, useState } from 'react';
import RequestStatus from '@/lib/components/RequestStatus';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { Calendar, CheckCircle, Clock, Star, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { Store } from '@/lib/redux/store';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import GoBackButton from '@/lib/components/GoBackButton';
import ShareButton from '@/lib/components/ShareButton';
import ConfirmDrawer from '@/lib/components/ConfirmDrawer';
import {
  THEME_LIGHT_FROM_BG_CLASSES,
  THEME_LIGHT_TEXT_CLASSES,
  THEME_TEXT_CLASSES,
} from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { ShareModal } from '@/components/share-modal';
import ShowMoreText from '@/lib/components/ShowMoreText';

const themeClasses: any = {
  slate: 'bg-slate-600 hover:bg-slate-700',
  gray: 'bg-gray-600 hover:bg-gray-700',
  zinc: 'bg-zinc-600 hover:bg-zinc-700',
  neutral: 'bg-neutral-600 hover:bg-neutral-700',
  stone: 'bg-stone-600 hover:bg-stone-700',
  red: 'bg-red-600 hover:bg-red-700',
  orange: 'bg-orange-600 hover:bg-orange-700',
  amber: 'bg-amber-600 hover:bg-amber-700',
  yellow: 'bg-yellow-600 hover:bg-yellow-700',
  lime: 'bg-lime-600 hover:bg-lime-700',
  green: 'bg-green-600 hover:bg-green-700',
  emerald: 'bg-emerald-600 hover:bg-emerald-700',
  teal: 'bg-teal-600 hover:bg-teal-700',
  cyan: 'bg-cyan-600 hover:bg-cyan-700',
  sky: 'bg-sky-600 hover:bg-sky-700',
  blue: 'bg-blue-600 hover:bg-blue-700',
  indigo: 'bg-indigo-600 hover:bg-indigo-700',
  violet: 'bg-violet-600 hover:bg-violet-700',
  purple: 'bg-purple-600 hover:bg-purple-700',
  fuchsia: 'bg-fuchsia-600 hover:bg-fuchsia-700',
  pink: 'bg-pink-600 hover:bg-pink-700',
  rose: 'bg-rose-600 hover:bg-rose-700',
};

function ApplyButton({
  testingId,
  theme,
  status,
  creatorId,
  testerIds,
  hasApplied,
  setHasApplied,
}: {
  testingId: string;
  theme: string;
  status: string;
  creatorId: string;
  testerIds: string[];
  hasApplied: boolean;
  setHasApplied: (state: boolean) => void;
}) {
  const [applyIsOpen, setApplyIsOpen] = useState(false);
  const [revokeIsOpen, setRevokeIsOpen] = useState(false);

  const {
    fetch: applyTesting,
    isSuccess: applyTestingIsSuccess,
    isError: applyTestingIsError,
    isLoading: applyTestingIsLoading,
    errorDetail: applyTestingErrorDetail,
  } = useApplyTesting();
  const {
    mutate: revokeTesting,
    isSuccess: revokeTestingIsSuccess,
    isError: revokeTestingIsError,
    isLoading: revokeTestingIsLoading,
    errorDetail: revokeTestingErrorDetail,
  } = useRevokeTesterApplication();
  const { userId } = useSelector((store: Store) => store.auth);

  const router = useRouter();
  const pathname = usePathname();

  const handleApplyClick = async (testingId: string) => {
    if (userId === '') {
      router.push(`/auth/registration?redirect=${pathname}`);
      return;
    }
    await applyTesting(testingId);
    setHasApplied(true);
    setApplyIsOpen(false);
  };

  const handleRevokeClick = async (testingId: string) => {
    await revokeTesting(testingId);
    setRevokeIsOpen(false);
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const disableByStatus = status !== 'Created';
  const isCreator = userId === creatorId;
  const isTester = testerIds.includes(userId);

  const getTestingStatusInfo = useMemo(() => {
    switch (status) {
      case 'InProgress':
        return 'This tester call is closed';
      case 'Aborted':
        return 'This tester call is closed';
      case 'Approved':
        return 'This tester call is closed';
      case 'Declined':
        return 'This tester call is closed';
      default:
        return 'Apply as a Tester';
    }
  }, [status]);

  return (
    <div className="block">
      <Button
        onClick={() => {
          setApplyIsOpen(true);
        }}
        disabled={
          applyTestingIsLoading ||
          disableByStatus ||
          isCreator ||
          isTester ||
          applyTestingIsSuccess ||
          hasApplied
        }
        size={`lg`}
        className={classNames(
          themeClasses[theme] || 'bg-neutral-600 hover:bg-neutral-700',
          'text-white font-semibold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 text-lg mb-2 shadow-lg',
        )}
      >
        {applyTestingIsLoading ? (
          <LoadingSpinnerComponent size={`sm`} className={`text-white mr-2`} />
        ) : (
          <CheckCircle className="mr-2 h-5 w-5" />
        )}
        {getTestingStatusInfo}
      </Button>
      {isCreator ? (
        <p className="text-center mt-2 font-medium text-gray-600 bg-gray-100 rounded-full py-1 px-4 inline-block">
          You are the creator of this tester call
        </p>
      ) : null}
      {isTester ? (
        <p className="text-center mt-2 font-medium">
          <span className="bg-green-50 text-green-700 rounded-full py-1 px-4 inline-block">
            You&apos;ve applied for this tester call
          </span>{' '}
          <button
            className="text-red-500 underline font-medium hover:text-red-700 transition-colors mt-2"
            onClick={() => setRevokeIsOpen(true)}
          >
            Click here to withdraw
          </button>
        </p>
      ) : null}
      <RequestStatus
        isSuccess={applyTestingIsSuccess}
        isError={applyTestingIsError}
        successMessage={
          <span className="text-center">
            <span className="font-bold text-lg">🎉 Application Submitted!</span>
            <br />
            <br />
            Your application for this tester call has been submitted. You&apos;ll receive an email
            with further instructions if the seller chooses you as a tester.
            <br />
            <br />
            <span className="text-foreground font-medium">Applied by accident?</span>{' '}
            <button
              className="text-red-500 underline font-medium hover:text-red-700 transition-colors"
              onClick={() => setRevokeIsOpen(true)}
            >
              Click here to withdraw
            </button>
          </span>
        }
      />
      <RequestStatus
        isSuccess={revokeTestingIsSuccess}
        isError={revokeTestingIsError}
        successMessage={`You've successfully withdrawn from this tester call. Feel free to apply again anytime if you change your mind!`}
      />
      <ConfirmDrawer
        isOpen={applyIsOpen}
        setIsOpen={setApplyIsOpen}
        isLoading={applyTestingIsLoading}
        errorDetail={applyTestingErrorDetail}
        description={'You are about to apply to this tester call. Continue?'}
        callbackFn={() => handleApplyClick(testingId)}
      />
      <ConfirmDrawer
        isOpen={revokeIsOpen}
        setIsOpen={setRevokeIsOpen}
        isLoading={revokeTestingIsLoading}
        errorDetail={revokeTestingErrorDetail}
        description={'You are about to withdraw from this tester call. Continue?'}
        callbackFn={() => handleRevokeClick(testingId)}
      />
    </div>
  );
}

interface TesterCallPageProps {
  product: GetProductResponse;
  testing: GetTestingResponse;
  theme: string;
}

export function TesterCallPage({ product, testing, theme }: TesterCallPageProps) {
  const [hasApplied, setHasApplied] = useState(false);
  const { userId } = useSelector((s: Store) => s.auth);
  const isMe = userId === product.creatorId;

  // Format the experience level with proper capitalization
  const formatExperience = (exp: string) => {
    return exp.charAt(0).toUpperCase() + exp.slice(1).toLowerCase();
  };

  return (
    <div
      className={classNames(
        'min-h-screen bg-gradient-to-b to-white p-4 md:p-8',
        THEME_LIGHT_FROM_BG_CLASSES[theme] || 'from-neutral-100',
      )}
    >
      {/* Header Navigation */}
      <div className="flex justify-between items-center mb-6">
        <GoBackButton className="w-fit" />
        <ShareButton
          url={`${process.env.NEXT_PUBLIC_URL}/app/tester-calls/${product.id}`}
          shareText={
            isMe
              ? 'Check out my tester call on Pattern Paradise!'
              : 'Check out this tester call on Pattern Paradise!'
          }
        />
      </div>

      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Image Carousel */}
        <div className="order-2 md:order-1">
          <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white p-4">
            <Carousel className="w-full">
              <CarouselContent>
                {product.imageUrls.map((src, index) => (
                  <CarouselItem key={index}>
                    <div className="flex flex-col items-center p-1">
                      <CldImage
                        key={src}
                        alt={`Tester Call for ${product.title} in ${product.category}${product.subCategories?.length ? ` – styles: ${product.subCategories.join(', ')}` : ''} on Pattern Paradise`}
                        src={src}
                        width={500}
                        height={500}
                        className="rounded-lg object-cover aspect-square"
                        format="webp"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>

            {/* Category and Subcategories */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              <Badge
                className={classNames(
                  'px-3 py-1 text-sm font-medium',
                  themeClasses[theme] || 'bg-neutral-600',
                )}
              >
                {product.category}
              </Badge>
              {product.subCategories?.map((subCat, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={classNames(
                    'px-3 py-1 text-sm font-medium border-2',
                    `border-${theme}-500` || 'border-neutral-500',
                  )}
                >
                  {subCat}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="order-1 md:order-2 flex flex-col justify-center">
          <div className="space-y-4">
            <div>
              <Badge
                className={classNames(
                  'px-3 py-1 text-sm font-medium mb-4',
                  themeClasses[theme] || 'bg-neutral-600',
                )}
              >
                Tester Call
              </Badge>
              <h1
                className={classNames(
                  'text-4xl md:text-5xl font-bold',
                  THEME_LIGHT_TEXT_CLASSES[theme] || 'text-neutral-600',
                )}
              >
                {product.title}
              </h1>
              <Link
                href={`/%5Blocale%5D/users/${testing.creator.username}`}
                className={classNames(
                  'inline-block mt-2 text-lg font-medium hover:underline',
                  THEME_TEXT_CLASSES[theme] || 'text-neutral-800',
                )}
              >
                by @{testing.creator.username}
              </Link>
            </div>

            <ShowMoreText
              description={product.description}
              maxRows={4}
              className="text-gray-700 text-lg leading-relaxed"
              btnClassName={THEME_TEXT_CLASSES[theme] || 'text-neutral-600'}
            />

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-gray-700">{testing.durationInWeeks} weeks</span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-gray-700">
                  {formatExperience(testing.product.experience)} level
                </span>
              </div>
            </div>

            {/*<ShareModal product={product} testing={testing} theme={theme} />*/}

            <div className="mt-6">
              <ApplyButton
                testingId={testing.id}
                theme={theme}
                status={testing.status}
                creatorId={testing.creatorId}
                testerIds={testing.testerIds ?? []}
                hasApplied={hasApplied}
                setHasApplied={setHasApplied}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="my-12" />

      {/* Main Content */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Tester Requirements */}
        <Card className="md:col-span-1 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <div className={classNames('h-2', themeClasses[theme] || 'bg-neutral-600')}></div>
          <CardContent className="p-6">
            <h2
              className={classNames(
                'text-2xl font-bold mb-4 flex items-center',
                THEME_TEXT_CLASSES[theme] || 'text-neutral-800',
              )}
            >
              <Users className="h-6 w-6 mr-2" />
              Tester Requirements
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>
                  <strong>
                    {formatExperience(testing.product.experience)}{' '}
                    {testing.product.category.toLowerCase()}
                  </strong>{' '}
                  skills required
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Ability to follow written patterns accurately</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Provide detailed feedback on pattern clarity</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>
                  Complete the project within <strong>{testing.durationInWeeks} weeks</strong>
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Share progress photos and final project images</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="md:col-span-1 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <div className={classNames('h-2', themeClasses[theme] || 'bg-neutral-600')}></div>
          <CardContent className="p-6">
            <h2
              className={classNames(
                'text-2xl font-bold mb-4 flex items-center',
                THEME_TEXT_CLASSES[theme] || 'text-neutral-800',
              )}
            >
              <Star className="h-6 w-6 mr-2" />
              Benefits
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Receive the pattern completely free</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Your name credited in the final pattern release</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Opportunity to influence the design process</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Connect with a community of fellow crafters</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Early access to the pattern before public release</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="md:col-span-1 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <div className={classNames('h-2', themeClasses[theme] || 'bg-neutral-600')}></div>
          <CardContent className="p-6">
            <h2
              className={classNames(
                'text-2xl font-bold mb-4 flex items-center',
                THEME_TEXT_CLASSES[theme] || 'text-neutral-800',
              )}
            >
              <Calendar className="h-6 w-6 mr-2" />
              Testing Timeline
            </h2>
            <div className="space-y-4">
              <div className="border-l-2 border-gray-200 pl-4 pb-4 relative">
                <div
                  className={classNames(
                    'absolute w-3 h-3 rounded-full -left-[7px] top-0',
                    themeClasses[theme]?.replace('hover:bg-', '') || 'bg-neutral-600',
                  )}
                ></div>
                <h3 className="font-semibold text-lg">Application</h3>
                <p className="text-gray-600">Apply to join the testing team</p>
              </div>

              <div className="border-l-2 border-gray-200 pl-4 pb-4 relative">
                <div
                  className={classNames(
                    'absolute w-3 h-3 rounded-full -left-[7px] top-0',
                    themeClasses[theme]?.replace('hover:bg-', '') || 'bg-neutral-600',
                  )}
                ></div>
                <h3 className="font-semibold text-lg">Selection</h3>
                <p className="text-gray-600">Testers are chosen and notified</p>
              </div>

              <div className="border-l-2 border-gray-200 pl-4 pb-4 relative">
                <div
                  className={classNames(
                    'absolute w-3 h-3 rounded-full -left-[7px] top-0',
                    themeClasses[theme]?.replace('hover:bg-', '') || 'bg-neutral-600',
                  )}
                ></div>
                <h3 className="font-semibold text-lg">Testing Period</h3>
                <p className="text-gray-600">
                  {testing.durationInWeeks} weeks to complete the project
                </p>
              </div>

              <div className="border-l-2 border-gray-200 pl-4 relative">
                <div
                  className={classNames(
                    'absolute w-3 h-3 rounded-full -left-[7px] top-0',
                    themeClasses[theme]?.replace('hover:bg-', '') || 'bg-neutral-600',
                  )}
                ></div>
                <h3 className="font-semibold text-lg">Feedback & Release</h3>
                <p className="text-gray-600">Pattern finalized and published</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action Footer */}
      <div className="mt-16 text-center bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto">
        <h2
          className={classNames(
            'text-3xl font-bold mb-6',
            THEME_TEXT_CLASSES[theme] || 'text-neutral-800',
          )}
        >
          Ready to join this creative journey?
        </h2>
        <p className="text-gray-700 mb-6 text-lg">
          Be part of shaping this {product.category.toLowerCase()} pattern and showcase your
          crafting skills!
        </p>
        <ApplyButton
          testingId={testing.id}
          theme={theme}
          status={testing.status}
          creatorId={testing.creatorId}
          testerIds={testing.testerIds ?? []}
          hasApplied={hasApplied}
          setHasApplied={setHasApplied}
        />
      </div>
    </div>
  );
}
