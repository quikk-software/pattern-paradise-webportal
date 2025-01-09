import { client, getApi } from '@/@types';
import type { PutProductRequest } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { useCookies } from 'next-client-cookies';

export const useUpdateProduct = () => {
  const cookieStore = useCookies();
  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (productId: string, product: PutProductRequest) => {
    await handleFn(
      async () =>
        await client.api.putProduct(productId, product, {
          ...(await getApi(accessToken, refreshToken, dispatch, cookieStore)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
