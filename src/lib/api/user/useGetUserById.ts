import { useState } from 'react';
import { client } from '@/@types';
import type { GetUserAccountResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';

export const useGetUserById = () => {
  const [data, setData] = useState<GetUserAccountResponse | undefined>(undefined);

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (userId: string) => {
    const response = await handleFn(async () => await client.api.getUserById(userId));

    setData(response.data);

    return response.data;
  };

  return {
    ...apiStates,
    fetch,
    data,
  };
};
