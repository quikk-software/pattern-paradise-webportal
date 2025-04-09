import { client, getApi } from '@/@types';
import type { PutTestingRequest } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useUpdateTesting = () => {
  const { data: session } = useValidSession();

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
