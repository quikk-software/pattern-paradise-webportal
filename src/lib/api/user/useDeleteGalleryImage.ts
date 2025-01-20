import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useDeleteGalleryImage = () => {
  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (imageUrl: string, userId: string) => {
    await handleFn(
      async () =>
        await client.api.deleteGalleryImage(
          userId,
          { imageUrl },
          {
            ...(await getApi(session?.user.accessToken)),
          },
        ),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
