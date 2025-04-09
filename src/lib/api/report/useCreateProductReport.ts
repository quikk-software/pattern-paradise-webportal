import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useCreateProductReport = () => {
  const { data: session } = useValidSession();

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
            ...(await getApi(session)),
          },
        ),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
