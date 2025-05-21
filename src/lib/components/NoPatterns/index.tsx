import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function NoPatterns() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <div className="bg-primary/10 rounded-full p-6 mb-6">
        <ShoppingBag className="w-12 h-12 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">No patterns yet</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        You haven&apos;t bought any crochet patterns yet. Start your creative journey by exploring
        our collection of beautiful designs!
      </p>
      <Link href="/browse">
        <Button size="lg" className="font-semibold">
          Browse Patterns
        </Button>
      </Link>
    </div>
  );
}
