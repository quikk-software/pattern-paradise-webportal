import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetTestingResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { usePagination } from '@/lib/api/usePagination';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { combineArraysById } from '@/lib/core/utils';

export const useListTestings = ({
  pageNumber = 1,
  pageSize = 20,
}: {
  pageNumber?: number;
  pageSize?: number;
}) => {
  const [data, setData] = useState<GetTestingResponse[]>([]);

  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();
  const pagination = usePagination(pageNumber, pageSize);

  const fetch = async (status?: string[]) => {
    const response = await handleFn(
      async () =>
        await client.api.listTestings(
          {
            pageNumber: pagination.pageNumber,
            pageSize: pagination.pageSize,
            status,
          },
          { ...(await getApi(accessToken, refreshToken, dispatch)) },
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
