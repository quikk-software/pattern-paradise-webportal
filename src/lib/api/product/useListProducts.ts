import { useState } from 'react';
import { client } from '@/@types';
import type { GetProductResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { usePagination } from '@/lib/api/usePagination';

type FilterObject = {
  q?: string;
  status?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  pageNumber?: number;
  pageSize?: number;
};

export const useListProducts = ({
  pageNumber = 1,
  pageSize = 20,
}: {
  pageNumber?: number;
  pageSize?: number;
}) => {
  const [data, setData] = useState<GetProductResponse[]>([]);

  const { handleFn, ...apiStates } = useApiStates();
  const pagination = usePagination(pageNumber, pageSize);

  const fetch = async (filter?: FilterObject) => {
    const response = await handleFn(
      async () =>
        await client.api.listProducts({
          pageNumber: filter?.pageNumber ?? pagination.pageNumber,
          pageSize: filter?.pageSize ?? pagination.pageSize,
          ...filter,
        }),
    );

    setData((p) => [...p, ...response?.data.products]);

    pagination.handlePaginationPayload(response?.data);

    return response?.data;
  };

  return {
    ...apiStates,
    ...pagination,
    fetch,
    data,
  };
};
