import { client, getApi } from '@/@types';
import type { PutDeviceTokenRequest } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useUpdateDeviceToken = () => {
  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (userId: string, data: PutDeviceTokenRequest) => {
    if (!userId) return;
    await handleFn(
      async () =>
        await client.api.putDeviceToken(userId, data, {
          ...(await getApi(session)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
