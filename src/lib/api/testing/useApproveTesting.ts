import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useApproveTesting = () => {
  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (testingId: string) => {
    await handleFn(
      async () =>
        await client.api.approveTesting(testingId, {
          ...(await getApi(session?.user.accessToken)),
        }),
    );
  };

  return {
    ...apiStates,
    fetch,
  };
};
