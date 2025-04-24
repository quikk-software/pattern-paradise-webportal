import { client, getBearerToken } from '@/@types';
import logger from '@/lib/core/logger';

export const listUsers = async (
  {
    overridePageNumber,
    overridePageSize,
  }: {
    overridePageNumber?: number;
    overridePageSize?: number;
  },
  accessToken: string,
) => {
  try {
    const response = await client.api.listUsers(
      {
        pageNumber: overridePageNumber ?? 1,
        pageSize: overridePageSize ?? 20,
      },
      {
        ...getBearerToken(accessToken),
        next: { revalidate: 1 },
      },
    );

    return response.data.users ?? [];
  } catch (error) {
    logger.error(error);
    return [];
  }
};
