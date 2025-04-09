import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetUserAccountResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useGetUserById = () => {
  const [data, setData] = useState<GetUserAccountResponse | undefined>(undefined);

  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (userId: string, trackMetrics: boolean = true) => {
    const response = await handleFn(
      async () =>
        await client.api.getUserById(
          userId,
          {
            trackMetrics,
          },
          {
            ...(await getApi(session)),
          },
        ),
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
