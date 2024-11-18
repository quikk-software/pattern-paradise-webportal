import React from 'react';
import { OrderListComponent } from '@/components/order-list';

export default function SellOrdersPage() {
  return <OrderListComponent filter={'seller'} />;
}
