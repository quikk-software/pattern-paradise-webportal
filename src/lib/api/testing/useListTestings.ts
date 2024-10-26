import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetTestingResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { usePagination } from '@/lib/api/usePagination';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

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
  const { pageNumber: actualPageNumber, pageSize: actualPageSize } = usePagination(
    pageNumber,
    pageSize,
  );

  const fetch = async () => {
    const response = await handleFn(
      async () =>
        await client.api.listTestings(
          {
            pageNumber: actualPageNumber,
            pageSize: actualPageSize,
          },
          { ...(await getApi(accessToken, refreshToken, dispatch)) },
        ),
    );

    setData(response?.data.testings);

    return response?.data;
  };

  return {
    ...apiStates,
    fetch,
    data,
  };
};
