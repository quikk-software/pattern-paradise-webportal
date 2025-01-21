import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useDeleteProduct = () => {
  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (productId: string) => {
    await handleFn(
      async () =>
        await client.api.deleteProduct(productId, {
          ...(await getApi(session)),
        }),
    );
  };

  return {
    ...apiStates,
    fetch,
  };
};
