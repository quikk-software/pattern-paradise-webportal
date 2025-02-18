'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSelectedOrders } from '@/hooks/use-selected-orders';
import { GetOrderResponse } from '@/@types/api-types';
import { useListOrders } from '@/lib/api/order';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const ITEMS_PER_PAGE = 20;

interface OrderTableProps {
  filter?: 'customer' | 'seller';
}

export default function OrderTable({ filter }: OrderTableProps) {
  const [orders, setOrders] = useState<GetOrderResponse[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof GetOrderResponse>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const { selectedIds, isSelected, isAllSelected, toggleSelection, toggleAll, clearSelection } =
    useSelectedOrders(orders);

  const router = useRouter();

  const { fetch, totalPages } = useListOrders({
    filter,
    pageSize: ITEMS_PER_PAGE,
  });

  useEffect(() => {
    fetch(1, ITEMS_PER_PAGE).then((result) => setOrders(result?.orders));
  }, []);

  useEffect(() => {
    fetch(
      currentPage,
      ITEMS_PER_PAGE,
      sortColumn,
      sortDirection,
      debouncedSearchTerm || undefined,
    ).then((result) => setOrders(result?.orders));
  }, [currentPage, sortColumn, sortDirection, debouncedSearchTerm]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const getStatusColor = (status: GetOrderResponse['status']) => {
    switch (status) {
      case 'CREATED':
        return 'text-yellow-500';
      case 'CAPTURED':
        return 'text-green-500';
      case 'APPROVED':
        return 'text-green-500';
      case 'COMPLETED':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleSort = (column: keyof GetOrderResponse) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleAction = (action: string, id: string) => {
    switch (action) {
      case 'view':
        router.push(`/app/secure/auth/me/orders/${id}`);
        break;
      case 'profile':
        router.push(`/users/${id}`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-end items-center gap-2">
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            size="sm"
            variant={'outline'}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            size="sm"
            variant={'outline'}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="w-full">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox checked={isAllSelected} onCheckedChange={toggleAll} />
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('productName')}>
                  Pattern
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('status')}>
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => handleSort('amount')}>
                  Amount
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                {filter === 'seller' ? 'Customer' : 'Seller'}
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('createdAt')}>
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Checkbox
                    checked={isSelected(order.id)}
                    onCheckedChange={() => toggleSelection(order.id)}
                  />
                </TableCell>
                <TableCell>{order.productName}</TableCell>
                <TableCell className={`text-sm font-semibold ${getStatusColor(order.status)}`}>
                  {order.status}
                </TableCell>
                <TableCell className="text-right">${order.amount.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Link
                    href={
                      filter === 'customer'
                        ? `/users/${order.seller.id}`
                        : `/users/${order.customer.id}`
                    }
                    className="text-blue-500 underline"
                    rel={'nofollow'}
                  >
                    {filter === 'customer' ? order.seller.username : order.customer.username}
                  </Link>
                </TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleAction('view', order.id)}>
                        View order details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction('profile', order.customer.id)}>
                        View {filter === 'customer' ? 'seller' : 'customer'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
