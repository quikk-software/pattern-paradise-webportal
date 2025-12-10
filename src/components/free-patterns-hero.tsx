import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export async function FreePatternsHero() {
  const t = await getTranslations();

  return (
    <section className="pb-8">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
        <div className="flex flex-col gap-6 text-balance">
          <Badge className="self-start text-sm px-4 py-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
            {t('browseFree.freeHint')}
          </Badge>

          <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-foreground">
            <span className="text-balance">{t('browseFree.heroTitle')}</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            {t('browseFree.heroDescription')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/browse?sortBy=mostRelevant&maxPrice=0&craft=Crocheting">
              <Button size="lg" className="text-base font-semibold">
                {t('browseFree.browseButton')}
              </Button>
            </Link>
            <Link href="/browse">
              <Button
                size="lg"
                variant="outline"
                className="text-base font-semibold bg-transparent"
              >
                <Search className="mr-2 h-5 w-5" />
                {t('browseFree.searchButton')}
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative lg:h-[500px] h-[400px]">
          <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-border">
            <Image
              src="/banners/free-patterns-hero.jpg"
              alt={t('browseFree.heroImageAlt')}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />
    </section>
  );
}
