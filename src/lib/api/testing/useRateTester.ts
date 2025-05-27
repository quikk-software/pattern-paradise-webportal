import { client, getApi } from '@/@types';
import type { PostRateTesterRequest } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useRateTester = () => {
  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (testingId: string, data: PostRateTesterRequest) => {
    await handleFn(
      async () =>
        await client.api.rateTester(testingId, data, {
          ...(await getApi(session)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
