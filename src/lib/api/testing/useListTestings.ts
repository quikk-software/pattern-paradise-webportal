import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetTestingResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { usePagination } from '@/lib/api/usePagination';
import { combineArraysById } from '@/lib/core/utils';
import { useValidSession } from '@/hooks/useValidSession';

export const useListTestings = ({
  pageNumber = 1,
  pageSize = 20,
}: {
  pageNumber?: number;
  pageSize?: number;
}) => {
  const [data, setData] = useState<GetTestingResponse[]>([]);

  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();
  const pagination = usePagination(pageNumber, pageSize);

  const fetch = async (status?: string[], isChat = false) => {
    const response = await handleFn(
      async () =>
        await client.api.listTestings(
          {
            pageNumber: pagination.pageNumber,
            pageSize: pagination.pageSize,
            status,
            isChat,
          },
          { ...(await getApi(session)) },
        ),
    );

    setData(response.data?.testings ?? []);

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
