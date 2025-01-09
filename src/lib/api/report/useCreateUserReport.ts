import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

export const useCreateUserReport = () => {
  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (userId: string, reason: string, comment?: string) => {
    await handleFn(
      async () =>
        await client.api.postUserReport(
          userId,
          {
            reason,
            comment,
          },
          {
            ...(await getApi(accessToken, refreshToken, dispatch)),
          },
        ),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
