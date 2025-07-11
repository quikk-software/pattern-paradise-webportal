'use client';

import React, { useEffect, useLayoutEffect, useRef } from 'react';
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
import { useListProducts, useListProductsForRecommendations } from '@/lib/api';
import PriceFilter from '@/components/price-filter';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import WaterfallListing from '@/lib/components/WaterfallListing';
import useScreenSize from '@/lib/core/useScreenSize';
import HashtagInput from '@/components/hashtag-input';
import { MultiSelect } from '@/components/multi-select';
import { CATEGORIES, MAX_PRICE, MIN_PRICE } from '@/lib/constants';
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
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'use-intl';
import { useValidSession } from '@/hooks/useValidSession';

interface ListingComponentProps {
  status: 'Released' | 'Created';
  infiniteScroll?: boolean;
  initialQuery?: { [key: string]: string };
}

export function ListingComponent({
  initialQuery,
  status,
  infiniteScroll = true,
}: ListingComponentProps) {
  const dispatch = useDispatch();
  const observer = useRef<IntersectionObserver | null>(null);
  const screenSize = useScreenSize();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();

  const { data: session } = useValidSession();

  const { productFilter } = useSelector((s: Store) => s.filter);

  const {
    q: searchTerm,
    sortBy,
    selectedCategory,
    minPrice,
    maxPrice,
    hashtags,
    language,
    showFilter,
    triggerLoad,
    pageNumber,
    pageSize,
    hasNextPage,
  } = productFilter;

  const {
    fetch,
    data: products,
    isLoading,
  } = useListProducts({
    pageNumber,
    pageSize,
  });
  const { fetch: fetchRecommendations, data: recommendedProducts } =
    useListProductsForRecommendations();
  const { mutate: mutateProductImpression } = useCreateProductImpression();
  const { mutate: mutateTestingImpression } = useCreateTestingImpression();

  useEffect(() => {
    if (!session?.user) return;
    fetchRecommendations();
  }, [session?.user]);

  useEffect(() => {
    const query = new URLSearchParams();

    if (productFilter.q) query.set('q', productFilter.q);
    if (productFilter.sortBy) query.set('sortBy', productFilter.sortBy);
    if (productFilter.minPrice !== MIN_PRICE) query.set('minPrice', String(productFilter.minPrice));
    if (productFilter.maxPrice !== MAX_PRICE) query.set('maxPrice', String(productFilter.maxPrice));
    if (productFilter.language) query.set('language', productFilter.language);
    if (productFilter.hashtags.length) query.set('hashtags', productFilter.hashtags.join(','));
    if (productFilter.selectedCategory.craft !== 'All')
      query.set('craft', productFilter.selectedCategory.craft);

    const selectedSubcategories = Object.values(productFilter.selectedCategory.options)
      .flat()
      .filter((opt) => opt.selected)
      .map((opt) => opt.name);

    if (selectedSubcategories.length) query.set('subCategories', selectedSubcategories.join(','));

    router.replace(`${pathname}?${query.toString()}`, { scroll: false });
  }, [productFilter]);

  useEffect(() => {
    if (!initialQuery) return;

    dispatch(updateFilterField({ key: 'q', value: initialQuery.q || '' }));
    dispatch(updateFilterField({ key: 'sortBy', value: initialQuery.sortBy || 'mostRelevant' }));
    dispatch(
      updateFilterField({
        key: 'minPrice',
        value: parseInt(initialQuery.minPrice || String(MIN_PRICE), 10),
      }),
    );
    dispatch(
      updateFilterField({
        key: 'maxPrice',
        value: parseInt(initialQuery.maxPrice || String(MAX_PRICE), 10),
      }),
    );
    dispatch(
      updateFilterField({
        key: 'language',
        value: initialQuery.language || undefined,
      }),
    );
    dispatch(
      updateFilterField({
        key: 'hashtags',
        value: initialQuery.hashtags?.split(',') || [],
      }),
    );

    const craft = initialQuery.craft || 'All';
    const subCategories = initialQuery.subCategories?.split(',') || [];

    dispatch(
      updateFilterField({
        key: 'selectedCategory',
        value: {
          craft,
          options: subCategories.length
            ? {
                [craft]: subCategories.map((name) => ({ name, selected: true })),
              }
            : {},
        },
      }),
    );

    dispatch(updateFilterField({ key: 'triggerLoad', value: true }));
  }, []);

  useEffect(() => {
    if (!triggerLoad) return;
    fetchProductsByFilter(false, 1, 20);
    dispatch(updateFilterField({ key: 'triggerLoad', value: false }));
  }, [triggerLoad]);

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const storedY = sessionStorage.getItem('scrollY');
      const scrollContainer = document.getElementById('main-scroll-area');

      if (storedY && scrollContainer) {
        scrollContainer.scrollTo(0, parseInt(storedY));
        sessionStorage.removeItem('scrollY');
      }
    }
  }, []);

  const fetchProductsByFilter = (
    scrollToResults = false,
    overridePageNumber?: number,
    overridePageSize?: number,
  ) => {
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
      pageNumber: overridePageNumber ?? pageNumber,
      pageSize: overridePageSize ?? pageSize,
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
    dispatch(updateFilterField({ key: 'triggerLoad', value: true }));
  };

  const handleImpression = async (productId: string) => {
    if (status === 'Released') await mutateProductImpression(productId);
    else if (status === 'Created') await mutateTestingImpression(productId);
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
          pageNumber,
          pageSize,
          sale: sortBy === 'sale',
        });
      }
    });

    if (node) observer.current.observe(node);
  };

  if (
    !infiniteScroll &&
    initialQuery?.sortBy === 'mostRelevant' &&
    recommendedProducts.length > 0
  ) {
    return (
      <div className="space-y-4">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              {t('landing.recommendation.title')}
            </h2>
            <p className="text-sm text-gray-500">{t('landing.recommendation.description')}</p>
          </div>
          <a
            href="/browse"
            className="text-sm font-medium text-blue-600 hover:underline hover:text-blue-800"
          >
            {t('landing.recommendation.button')} →
          </a>
        </div>
        <div id={'listing-results'}>
          <WaterfallListing
            products={recommendedProducts}
            status={status}
            columns={screenSize === 'xs' || screenSize === 'sm' || screenSize === 'md' ? 2 : 5}
            onImpression={(productId) => handleImpression(productId)}
            showFade={!infiniteScroll && hasNextPage}
          />
          <div ref={lastProductRef} className="h-10" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {status === 'Released' ? 'Find Patterns' : null}
            {status === 'Created' ? 'Find Tester Calls' : null}
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
              <h2 className="text-lg font-semibold mb-2">{t('browse.filter.hashtags')}</h2>
              <HashtagInput
                hashtags={hashtags}
                setHashtags={(tags) =>
                  dispatch(updateFilterField({ key: 'hashtags', value: tags }))
                }
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">{t('browse.filter.language')}</h2>
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
              <h2 className="text-lg font-semibold mb-2">{t('browse.filter.category')}</h2>
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
              {t('browse.filter.applyFilter')}
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 mt-6">
        <div className="w-full">
          <div className="relative">
            <Search className="absolute left-2 top-3 h-4 w-4 z-50 text-muted-foreground" />
            <Input
              placeholder={t('browse.filter.searchPlaceholder')}
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
            <SelectValue placeholder={t('common.sort.placeholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mostRelevant">
              <span className="flex flex-row gap-2 items-center">
                <Star size={14} /> {t('browse.filter.mostRelevant')}
              </span>
            </SelectItem>
            <SelectItem value="sale">
              <span className="flex flex-row gap-2 items-center">
                <PercentIcon size={14} /> {t('browse.filter.saleOnly')}
              </span>
            </SelectItem>
            <SelectItem value="priceAscending">
              <span className="flex flex-row gap-2 items-center">
                <ArrowDown01 size={14} /> {t('browse.filter.priceAscending')}
              </span>
            </SelectItem>
            <SelectItem value="priceDescending">
              <span className="flex flex-row gap-2 items-center">
                <ArrowUp10 size={14} /> {t('browse.filter.priceAscending')}
              </span>
            </SelectItem>
            <SelectItem value="newest">
              <span className="flex flex-row gap-2 items-center">
                <CalendarArrowDown size={14} /> {t('browse.filter.newest')}
              </span>
            </SelectItem>
            <SelectItem value="oldest">
              <span className="flex flex-row gap-2 items-center">
                <CalendarArrowUp size={14} /> {t('browse.filter.oldest')}
              </span>
            </SelectItem>
          </SelectContent>
        </Select>

        <div className="w-full mb-6">
          <Button variant={'outline'} className={'w-full'} onClick={clearFilter}>
            <Trash /> {t('browse.filter.clearFilter')}
          </Button>
        </div>

        <div className="space-y-4">
          <div id={'listing-results'}>
            <WaterfallListing
              products={products}
              status={status}
              columns={screenSize === 'xs' || screenSize === 'sm' || screenSize === 'md' ? 2 : 5}
              onImpression={(productId) => handleImpression(productId)}
              showFade={!infiniteScroll && hasNextPage}
            />
            <div ref={lastProductRef} className="h-10" />
          </div>
          {products.length === 0 && !isLoading && (
            <div className="flex flex-col gap-4 justify-center items-center mb-10">
              <p className="text-center text-muted-foreground">{t('browse.filter.noResults')}</p>
              <div className="flex justify-center">
                <Button size="lg" onClick={clearFilter}>
                  {t('browse.filter.resetFilter')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
