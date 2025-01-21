import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetProductReportResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { usePagination } from '@/lib/api/usePagination';
import { useSession } from 'next-auth/react';

export const useListProductReports = ({
  pageNumber = 1,
  pageSize = 20,
}: {
  pageNumber?: number;
  pageSize?: number;
}) => {
  const [data, setData] = useState<GetProductReportResponse[]>([]);

  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();
  const pagination = usePagination(pageNumber, pageSize);

  const fetch = async (
    customPageNumber?: number,
    customPageSize?: number,
    direction?: 'asc' | 'desc',
    userId?: string,
    productId?: string,
    status?: string,
    reason?: string,
  ) => {
    const response = await handleFn(
      async () =>
        await client.api.listProductReports(
          {
            pageNumber: customPageNumber ?? pagination.pageNumber,
            pageSize: customPageSize ?? pagination.pageSize,
            direction,
            userId,
            productId,
            status,
            reason,
          },
          {
            ...(await getApi(session)),
          },
        ),
    );

    setData(response?.data.productReports ?? []);

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
