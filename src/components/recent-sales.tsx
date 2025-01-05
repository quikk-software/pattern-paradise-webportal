import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GetOrderAnalyticsResponse } from '@/@types/api-types';
import { NoDataAvailable } from '@/components/no-data-available';
import Link from 'next/link';

interface RecentSalesProps {
  recentSales: GetOrderAnalyticsResponse['lastSales'];
}

export function RecentSales({ recentSales }: RecentSalesProps): JSX.Element {
  if (recentSales.length === 0) {
    return <NoDataAvailable />;
  }

  return (
    <div className="space-y-8">
      {recentSales.map((recentSale, index) => (
        <Link
          href={`/users/${recentSale.userId}`}
          key={`${recentSale.userId}-${index}`}
          className="flex items-center"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={recentSale.imageUrl} alt={recentSale.fullName} />
            <AvatarFallback>
              {recentSale.fullName?.[0] ? recentSale.fullName[0].toUpperCase() : null}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            {recentSale.fullName ? (
              <p className="text-sm font-medium leading-none">{recentSale.fullName}</p>
            ) : null}
            <p className="text-sm text-muted-foreground">{recentSale.username}</p>
          </div>
          <div className="ml-auto font-medium">+${recentSale.revenue.toLocaleString('en-US')}</div>
        </Link>
      ))}
    </div>
  );
}
