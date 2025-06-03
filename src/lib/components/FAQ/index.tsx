import FAQItem from './faq-item';
import { getTranslations } from 'next-intl/server';

export default async function FAQPageComponent() {
  const t = await getTranslations();

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 bg-primary/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-50" />
      <div className="absolute bottom-0 right-0 bg-primary/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl opacity-40" />

      <div className="relative">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-primary sm:text-4xl md:text-5xl mb-3">
            {t('faq.title')}
          </h2>
          <p className="text-muted-foreground">{t('faq.description')}</p>
        </div>

        <div className="relative">
          <FAQItem />
        </div>
      </div>
    </div>
  );
}
