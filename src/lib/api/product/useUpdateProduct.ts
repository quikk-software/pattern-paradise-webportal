import { client, getApi } from '@/@types';
import type { PutProductRequest } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useUpdateProduct = () => {
  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (productId: string, product: PutProductRequest) => {
    await handleFn(
      async () =>
        await client.api.putProduct(productId, product, {
          ...(await getApi(session)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
