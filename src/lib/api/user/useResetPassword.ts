import { client } from '@/@types';
import type { ResetPasswordRequest } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';

export const useResetPassword = () => {
  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (data: ResetPasswordRequest) => {
    await handleFn(async () => await client.api.resetPassword(data));
  };

  return {
    ...apiStates,
    mutate,
  };
};
