'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  ArrowDown01,
  ArrowUp10,
  CalendarArrowDown,
  CalendarArrowUp,
  CircleX,
  Search,
  SlidersHorizontal,
  Star,
  Trash,
  Trash2,
} from 'lucide-react';
import { GetProductResponse } from '@/@types/api-types';
import { useListProducts } from '@/lib/api';
import PriceFilter from '@/components/price-filter';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import WaterfallListing from '@/lib/components/WaterfallListing';
import useScreenSize from '@/lib/core/useScreenSize';
import HashtagInput from '@/components/hashtag-input';
import { MultiSelect } from '@/components/multi-select';
import { CATEGORIES, MAX_PRICE, MIN_PRICE } from '@/lib/constants';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { updateSelectedFlags } from '@/lib/utils';
import { useCreateProductImpression, useCreateTestingImpression } from '@/lib/api/metric';
import LanguageSelect from '@/lib/components/LanguageSelect';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categories = ['All', 'Crocheting', 'Knitting'];

interface ListingComponentProps {
  listingType: 'sell' | 'test';
  defaultProducts: GetProductResponse[];
}

export function ListingComponent({ listingType, defaultProducts }: ListingComponentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [selectedCategory, setSelectedCategory] = useState<{
    craft: string;
    options: { [key: string]: { name: string; selected: boolean }[] };
  }>({
    craft: 'All',
    options: {},
  });
  const [priceRange, setPriceRange] = useState([MIN_PRICE, MAX_PRICE]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [language, setLanguage] = useState<string | undefined>(undefined);
  const [showFilter, setShowFilter] = useState(false);
  const [triggerLoad, setTriggerLoad] = useState(false);
  const [sortValue, setSortValue] = useState('mostRelevant');

  const observer = useRef<IntersectionObserver | null>(null);

  const { fetch, data: products, hasNextPage, isLoading } = useListProducts({});
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
    fetch({
      status,
    }).then();
  }, [status]);

  useEffect(() => {
    fetchProductsByFilter();
  }, [debouncedSearchTerm, sortValue]);

  useEffect(() => {
    if (!triggerLoad) {
      return;
    }
    fetchProductsByFilter();
  }, [triggerLoad]);

  const fetchProductsByFilter = (scrollToResults = false) => {
    fetch({
      q: debouncedSearchTerm ?? undefined,
      status,
      categories: selectedCategory ? [selectedCategory.craft] : ['All'],
      subCategories: Object.values(selectedCategory.options)
        .map((options) => options.map((option) => option.name))
        .flat(),
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      hashtags,
      languages: language ? [language] : [],
      pageNumber: 1,
      pageSize: 20,
      sortBy: sortValue,
    }).then(() => {
      setTriggerLoad(false);
      if (scrollToResults) {
        document.getElementById('listing-results')?.scrollIntoView();
      }
    });
  };

  const clearFilter = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSelectedCategory({
      craft: 'All',
      options: {},
    });
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    setTriggerLoad(true);
    setHashtags([]);
    setLanguage(undefined);
    setSortValue('mostRelevant');
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

  const handleLanguageChange = (language: string) => {
    setLanguage(language);
  };

  const onSortSelectChange = (value: string) => setSortValue(value);

  const lastProductRef = (node: HTMLElement | null) => {
    if (isLoading) {
      return;
    }
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetch({
          q: debouncedSearchTerm ?? undefined,
          status,
          categories: selectedCategory ? [selectedCategory.craft] : ['All'],
          subCategories: Object.values(selectedCategory.options)
            .map((options) => options.map((option) => option.name))
            .flat(),
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          hashtags,
          languages: language ? [language] : [],
          pageNumber: 1,
          pageSize: 20,
          sortBy: sortValue,
        });
      }
    });

    if (node) {
      observer.current.observe(node);
    }
  };

  return (
    <div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {listingType === 'sell'
              ? 'Find Patterns'
              : listingType === 'test' && 'Find Tester Calls'}
          </h2>
          {!showFilter ? (
            <Button variant={'outline'} onClick={() => setShowFilter(true)}>
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filter
            </Button>
          ) : (
            <Button variant={'outline'} onClick={() => setShowFilter(false)}>
              <CircleX className="mr-2 h-4 w-4" />
              Filter
            </Button>
          )}
        </div>

        {showFilter ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Hashtags</h2>
              <HashtagInput hashtags={hashtags} setHashtags={setHashtags} />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Language</h2>
              <div className="flex gap-2">
                <LanguageSelect
                  language={language}
                  handleLanguageChange={handleLanguageChange}
                  fullWidth
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={(event) => {
                    event.preventDefault();
                    setLanguage(undefined);
                  }}
                  disabled={language === undefined}
                >
                  <Trash2 />
                </Button>
              </div>
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
                setPriceRange([filter.minPrice, filter.maxPrice]);
              }}
              overrideMinPrice={priceRange?.[0]}
              overrideMaxPrice={priceRange?.[1]}
            />
            <Button
              onClick={() => {
                fetchProductsByFilter(true);
              }}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <LoadingSpinnerComponent size="sm" className="text-white" /> : null}
              Apply Filter
            </Button>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-6 mt-6">
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
        <Select onValueChange={onSortSelectChange} value={sortValue} defaultValue={sortValue}>
          <SelectTrigger>
            <SelectValue placeholder="Select a reason" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mostRelevant">
              <span className="flex flex-row gap-2 items-center">
                <Star size={14} /> Most Relevant
              </span>
            </SelectItem>
            <SelectItem value="priceAscending">
              <span className="flex flex-row gap-2 items-center">
                <ArrowDown01 size={14} /> Price Ascending
              </span>
            </SelectItem>
            <SelectItem value="priceDescending">
              <span className="flex flex-row gap-2 items-center">
                <ArrowUp10 size={14} /> Price Descending
              </span>
            </SelectItem>
            <SelectItem value="newest">
              <span className="flex flex-row gap-2 items-center">
                <CalendarArrowDown size={14} /> Newest
              </span>
            </SelectItem>
            <SelectItem value="oldest">
              <span className="flex flex-row gap-2 items-center">
                <CalendarArrowUp size={14} /> Oldest
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
        <div className="w-full mb-6">
          <Button variant={'outline'} className={'w-full'} onClick={clearFilter}>
            <Trash />
            Clear Filter
          </Button>
        </div>

        <div id={'listing-results'}>
          <WaterfallListing
            products={products}
            listingType={listingType}
            columns={screenSize === 'xs' || screenSize === 'sm' || screenSize === 'md' ? 2 : 20}
            onImpression={(productId) => handleImpression(productId)}
          />
          <div ref={lastProductRef} className="h-10" />
        </div>

        {products.length === 0 && !isLoading && (
          <p className="text-center text-muted-foreground mt-6">
            Nothing found matching your criteria.
          </p>
        )}
      </div>
    </div>
  );
}
