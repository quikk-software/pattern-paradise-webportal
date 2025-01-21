import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useCreateProductImpression = () => {
  const { data: session, update } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (productId: string) => {
    await handleFn(
      async () =>
        await client.api.postProductImpression(productId, {
          ...(await getApi(session, update)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
