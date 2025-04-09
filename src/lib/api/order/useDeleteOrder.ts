import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useDeleteOrder = () => {
  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (orderId: string) => {
    await handleFn(
      async () =>
        await client.api.deleteOrder(orderId, {
          ...(await getApi(session)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
