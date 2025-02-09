import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  useCaptureOrder,
  useCreateOrder,
  useDeleteOrder,
  useListOrdersByProductId,
} from '@/lib/api/order';
import logger from '@/lib/core/logger';

export function usePayPalOrder(
  productId: string,
  userId: string,
  price: number,
  callback?: (orderId: string) => void,
) {
  const router = useRouter();
  const [customPrice, setCustomPrice] = useState<number | undefined>(undefined);
  const [priceError, setPriceError] = useState<string | null>(null);

  const { mutate: createOrder, isError: createOrderIsError, data: orderData } = useCreateOrder();
  const {
    mutate: captureOrder,
    isSuccess: captureOrderIsSuccess,
    isError: captureOrderIsError,
  } = useCaptureOrder();
  const {
    mutate: deleteOrder,
    isSuccess: deleteOrderIsSuccess,
    isError: deleteOrderIsError,
  } = useDeleteOrder();
  const {
    fetch: fetchOrdersByProductId,
    isLoading: listOrdersByProductIdIsLoading,
    isSuccess: listOrdersByProductIdIsSuccess,
    data: orders,
    setIsSuccess: setListOrdersByProductIdIsSuccess,
  } = useListOrdersByProductId();

  useEffect(() => {
    fetchOrdersByProductId(productId);
  }, [productId]);

  useEffect(() => {
    if (!captureOrderIsSuccess || !orderData?.orderId) {
      return;
    }
    router.push(`/app/secure/auth/me/orders/${orderData.orderId}`);
  }, [captureOrderIsSuccess, orderData, router]);

  useEffect(() => {
    if (!listOrdersByProductIdIsSuccess || !orders || orders.length === 0) {
      return;
    }
    const customerOrder = orders.find((order) => order.customer.id === userId);
    const sellerOrder = orders.find((order) => order.seller.id === userId);

    if (customerOrder) {
      router.push(`/app/secure/auth/me/orders/${customerOrder.id}?action=toggleBuyNow`);
    } else if (sellerOrder) {
      router.push(`/app/secure/sell/orders`);
    }
  }, [listOrdersByProductIdIsSuccess, orders, userId, router]);

  const customPriceRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    customPriceRef.current = customPrice;
  }, [customPrice]);

  const handleCreateOrder = async () => {
    try {
      const priceToUse = customPriceRef.current ?? price;
      const order = orders?.find((order) => order.customer.id === userId);
      if (order?.status === 'CREATED') {
        logger.info("Order with status 'CREATED' for user already exists");
        return order.paypalOrderId;
      }
      const response = await createOrder({
        productId,
        customPrice: priceToUse,
      });
      return response.paypalOrderId;
    } catch (error) {
      logger.error('Error creating order:', error);
      setListOrdersByProductIdIsSuccess(false);
      fetchOrdersByProductId(productId);
      return '';
    }
  };

  const handleCaptureOrder = async (orderID: string) => {
    try {
      const orderId = await captureOrder(orderID);
      callback ? callback(orderId) : window.location.reload();
    } catch (error) {
      logger.error('Error capturing order:', error);
      setListOrdersByProductIdIsSuccess(false);
      fetchOrdersByProductId(productId);
    }
  };

  const handleDeleteOrder = async (orderID: string) => {
    try {
      await deleteOrder(orderID);
      router.push(`/app/products/${productId}`);
    } catch (error) {
      logger.error('Error deleting order:', error);
      setListOrdersByProductIdIsSuccess(false);
      fetchOrdersByProductId(productId);
    }
  };

  const handleCustomPriceChange = (price: number, minPrice: number) => {
    if (price < minPrice) {
      setPriceError(`Price must be at least $${minPrice.toFixed(2)}`);
      setCustomPrice(undefined);
    } else {
      setPriceError(null);
      setCustomPrice(price);
    }
  };

  return {
    customPrice,
    priceError,
    handleCustomPriceChange,
    handleCreateOrder,
    handleCaptureOrder,
    handleDeleteOrder,
    createOrderIsError,
    captureOrderIsError,
    deleteOrderIsError,
    captureOrderIsSuccess,
    deleteOrderIsSuccess,
    listOrdersByProductIdIsLoading,
  };
}
