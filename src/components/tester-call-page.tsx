'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { GetProductResponse, GetTestingResponse } from '@/@types/api-types';
import { useApplyTesting } from '@/lib/api/testing';
import { CldImage } from 'next-cloudinary';
import React from 'react';
import RequestStatus from '@/lib/components/RequestStatus';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';

function ApplyButton({ testingId }: { testingId: string }) {
  const { fetch: applyTesting, isSuccess, isError, isLoading } = useApplyTesting();

  const handleApplyClick = async (testingId: string) => {
    await applyTesting(testingId);
  };

  return (
    <div className="block">
      <Button
        onClick={() => {
          handleApplyClick(testingId);
        }}
        disabled={isLoading}
        size="lg"
        className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 text-lg mb-2"
      >
        {isLoading ? <LoadingSpinnerComponent size="sm" className="text-white" /> : null}
        Apply as a Tester
      </Button>
      <RequestStatus
        isSuccess={isSuccess}
        isError={isError}
        successMessage="Congratulations! Your application for this tester call has been submitted. You'll receive an email with further instructions if the seller chooses you as a tester."
      />
    </div>
  );
}

interface TesterCallPageProps {
  product: GetProductResponse;
  testing: GetTestingResponse;
}

export function TesterCallPage({ product, testing }: TesterCallPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 to-white">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-amber-600 mb-2">Tester Call for</h1>
          <h3 className="text-4xl md:text-6xl font-bold text-amber-800 mb-4">{product.title}!</h3>
          <p className="text-xl text-gray-700 mb-6">
            Help us perfect our patterns and shape the future of crocheting and knitting!
          </p>
          {/* Prominent CTA Button */}
          <ApplyButton testingId={testing.id} />
        </section>

        {/* Pattern Information */}
        <section className="mb-12">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-3xl font-semibold mb-4 text-amber-700">{product.title}</h2>
              <p className="text-gray-700 mb-4">{product.description}</p>
            </CardContent>
          </Card>
        </section>

        {/* Image Slider */}
        <section className="mb-12">
          <Carousel className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
            <CarouselContent>
              {product.imageUrls.map((src, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <CldImage
                      key={src}
                      alt={`${product.title} view ${index + 1}`}
                      src={src}
                      width="400"
                      height="400"
                      crop={{
                        type: 'auto',
                        source: true,
                      }}
                      className="rounded-lg shadow-md"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* Tester Requirements */}
        <section className="mb-12">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-amber-700">Tester Requirements</h2>
              <ul className="list-disc list-inside text-gray-700">
                <li>Intermediate knitting skills</li>
                <li>Ability to follow written patterns</li>
                <li>Provide detailed feedback on pattern clarity and accuracy</li>
                <li>Complete the project within 3 weeks</li>
                <li>Share progress photos and final project images</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Benefits */}
        <section className="mb-12">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-amber-700">
                Benefits of Participating
              </h2>
              <ul className="list-disc list-inside text-gray-700">
                <li>Receive the pattern for free</li>
                <li>Get rewards for successfully testing the pattern</li>
                <li>Your name credited in the final pattern release</li>
                <li>Opportunity to influence the design process</li>
                <li>Connect with a community of fellow crafters</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action (Bottom) */}
        <section className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-amber-800 mb-4">
            Ready to stitch with us?
          </h2>
          <ApplyButton testingId={testing.id} />
        </section>
      </main>
    </div>
  );
}
