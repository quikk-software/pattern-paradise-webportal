import { useState } from 'react';
import { client } from '@/@types';
import type { GetProductResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { usePagination } from '@/lib/api/usePagination';

export const useListProducts = ({
  pageNumber = 1,
  pageSize = 20,
}: {
  pageNumber?: number;
  pageSize?: number;
}) => {
  const [data, setData] = useState<GetProductResponse[]>([]);

  const { handleFn, ...apiStates } = useApiStates();
  const { pageNumber: actualPageNumber, pageSize: actualPageSize } = usePagination(
    pageNumber,
    pageSize,
  );

  const fetch = async () => {
    const response = await handleFn(
      async () =>
        await client.api.listProducts({
          pageNumber: actualPageNumber,
          pageSize: actualPageSize,
        }),
    );

    setData(response?.data.products);

    return response?.data;
  };

  return {
    ...apiStates,
    fetch,
    data,
  };
};
