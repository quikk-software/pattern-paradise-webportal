import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetUserResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useGetUser = () => {
  const [data, setData] = useState<GetUserResponse | undefined>(undefined);

  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (userId: string) => {
    if (!userId) return;
    const response = await handleFn(
      async () =>
        await client.api.getUser(userId, {
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
