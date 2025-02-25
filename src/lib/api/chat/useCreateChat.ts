import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useCreateChat = () => {
  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (participantIds: string[]) => {
    const response = await handleFn(
      async () =>
        await client.api.postChat(
          { participantIds },
          {
            ...(await getApi(session)),
          },
        ),
    );

    return response.data.chatId;
  };

  return {
    ...apiStates,
    mutate,
  };
};
