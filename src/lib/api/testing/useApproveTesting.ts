import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

export const useApproveTesting = () => {
  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (testingId: string) => {
    await handleFn(
      async () =>
        await client.api.approveTesting(testingId, {
          ...(await getApi(accessToken, refreshToken, dispatch)),
        }),
    );
  };

  return {
    ...apiStates,
    fetch,
  };
};
