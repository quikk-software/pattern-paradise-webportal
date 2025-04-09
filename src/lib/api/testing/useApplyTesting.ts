import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useApplyTesting = () => {
  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (testingId: string) => {
    await handleFn(
      async () =>
        await client.api.applyTesting(testingId, {
          ...(await getApi(session)),
        }),
    );
  };

  return {
    ...apiStates,
    fetch,
  };
};
