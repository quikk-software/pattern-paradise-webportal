import { useState } from 'react';
import { client } from '@/@types';
import type { GetProductResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { usePagination } from '@/lib/api/usePagination';

export const useListProductsByUserId = ({
  pageNumber = 1,
  pageSize = 20,
}: {
  pageNumber?: number;
  pageSize?: number;
}) => {
  const [data, setData] = useState<GetProductResponse[]>([]);

  const { handleFn, ...apiStates } = useApiStates();
  const pagination = usePagination(pageNumber, pageSize);

  const fetch = async (userId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.listProductsByUserId(userId, {
          pageNumber: pagination.pageNumber,
          pageSize: pagination.pageSize,
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
