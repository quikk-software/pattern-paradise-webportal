import { useState } from 'react';
import { client } from '@/@types';
import type { GetProductResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { ProductFilterObject } from '@/lib/constants';

export const useListProductsForShowcase = () => {
  const [data, setData] = useState<GetProductResponse[]>([]);

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async () => {
    const response = await handleFn(async () => await client.api.listProductsForShowcase());

    setData(response?.data.products ?? []);

    return response?.data;
  };

  return {
    ...apiStates,
    fetch,
    data,
  };
};
