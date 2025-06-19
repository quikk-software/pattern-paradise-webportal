'use client';

import { createContext, useContext, type ReactNode, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateOrderPayPal, useDeleteOrder, useListOrdersByProductId } from '@/lib/api/order';
import logger from '@/lib/core/logger';
import { MAX_PRICE } from '@/lib/constants';
import type { GetOrderResponse } from '@/@types/api-types';

type PayPalOrderContextType = {
  customPrice: number | undefined;
  priceError: string | null;
  orderId: string | null;
  handleCustomPriceChange: (price: number, minPrice: number) => void;
  handleCreateOrder: (order?: GetOrderResponse) => Promise<string>;
  handleDeleteOrder: (orderID: string) => Promise<void>;
  createOrderIsError: boolean;
  createOrderErrorDetail?: string;
  deleteOrderIsError: boolean;
  deleteOrderIsSuccess: boolean;
  listOrdersByProductIdIsLoading: boolean;
  order: GetOrderResponse | undefined;
  country?: string;
  setCountry: (country?: string) => void;
};

const PayPalOrderContext = createContext<PayPalOrderContextType | undefined>(undefined);

type PayPalOrderProviderProps = {
  children: ReactNode;
  productId: string;
  userId: string;
  price: number;
  currency?: string;
};

export function PayPalOrderProvider({
  children,
  productId,
  userId,
  price,
  currency,
}: PayPalOrderProviderProps) {
  const router = useRouter();
  const [customPrice, setCustomPrice] = useState<number | undefined>(undefined);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [country, setCountry] = useState<string | undefined>(undefined);

  const {
    mutate: createOrder,
    isError: createOrderIsError,
    errorDetail: createOrderErrorDetail,
  } = useCreateOrderPayPal();
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

  const customPriceRef = useRef<number | undefined>(undefined);
  const countryRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    fetchOrdersByProductId(productId);
  }, [productId]);

  useEffect(() => {
    if (!listOrdersByProductIdIsSuccess || !orders || orders.length === 0) {
      return;
    }
    const customerOrder = orders.find((order) => order.customer.id === userId);

    if (customerOrder?.status === 'COMPLETED' || customerOrder?.status === 'CAPTURED') {
      router.push(`/app/secure/auth/me/orders/${customerOrder.id}?action=toggleBuyNow`);
    }
  }, [listOrdersByProductIdIsSuccess, orders, userId, router]);

  useEffect(() => {
    customPriceRef.current = customPrice;
  }, [customPrice]);

  useEffect(() => {
    countryRef.current = country;
  }, [country]);

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
        selfSelectedCountry: countryRef.current,
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
      setPriceError(`Price must be at least ${currency ?? ''}${minPrice.toFixed(2)}`);
      setCustomPrice(undefined);
    } else if (price > MAX_PRICE) {
      setPriceError(`Price cannot be greater than ${currency ?? ''}${MAX_PRICE.toFixed(2)}`);
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
    createOrderErrorDetail,
    deleteOrderIsError,
    deleteOrderIsSuccess,
    listOrdersByProductIdIsLoading,
    order,
    country,
    setCountry,
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
