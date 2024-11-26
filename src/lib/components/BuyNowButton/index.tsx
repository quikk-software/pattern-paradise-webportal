'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useCaptureOrder, useCreateOrder, useListOrdersByProductId } from '@/lib/api/order';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import logger from '@/lib/core/logger';
import RequestStatus from '@/lib/components/RequestStatus';
import { useRouter } from 'next/navigation';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { InfoBoxComponent } from '@/components/info-box';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import Link from 'next/link';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { ShieldCheck, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isTokenValid } from '@/lib/auth/auth.utils';
import QuickSignUp from '@/lib/components/QuickSignUp';
import useAction from '@/lib/core/useAction';

interface BuyNowButtonProps {
  price: number;
  productId: string;
  productName: string;
  productStatus: string;
  creatorId?: string;
  callback?: (orderId: string) => void;
}

interface PayPalButtonProps {
  price: number;
  productId: string;
  userId: string;
  disabled: boolean;
  callback?: (orderId: string) => void;
}

function PayPalButton({ price, productId, userId, disabled, callback }: PayPalButtonProps) {
  const router = useRouter();

  const { mutate: createOrder, isError: createOrderIsError, data: orderData } = useCreateOrder();
  const {
    mutate: captureOrder,
    isSuccess: captureOrderIsSuccess,
    isError: captureOrderIsError,
  } = useCaptureOrder();
  const {
    fetch: fetchOrdersByProductId,
    isLoading: listOrdersByProductIdIsLoading,
    isSuccess: listOrdersByProductIdIsSuccess,
    data: orders,
    setIsSuccess: setListOrdersByProductIdIsSuccess,
  } = useListOrdersByProductId();

  const errorReason = useMemo(() => {
    if (captureOrderIsError) {
      return "We couldn't authorize your payment. Please try again and consider using another PayPal account.";
    } else if (createOrderIsError) {
      return 'Something went wrong while creating your order. Please try again and consider reloading the page.';
    }
  }, [createOrderIsError, captureOrderIsError]);

  useEffect(() => {
    if (!captureOrderIsSuccess || !orderData?.orderId) {
      return;
    }
    router.push(`/app/auth/me/orders/${orderData.orderId}`);
  }, [captureOrderIsSuccess, orderData]);

  useEffect(() => {
    fetchOrdersByProductId(productId);
  }, [productId]);

  useEffect(() => {
    if (!listOrdersByProductIdIsSuccess || orders?.length === 0) {
      return;
    }
    // redirect to first order detail page related to the user matching this product
    router.push(`/app/auth/me/orders/${orders[0].id}`);
  }, [listOrdersByProductIdIsSuccess, orders]);

  if (listOrdersByProductIdIsLoading) {
    return <LoadingSpinnerComponent />;
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_PLATFORM_CLIENT_ID ?? '',
        currency: 'USD',
      }}
    >
      <div className="flex flex-col flex-start mb-6 gap-4 w-full">
        <span className="text-lg font-bold">${price.toFixed(2)}</span>
        <div className="flex flex-col gap-2">
          <PayPalButtons
            disabled={disabled}
            createOrder={async () => {
              try {
                const order = orders.find((order) => order.customer.id === userId);
                if (order?.status === 'CREATED') {
                  logger.info("Order with status 'CREATED' for user already exists");
                  return order.paypalOrderId;
                }
                const response = await createOrder({
                  productId,
                });
                return response.paypalOrderId;
              } catch (error) {
                logger.error('Error creating order:', error);
                setListOrdersByProductIdIsSuccess(false);
                fetchOrdersByProductId(productId);
                return '';
              }
            }}
            onApprove={async (data: { orderID: string }) => {
              try {
                const orderId = await captureOrder(data.orderID);
                callback !== undefined ? callback(orderId) : location.reload();
              } catch (error) {
                logger.error('Error capturing order:', error);
                setListOrdersByProductIdIsSuccess(false);
                fetchOrdersByProductId(productId);
              }
            }}
            onError={(err: any) => {
              logger.error('PayPal Buttons Error:', err);
              setListOrdersByProductIdIsSuccess(false);
              fetchOrdersByProductId(productId);
            }}
          />
        </div>
      </div>
      <RequestStatus
        isSuccess={captureOrderIsSuccess}
        isError={createOrderIsError || captureOrderIsError}
        errorMessage={errorReason}
      />
    </PayPalScriptProvider>
  );
}

export function BuyNowButton({
  price,
  productId,
  productName,
  productStatus,
  creatorId,
  callback,
}: BuyNowButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const { action } = useAction();

  const { accessToken, userId } = useSelector((s: Store) => s.auth);

  useEffect(() => {
    if (!action) {
      return;
    }
    if (action === 'toggleBuyNow') {
      setIsOpen(true);
    }
  }, [action]);

  const isOwner = creatorId === userId;
  const isLoggedIn = isTokenValid(accessToken);

  if (isOwner) {
    return <InfoBoxComponent severity="info" message="You are the owner of this pattern" />;
  }

  if (productStatus !== 'Released') {
    return (
      <InfoBoxComponent
        message={
          <span>
            This pattern is currently not for sale.
            {productStatus === 'Created' ? (
              <span>
                {' '}
                <Link href={`/app/test/products/${productId}`} className="text-blue-500 underline">
                  Apply as a Tester here!
                </Link>
              </span>
            ) : (
              ''
            )}
          </span>
        }
        severity="info"
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-3xl font-bold">${price.toFixed(2)}</span>
      <Button className="w-full" onClick={() => setIsOpen(true)}>
        <Lock />
        Buy Now
      </Button>
      <Drawer open={isOpen} onOpenChange={setIsOpen} dismissible={!isLoggedIn}>
        <DrawerContent className="p-4">
          <div className="mx-auto w-full max-w-sm flex flex-col gap-4  max-h-[60vh] overflow-y-auto">
            <DrawerHeader className="flex flex-col gap-8 items-center mt-4">
              <ShieldCheck className="w-20 h-20 text-green-500" />
              <div className="flex flex-col gap-2">
                <DrawerTitle>Complete your order</DrawerTitle>
                <DrawerTitle className="font-medium text-md">{productName}</DrawerTitle>
              </div>
              {!isLoggedIn ? (
                <div className="flex flex-col gap-4">
                  <InfoBoxComponent
                    severity="info"
                    message={
                      <span>
                        You&apos;re not logged in. You can{' '}
                        <Link
                          href={`/auth/login?redirect=/products/${productId}?action=toggleBuyNow`}
                          className="text-blue-500 underline"
                        >
                          log in
                        </Link>{' '}
                        or{' '}
                        <Link
                          href={`/auth/registration?preselectedRoles=Buyer&redirect=/products/${productId}?action=toggleBuyNow`}
                          className="text-blue-500 underline"
                        >
                          register
                        </Link>
                        . Otherwise you can use our{' '}
                        <Link
                          href="/faq?anchor=quickregistration"
                          className="text-blue-500 underline"
                          target="_blank"
                        >
                          Quick Sign Up
                        </Link>{' '}
                        below.
                      </span>
                    }
                  />
                  <QuickSignUp
                    signupCallback={() =>
                      router.push(
                        `/auth/login?redirect=${encodeURIComponent(
                          `/products/${productId}?action=toggleBuyNow`,
                        )}`,
                      )
                    }
                  />
                </div>
              ) : null}
              <PayPalButton
                disabled={!isLoggedIn}
                price={price}
                productId={productId}
                userId={userId}
                callback={callback}
              />
            </DrawerHeader>
            <Button variant="destructive" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
