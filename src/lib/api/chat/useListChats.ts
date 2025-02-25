import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetChatResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useListChats = () => {
  const [data, setData] = useState<GetChatResponse[]>([]);

  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (userId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.listChatsByUserId(userId, {
          ...(await getApi(session)),
        }),
    );

    setData(response.data.chats);

    return response?.data.chats;
  };

  return {
    ...apiStates,
    fetch,
    data,
  };
};
