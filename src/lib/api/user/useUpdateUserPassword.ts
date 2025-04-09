import { client, getApi } from '@/@types';
import type { PutUserPasswordRequest } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useUpdateUserPassword = () => {
  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (userId: string, data: PutUserPasswordRequest) => {
    await handleFn(
      async () =>
        await client.api.putUserPassword(userId, data, {
          ...(await getApi(session)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
