import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetPatternResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { usePagination } from '@/lib/api/usePagination';
import { combineArraysById } from '@/lib/core/utils';
import { PatternFilterObject } from '@/lib/constants';
import { useValidSession } from '@/hooks/useValidSession';

export const useListPatterns = ({
  pageNumber = 1,
  pageSize = 20,
}: {
  pageNumber?: number;
  pageSize?: number;
}) => {
  const [data, setData] = useState<GetPatternResponse[]>([]);

  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();
  const pagination = usePagination(pageNumber, pageSize);

  const fetch = async (filter?: PatternFilterObject) => {
    const response = await handleFn(
      async () =>
        await client.api.listPatterns(
          {
            pageNumber: filter?.pageNumber ?? pagination.pageNumber,
            pageSize: filter?.pageSize ?? pagination.pageSize,
            ...filter,
          },
          {
            ...(await getApi(session)),
          },
        ),
    );

    setData((p) => [...combineArraysById(p, response?.data.patterns ?? [], 'orderId')]);

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
