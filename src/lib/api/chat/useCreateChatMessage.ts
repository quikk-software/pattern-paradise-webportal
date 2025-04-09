import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';
import { PostChatMessageRequest } from '@/@types/api-types';

export const useCreateChatMessage = () => {
  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (chatId: string, data: PostChatMessageRequest) => {
    const response = await handleFn(
      async () =>
        await client.api.postChatMessage(chatId, data, {
          ...(await getApi(session)),
        }),
    );

    return response.data;
  };

  return {
    ...apiStates,
    mutate,
  };
};
