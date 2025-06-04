'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useListUserReports } from '@/lib/api/report';
import dayjs, { ADVANCED_DATE_FORMAT } from '@/lib/core/dayjs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

interface FilterOptions {
  status: string | undefined;
  reasonType: string | undefined;
  orderDirection: 'asc' | 'desc';
}

const initialFilters: FilterOptions = {
  status: undefined,
  reasonType: undefined,
  orderDirection: 'desc',
};

function getReasonDisplayText(value: string): string {
  const displayTextMap: Record<string, string> = {
    FRAUDULENT_ACTIVITY: 'Fraudulent activity',
    IMPERSONATION: 'Impersonation',
    INAPPROPRIATE_BEHAVIOR: 'Inappropriate behavior',
    UNSOLICITED_PROMOTIONS_SPAM: 'Unsolicited promotions/spam',
    SUSPICIOUS_ACTIVITY: 'Suspicious activity',
    SELLING_PROHIBITED_CONTENT: 'Selling prohibited content',
    MULTIPLE_VIOLATIONS: 'Multiple violations',
    INCOMPLETE_PROFILE_OR_FAKE_INFORMATION: 'Incomplete profile or fake information',
    VIOLATION_OF_AUP: 'Violation of AUP',
  };

  return displayTextMap[value] || 'Unknown value';
}

function getStatusDisplayText(value: string): {
  color: string;
  text: string;
} {
  const displayTextMap: Record<
    string,
    {
      color: string;
      text: string;
    }
  > = {
    CREATED: {
      text: 'CREATED',
      color: 'bg-primary',
    },
    IN_PROGRESS: {
      text: 'UNDER REVIEW',
      color: 'bg-blue-500',
    },
    REJECTED: {
      text: 'REJECTED',
      color: 'bg-red-500',
    },
    DONE: {
      text: 'RESOLVED',
      color: 'bg-green-500',
    },
  };

  return displayTextMap[value] || 'Unknown value';
}

export function UserReports() {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const {
    fetch,
    data: userReports,
    hasPreviousPage,
    hasNextPage,
    pageSize,
    totalPages,
    reset,
  } = useListUserReports({
    pageNumber: 1,
    pageSize: 5,
  });

  useEffect(() => {
    fetch(
      currentPage,
      pageSize,
      filters.orderDirection,
      undefined,
      filters.status,
      filters.reasonType,
    );
  }, [filters, currentPage, pageSize]);

  const toggleCard = (index: number) => {
    const newExpandedCards = new Set(expandedCards);
    if (newExpandedCards.has(index)) {
      newExpandedCards.delete(index);
    } else {
      newExpandedCards.add(index);
    }
    setExpandedCards(newExpandedCards);
  };

  const onFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1);
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
              <Label htmlFor="status">Status {filters.status}</Label>
              <Select
                value={filters.status ?? 'all'}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger id="status" aria-label={'Select a status'}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="CREATED">Created</SelectItem>
                  <SelectItem value="IN_PROGRESS">Under Review</SelectItem>
                  <SelectItem value="DONE">Resolved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reasonType">Reason Type</Label>
              <Select
                value={filters.reasonType ?? 'all'}
                onValueChange={(value) => handleFilterChange('reasonType', value)}
              >
                <SelectTrigger id="reasonType" aria-label={'Select a reason type'}>
                  <SelectValue placeholder="Select reason type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="FRAUDULENT_ACTIVITY">Fraudulent activity</SelectItem>
                  <SelectItem value="IMPERSONATION">Impersonation</SelectItem>
                  <SelectItem value="INAPPROPRIATE_BEHAVIOR">Inappropriate behavior</SelectItem>
                  <SelectItem value="UNSOLICITED_PROMOTIONS_SPAM">
                    Unsolicited promotions/spam
                  </SelectItem>
                  <SelectItem value="SUSPICIOUS_ACTIVITY">Suspicious activity</SelectItem>
                  <SelectItem value="SELLING_PROHIBITED_CONTENT">
                    Selling prohibited content
                  </SelectItem>
                  <SelectItem value="MULTIPLE_VIOLATIONS">Multiple violations</SelectItem>
                  <SelectItem value="INCOMPLETE_PROFILE_OR_FAKE_INFORMATION">
                    Incomplete profile or fake information
                  </SelectItem>
                  <SelectItem value="VIOLATION_OF_AUP">Violation of AUP</SelectItem>
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
        {userReports.map((report, index) => {
          const status = getStatusDisplayText(report.status);
          return (
            <Card key={index} className="w-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span className="truncate">{getReasonDisplayText(report.reason)}</span>
                  <Badge variant="default" className={`${status.color} text-white`}>
                    {status.text}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Reporter:</strong>{' '}
                    <Link
                      href={`/users/${report.reporter.id}`}
                      target="_blank"
                      className="text-blue-500 underline"
                    >
                      {report.reporter.username}
                    </Link>
                  </p>
                  <p>
                    <strong>Defendant:</strong>{' '}
                    <Link
                      href={`/users/${report.defendant.id}`}
                      target="_blank"
                      className="text-blue-500 underline"
                    >
                      {report.defendant.username}
                    </Link>
                  </p>
                  <p>
                    <strong>Created:</strong> {dayjs(report.createdAt).format(ADVANCED_DATE_FORMAT)}
                  </p>
                </div>
                <Collapsible open={expandedCards.has(index)} onOpenChange={() => toggleCard(index)}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full mt-2">
                      {expandedCards.has(index) ? (
                        <>
                          Less details <ChevronUp className="h-4 w-4 ml-2" />
                        </>
                      ) : (
                        <>
                          More details <ChevronDown className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-2 text-sm">
                    <p>
                      <strong>Reporter Comment:</strong> {report.reporterComment || 'N/A'}
                    </p>
                    <p>
                      <strong>Defendant Comment:</strong> {report.defendantComment || 'N/A'}
                    </p>
                    <p>
                      <strong>Admin Comment:</strong> {report.adminComment || 'N/A'}
                    </p>
                    <p>
                      <strong>Updated At:</strong>{' '}
                      {dayjs(report.updatedAt).format(ADVANCED_DATE_FORMAT)}
                    </p>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Showing page {currentPage} of {totalPages}
        </p>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={!hasPreviousPage}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={!hasNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
