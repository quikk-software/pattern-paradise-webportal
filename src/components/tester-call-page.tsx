'use client';

import classNames from 'classnames';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { GetProductResponse, GetTestingResponse } from '@/@types/api-types';
import { useApplyTesting, useRevokeTesterApplication } from '@/lib/api/testing';
import { CldImage } from 'next-cloudinary';
import React, { useMemo, useState } from 'react';
import RequestStatus from '@/lib/components/RequestStatus';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { ArrowLeftRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
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
          'text-white font-semibold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 text-lg mb-2',
        )}
      >
        {applyTestingIsLoading ? (
          <LoadingSpinnerComponent size={`sm`} className={`text-white`} />
        ) : null}
        {getTestingStatusInfo}
      </Button>
      {isCreator ? <p className="text-center">You are the creator of this tester call</p> : null}
      {isTester ? (
        <p className="text-center">
          You already applied for this tester call.{' '}
          <a className="text-blue-500 underline" onClick={() => setRevokeIsOpen(true)}>
            Click here to leave.
          </a>
        </p>
      ) : null}
      <RequestStatus
        isSuccess={applyTestingIsSuccess}
        isError={applyTestingIsError}
        successMessage={
          <span>
            Congratulations! Your application for this tester call has been submitted. You&apos;ll
            receive an email with further instructions if the seller chooses you as a tester.
            <br />
            <br />
            <span className="text-foreground">Applied by accident?</span>{' '}
            <a className="text-blue-500 underline" onClick={() => setRevokeIsOpen(true)}>
              Click here to leave.
            </a>
          </span>
        }
      />
      <RequestStatus
        isSuccess={revokeTestingIsSuccess}
        isError={revokeTestingIsError}
        successMessage={`You’ve successfully left this tester call. Feel free to apply again anytime if you change your mind!`}
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
        description={'You are about to leave this tester call. Continue?'}
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

  return (
    <div
      className={classNames(
        'bg-gradient-to-b to-white p-4',
        THEME_LIGHT_FROM_BG_CLASSES[theme] || 'from-neutral-100',
      )}
    >
      <div className="flex justify-between items-start">
        <GoBackButton className="mb-8 w-fit" />
        <ShareButton
          url={`${process.env.NEXT_PUBLIC_URL}/app/tester-calls/${product.id}`}
          shareText={
            isMe
              ? 'Check out my tester call on Pattern Paradise!'
              : 'Check out this tester call on Pattern Paradise!'
          }
        />
      </div>
      <section className="text-center mb-8">
        <h1
          className={classNames(
            'text-3xl md:text-5xl font-bold mb-2',
            THEME_LIGHT_TEXT_CLASSES[theme] || 'text-neutral-600',
          )}
        >
          Tester Call for
        </h1>
        <h3
          className={classNames(
            'text-4xl md:text-6xl font-bold mb-2',
            THEME_LIGHT_TEXT_CLASSES[theme] || 'text-neutral-600',
          )}
        >
          {product.title}!
        </h3>
        <h3
          className={classNames(
            'text-md md:text-lg font-bold mb-4 italic underline',
            THEME_TEXT_CLASSES[theme] || 'text-neutral-800',
          )}
        >
          <Link href={`/users/${testing.creator.username}`}>by @{testing.creator.username}</Link>
        </h3>
        <p className="text-xl text-gray-700 mb-6">
          Help us perfect our patterns and shape the future of {testing.product.category}!
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
      </section>

      {/* Pattern Information */}
      <section className={`mb-12`}>
        <Card>
          <CardContent className={`p-6`}>
            <h2
              className={classNames(
                'text-3xl font-semibold mb-4',
                THEME_LIGHT_TEXT_CLASSES[theme] || 'text-neutral-700',
              )}
            >
              {product.title}
            </h2>
            <p className={`text-gray-700 mb-4`}>{product.description}</p>
          </CardContent>
        </Card>
      </section>

      {/* Image Slider */}
      <section className={`mb-12 flex flex-col gap-2 items-center`}>
        <Carousel
          className={`w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto`}
        >
          <CarouselContent>
            {product.imageUrls.map((src, index) => (
              <CarouselItem key={index}>
                <div className={`flex flex-col items-center`}>
                  <CldImage
                    key={src}
                    alt={`Tester Call for ${product.title} in ${product.category}${product.subCategories?.length ? ` – styles: ${product.subCategories.join(', ')}` : ''} on Pattern Paradise`}
                    src={src}
                    width={400}
                    height={400}
                    className={`rounded-lg shadow-md`}
                    format="webp"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <ArrowLeftRight className={classNames(THEME_TEXT_CLASSES[theme] || 'text-neutral-800')} />
      </section>

      {/* Tester Requirements */}
      <section className={`mb-12`}>
        <Card>
          <CardContent className={`p-6`}>
            <h2
              className={classNames(
                'text-2xl font-semibold mb-4',
                THEME_TEXT_CLASSES[theme] || 'text-neutral-800',
              )}
            >
              Tester Requirements
            </h2>
            <ul className={`list-disc list-inside text-gray-700`}>
              <li>
                <strong>
                  {testing.product.experience} {testing.product.category.toLowerCase()}
                </strong>{' '}
                skills
              </li>
              <li>Ability to follow written patterns</li>
              <li>Provide detailed feedback on pattern clarity and accuracy</li>
              <li>
                Complete the project <strong>within {testing.durationInWeeks} weeks</strong>
              </li>
              <li>Share progress photos and final project images</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Benefits */}
      <section className={`mb-12`}>
        <Card>
          <CardContent className={`p-6`}>
            <h2
              className={classNames(
                'text-2xl font-semibold mb-4',
                THEME_TEXT_CLASSES[theme] || 'text-neutral-800',
              )}
            >
              Benefits of Participating
            </h2>
            <ul className={`list-disc list-inside text-gray-700`}>
              <li>Receive the pattern for free</li>
              <li>Your name credited in the final pattern release</li>
              <li>Opportunity to influence the design process</li>
              <li>Connect with a community of fellow crafters</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className={`text-center`}>
        <h2
          className={classNames(
            'text-2xl md:text-3xl font-bold  mb-4',
            THEME_TEXT_CLASSES[theme] || 'text-neutral-800',
          )}
        >
          Ready to stitch with us?
        </h2>
        <ApplyButton
          testingId={testing.id}
          theme={theme}
          status={testing.status}
          creatorId={testing.creatorId}
          testerIds={testing.testerIds ?? []}
          hasApplied={hasApplied}
          setHasApplied={setHasApplied}
        />
      </section>
    </div>
  );
}
