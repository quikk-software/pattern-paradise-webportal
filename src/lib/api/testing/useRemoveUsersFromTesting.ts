import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { useCookies } from 'next-client-cookies';

export const useRemoveUsersFromTesting = () => {
  const cookieStore = useCookies();
  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (testingId: string, testerIds: string[]) => {
    await handleFn(
      async () =>
        await client.api.removeUsersFromTesting(
          testingId,
          { testerIds },
          {
            ...(await getApi(accessToken, refreshToken, dispatch, cookieStore)),
          },
        ),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
