'use client';

import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { GetUserAccountResponse } from '@/@types/api-types';
import { useGetUserById, useListProductsByUserId, useListUserRatings } from '@/lib/api';
import WaterfallListing from '@/lib/components/WaterfallListing';
import useScreenSize from '@/lib/core/useScreenSize';
import GoBackButton from '@/lib/components/GoBackButton';
import { Input } from '@/components/ui/input';
import GalleryGrid from '@/lib/components/GalleryGrid';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ShareButton from '@/lib/components/ShareButton';
import { useValidSession } from '@/hooks/useValidSession';
import UserDetailsCardWrapper from '@/lib/wrappers/UserDetailsCardWrapper';
import WelcomeBanner from '@/lib/components/WelcomeBanner';
import { useRouter } from 'next/navigation';
import useAction from '@/lib/core/useAction';
import { Label } from '@/components/ui/label';
import StarRating from '@/lib/components/StarRating';

interface UserAccountComponentProps {
  user: GetUserAccountResponse;
}

export default function UserAccountComponent({ user }: UserAccountComponentProps) {
  const [userToUse, setUserToUse] = useState<GetUserAccountResponse>(user);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const { userId } = useSelector((s: Store) => s.auth);

  const router = useRouter();

  const { data } = useValidSession();

  const screenSize = useScreenSize();
  const { action } = useAction();

  const observer = useRef<IntersectionObserver | null>(null);
  const testerReviewsRef = useRef<HTMLDivElement | null>(null);

  const {
    fetch: fetchProducts,
    data: products,
    isLoading: fetchProductsIsLoading,
    hasNextPage: fetchProductsHasNextPage,
  } = useListProductsByUserId({});

  const { fetch: fetchUser, data: currentUser } = useGetUserById();
  const { fetch: fetchUserRatings, data: userRatings } = useListUserRatings({});

  useEffect(() => {
    switch (action) {
      case 'scrollToTesterReviews':
        executeScroll(testerReviewsRef);
        break;
      default:
        break;
    }
  }, [action, testerReviewsRef.current]);

  useEffect(() => {
    fetchProducts(user.id, {
      status: 'Released',
    });
  }, [user.id]);

  useEffect(() => {
    if (!data) {
      return;
    }
    fetchUser(user.id);
    fetchUserRatings(user.id);
  }, [user.id, data]);

  useEffect(() => {
    if (currentUser) {
      setUserToUse(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchProducts(user.id, {
      status: 'Released',
      q: debouncedSearchTerm || undefined,
      pageNumber: 1,
      pageSize: 20,
    });
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const executeScroll = (ref: MutableRefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView();
  };

  const lastProductRef = (node: HTMLElement | null) => {
    if (fetchProductsIsLoading) {
      return;
    }
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && fetchProductsHasNextPage) {
        fetchProducts(user.id, {
          status: 'Released',
          q: debouncedSearchTerm || undefined,
        });
      }
    });

    if (node) {
      observer.current.observe(node);
    }
  };

  const isMe = user.id === userId;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <GoBackButton />
        <ShareButton
          url={`${process.env.NEXT_PUBLIC_URL}/users/${userToUse.username}`}
          shareText={
            isMe
              ? 'Check out my profile on Pattern Paradise!'
              : 'Check out this profile on Pattern Paradise!'
          }
        />
      </div>

      <WelcomeBanner
        onContinue={() => router.push(`/auth/registration?redirect=/users/${user.username}`)}
        buttonText="Get Started in 2 Minutes"
        minimal
      />

      <UserDetailsCardWrapper user={userToUse} showRoles={true} hasProducts={products.length > 0} />

      {userToUse.gallery.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Gallery</h2>
          <GalleryGrid images={userToUse.gallery} />
          <Button variant={'outline'} asChild>
            <Link
              href={`/%5Blocale%5D/app/secure/auth/me?action=scrollToGallery`}
              className="w-full"
            >
              <Plus className="w-4 h-4" />
              Add Images to Gallery
            </Link>
          </Button>
        </div>
      ) : null}

      <div className="space-y-4" id="user-ratings" ref={testerReviewsRef}>
        {userRatings?.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Tester Call Feedback</h2>
            <div className="space-y-2">
              {userRatings.map((userRating) => (
                <div
                  className="space-y-1 mt-1 p-2 rounded-md shadow-sm"
                  key={`${userRating.user.id}-${userRating.testing.id}`}
                >
                  <Label className="text-sm font-medium text-gray-700">
                    Feedback from{' '}
                    <Link
                      href={`/%5Blocale%5D/users/${userRating.testing.creator.id}`}
                      // rel="nofollow"
                      className="underline italic"
                    >
                      @{userRating.testing.creator.username}
                    </Link>
                    :
                  </Label>
                  <StarRating rating={userRating.starRating} showCount={false} />
                  {userRating.textRating ? (
                    <div className="text-sm text-gray-700 italic">
                      &quot;{userRating.textRating}&quot;
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>

      {products.length > 0 ? (
        <div className="space-y-4" id="shop">
          <h2 className="text-2xl font-bold mb-4">Associated Patterns</h2>
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          <div className="flex flex-col gap-6">
            <WaterfallListing
              products={products}
              status={'Released'}
              columns={screenSize === 'xs' || screenSize === 'sm' || screenSize === 'md' ? 2 : 4}
            />
          </div>
          <div ref={lastProductRef} className="h-10" />
        </div>
      ) : null}
    </div>
  );
}
