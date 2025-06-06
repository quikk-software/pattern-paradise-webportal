import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { PostTestingCommentRequest, GetTestingCommentResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useCreateTestingComment = () => {
  const [data, setData] = useState<GetTestingCommentResponse | undefined>(undefined);

  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (testingComment: PostTestingCommentRequest) => {
    const response = await handleFn(
      async () =>
        await client.api.postTestingComment(testingComment, {
          ...(await getApi(session)),
        }),
    );

    setData(response?.data);

    return response?.data;
  };

  return {
    ...apiStates,
    mutate,
    data,
  };
};
