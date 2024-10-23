import { client } from '@/@types';
import logger from '@/lib/core/logger';

export const listProducts = async () => {
  try {
    const response = await client.api.listProducts(
      {
        pageNumber: 1,
        pageSize: 20,
      },
      {
        next: { revalidate: 1 },
      },
    );

    const data = await response.json();

    return data.products;
  } catch (error) {
    logger.error(error);
    return [];
  }
};
