import { client, getApi } from '@/@types';
import type { PutGalleryImagesRequest } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { Store } from '@/lib/redux/store';
import { useDispatch, useSelector } from 'react-redux';

export const useAddGalleryImages = () => {
  const dispatch = useDispatch();
  const { accessToken, refreshToken, userId } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (data: PutGalleryImagesRequest) => {
    await handleFn(
      async () =>
        await client.api.putGalleryImages(userId, data, {
          ...(await getApi(accessToken, refreshToken, dispatch)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
