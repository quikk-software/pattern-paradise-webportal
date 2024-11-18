import React from 'react';
import { OrderListComponent } from '@/components/order-list';

export default function MyOrdersPage() {
  return <OrderListComponent filter={'customer'} />;
}
