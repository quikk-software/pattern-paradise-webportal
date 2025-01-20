import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useDeclineTesting = () => {
  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (testingId: string) => {
    await handleFn(
      async () =>
        await client.api.declineTesting(testingId, {
          ...(await getApi(session?.user.accessToken)),
        }),
    );
  };

  return {
    ...apiStates,
    fetch,
  };
};
