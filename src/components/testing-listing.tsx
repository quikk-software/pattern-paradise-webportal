'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Search, Image, SlidersHorizontal, Trash } from 'lucide-react';
import { GetProductResponse } from '@/@types/api-types';
import { useListProducts } from '@/lib/api';
import ProductImageSlider from '@/lib/components/ProductImageSlider';
import Link from 'next/link';

const categories = ['All', 'Crocheting', 'Knitting'];

export function TestingListingComponent() {
  const [products, setProducts] = useState<GetProductResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0.01, 100]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loadMore, setLoadMore] = useState(false);

  const { fetch, hasNextPage } = useListProducts({});

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await fetch();
      setProducts(result?.products ?? []);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!loadMore) {
      return;
    }
    const fetchProducts = async () => {
      const result = await fetch();
      setProducts((p) => [...p, ...(result?.products ?? [])]);
      setLoadMore((p) => !p);
    };
    fetchProducts();
  }, [loadMore]);

  useEffect(() => {
    const fetchProductsByFilter = async () => {
      const result = await fetch({
        q: debouncedSearchTerm ?? undefined,
        status: 'Created',
        categories: selectedCategory ? [selectedCategory] : ['All'],
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        pageNumber: 1,
        pageSize: 20,
      });
      setProducts(result.products);
    };
    fetchProductsByFilter();
  }, [debouncedSearchTerm, selectedCategory, priceRange]);

  const clearFilter = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSelectedCategory('All');
    setPriceRange([0.01, 100]);
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

      <div>
        <h2 className="text-lg font-semibold mb-2">Price Range</h2>
        <Slider
          min={0.01}
          max={100}
          step={0.01}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Open Testings</h1>
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

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search testings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="w-full md:w-64 mb-6">
          <Button variant={'outline'} className={'w-full'} onClick={clearFilter}>
            <Trash />
            Clear Filter
          </Button>
        </div>

        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="flex flex-col justify-between">
                <CardContent className="pt-4">
                  <div>
                    <ProductImageSlider imageUrls={product.imageUrls} title={product.title} />
                  </div>
                  <h3 className="font-semibold">{product.title}</h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <span className="font-bold">${product.price}</span>
                  <Link href={`/test/${product.id}`}>
                    <Button>View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          {hasNextPage ? (
            <Button
              variant={'outline'}
              className={'w-full'}
              onClick={() => {
                setLoadMore(true);
              }}
            >
              Load more
            </Button>
          ) : null}
          {products.length === 0 && (
            <p className="text-center text-muted-foreground mt-6">
              No testings found matching your criteria.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
