import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetTestingCommentResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { usePagination } from '@/lib/api/usePagination';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { combineArraysById } from '@/lib/core/utils';
import { useCookies } from 'next-client-cookies';

export const useListTestingComments = ({
  pageNumber = 1,
  pageSize = 20,
}: {
  pageNumber?: number;
  pageSize?: number;
}) => {
  const [data, setData] = useState<GetTestingCommentResponse[]>([]);

  const cookieStore = useCookies();
  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();
  const pagination = usePagination(pageNumber, pageSize);

  const fetch = async (
    testingId: string,
    {
      overridePageNumber,
      overridePageSize,
    }: { overridePageNumber?: number; overridePageSize?: number },
  ) => {
    const response = await handleFn(
      async () =>
        await client.api.listTestingCommentsByTestingId(
          testingId,
          {
            pageNumber: overridePageNumber ?? pagination.pageNumber,
            pageSize: overridePageSize ?? pagination.pageSize,
          },
          { ...(await getApi(accessToken, refreshToken, dispatch, cookieStore)) },
        ),
    );

    setData((p) => [...combineArraysById(p, response?.data.testingComments ?? [], 'id')]);

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
