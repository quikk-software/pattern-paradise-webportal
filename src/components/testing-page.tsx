'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ShoppingBag, TestTube } from 'lucide-react';
import Link from 'next/link';
import { GetTestingResponse } from '@/@types/api-types';

interface TestingPageComponentProps {
  testings: GetTestingResponse[];
}

export function TestingPageComponent({ testings }: TestingPageComponentProps) {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Your Testings</h1>
      </header>

      <div className="grid gap-6 mb-8">
        <Link href={`/testings/submit`} className="block">
          <Button
            variant="outline"
            className="w-full h-full min-h-[100px] flex flex-col items-center justify-center gap-2"
          >
            <PlusCircle className="h-8 w-8" />
            <span className="text-lg font-semibold">Create a new pattern</span>
          </Button>
        </Link>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Explore Open Testings</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patterns</CardTitle>
            <PlusCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Testings</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
