import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useRemoveUsersFromTesting = () => {
  const { data: session } = useValidSession();

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
