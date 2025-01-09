import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { useCookies } from 'next-client-cookies';

export const useRemovePayPalReferral = () => {
  const cookieStore = useCookies();
  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);
  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (userId: string) => {
    await handleFn(
      async () =>
        await client.api.deleteUserPayPalReferral(userId, {
          ...(await getApi(accessToken, refreshToken, dispatch, cookieStore)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
