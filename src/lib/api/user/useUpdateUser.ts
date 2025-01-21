import { client, getApi } from '@/@types';
import type { PutUserRequest } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useUpdateUser = () => {
  const { data: session, update } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (userId: string, data: PutUserRequest) => {
    await handleFn(
      async () =>
        await client.api.putUser(userId, data, {
          ...(await getApi(session, update)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
