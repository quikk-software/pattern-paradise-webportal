import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useDeclineTesting = () => {
  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (testingId: string) => {
    await handleFn(
      async () =>
        await client.api.declineTesting(testingId, {
          ...(await getApi(session)),
        }),
    );
  };

  return {
    ...apiStates,
    fetch,
  };
};
