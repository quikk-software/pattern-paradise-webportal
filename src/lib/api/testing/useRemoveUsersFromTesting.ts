import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useRemoveUsersFromTesting = () => {
  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (testingId: string, testerIds: string[]) => {
    await handleFn(
      async () =>
        await client.api.removeUsersFromTesting(
          testingId,
          { testerIds },
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
