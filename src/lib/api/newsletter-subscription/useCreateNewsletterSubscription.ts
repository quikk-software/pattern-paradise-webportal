import { client } from '@/@types';
import type { PostNewsletterSubscriptionRequest } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';

export const useCreateNewsletterSubscription = () => {
  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (data: PostNewsletterSubscriptionRequest) => {
    await handleFn(async () => await client.api.postNewsletterSubscription(data));
  };

  return {
    ...apiStates,
    mutate,
  };
};
