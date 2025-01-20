import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetUserAccountResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useGetUserById = () => {
  const [data, setData] = useState<GetUserAccountResponse | undefined>(undefined);

  const { data: session } = useSession();

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
            ...(await getApi(session?.user.accessToken)),
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
