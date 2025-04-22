import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useState } from 'react';
import type { GetUnreadMessagesCountResponse } from '@/@types/api-types';
import { useValidSession } from '@/hooks/useValidSession';

export const useGetUnreadTestingCommentsCount = () => {
  const [data, setData] = useState<GetUnreadMessagesCountResponse | undefined>(undefined);

  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (userId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.getUnreadTestingCommentsCount(userId, {
          ...(await getApi(session)),
        }),
    );

    setData(response?.data);

    return response?.data;
  };

  return {
    ...apiStates,
    data,
    fetch,
  };
};
