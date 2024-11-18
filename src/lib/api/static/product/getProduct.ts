import { client } from '@/@types';
import logger from '@/lib/core/logger';

export const getProduct = async (productId: string) => {
  try {
    const response = await client.api.getProductById(productId, {
      next: { revalidate: 1 },
    });

    return response.data;
  } catch (error) {
    logger.error(error);
  }
};
