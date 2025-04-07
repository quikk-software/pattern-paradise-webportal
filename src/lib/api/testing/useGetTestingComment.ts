import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useState } from 'react';
import type { GetTestingCommentResponse } from '@/@types/api-types';
import { useSession } from 'next-auth/react';

export const useGetTestingComment = () => {
  const [data, setData] = useState<GetTestingCommentResponse | undefined>(undefined);

  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (testingId: string, userId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.getTestingReviewComment(testingId, userId, {
          ...(await getApi(session)),
        }),
    );

    setData(response?.data);

    return response?.data;
  };

  return {
    ...apiStates,
    data,
    fetch,
  };
};
