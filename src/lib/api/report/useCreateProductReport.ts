import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useCreateProductReport = () => {
  const { data: session, update } = useSession();

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
            ...(await getApi(session, update)),
          },
        ),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
