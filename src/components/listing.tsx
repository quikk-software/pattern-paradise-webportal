'use client';

import React, { useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  ArrowDown01,
  ArrowUp10,
  CalendarArrowDown,
  CalendarArrowUp,
  CircleX,
  PercentIcon,
  Search,
  SlidersHorizontal,
  Star,
  Trash,
  Trash2,
} from 'lucide-react';
import { useListProducts } from '@/lib/api';
import PriceFilter from '@/components/price-filter';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import WaterfallListing from '@/lib/components/WaterfallListing';
import useScreenSize from '@/lib/core/useScreenSize';
import HashtagInput from '@/components/hashtag-input';
import { MultiSelect } from '@/components/multi-select';
import { CATEGORIES } from '@/lib/constants';
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
import { CraftSelector } from '@/components/craft-selector';
import { useDispatch, useSelector } from 'react-redux';
import { reset, updateFilterField } from '@/lib/features/filter/filterSlice';
import { Store } from '@/lib/redux/store';

interface ListingComponentProps {
  listingType: 'sell' | 'test';
  infiniteScroll?: boolean;
}

export function ListingComponent({ listingType, infiniteScroll = true }: ListingComponentProps) {
  const dispatch = useDispatch();
  const observer = useRef<IntersectionObserver | null>(null);
  const screenSize = useScreenSize();
  const {
    productFilter: {
      q: searchTerm,
      sortBy,
      selectedCategory,
      minPrice,
      maxPrice,
      hashtags,
      language,
      showFilter,
      triggerLoad,
    },
  } = useSelector((s: Store) => s.filter);

  const { fetch, data: products, hasNextPage, isLoading } = useListProducts({});
  const { mutate: mutateProductImpression } = useCreateProductImpression();
  const { mutate: mutateTestingImpression } = useCreateTestingImpression();

  const status =
    listingType === 'sell' ? 'Released' : listingType === 'test' ? 'Created' : undefined;

  useEffect(() => {
    fetchProductsByFilter();
  }, [searchTerm, sortBy, status]);

  useEffect(() => {
    if (!triggerLoad) return;
    fetchProductsByFilter();
    dispatch(updateFilterField({ key: 'triggerLoad', value: false }));
  }, [triggerLoad]);

  const fetchProductsByFilter = (scrollToResults = false) => {
    const filter = {
      q: searchTerm ?? undefined,
      status,
      categories: [selectedCategory.craft || 'All'],
      subCategories: Object.values(selectedCategory.options)
        .flat()
        .filter((opt) => opt.selected)
        .map((opt) => opt.name),
      minPrice,
      maxPrice,
      hashtags,
      languages: language ? [language] : [],
      pageNumber: 1,
      pageSize: 20,
      sale: sortBy === 'sale',
      sortBy,
    };
    fetch(filter).then(() => {
      if (typeof window !== 'undefined' && scrollToResults) {
        document.getElementById('listing-results')?.scrollIntoView();
      }
    });
  };

  const clearFilter = () => {
    dispatch(reset());
  };

  const handleImpression = async (productId: string) => {
    if (listingType === 'sell') await mutateProductImpression(productId);
    else if (listingType === 'test') await mutateTestingImpression(productId);
  };

  const updatedCategories = updateSelectedFlags(
    CATEGORIES,
    selectedCategory.craft,
    Object.values(selectedCategory.options)
      .flat()
      .map((option) => ({ name: option.name, selected: option.selected })),
  );

  const lastProductRef = (node: HTMLElement | null) => {
    if (isLoading || !infiniteScroll) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetch({
          q: searchTerm ?? undefined,
          status,
          categories: [selectedCategory.craft || 'All'],
          subCategories: Object.values(selectedCategory.options)
            .flat()
            .filter((opt) => opt.selected)
            .map((opt) => opt.name),
          minPrice,
          maxPrice,
          hashtags,
          languages: language ? [language] : [],
          sortBy,
        });
      }
    });

    if (node) observer.current.observe(node);
  };

  return (
    <div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {listingType === 'sell' ? 'Find Patterns' : 'Find Tester Calls'}
          </h2>
          <Button
            variant={'outline'}
            onClick={() => dispatch(updateFilterField({ key: 'showFilter', value: !showFilter }))}
          >
            {showFilter ? (
              <>
                <CircleX className="mr-2 h-4 w-4" /> Filter
              </>
            ) : (
              <>
                <SlidersHorizontal className="mr-2 h-4 w-4" /> Filter
              </>
            )}
          </Button>
        </div>

        {showFilter && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Hashtags</h2>
              <HashtagInput
                hashtags={hashtags}
                setHashtags={(tags) =>
                  dispatch(updateFilterField({ key: 'hashtags', value: tags }))
                }
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Language</h2>
              <div className="flex gap-2">
                <LanguageSelect
                  language={language}
                  handleLanguageChange={(lang) =>
                    dispatch(updateFilterField({ key: 'language', value: lang }))
                  }
                  fullWidth
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(updateFilterField({ key: 'language', value: undefined }));
                  }}
                  disabled={language === undefined}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Category</h2>
              <CraftSelector
                hasAll
                selectedCraft={selectedCategory.craft}
                onCraftChange={(craft) =>
                  dispatch(
                    updateFilterField({
                      key: 'selectedCategory',
                      value: { craft, options: {} },
                    }),
                  )
                }
              />
            </div>

            <MultiSelect
              initialCategories={updatedCategories}
              onChange={(value) => dispatch(updateFilterField({ key: 'selectedCategory', value }))}
              injectCategories
              overrideCraft={selectedCategory.craft}
            />

            <PriceFilter
              onFilterChange={(filter) => {
                dispatch(updateFilterField({ key: 'minPrice', value: filter.minPrice }));
                dispatch(updateFilterField({ key: 'maxPrice', value: filter.maxPrice }));
              }}
              overrideMinPrice={minPrice}
              overrideMaxPrice={maxPrice}
            />

            <Button
              onClick={() => fetchProductsByFilter(true)}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <LoadingSpinnerComponent size="sm" className="text-white" /> : null}
              Apply Filter
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 mt-6">
        <div className="w-full">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pattern or creator..."
              value={searchTerm}
              onChange={(e) => dispatch(updateFilterField({ key: 'q', value: e.target.value }))}
              className="pl-8"
            />
          </div>
        </div>

        <Select
          onValueChange={(value) => dispatch(updateFilterField({ key: 'sortBy', value }))}
          value={sortBy}
        >
          <SelectTrigger aria-label={'Sort'}>
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mostRelevant">
              <span className="flex flex-row gap-2 items-center">
                <Star size={14} /> Most Relevant
              </span>
            </SelectItem>
            <SelectItem value="sale">
              <span className="flex flex-row gap-2 items-center">
                <PercentIcon size={14} /> Sale Only
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
            <Trash /> Clear Filter
          </Button>
        </div>

        <div className="space-y-4">
          <div id={'listing-results'}>
            <WaterfallListing
              products={products}
              listingType={listingType}
              columns={screenSize === 'xs' || screenSize === 'sm' || screenSize === 'md' ? 2 : 4}
              onImpression={(productId) => handleImpression(productId)}
              showFade={!infiniteScroll && hasNextPage}
            />
            <div ref={lastProductRef} className="h-10" />
          </div>
          {products.length === 0 && !isLoading && (
            <div className="flex flex-col gap-4 justify-center items-center mb-10">
              <p className="text-center text-muted-foreground">
                Nothing found matching your criteria.
              </p>
              <div className="flex justify-center">
                <Button size="lg" onClick={() => dispatch(reset())}>
                  Reset Filter
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
