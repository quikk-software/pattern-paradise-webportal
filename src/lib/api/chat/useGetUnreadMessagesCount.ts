import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';
import { useState } from 'react';
import { GetUnreadMessagesCountResponse } from '@/@types/api-types';

export const useGetUnreadMessagesCount = () => {
  const [data, setData] = useState<GetUnreadMessagesCountResponse | undefined>(undefined);

  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (userId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.getUnreadMessagesCount(userId, {
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
    setData,
  };
};
