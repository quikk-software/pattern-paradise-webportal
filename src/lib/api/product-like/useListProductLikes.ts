import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetProductLikeResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { usePagination } from '@/lib/api/usePagination';
import { useSession } from 'next-auth/react';

export const useListProductLikes = ({
  pageNumber = 1,
  pageSize = 20,
}: {
  pageNumber?: number;
  pageSize?: number;
}) => {
  const [data, setData] = useState<GetProductLikeResponse[]>([]);

  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();
  const pagination = usePagination(pageNumber, pageSize);

  const fetch = async (
    isSwipeLike?: boolean,
    customPageNumber?: number,
    customPageSize?: number,
  ) => {
    const response = await handleFn(
      async () =>
        await client.api.listProductLikes(
          {
            pageNumber: customPageNumber ?? pagination.pageNumber,
            pageSize: customPageSize ?? pagination.pageSize,
            isSwipeLike,
          },
          {
            ...(await getApi(session)),
          },
        ),
    );

    setData(response?.data.productLikes ?? []);

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
