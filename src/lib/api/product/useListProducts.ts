import { useState } from 'react';
import { client } from '@/@types';
import type { GetProductResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { usePagination } from '@/lib/api/usePagination';
import { combineArraysById } from '@/lib/core/utils';
import { ProductFilterObject } from '@/lib/constants';

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

  const fetch = async (filter?: ProductFilterObject) => {
    const response = await handleFn(
      async () =>
        await client.api.listProducts({
          pageNumber: filter?.pageNumber ?? pagination.pageNumber,
          pageSize: filter?.pageSize ?? pagination.pageSize,
          ...filter,
        }),
    );

    setData((p) => [...combineArraysById(p, response?.data.products ?? [], 'id')]);

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
