import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { Store } from '@/lib/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'next-client-cookies';

export const useDeleteGalleryImage = () => {
  const cookieStore = useCookies();
  const dispatch = useDispatch();
  const { accessToken, refreshToken, userId } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (imageUrl: string) => {
    await handleFn(
      async () =>
        await client.api.deleteGalleryImage(
          userId,
          { imageUrl },
          {
            ...(await getApi(accessToken, refreshToken, dispatch, cookieStore)),
          },
        ),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
