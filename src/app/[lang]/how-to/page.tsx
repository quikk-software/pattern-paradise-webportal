import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import GuideSection from '@/lib/components/GuideSection';
import StepItem from '@/lib/components/StepItem';
import Link from 'next/link';
import WelcomeCard from '@/lib/components/WelcomeCard';
import { generatePageMetadata } from '@/lib/core/metadata';
import { DEFAULT_LANGUAGE } from '@/i18n/i18n.constants';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  return generatePageMetadata('/how-to', params.lang);
}

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function HowToPage({ params }: Props) {
  const p = await params;
  const lang = p.lang || DEFAULT_LANGUAGE;
  const { default: howTo } = await import(`@/i18n/translations/${lang}/howTo`);
  const t = (key: string): any => {
    const prefix = 'howTo:';
    if (!key.startsWith(prefix)) return undefined;

    const path = key.slice(prefix.length).split('.');
    const result = path.reduce((acc, part) => acc?.[part], howTo);
    return result;
  };

  return (
    <div>
      <div className="space-y-4 mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t('howTo:title')}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{t('howTo:subtitle')}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="grid w-full grid-cols-1 mb-6">
          <TabsTrigger value="all">{t('howTo:tabs.all')}</TabsTrigger>
        </TabsList>

        <WelcomeCard />

        {['all', 'patterns', 'testing', 'account', 'payments'].map((tabKey) => (
          <TabsContent key={tabKey} value={tabKey} className="space-y-6 mt-0">
            {tabKey === 'all' || tabKey === 'patterns' ? (
              <GuideSection
                title={t('howTo:sections.uploadPattern.title')}
                description={t('howTo:sections.uploadPattern.description')}
                defaultOpen={tabKey === 'all'}
              >
                <p className="text-muted-foreground mb-4">
                  {t('howTo:sections.uploadPattern.intro')}
                </p>
                {Object.entries(t('howTo:sections.uploadPattern.steps')).map(
                  ([key, step]: any, index) => (
                    <StepItem
                      key={key}
                      number={index + 1}
                      title={step.title}
                      isRequired={key !== 'step5' && key !== 'step7' && key !== 'step8'}
                    >
                      {step.description && <p>{step.description}</p>}
                      {step.description1 && <p>{step.description1}</p>}
                      {step.description2 && <p className="mt-2">{step.description2}</p>}
                      {step.intro && <p>{step.intro}</p>}
                      {step.tips && (
                        <ul className="space-y-2 mt-2">
                          {step.tips.map((tip: string, i: number) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      )}
                      {step.warning && (
                        <p className="mt-3 text-destructive font-medium flex items-center gap-1.5">
                          <span>⚠️</span> {step.warning}
                        </p>
                      )}
                      {step.systemSteps && (
                        <ul className="mt-2 space-y-1">
                          {step.systemSteps.map((line: string, i: number) => (
                            <li key={i}>{line}</li>
                          ))}
                        </ul>
                      )}
                      {step.items && (
                        <ul className="mt-2 space-y-1">
                          {step.items.map((line: string, i: number) => (
                            <li key={i}>{line}</li>
                          ))}
                        </ul>
                      )}
                    </StepItem>
                  ),
                )}

                <div className="mt-8 rounded-lg bg-muted/50 p-4">
                  <h4 className="font-semibold text-lg mb-3">
                    {t('howTo:sections.uploadPattern.errors.title')}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {t('howTo:sections.uploadPattern.errors.items').map(
                      (item: { title: string; description: string }, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <span className="font-medium min-w-28 flex-1">{item.title}</span>
                          <span className="text-muted-foreground">{item.description}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </GuideSection>
            ) : null}

            {tabKey === 'all' || tabKey === 'testing' ? (
              <GuideSection
                title={t('howTo:sections.testerCall.title')}
                description={t('howTo:sections.testerCall.description')}
              >
                <p className="text-muted-foreground mb-4">{t('howTo:sections.testerCall.intro')}</p>
                {Object.entries(t('howTo:sections.testerCall.steps')).map(
                  ([key, step]: any, index) => (
                    <StepItem
                      key={key}
                      number={index + 1}
                      title={step.title}
                      isRequired={key !== 'step4' && key !== 'step6'}
                    >
                      {step.description && <p>{step.description}</p>}
                      {step.note && <p className="mt-2 text-muted-foreground">{step.note}</p>}
                      {step.list && (
                        <ul className="mt-2 space-y-1">
                          {step.list.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}
                      {step.includes && (
                        <ul className="mt-3 space-y-1">
                          {step.includes.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}
                      {step.steps && (
                        <ol className="space-y-2 mt-2">
                          {step.steps.map((s: string, i: number) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ol>
                      )}
                      {step.reviewNote && (
                        <p className="mt-3 text-muted-foreground">{step.reviewNote}</p>
                      )}
                    </StepItem>
                  ),
                )}

                <div className="mt-8 rounded-lg bg-destructive/10 p-4">
                  <h4 className="font-semibold text-lg mb-3 text-destructive">
                    {t('howTo:sections.testerCall.limitations.title')}
                  </h4>
                  <ul className="mt-2 space-y-1">
                    {t('howTo:sections.testerCall.limitations.list').map(
                      (line: string, i: number) => (
                        <li key={i}>• {line}</li>
                      ),
                    )}
                  </ul>
                </div>

                <div className="mt-4 text-center p-4 border border-primary/20 rounded-lg bg-primary/5">
                  <h4 className="font-medium text-lg text-primary">
                    {t('howTo:sections.testerCall.cta.title')}
                  </h4>
                  <p className="mt-1">{t('howTo:sections.testerCall.cta.description')}</p>
                </div>
              </GuideSection>
            ) : null}

            {tabKey === 'all' || tabKey === 'testing' ? (
              <GuideSection
                title={t('howTo:sections.chat.title')}
                description={t('howTo:sections.chat.description')}
              >
                <p className="text-muted-foreground mb-4">{t('howTo:sections.chat.intro')}</p>
                <div className="mb-8 rounded-lg bg-muted/50 p-4">
                  <h4 className="font-semibold text-lg mb-3">
                    {t('howTo:sections.chat.features.title')}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                    {t('howTo:sections.chat.features.items').map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-start gap-3">
                        <span className="font-medium flex-1 min-w-20">{item.title}</span>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {Object.entries(t('howTo:sections.chat.actions')).map(
                  ([key, value]: any, index) => (
                    <StepItem key={key} number={index + 1} title={value}>
                      <p>{value}</p>
                    </StepItem>
                  ),
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-950/40 p-4">
                    <h4 className="font-semibold text-lg mb-3 text-blue-700 dark:text-blue-400 flex items-center gap-2">
                      <span className="text-xl">🟢</span> {t('howTo:sections.chat.realtime.title')}
                    </h4>
                    <p>{t('howTo:sections.chat.realtime.description')}</p>
                  </div>

                  <div className="rounded-lg bg-purple-50 dark:bg-orange-950/40 p-4">
                    <h4 className="font-semibold text-lg mb-3 text-primary flex items-center gap-2">
                      <span className="text-xl">📦</span> {t('howTo:sections.chat.systemBox.title')}
                    </h4>
                    <p>{t('howTo:sections.chat.systemBox.description')}</p>
                    <ul className="mt-2 space-y-1">
                      {t('howTo:sections.chat.systemBox.list').map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    <p className="mt-2 text-sm">{t('howTo:sections.chat.systemBox.note')}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-lg bg-destructive/10 p-4">
                  <h4 className="font-semibold text-lg mb-3 text-destructive">
                    {t('howTo:sections.chat.limitations.title')}
                  </h4>
                  <ul className="mt-2 space-y-1">
                    {t('howTo:sections.chat.limitations.list').map((line: string, i: number) => (
                      <li key={i}>• {line}</li>
                    ))}
                  </ul>
                  <p className="mt-3">{t('howTo:sections.chat.limitations.note')}</p>
                </div>

                <div className="mt-4 p-4 border border-primary/20 rounded-lg bg-primary/5">
                  <h4 className="font-medium text-lg mb-2">
                    {t('howTo:sections.chat.leaving.title')}
                  </h4>
                  <ol className="mt-2 space-y-1">
                    {t('howTo:sections.chat.leaving.steps').map((step: string, i: number) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              </GuideSection>
            ) : null}
          </TabsContent>
        ))}
      </Tabs>

      <div className="text-center space-y-2 max-w-lg mx-auto">
        <h2 className="text-xl font-medium">{t('howTo:help.heading')}</h2>
        <p className="text-muted-foreground">{t('howTo:help.description')}</p>
        <div className="flex justify-center gap-3 mt-4">
          <Button asChild>
            <Link href="/help" className="space-x-2">
              <MessageSquare size={16} />
              {t('howTo:help.contact')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
