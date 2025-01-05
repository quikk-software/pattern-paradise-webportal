import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface NoDataAvailableProps {
  title?: string;
  description?: string;
  actionLabel?: string;
}

export function NoDataAvailable({
  title = 'No Data Available',
  description = "There's currently no data to display. Check back later or try refreshing the page.",
  actionLabel = 'Refresh',
}: NoDataAvailableProps) {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 bg-muted rounded-full w-16 h-16 flex items-center justify-center">
          <FileQuestion className="h-8 w-8 text-muted-foreground" />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={handleReload}>{actionLabel}</Button>
      </CardFooter>
    </Card>
  );
}
