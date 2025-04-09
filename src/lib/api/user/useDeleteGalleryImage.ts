import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useDeleteGalleryImage = () => {
  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (imageUrl: string, userId: string) => {
    await handleFn(
      async () =>
        await client.api.deleteGalleryImage(
          userId,
          { imageUrl },
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
