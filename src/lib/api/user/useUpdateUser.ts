import { client, getApi } from '@/@types';
import type { PutUserRequest } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useUpdateUser = () => {
  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (userId: string, data: PutUserRequest) => {
    await handleFn(
      async () =>
        await client.api.putUser(userId, data, {
          ...(await getApi(session)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
