import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InboxIcon } from 'lucide-react';

interface NoDataInfoBoxProps {
  title?: string;
  description?: string;
}

export default function NoDataInfoBox({ title, description }: NoDataInfoBoxProps) {
  return (
    <Card className="mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <InboxIcon className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">{title ?? 'No data available'}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          {description ?? "It looks like there's no data to display at the moment."}
        </p>
      </CardContent>
    </Card>
  );
}
