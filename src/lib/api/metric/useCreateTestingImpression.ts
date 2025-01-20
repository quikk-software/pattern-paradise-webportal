import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useCreateTestingImpression = () => {
  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (productId: string) => {
    await handleFn(
      async () =>
        await client.api.postTestingImpression(productId, {
          ...(await getApi(session?.user.accessToken)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
