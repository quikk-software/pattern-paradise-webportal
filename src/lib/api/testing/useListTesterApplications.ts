import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetTesterApplicationResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { usePagination } from '@/lib/api/usePagination';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { combineArraysById } from '@/lib/core/utils';
import { TesterApplicationFilterObject } from '@/lib/constants';

export const useListTesterApplications = ({
  pageNumber = 1,
  pageSize = 20,
}: {
  pageNumber?: number;
  pageSize?: number;
}) => {
  const [data, setData] = useState<GetTesterApplicationResponse[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();
  const pagination = usePagination(pageNumber, pageSize);

  const fetch = async (testingId: string, filter: TesterApplicationFilterObject) => {
    const response = await handleFn(
      async () =>
        await client.api.listTesterApplications(
          testingId,
          {
            pageNumber: pagination.pageNumber,
            pageSize: pagination.pageSize,
            ...filter,
          },
          { ...(await getApi(accessToken, refreshToken, dispatch)) },
        ),
    );

    setData((p) => [
      ...combineArraysById(
        p.map((e) => ({
          ...e,
          id: `${e.user.id}${e.testing.id}`,
        })),
        (response?.data.testingsOnUsers ?? []).map((e) => ({
          ...e,
          id: `${e.user.id}${e.testing.id}`,
        })),
        'id',
      ),
    ]);

    pagination.handlePaginationPayload(response?.data);
    setTotalCount(response?.data.totalCount ?? 0);

    return response?.data;
  };

  return {
    ...apiStates,
    ...pagination,
    fetch,
    data,
    setData,
    totalCount,
  };
};
