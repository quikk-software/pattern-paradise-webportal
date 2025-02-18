import React from 'react';
import { OrderListComponent } from '@/components/order-list';
import OrderTable from '@/components/order-table';

export default function SellOrdersPage() {
  return <OrderListComponent filter={'seller'} />;
}
