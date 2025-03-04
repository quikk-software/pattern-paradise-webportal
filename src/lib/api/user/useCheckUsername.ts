import { client } from '@/@types';
import { useApiStates } from '../useApiStates';

export const useCheckUsername = () => {
  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (username: string) => {
    await handleFn(
      async () =>
        await client.api.checkUsername({
          username,
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
