import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useRemoveStripeReferral = () => {
  const { data: session } = useValidSession();
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
