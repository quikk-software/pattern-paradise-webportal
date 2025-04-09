import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useApproveTesting = () => {
  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (testingId: string) => {
    await handleFn(
      async () =>
        await client.api.approveTesting(testingId, {
          ...(await getApi(session)),
        }),
    );
  };

  return {
    ...apiStates,
    fetch,
  };
};
