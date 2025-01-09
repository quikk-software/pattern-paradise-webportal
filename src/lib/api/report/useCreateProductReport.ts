import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

export const useCreateProductReport = () => {
  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (productId: string, reason: string, comment?: string) => {
    await handleFn(
      async () =>
        await client.api.postProductReport(
          productId,
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
