import { client, getApi } from '@/@types';
import type { PutTestingRequest } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useUpdateTesting = () => {
  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (testingId: string, testing: PutTestingRequest) => {
    await handleFn(
      async () =>
        await client.api.putTesting(testingId, testing, {
          ...(await getApi(session)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
