import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useRemoveStripeReferral = () => {
  const { data: session } = useSession();
  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (userId: string) => {
    await handleFn(
      async () =>
        await client.api.deleteUserStripeReferral(userId, {
          ...(await getApi(session)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
