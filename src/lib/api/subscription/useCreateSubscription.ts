import { client, getApi } from '@/@types';
import type { PostSubscriptionRequest } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

export const useCreateSubscription = () => {
  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (subscription: PostSubscriptionRequest) => {
    await handleFn(
      async () =>
        await client.api.postSubscription(subscription, {
          ...(await getApi(accessToken, refreshToken, dispatch)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
