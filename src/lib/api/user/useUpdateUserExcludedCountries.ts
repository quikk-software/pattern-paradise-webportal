import { client, getApi } from '@/@types';
import type { PutUserExcludedCountriesRequest } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useUpdateUserExcludedCountries = () => {
  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (userId: string, data: PutUserExcludedCountriesRequest) => {
    await handleFn(
      async () =>
        await client.api.putUserExcludedCountries(userId, data, {
          ...(await getApi(session)),
        }),
    );
  };

  return {
    ...apiStates,
    mutate,
  };
};
