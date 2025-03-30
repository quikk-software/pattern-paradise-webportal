import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useDeleteDeviceToken = () => {
  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (userId: string, deviceToken: string) => {
    await handleFn(
      async () =>
        await client.api.deleteDeviceToken(userId, deviceToken, {
          ...(await getApi(session)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
