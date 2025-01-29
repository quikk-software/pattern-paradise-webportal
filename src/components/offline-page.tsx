'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { WifiOff, RefreshCw } from 'lucide-react';

export function OfflinePageComponent() {
  const handleReconnect = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto bg-yellow-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
            <WifiOff className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold">You&apos;re Offline</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            It looks like you&apos;ve lost your internet connection. Don&apos;t worry, some features
            may still work offline.
          </p>
          <Button onClick={handleReconnect} className="mb-4">
            <RefreshCw className="mr-2 h-4 w-4" /> Try to Reconnect
          </Button>
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">While you&apos;re offline, you can:</h3>
            <ul className="text-sm text-left list-disc list-inside">
              <li>View previously loaded content</li>
              <li>Use any offline-enabled features</li>
              <li>Prepare data to sync when you&apos;re back online</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          Your data will automatically sync once you&apos;re back online.
        </CardFooter>
      </Card>
    </div>
  );
}
