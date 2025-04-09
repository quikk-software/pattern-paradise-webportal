import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useDeleteProduct = () => {
  const { data: session } = useValidSession();

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
