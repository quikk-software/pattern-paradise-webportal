import { client } from '@/@types';
import logger from '@/lib/core/logger';

export const listProducts = async ({
  overridePageNumber,
  overridePageSize,
  categories,
}: {
  overridePageNumber?: number;
  overridePageSize?: number;
  categories?: string[];
}) => {
  try {
    const response = await client.api.listProducts(
      {
        pageNumber: overridePageNumber ?? 1,
        pageSize: overridePageSize ?? 20,
        status: 'Released',
        categories,
      },
      {
        next: { revalidate: 1 },
      },
    );

    return response.data.products ?? [];
  } catch (error) {
    logger.error(error);
    return [];
  }
};
