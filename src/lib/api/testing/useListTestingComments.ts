import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetTestingCommentResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { usePagination } from '@/lib/api/usePagination';
import { combineArraysById } from '@/lib/core/utils';
import { useSession } from 'next-auth/react';

export const useListTestingComments = ({
  pageNumber = 1,
  pageSize = 20,
}: {
  pageNumber?: number;
  pageSize?: number;
}) => {
  const [data, setData] = useState<GetTestingCommentResponse[]>([]);

  const { data: session, update } = useSession();

  const { handleFn, ...apiStates } = useApiStates();
  const pagination = usePagination(pageNumber, pageSize);

  const fetch = async (
    testingId: string,
    {
      overridePageNumber,
      overridePageSize,
    }: { overridePageNumber?: number; overridePageSize?: number },
  ) => {
    const response = await handleFn(
      async () =>
        await client.api.listTestingCommentsByTestingId(
          testingId,
          {
            pageNumber: overridePageNumber ?? pagination.pageNumber,
            pageSize: overridePageSize ?? pagination.pageSize,
          },
          { ...(await getApi(session, update)) },
        ),
    );

    setData((p) => [...combineArraysById(p, response?.data.testingComments ?? [], 'id')]);

    pagination.handlePaginationPayload(response?.data);

    return response?.data;
  };

  return {
    ...apiStates,
    ...pagination,
    fetch,
    data,
  };
};
