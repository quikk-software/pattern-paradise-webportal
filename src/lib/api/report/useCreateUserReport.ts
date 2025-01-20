import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useCreateUserReport = () => {
  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (userId: string, reason: string, comment?: string) => {
    await handleFn(
      async () =>
        await client.api.postUserReport(
          userId,
          {
            reason,
            comment,
          },
          {
            ...(await getApi(session?.user.accessToken)),
          },
        ),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
