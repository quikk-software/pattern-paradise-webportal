import { client, getApi } from '@/@types';
import type { PostSubscriptionRequest } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useCreateSubscription = () => {
  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (subscription: PostSubscriptionRequest) => {
    await handleFn(
      async () =>
        await client.api.postSubscription(subscription, {
          ...(await getApi(session?.user.accessToken)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
