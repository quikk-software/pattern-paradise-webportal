import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useCreateChat = () => {
  const { data: session } = useValidSession();

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
