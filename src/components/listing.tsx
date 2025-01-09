'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Search, SlidersHorizontal, Trash } from 'lucide-react';
import { GetProductResponse } from '@/@types/api-types';
import { useListProducts } from '@/lib/api';
import { combineArraysById } from '@/lib/core/utils';
import PriceFilter from '@/components/price-filter';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import WaterfallListing from '@/lib/components/WaterfallListing';
import useScreenSize from '@/lib/core/useScreenSize';
import HashtagInput from '@/components/hashtag-input';
import { MultiSelect } from '@/components/multi-select';
import { CATEGORIES } from '@/lib/constants';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { updateSelectedFlags } from '@/lib/utils';
import { useCreateProductImpression, useCreateTestingImpression } from '@/lib/api/metric';

const categories = ['All', 'Crocheting', 'Knitting'];

interface ListingComponentProps {
  listingType: 'sell' | 'test';
  defaultProducts: GetProductResponse[];
}

export function ListingComponent({ listingType, defaultProducts }: ListingComponentProps) {
  const [products, setProducts] = useState<GetProductResponse[]>(defaultProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [selectedCategory, setSelectedCategory] = useState<{
    craft: string;
    options: { [key: string]: { name: string; selected: boolean }[] };
  }>({
    craft: 'All',
    options: {},
  });
  const [priceRange, setPriceRange] = useState([3, 100]);
  const [isFree, setIsFree] = useState(true);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [triggerLoad, setTriggerLoad] = useState(false);

  const { fetch, hasNextPage, isLoading } = useListProducts({});
  const { mutate: mutateProductImpression } = useCreateProductImpression();
  const { mutate: mutateTestingImpression } = useCreateTestingImpression();
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
        categories: selectedCategory ? [selectedCategory.craft] : ['All'],
        hashtags,
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
      categories: selectedCategory ? [selectedCategory.craft] : ['All'],
      subCategories: Object.values(selectedCategory.options)
        .map((options) => options.map((option) => option.name))
        .flat(),
      minPrice: isFree ? 0 : priceRange[0],
      maxPrice: priceRange[1],
      hashtags,
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
    setSelectedCategory({
      craft: 'All',
      options: {},
    });
    setPriceRange([3, 100]);
    setTriggerLoad(true);
    setIsFree(true);
    setHashtags([]);
  };

  const handleImpression = async (productId: string) => {
    switch (listingType) {
      case 'sell':
        await mutateProductImpression(productId);
        break;
      case 'test':
        await mutateTestingImpression(productId);
        break;
      default:
        break;
    }
  };

  const updatedCategories = updateSelectedFlags(
    CATEGORIES,
    selectedCategory.craft,
    Object.values(selectedCategory.options)
      .flat()
      .map((option) => ({ name: option.name, selected: option.selected })),
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
              Filter
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-4">
            <div className="mx-auto w-full max-w-sm max-h-[100vh] overflow-y-auto">
              <div className="p-4">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Hashtags</h2>
                    <HashtagInput hashtags={hashtags} setHashtags={setHashtags} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold mb-2">Category</h2>
                    <RadioGroup
                      value={selectedCategory.craft}
                      onValueChange={(value) =>
                        setSelectedCategory({
                          craft: value,
                          options: {},
                        })
                      }
                      className="flex flex-col space-y-1"
                    >
                      {categories.map((category) => (
                        <div className="flex items-center space-x-2" key={category}>
                          <RadioGroupItem value={category} id={category?.toLowerCase()} />
                          <Label htmlFor={category?.toLowerCase()} className="cursor-pointer">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <MultiSelect
                    initialCategories={updatedCategories}
                    onChange={(value) => {
                      setSelectedCategory(value);
                    }}
                    injectCategories={true}
                    overrideCraft={selectedCategory.craft}
                  />

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
                    {isLoading ? (
                      <LoadingSpinnerComponent size="sm" className="text-white" />
                    ) : null}
                    Apply Filter
                  </Button>
                </div>
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
          onImpression={(productId) => handleImpression(productId)}
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
