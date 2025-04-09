import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useCreateProductLike = () => {
  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (productId: string, isSwipeLike: boolean) => {
    await handleFn(
      async () =>
        await client.api.postProductLike(
          {
            productId,
            isSwipeLike,
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
