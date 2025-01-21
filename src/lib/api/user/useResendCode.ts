import { client, getApi } from '@/@types';
import type { ResendCodeRequest } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useResendCode = () => {
  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (data: ResendCodeRequest) => {
    await handleFn(
      async () =>
        await client.api.resendCode(data, {
          ...(await getApi(session)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
