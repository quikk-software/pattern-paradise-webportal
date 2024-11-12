'use client';

import { useState, useMemo, useCallback } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Instagram, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { GetTesterApplicationResponse } from '@/@types/api-types';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

type SortKey = 'name' | 'assignedAt' | 'updatedAt';

const useSortableData = (
  items: GetTesterApplicationResponse[],
  config = { key: 'assignedAt' as SortKey, direction: 'asc' as 'asc' | 'desc' },
) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === 'name') {
          const aName = `${a.user.firstName} ${a.user.lastName}`.trim();
          const bName = `${b.user.firstName} ${b.user.lastName}`.trim();
          if (aName < bName) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aName > bName) return sortConfig.direction === 'asc' ? 1 : -1;
        } else {
          if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
          if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = useCallback(
    (key: SortKey) => {
      let direction: 'asc' | 'desc' = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      setSortConfig({ key, direction });
    },
    [sortConfig],
  );

  return { items: sortedItems, requestSort, sortConfig };
};

export function TesterApplicantsPage({
  applications,
}: {
  applications: GetTesterApplicationResponse[];
}) {
  const { items, requestSort, sortConfig } = useSortableData(applications);
  const [selectedApplicants, setSelectedApplicants] = useState<Set<string>>(new Set());

  const toggleApplicant = (id: string) => {
    setSelectedApplicants((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderSortIcon = (columnName: SortKey) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === 'asc' ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-5">Tester Applicants</h1>
      <div className="flex justify-end space-x-4 mb-4">
        <Button variant="outline" onClick={() => requestSort('updatedAt')}>
          Sort by Last Updated {renderSortIcon('updatedAt')}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((application) => (
          <Card
            key={application.user.id}
            className={`relative cursor-pointer transition-all ${
              selectedApplicants.has(application.user.id) ? 'ring-2 ring-green-500' : ''
            }`}
            onClick={() => toggleApplicant(application.user.id)}
          >
            {selectedApplicants.has(application.user.id) && (
              <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={application.user.imageUrl}
                    alt={`${application.user.firstName} ${application.user.lastName}`}
                  />
                  <AvatarFallback>
                    {application.user.firstName?.[0]}
                    {application.user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">
                    {application.user.firstName} {application.user.lastName}
                  </h2>
                  <p className="text-sm text-muted-foreground">@{application.user.username}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-2">
                {application.user.instagramRef && (
                  <a
                    href={`https://instagram.com/${application.user.instagramRef}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Badge variant="secondary">
                      <Instagram className="w-4 h-4 mr-1" />
                      Instagram
                    </Badge>
                  </a>
                )}
                {application.user.tiktokRef && (
                  <a
                    href={`https://tiktok.com/@${application.user.tiktokRef}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Badge variant="secondary">
                      <TikTokIcon className="w-4 h-4 mr-1" />
                      TikTok
                    </Badge>
                  </a>
                )}
              </div>
              <p className="text-sm">
                Assigned: {new Date(application.assignedAt).toLocaleDateString()}
              </p>
              <p className="text-sm">
                Last Updated: {new Date(application.updatedAt).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add your logic here for viewing more details
                }}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
