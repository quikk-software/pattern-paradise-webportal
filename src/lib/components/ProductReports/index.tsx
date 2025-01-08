import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useListProductReports } from '@/lib/api/report';
import dayjs, { ADVANCED_DATE_FORMAT } from '@/lib/core/dayjs';

interface FilterOptions {
  userId: string | undefined;
  productId: string | undefined;
  status: string | undefined;
  reasonType: string | undefined;
  orderDirection: 'asc' | 'desc';
}

const initialFilters: FilterOptions = {
  userId: undefined,
  productId: undefined,
  status: undefined,
  reasonType: undefined,
  orderDirection: 'desc',
};

export function ProductReportsCards() {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    fetch,
    data: productReports,
    hasPreviousPage,
    hasNextPage,
    pageNumber,
    pageSize,
    count,
    reset,
  } = useListProductReports({
    pageNumber: 1,
    pageSize: 20,
  });

  useEffect(() => {
    fetch(
      currentPage,
      pageSize,
      filters.orderDirection,
      filters.userId,
      filters.productId,
      filters.status,
      filters.reasonType,
    );
  }, [filters]);

  const onFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    reset();
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string | undefined) => {
    let newValue = value;
    if (key === 'status' || key === 'reasonType') {
      newValue = value === 'all' ? undefined : value;
    }
    const newFilters = { ...filters, [key]: newValue };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={filters.userId}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
                placeholder="Enter user ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productId">Product ID</Label>
              <Input
                id="productId"
                value={filters.productId}
                onChange={(e) => handleFilterChange('productId', e.target.value)}
                placeholder="Enter product ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reasonType">Reason Type</Label>
              <Select
                value={filters.reasonType}
                onValueChange={(value) => handleFilterChange('reasonType', value)}
              >
                <SelectTrigger id="reasonType">
                  <SelectValue placeholder="Select reason type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="inappropriate-content">Inappropriate content</SelectItem>
                  <SelectItem value="counterfeit-item">Counterfeit item</SelectItem>
                  <SelectItem value="misleading-description">Misleading description</SelectItem>
                  <SelectItem value="prohibited-item">Prohibited item</SelectItem>
                  <SelectItem value="copyright-infringement">Copyright infringement</SelectItem>
                  <SelectItem value="safety-concern">Safety concern</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="orderDirection">Order Direction</Label>
              <Select
                value={filters.orderDirection}
                onValueChange={(value) =>
                  handleFilterChange('orderDirection', value as 'asc' | 'desc')
                }
              >
                <SelectTrigger id="orderDirection">
                  <SelectValue placeholder="Select order direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest first</SelectItem>
                  <SelectItem value="asc">Oldest first</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productReports.map((report, index) => (
          <Card key={index} className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                <span className="truncate">{report.reason}</span>
                <Badge variant={report.status === 'Under Review' ? 'secondary' : 'default'}>
                  {report.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-sm space-y-1">
                <p>
                  <strong>Reporter:</strong> {report.reporter.username}
                </p>
                <p>
                  <strong>Defendant:</strong> {report.defendant.username}
                </p>
                <p>
                  <strong>Product:</strong> {report.product.title}
                </p>
                <p>
                  <strong>Created:</strong> {dayjs(report.createdAt).format(ADVANCED_DATE_FORMAT)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Showing page {pageNumber} of {count}
        </p>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(pageNumber - 1)}
            disabled={!hasPreviousPage}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(pageNumber + 1)}
            disabled={!hasNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
