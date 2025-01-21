import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetUserResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useGetUser = () => {
  const [data, setData] = useState<GetUserResponse | undefined>(undefined);

  const { data: session, update } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (userId: string) => {
    if (!userId) return;
    const response = await handleFn(
      async () =>
        await client.api.getUser(userId, {
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
