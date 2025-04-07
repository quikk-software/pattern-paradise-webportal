'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateOrderPayPal, useDeleteOrder, useListOrdersByProductId } from '@/lib/api/order';
import logger from '@/lib/core/logger';
import { MAX_PRICE } from '@/lib/constants';
import type { GetOrderResponse } from '@/@types/api-types';
import { useState, useEffect, useRef } from 'react';

type PayPalOrderContextType = {
  customPrice: number | undefined;
  priceError: string | null;
  orderId: string | null;
  handleCustomPriceChange: (price: number, minPrice: number) => void;
  handleCreateOrder: (order?: GetOrderResponse) => Promise<string>;
  handleDeleteOrder: (orderID: string) => Promise<void>;
  createOrderIsError: boolean;
  deleteOrderIsError: boolean;
  deleteOrderIsSuccess: boolean;
  listOrdersByProductIdIsLoading: boolean;
  order: GetOrderResponse | undefined;
};

const PayPalOrderContext = createContext<PayPalOrderContextType | undefined>(undefined);

type PayPalOrderProviderProps = {
  children: ReactNode;
  productId: string;
  userId: string;
  price: number;
};

export function PayPalOrderProvider({
  children,
  productId,
  userId,
  price,
}: PayPalOrderProviderProps) {
  const router = useRouter();
  const [customPrice, setCustomPrice] = useState<number | undefined>(undefined);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const { mutate: createOrder, isError: createOrderIsError } = useCreateOrderPayPal();
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
    if (!listOrdersByProductIdIsSuccess || !orders || orders.length === 0) {
      return;
    }
    const customerOrder = orders.find((order) => order.customer.id === userId);

    if (customerOrder) {
      router.push(`/app/secure/auth/me/orders/${customerOrder.id}?action=toggleBuyNow`);
    }
  }, [listOrdersByProductIdIsSuccess, orders, userId, router]);

  const customPriceRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    customPriceRef.current = customPrice;
  }, [customPrice]);

  const handleCreateOrder = async (order?: GetOrderResponse) => {
    try {
      setOrderId(null);
      const priceToUse = customPriceRef.current ?? price;
      if (order?.status === 'CREATED') {
        logger.info("Order with status 'CREATED' for user already exists");
        return order.paypalOrderId;
      }
      const response = await createOrder({
        productId,
        customPrice: priceToUse,
      });
      setOrderId(response?.orderId ?? null);
      return response.paypalOrderId;
    } catch (error) {
      logger.error('Error creating order:', error);
      setListOrdersByProductIdIsSuccess(false);
      fetchOrdersByProductId(productId);
      return '';
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
    } else if (price > MAX_PRICE) {
      setPriceError(`Price cannot be greater than $${MAX_PRICE.toFixed(2)}`);
      setCustomPrice(undefined);
    } else {
      setPriceError(null);
      setCustomPrice(price);
    }
  };

  const order = orders?.find((order) => order.customer.id === userId);

  const contextValue: PayPalOrderContextType = {
    customPrice,
    priceError,
    orderId,
    handleCustomPriceChange,
    handleCreateOrder,
    handleDeleteOrder,
    createOrderIsError,
    deleteOrderIsError,
    deleteOrderIsSuccess,
    listOrdersByProductIdIsLoading,
    order,
  };

  return <PayPalOrderContext.Provider value={contextValue}>{children}</PayPalOrderContext.Provider>;
}

export function usePayPalOrderContext() {
  const context = useContext(PayPalOrderContext);

  if (context === undefined) {
    throw new Error('usePayPalOrderContext must be used within a PayPalOrderProvider');
  }

  return context;
}
