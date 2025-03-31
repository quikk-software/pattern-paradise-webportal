import { client, getApi } from '@/@types';
import type { PostDeviceTokenRequest } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useCreateDeviceToken = () => {
  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (userId: string, data: PostDeviceTokenRequest) => {
    if (!userId) return;
    await handleFn(
      async () =>
        await client.api.postDeviceToken(userId, data, {
          ...(await getApi(session)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
