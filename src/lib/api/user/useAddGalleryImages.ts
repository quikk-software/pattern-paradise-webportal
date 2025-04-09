import { client, getApi } from '@/@types';
import type { PutGalleryImagesRequest } from '@/@types/api-types';
import { useValidSession } from '@/hooks/useValidSession';
import { useApiStates } from '@/lib/api/useApiStates';

export const useAddGalleryImages = () => {
  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (userId: string, data: PutGalleryImagesRequest) => {
    await handleFn(
      async () =>
        await client.api.putGalleryImages(userId, data, {
          ...(await getApi(session)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
