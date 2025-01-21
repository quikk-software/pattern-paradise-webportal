import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetUserMetricsResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useGetUserMetrics = () => {
  const [data, setData] = useState<GetUserMetricsResponse | undefined>(undefined);

  const { data: session, update } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (userId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.getUserMetrics(userId, {
          ...(await getApi(session, update)),
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
