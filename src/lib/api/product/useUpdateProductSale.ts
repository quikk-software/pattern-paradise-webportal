import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';
import { PutProductSaleRequest } from '@/@types/api-types';

export const useUpdateProductSale = () => {
  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (productId: string, data: PutProductSaleRequest) => {
    await handleFn(
      async () =>
        await client.api.putProductSale(productId, data, {
          ...(await getApi(session)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
