import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetTesterApplicationResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { usePagination } from '@/lib/api/usePagination';
import { useValidSession } from '@/hooks/useValidSession';

export const useListUserRatings = ({
  pageNumber = 1,
  pageSize = 20,
}: {
  pageNumber?: number;
  pageSize?: number;
}) => {
  const [data, setData] = useState<GetTesterApplicationResponse[]>([]);

  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();
  const pagination = usePagination(pageNumber, pageSize);

  const fetch = async (userId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.listUserRatings(
          userId,
          {
            pageNumber: pagination.pageNumber,
            pageSize: pagination.pageSize,
          },
          { ...(await getApi(session)) },
        ),
    );

    setData(response?.data.testingsOnUsers);

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
