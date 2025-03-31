import { client } from '@/@types';
import logger from '@/lib/core/logger';

export const listProductsForShowcase = async () => {
  try {
    const response = await client.api.listProductsForShowcase({
      next: { revalidate: 900 },
    });

    return response.data.products ?? [];
  } catch (error) {
    logger.error(error);
    return [];
  }
};
