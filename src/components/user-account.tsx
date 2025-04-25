'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GetUserAccountResponse } from '@/@types/api-types';
import { useGetUserById, useListProductsByUserId } from '@/lib/api';
import WaterfallListing from '@/lib/components/WaterfallListing';
import useScreenSize from '@/lib/core/useScreenSize';
import UserDetailsCard from '@/lib/components/UserDetailsCard';
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

interface UserAccountComponentProps {
  user: GetUserAccountResponse;
}

export default function UserAccountComponent({ user }: UserAccountComponentProps) {
  const [userToUse, setUserToUse] = useState<GetUserAccountResponse>(user);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const { userId } = useSelector((s: Store) => s.auth);

  const { data } = useValidSession();

  const observer = useRef<IntersectionObserver | null>(null);

  const screenSize = useScreenSize();

  const {
    fetch: fetchProducts,
    data: products,
    isLoading: fetchProductsIsLoading,
    hasNextPage: fetchProductsHasNextPage,
  } = useListProductsByUserId({});

  const { fetch: fetchUser, data: currentUser } = useGetUserById();

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

      <UserDetailsCard user={userToUse} showRoles={true} hasProducts={products.length > 0} />

      {userToUse.description ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">About me</CardTitle>
          </CardHeader>
          <CardContent>{userToUse.description}</CardContent>
        </Card>
      ) : null}

      {userToUse.gallery.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Gallery</h2>
          <GalleryGrid images={userToUse.gallery} />
          <Button variant={'outline'} asChild>
            <Link href={`/app/secure/auth/me?action=scrollToGallery`} className="w-full">
              <Plus className="w-4 h-4" />
              Add Images to Gallery
            </Link>
          </Button>
        </div>
      ) : null}

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
              listingType={'sell'}
              columns={screenSize === 'xs' || screenSize === 'sm' || screenSize === 'md' ? 2 : 4}
            />
          </div>
          <div ref={lastProductRef} className="h-10" />
        </div>
      ) : null}
    </div>
  );
}
