import { client } from '@/@types';
import logger from '@/lib/core/logger';

export const listProducts = async () => {
  try {
    const response = await client.api.listProducts(
      {
        pageNumber: 1,
        pageSize: 20,
        status: 'Released',
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
