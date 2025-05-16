import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useGetTesterCallPreviewImage = () => {
  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (productId: string, theme: string) => {
    const response = await handleFn(
      async () =>
        await client.api.getTesterCallImage(
          productId,
          {
            theme,
          },
          {
            ...(await getApi(session)),
          },
        ),
    );

    return await response.blob();
  };

  return {
    ...apiStates,
    fetch,
  };
};
