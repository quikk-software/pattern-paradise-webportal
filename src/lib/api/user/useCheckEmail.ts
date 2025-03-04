import { client } from '@/@types';
import { useApiStates } from '../useApiStates';

export const useCheckEmail = () => {
  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (email: string) => {
    await handleFn(
      async () =>
        await client.api.checkEmail({
          email,
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
