import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MIN_PRICE, MAX_PRICE } from '@/lib/constants';
import { GetProductResponse } from '@/@types/api-types';

export interface SelectedCategory {
  craft: string;
  options: { [key: string]: { name: string; selected: boolean }[] };
}

export interface ProductFilterObject {
  q: string;
  sortBy: string;
  selectedCategory: SelectedCategory;
  minPrice: number;
  maxPrice: number;
  hashtags: string[];
  language?: string;
  showFilter: boolean;
  triggerLoad: boolean;
  pageNumber: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface FilterState {
  productFilter: ProductFilterObject;
  products: GetProductResponse[];
}

export const initialState: FilterState = {
  productFilter: {
    q: '',
    sortBy: 'mostRelevant',
    selectedCategory: {
      craft: 'All',
      options: {},
    },
    minPrice: MIN_PRICE,
    maxPrice: MAX_PRICE,
    hashtags: [],
    language: undefined,
    showFilter: false,
    triggerLoad: false,
    pageNumber: 1,
    pageSize: 20,
    hasNextPage: false,
  },
  products: [],
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setProductFilter: (state, action: PayloadAction<ProductFilterObject>) => {
      state.productFilter = action.payload;
    },
    updateFilterField: <K extends keyof ProductFilterObject>(
      state: FilterState,
      action: PayloadAction<{ key: K; value: ProductFilterObject[K] }>,
    ) => {
      state.productFilter[action.payload.key] = action.payload.value;
      if (action.payload.key !== 'triggerLoad') {
        state.productFilter.triggerLoad = true;
      }
    },
    setPageNumber: (state: FilterState, action: PayloadAction<number>) => {
      state.productFilter.pageNumber = action.payload;
    },
    setPageSize: (state: FilterState, action: PayloadAction<number>) => {
      state.productFilter.pageSize = action.payload;
    },
    setHasNextPage: (state: FilterState, action: PayloadAction<boolean>) => {
      state.productFilter.hasNextPage = action.payload;
    },
    setProducts: (state, action: PayloadAction<GetProductResponse[]>) => {
      state.products = action.payload;
    },
    reset: () => initialState,
  },
});

export const {
  setProductFilter,
  updateFilterField,
  setProducts,
  setPageNumber,
  setPageSize,
  setHasNextPage,
  reset,
} = filterSlice.actions;
export default filterSlice.reducer;
