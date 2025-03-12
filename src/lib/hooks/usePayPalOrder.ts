'use client';

import { usePayPalOrderContext, PayPalOrderProvider } from '@/lib/contexts/PayPalOrderContext';

export const usePayPalOrder = usePayPalOrderContext;

export { PayPalOrderProvider };
