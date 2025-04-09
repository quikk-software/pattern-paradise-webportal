import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetUserReportResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { usePagination } from '@/lib/api/usePagination';
import { useValidSession } from '@/hooks/useValidSession';

export const useListUserReports = ({
  pageNumber = 1,
  pageSize = 20,
}: {
  pageNumber?: number;
  pageSize?: number;
}) => {
  const [data, setData] = useState<GetUserReportResponse[]>([]);

  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();
  const pagination = usePagination(pageNumber, pageSize, false);

  const fetch = async (
    customPageNumber?: number,
    customPageSize?: number,
    direction?: 'asc' | 'desc',
    userId?: string,
    status?: string,
    reason?: string,
  ) => {
    const response = await handleFn(
      async () =>
        await client.api.listUserReports(
          {
            pageNumber: customPageNumber ?? pagination.pageNumber,
            pageSize: customPageSize ?? pagination.pageSize,
            direction,
            userId,
            status,
            reason,
          },
          {
            ...(await getApi(session)),
          },
        ),
    );

    setData(response?.data.userReports);

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
