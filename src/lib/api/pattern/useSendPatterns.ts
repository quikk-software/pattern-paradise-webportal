import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useSendPatterns = () => {
  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (patternId: string, language: string, channel: string) => {
    await handleFn(
      async () =>
        await client.api.sendPatterns(
          patternId,
          {
            language,
            channel,
          },
          {
            ...(await getApi(session)),
          },
        ),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
