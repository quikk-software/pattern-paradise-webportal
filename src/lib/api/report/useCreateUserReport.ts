import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useCreateUserReport = () => {
  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (userId: string, reason: string, comment?: string) => {
    await handleFn(
      async () =>
        await client.api.postUserReport(
          userId,
          {
            reason,
            comment,
          },
          {
            ...(await getApi(session)),
          },
        ),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
