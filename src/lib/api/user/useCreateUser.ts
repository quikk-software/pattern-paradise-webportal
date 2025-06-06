import { useState } from 'react';
import { client } from '@/@types';
import type { PostUserRequest, PostUserResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';

export const useCreateUser = () => {
  const [data, setData] = useState<PostUserResponse | undefined>(undefined);

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (data: PostUserRequest) => {
    const response = await handleFn(async () => await client.api.postUser(data));

    setData(response?.data);

    return response?.data;
  };

  return {
    ...apiStates,
    mutate,
    data,
  };
};
