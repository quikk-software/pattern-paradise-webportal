import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { PostTestingCommentRequest, GetTestingCommentResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

export const useCreateTestingComment = () => {
  const [data, setData] = useState<GetTestingCommentResponse | undefined>(undefined);

  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (testingComment: PostTestingCommentRequest) => {
    const response = await handleFn(
      async () =>
        await client.api.postTestingComment(testingComment, {
          ...(await getApi(accessToken, refreshToken, dispatch)),
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
