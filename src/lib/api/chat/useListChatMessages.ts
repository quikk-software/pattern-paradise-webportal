import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetChatMessageResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { usePagination } from '@/lib/api/usePagination';
import { combineArraysById } from '@/lib/core/utils';
import { useSession } from 'next-auth/react';

export const useListChatMessages = ({
  pageNumber = 1,
  pageSize = 20,
}: {
  pageNumber?: number;
  pageSize?: number;
}) => {
  const [data, setData] = useState<GetChatMessageResponse[]>([]);

  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();
  const pagination = usePagination(pageNumber, pageSize);

  const fetch = async (chatId: string, customPageNumber?: number, customPageSize?: number) => {
    const response = await handleFn(
      async () =>
        await client.api.listChatMessages(
          chatId,
          {
            pageNumber: customPageNumber ?? pagination.pageNumber,
            pageSize: customPageSize ?? pagination.pageSize,
          },
          {
            ...(await getApi(session)),
          },
        ),
    );

    setData((p) => [...combineArraysById(p, response?.data.chatMessages ?? [], 'id')]);

    pagination.handlePaginationPayload(response?.data);

    return response?.data.chatMessages;
  };

  return {
    ...apiStates,
    ...pagination,
    fetch,
    data,
  };
};
