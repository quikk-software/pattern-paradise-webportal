import { client } from '@/@types';
import type { RequestPasswordRequest } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';

export const useRequestPassword = () => {
  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (data: RequestPasswordRequest) => {
    await handleFn(async () => await client.api.requestPassword(data));
  };

  return {
    ...apiStates,
    mutate,
  };
};
