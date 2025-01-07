import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetTestingMetricsResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

export const useGetTestingMetrics = () => {
  const [data, setData] = useState<GetTestingMetricsResponse | undefined>(undefined);

  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (testingId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.getTestingMetrics(testingId, {
          ...(await getApi(accessToken, refreshToken, dispatch)),
        }),
    );

    setData(response.data);

    return response.data;
  };

  return {
    ...apiStates,
    fetch,
    data,
  };
};
