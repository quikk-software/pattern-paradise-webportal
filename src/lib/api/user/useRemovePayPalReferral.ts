import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useRemovePayPalReferral = () => {
  const { data: session } = useSession();
  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (userId: string) => {
    await handleFn(
      async () =>
        await client.api.deleteUserPayPalReferral(userId, {
          ...(await getApi(session?.user.accessToken)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
