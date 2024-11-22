'use client';

import classNames from 'classnames';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { GetProductResponse, GetTestingResponse } from '@/@types/api-types';
import { useApplyTesting } from '@/lib/api/testing';
import { CldImage } from 'next-cloudinary';
import React, { useEffect, useMemo } from 'react';
import RequestStatus from '@/lib/components/RequestStatus';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { ArrowLeftRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { usePathname, useRouter } from 'next/navigation';
import { useGetUserById } from '@/lib/api';
import Link from 'next/link';

function ApplyButton({
  testingId,
  theme,
  status,
  creatorId,
  testerIds,
}: {
  testingId: string;
  theme: string;
  status: string;
  creatorId: string;
  testerIds: string[];
}) {
  const { fetch: applyTesting, isSuccess, isError, isLoading } = useApplyTesting();
  const { userId } = useSelector((store: Store) => store.auth);

  const router = useRouter();
  const pathname = usePathname();

  const handleApplyClick = async (testingId: string) => {
    if (userId === '') {
      router.push(`/auth/registration?redirect=${pathname}`);
      return;
    }
    await applyTesting(testingId);
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
    <div className={`block`}>
      <Button
        onClick={() => {
          handleApplyClick(testingId);
        }}
        disabled={isLoading || disableByStatus || isCreator || isTester || isSuccess}
        size={`lg`}
        className={classNames(
          themeClasses[theme] || 'bg-neutral-600 hover:bg-neutral-700',
          'text-white font-semibold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 text-lg mb-2',
        )}
      >
        {isLoading ? <LoadingSpinnerComponent size={`sm`} className={`text-white`} /> : null}
        {getTestingStatusInfo}
      </Button>
      {isCreator ? <p className="text-center">You are the creator of this tester call</p> : null}
      {isTester ? <p className="text-center">You already applied for this tester call</p> : null}
      <RequestStatus
        isSuccess={isSuccess}
        isError={isError}
        successMessage={`Congratulations! Your application for this tester call has been submitted. You'll receive an email with further instructions if the seller chooses you as a tester.`}
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
  const themeTextClasses: any = {
    slate: 'text-slate-600',
    gray: 'text-gray-600',
    zinc: 'text-zinc-600',
    neutral: 'text-neutral-600',
    stone: 'text-stone-600',
    red: 'text-red-600',
    orange: 'text-orange-600',
    amber: 'text-amber-600',
    yellow: 'text-yellow-600',
    lime: 'text-lime-600',
    green: 'text-green-600',
    emerald: 'text-emerald-600',
    teal: 'text-teal-600',
    cyan: 'text-cyan-600',
    sky: 'text-sky-600',
    blue: 'text-blue-600',
    indigo: 'text-indigo-600',
    violet: 'text-violet-600',
    purple: 'text-purple-600',
    fuchsia: 'text-fuchsia-600',
    pink: 'text-pink-600',
    rose: 'text-rose-600',
  };

  const themeBgClasses: any = {
    slate: 'from-slate-100',
    gray: 'from-gray-100',
    zinc: 'from-zinc-100',
    neutral: 'from-neutral-100',
    stone: 'from-stone-100',
    red: 'from-red-100',
    orange: 'from-orange-100',
    amber: 'from-amber-100',
    yellow: 'from-yellow-100',
    lime: 'from-lime-100',
    green: 'from-green-100',
    emerald: 'from-emerald-100',
    teal: 'from-teal-100',
    cyan: 'from-cyan-100',
    sky: 'from-sky-100',
    blue: 'from-blue-100',
    indigo: 'from-indigo-100',
    violet: 'from-violet-100',
    purple: 'from-purple-100',
    fuchsia: 'from-fuchsia-100',
    pink: 'from-pink-100',
    rose: 'from-rose-100',
  };

  return (
    <div
      className={classNames(
        'min-h-screen bg-gradient-to-b to-white',
        themeBgClasses[theme] || 'from-neutral-100',
      )}
    >
      <main className={`container mx-auto px-4 py-8`}>
        {/* Hero Section */}
        <section className="text-center mb-8">
          <h1
            className={classNames(
              'text-3xl md:text-5xl font-bold mb-2',
              themeTextClasses[theme] || 'text-neutral-600',
            )}
          >
            Tester Call for
          </h1>
          <h3
            className={classNames(
              'text-4xl md:text-6xl font-bold mb-2',
              themeTextClasses[theme] || 'text-neutral-800',
            )}
          >
            {product.title}!
          </h3>
          <h3
            className={classNames(
              'text-md md:text-lg font-bold mb-4 italic underline',
              themeTextClasses[theme] || 'text-neutral-800',
            )}
          >
            <Link href={`/users/${testing.creator.username}`}>by @{testing.creator.username}</Link>
          </h3>
          <p className="text-xl text-gray-700 mb-6">
            Help us perfect our patterns and shape the future of crocheting and knitting!
          </p>
          <ApplyButton
            testingId={testing.id}
            theme={theme}
            status={testing.status}
            creatorId={testing.creatorId}
            testerIds={testing.testerIds ?? []}
          />
        </section>

        {/* Pattern Information */}
        <section className={`mb-12`}>
          <Card>
            <CardContent className={`p-6`}>
              <h2
                className={classNames(
                  'text-3xl font-semibold mb-4',
                  themeTextClasses[theme] || 'text-neutral-700',
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
                      alt={`${product.title} view ${index + 1}`}
                      src={src}
                      width={`200`}
                      height={`300`}
                      crop={{
                        type: 'auto',
                        source: true,
                      }}
                      className={`rounded-lg shadow-md`}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <ArrowLeftRight className={classNames(themeTextClasses[theme] || 'text-neutral-800')} />
        </section>

        {/* Tester Requirements */}
        <section className={`mb-12`}>
          <Card>
            <CardContent className={`p-6`}>
              <h2
                className={classNames(
                  'text-2xl font-semibold mb-4',
                  themeTextClasses[theme] || 'text-neutral-800',
                )}
              >
                Tester Requirements
              </h2>
              <ul className={`list-disc list-inside text-gray-700`}>
                <li>
                  <strong>
                    {testing.experience} {testing.product.category.toLowerCase()}
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
                  themeTextClasses[theme] || 'text-neutral-800',
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

        {/* Call to Action (Bottom) */}
        <section className={`text-center`}>
          <h2
            className={classNames(
              'text-2xl md:text-3xl font-bold  mb-4',
              themeTextClasses[theme] || 'text-neutral-800',
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
          />
        </section>
      </main>
    </div>
  );
}
