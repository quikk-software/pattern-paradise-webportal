'use client';

import React, { useState } from 'react';
import { Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ReportUserReason, reportUserReasons } from '@/lib/constants';
import { useCreateUserReport } from '@/lib/api/report';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { useValidSession } from '@/hooks/useValidSession';

interface ReportUserProps {
  userId: string;
}

export function ReportUser({ userId }: ReportUserProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportUserReason | undefined>();
  const [reasonError, setReasonError] = useState<string | undefined>();
  const [comment, setComment] = useState<string | undefined>(undefined);

  const { status } = useValidSession();

  const { mutate, isLoading, isError, errorDetail } = useCreateUserReport();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!reason) {
      setReasonError('Please select a reason.');
      return;
    }

    await mutate(userId, reason, comment);

    setReason(undefined);
    setReasonError(undefined);
    setComment(undefined);
    setOpen(false);
  };

  const isLoggedIn = status === 'authenticated';

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="secondary" size="icon">
          <Flag className="h-4 w-4" />
          <span className="sr-only">Report User</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4">
        <DrawerHeader>
          <DrawerTitle>Report User</DrawerTitle>
          <DrawerTitle className="text-sm font-medium">
            Please select a reason for reporting this user. Your report will be reviewed by our
            team.
          </DrawerTitle>
        </DrawerHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Select
              value={reason}
              onValueChange={(value) => setReason(value as ReportUserReason)}
              required
            >
              <SelectTrigger aria-label={'Select a reason'}>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {reportUserReasons.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {reasonError ? <p className="text-red-500">{reasonError}</p> : null}
            {reason ? (
              <p className="text-sm text-muted-foreground">
                {reportUserReasons.find((r) => r.value === reason)?.description}
              </p>
            ) : null}
            <Textarea
              placeholder="Additional comments (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value || undefined)}
            />
          </div>
          <DrawerFooter className="flex flex-col gap-2">
            {isError ? (
              <p className="text-red-500">
                Something went wrong while creating your report
                {errorDetail ? `: ${errorDetail}` : ''}
              </p>
            ) : null}
            <Button type="submit" variant="default">
              {isLoading ? <LoadingSpinnerComponent size={`sm`} className={`text-white`} /> : null}
              Submit Report
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
