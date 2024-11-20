import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

export const useCancelSubscription = () => {
  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (subscriptionId: string) => {
    await handleFn(
      async () =>
        await client.api.cancelSubscription(subscriptionId, {
          ...(await getApi(accessToken, refreshToken, dispatch)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
