import { client, getApi } from '@/@types';
import type { ResendCodeRequest } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { useCookies } from 'next-client-cookies';

export const useResendCode = () => {
  const cookieStore = useCookies();
  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (data: ResendCodeRequest) => {
    await handleFn(
      async () =>
        await client.api.resendCode(data, {
          ...(await getApi(accessToken, refreshToken, dispatch, cookieStore)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
