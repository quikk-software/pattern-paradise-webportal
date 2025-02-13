import { client } from '@/@types';
import logger from '@/lib/core/logger';

export const listUsers = async ({
  overridePageNumber,
  overridePageSize,
}: {
  overridePageNumber?: number;
  overridePageSize?: number;
}) => {
  try {
    const response = await client.api.listUsers(
      {
        pageNumber: overridePageNumber ?? 1,
        pageSize: overridePageSize ?? 20,
      },
      {
        next: { revalidate: 1 },
      },
    );

    return response.data.users ?? [];
  } catch (error) {
    logger.error(error);
    return [];
  }
};
