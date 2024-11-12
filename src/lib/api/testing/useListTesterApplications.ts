import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetTesterApplicationResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { usePagination } from '@/lib/api/usePagination';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

export const useListTesterApplications = ({
  pageNumber = 1,
  pageSize = 20,
}: {
  pageNumber?: number;
  pageSize?: number;
}) => {
  const [data, setData] = useState<GetTesterApplicationResponse[]>([]);

  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();
  const pagination = usePagination(pageNumber, pageSize);

  const fetch = async (testingId: string, direction: 'asc' | 'desc') => {
    const response = await handleFn(
      async () =>
        await client.api.listTesterApplications(
          testingId,
          {
            pageNumber: pagination.pageNumber,
            pageSize: pagination.pageSize,
            direction,
          },
          { ...(await getApi(accessToken, refreshToken, dispatch)) },
        ),
    );

    setData((p) => [...p, ...(response?.data.testingsOnUsers ?? [])]);

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
