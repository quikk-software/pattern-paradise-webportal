'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Search, SlidersHorizontal, Trash } from 'lucide-react';
import { GetProductResponse } from '@/@types/api-types';
import { useListProducts } from '@/lib/api';
import ProductImageSlider from '@/lib/components/ProductImageSlider';
import Link from 'next/link';
import { combineArraysById } from '@/lib/core/utils';
import PriceFilter from '@/components/price-filter';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import WaterfallListing from '@/lib/components/WaterfallListing';
import useScreenSize from '@/lib/core/useScreenSize';
import ColumnListing from '@/lib/components/ColumnListing';

const categories = ['All', 'Crocheting', 'Knitting'];

interface ListingComponentProps {
  listingType: 'sell' | 'test';
  defaultProducts: GetProductResponse[];
}

export function ListingComponent({ listingType, defaultProducts }: ListingComponentProps) {
  const [products, setProducts] = useState<GetProductResponse[]>(defaultProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([3, 100]);
  const [isFree, setIsFree] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [triggerLoad, setTriggerLoad] = useState(false);

  const { fetch, hasNextPage, isLoading } = useListProducts({});
  const screenSize = useScreenSize();

  const status =
    listingType === 'sell' ? 'Released' : listingType === 'test' ? 'Created' : undefined;

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await fetch({
        status,
      });
      setProducts(result?.products ?? []);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!loadMore) {
      return;
    }
    const fetchProducts = async () => {
      const result = await fetch({
        q: debouncedSearchTerm ?? undefined,
        status,
        categories: selectedCategory ? [selectedCategory] : ['All'],
        minPrice: isFree ? 0 : priceRange[0],
        maxPrice: priceRange[1],
        pageNumber: 1,
        pageSize: 20,
      });
      setProducts((p) => [...combineArraysById(p, result?.products ?? [], 'id')]);

      setLoadMore((p) => !p);
    };
    fetchProducts();
  }, [loadMore]);

  useEffect(() => {
    fetchProductsByFilter();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (!triggerLoad) {
      return;
    }
    fetchProductsByFilter();
  }, [triggerLoad]);

  const fetchProductsByFilter = async () => {
    const result = await fetch({
      q: debouncedSearchTerm ?? undefined,
      status,
      categories: selectedCategory ? [selectedCategory] : ['All'],
      minPrice: isFree ? 0 : priceRange[0],
      maxPrice: priceRange[1],
      pageNumber: 1,
      pageSize: 20,
    });
    setProducts(result.products);
    setIsDrawerOpen(false);
    setTriggerLoad(false);
  };

  const clearFilter = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSelectedCategory('All');
    setPriceRange([3, 100]);
    setTriggerLoad(true);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Category</h2>
        {categories.map((category) => (
          <div key={category} className="flex items-center space-x-2 mb-2">
            <Checkbox
              id={category}
              checked={selectedCategory === category}
              onCheckedChange={() => setSelectedCategory(category)}
            />
            <label
              htmlFor={category}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {category}
            </label>
          </div>
        ))}
      </div>

      <PriceFilter
        onFilterChange={(filter) => {
          setIsFree(filter.isFree);
          setPriceRange([filter.minPrice, 100]);
        }}
        value={priceRange[0]}
        isFree={isFree}
      />
      <Button
        onClick={() => {
          fetchProductsByFilter();
        }}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? <LoadingSpinnerComponent size="sm" className="text-white" /> : null}
        Apply filters
      </Button>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {listingType === 'sell' ? 'Find Patterns' : listingType === 'test' && 'Find Tester Calls'}
        </h1>
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button variant={'outline'}>
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Filter Options</DrawerTitle>
              </DrawerHeader>
              <div className="p-4">
                <FilterContent />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="flex flex-col gap-6">
        <div className="w-full">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="w-full mb-6">
          <Button variant={'outline'} className={'w-full'} onClick={clearFilter}>
            <Trash />
            Clear Filter
          </Button>
        </div>

        <WaterfallListing
          products={products}
          listingType={listingType}
          columns={screenSize === 'xs' || screenSize === 'sm' || screenSize === 'md' ? 2 : 4}
        />

        {hasNextPage ? (
          <Button
            variant={'outline'}
            className={'w-full'}
            onClick={() => {
              setLoadMore(true);
            }}
            disabled={isLoading}
          >
            Load more
          </Button>
        ) : null}

        {isLoading ? <LoadingSpinnerComponent /> : null}

        {products.length === 0 && !isLoading && (
          <p className="text-center text-muted-foreground mt-6">
            Nothing found matching your criteria.
          </p>
        )}
      </div>
    </div>
  );
}
