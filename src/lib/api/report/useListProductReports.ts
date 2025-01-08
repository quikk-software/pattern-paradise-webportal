import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetProductReportResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { usePagination } from '@/lib/api/usePagination';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { combineArraysById } from '@/lib/core/utils';

export const useListProductReports = ({
  pageNumber = 1,
  pageSize = 20,
}: {
  pageNumber?: number;
  pageSize?: number;
}) => {
  const [data, setData] = useState<GetProductReportResponse[]>([]);

  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

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
            ...(await getApi(accessToken, refreshToken, dispatch)),
          },
        ),
    );

    setData((p) => [...combineArraysById(p, response?.data.productReports ?? [], 'id')]);

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
