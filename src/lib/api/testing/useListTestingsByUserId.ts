import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetTestingResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { usePagination } from '@/lib/api/usePagination';
import { combineArraysById } from '@/lib/core/utils';
import { useSession } from 'next-auth/react';

export const useListTestingsByUserId = ({
  pageNumber = 1,
  pageSize = 20,
  filter,
}: {
  pageNumber?: number;
  pageSize?: number;
  filter?: 'customer' | 'seller';
}) => {
  const [data, setData] = useState<GetTestingResponse[]>([]);

  const { data: session, update } = useSession();

  const { handleFn, ...apiStates } = useApiStates();
  const pagination = usePagination(pageNumber, pageSize);

  const fetch = async (userId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.listTestingsByUserId(
          userId,
          {
            pageNumber: pagination.pageNumber,
            pageSize: pagination.pageSize,
            filter,
          },
          { ...(await getApi(session, update)) },
        ),
    );

    setData((p) => [...combineArraysById(p, response?.data.testings ?? [], 'id')]);

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
