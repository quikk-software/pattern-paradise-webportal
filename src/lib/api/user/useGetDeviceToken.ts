import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetDeviceTokenResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useGetDeviceToken = () => {
  const [data, setData] = useState<GetDeviceTokenResponse | undefined>(undefined);

  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (userId: string, deviceToken: string) => {
    const response = await handleFn(
      async () =>
        await client.api.getDeviceToken(userId, deviceToken, {
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
