import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetUserMetricsResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useGetUserMetrics = () => {
  const [data, setData] = useState<GetUserMetricsResponse | undefined>(undefined);

  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (userId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.getUserMetrics(userId, {
          ...(await getApi(session)),
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
