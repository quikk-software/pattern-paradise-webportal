import { client, getApi } from '@/@types';
import type { PutUserRequest } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

export const useUpdateUser = () => {
  const dispatch = useDispatch();
  const { accessToken, refreshToken, userId } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (data: PutUserRequest) => {
    await handleFn(
      async () =>
        await client.api.putUser(userId, data, {
          ...(await getApi(accessToken, refreshToken, dispatch)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
