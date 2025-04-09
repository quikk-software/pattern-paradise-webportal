import { client, getApi } from '@/@types';
import type { PostSubscriptionRequest } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useCreateSubscription = () => {
  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (subscription: PostSubscriptionRequest) => {
    await handleFn(
      async () =>
        await client.api.postSubscription(subscription, {
          ...(await getApi(session)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
