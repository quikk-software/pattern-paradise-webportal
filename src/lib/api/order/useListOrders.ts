import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetOrderResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { usePagination } from '@/lib/api/usePagination';
import { combineArraysById } from '@/lib/core/utils';
import { useValidSession } from '@/hooks/useValidSession';

export const useListOrders = ({
  pageNumber = 1,
  pageSize = 20,
  status,
  filter,
}: {
  pageNumber?: number;
  pageSize?: number;
  status?: string;
  filter?: 'customer' | 'seller';
}) => {
  const [data, setData] = useState<GetOrderResponse[]>([]);

  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();
  const pagination = usePagination(pageNumber, pageSize);

  const fetch = async (
    customPageNumber?: number,
    customPageSize?: number,
    sortBy?: string,
    sortDirection?: string,
    q?: string,
  ) => {
    const response = await handleFn(
      async () =>
        await client.api.listOrders(
          {
            pageNumber: customPageNumber ?? pagination.pageNumber,
            pageSize: customPageSize ?? pagination.pageSize,
            status,
            filter,
            sortBy,
            sortDirection,
            q,
          },
          {
            ...(await getApi(session)),
          },
        ),
    );

    setData((p) => [...combineArraysById(p, response?.data.orders ?? [], 'id')]);

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
