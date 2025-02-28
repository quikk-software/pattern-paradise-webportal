import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useBlockChat = () => {
  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (chatId: string, userId: string) => {
    await handleFn(
      async () =>
        await client.api.blockChat(chatId, userId, {
          ...(await getApi(session)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
