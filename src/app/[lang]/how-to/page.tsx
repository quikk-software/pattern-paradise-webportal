import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import GuideSection from '@/lib/components/GuideSection';
import StepItem from '@/lib/components/StepItem';
import Link from 'next/link';
import WelcomeCard from '@/lib/components/WelcomeCard';
import { generatePageMetadata } from '@/lib/core/metadata';

const JSON_LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://pattern-paradise.shop/#website',
    name: 'Pattern Paradise',
    alternateName: 'Pattern Paradise – Where Creativity Pays Off',
    url: 'https://pattern-paradise.shop',
    inLanguage: ['en', 'de'],
    description:
      'Pattern Paradise is an online marketplace and community for crochet and knitting patterns. It is a platform where designers sell digital patterns and makers discover, buy, and test handmade designs.',
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: 'https://pattern-paradise.shop/en/?q={search_term_string}',
        'query-input': 'required name=search_term_string',
        inLanguage: 'en',
      },
      {
        '@type': 'SearchAction',
        target: 'https://pattern-paradise.shop/de/?q={search_term_string}',
        'query-input': 'required name=search_term_string',
        inLanguage: 'de',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://pattern-paradise.shop/#organization',
    name: 'Pattern Paradise',
    url: 'https://pattern-paradise.shop',
    logo: 'https://pattern-paradise.shop/icons/ios/512.png',
    slogan: 'Where Creativity Pays Off.',
    description:
      'Pattern Paradise is a marketplace and community for crocheters and knitters. It is built to help creators upload and monetize patterns and to help makers buy, download, and test designs with the community.',
    brand: {
      '@type': 'Brand',
      name: 'Pattern Paradise',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': 'https://pattern-paradise.shop/en/how-to#howto-upload-pattern',
    url: 'https://pattern-paradise.shop/en/how-to#howto-upload-pattern',
    name: 'How to Upload a Pattern on Pattern Paradise',
    inLanguage: 'en',
    description:
      'This guide explains how to upload a crochet or knitting pattern to Pattern Paradise so it can be listed on the marketplace.',
    publisher: { '@id': 'https://pattern-paradise.shop/#organization' },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Fill in the basic details',
        text: 'Enter the required pattern information such as title and description.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Choose the category',
        text: 'Select a craft type such as Crocheting or Knitting and choose related subcategories such as Toys/Amigurumi or Clothes.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Upload images',
        text: 'Upload 1 to 6 high-quality images of the finished project. Reorder with drag-and-drop and remove images if needed. At least one image is required.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Upload the pattern file(s)',
        text: 'Upload the pattern in PDF format. Multiple files in different languages can be uploaded and reordered. Each PDF should include the complete pattern.',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Optional: join Mystery Pattern',
        text: 'If the pattern is not free, choose whether to join the Mystery Patterns program for extra exposure via mystery boxes sold at $3.',
      },
      {
        '@type': 'HowToStep',
        position: 6,
        name: 'Submit the pattern',
        text: 'Click Start Upload, upload images and pattern files, and save the listing.',
      },
      {
        '@type': 'HowToStep',
        position: 7,
        name: 'Reset if needed',
        text: 'Click Reset Form to clear the form and start the next upload.',
      },
      {
        '@type': 'HowToStep',
        position: 8,
        name: 'After successful upload',
        text: 'After upload, you will be redirected to a success page and you can start a tester call to gather feedback.',
      },
    ],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://pattern-paradise.shop/en/how-to',
    },
    isPartOf: { '@id': 'https://pattern-paradise.shop/#website' },
    translationOfWork: {
      '@type': 'CreativeWork',
      '@id': 'https://pattern-paradise.shop/de/how-to#howto-upload-pattern',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': 'https://pattern-paradise.shop/en/how-to#howto-apply-tester-call',
    url: 'https://pattern-paradise.shop/en/how-to#howto-apply-tester-call',
    name: 'How to Apply for a Tester Call on Pattern Paradise',
    inLanguage: 'en',
    description:
      'This guide explains how to apply for a tester call to preview upcoming patterns and help designers refine their work.',
    publisher: { '@id': 'https://pattern-paradise.shop/#organization' },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Log in or sign up',
        text: 'You must be logged into an account to apply for a tester call. If you are not logged in, you will be redirected to sign up or log in.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Visit the tester call page',
        text: 'Open a tester call from your dashboard, via social media links, or by browsing the Tester Calls section. Review the pattern details, designer information, skill level, time commitment, benefits, and requirements.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Review requirements',
        text: 'Confirm you meet the required skill level, can finish within the time frame, can share progress and feedback, and can submit final project photos.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Understand the perks',
        text: 'Testers can receive the pattern for free, get credited in the final design, gain early access, and connect with the community.',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Apply as a tester',
        text: 'Click Apply as a Tester, confirm in the popup, and submit the application. The designer reviews applications and accepted testers receive an email with next steps.',
      },
      {
        '@type': 'HowToStep',
        position: 6,
        name: 'Leave the tester list if needed',
        text: 'Use the leave option in the success message, confirm in the popup, and you will be removed from the tester list. You can reapply later.',
      },
    ],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://pattern-paradise.shop/en/how-to',
    },
    isPartOf: { '@id': 'https://pattern-paradise.shop/#website' },
    translationOfWork: {
      '@type': 'CreativeWork',
      '@id': 'https://pattern-paradise.shop/de/how-to#howto-apply-tester-call',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': 'https://pattern-paradise.shop/en/how-to#howto-tester-chat',
    url: 'https://pattern-paradise.shop/en/how-to#howto-tester-chat',
    name: 'How to Use the Tester Chat on Pattern Paradise',
    inLanguage: 'en',
    description:
      'This guide explains how to use the dedicated tester chat to collaborate with designers and other testers during a tester call.',
    publisher: { '@id': 'https://pattern-paradise.shop/#organization' },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Send messages',
        text: 'Use the chat to send and receive real-time messages with the designer and other testers.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Share progress images or files',
        text: 'Attach photos or PDFs such as WIP images or notes.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Reply with context',
        text: 'Reply to specific messages so feedback is easy to follow.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Download the latest pattern file',
        text: 'Download and use the latest pattern version shared in the tester call.',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Leave a review',
        text: 'Submit a final review after finishing the project.',
      },
      {
        '@type': 'HowToStep',
        position: 6,
        name: 'View other testers',
        text: 'Check who is participating in the testing group.',
      },
    ],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://pattern-paradise.shop/en/how-to',
    },
    isPartOf: { '@id': 'https://pattern-paradise.shop/#website' },
    translationOfWork: {
      '@type': 'CreativeWork',
      '@id': 'https://pattern-paradise.shop/de/how-to#howto-tester-chat',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://pattern-paradise.shop/en/how-to#page',
    url: 'https://pattern-paradise.shop/en/how-to',
    name: 'How To Guides',
    inLanguage: 'en',
    description:
      'How-to guides for Pattern Paradise. It includes step-by-step instructions for uploading patterns, applying to tester calls, and using the tester chat.',
    isPartOf: { '@id': 'https://pattern-paradise.shop/#website' },
    about: { '@id': 'https://pattern-paradise.shop/#organization' },
    hasPart: [
      { '@id': 'https://pattern-paradise.shop/en/how-to#howto-upload-pattern' },
      { '@id': 'https://pattern-paradise.shop/en/how-to#howto-apply-tester-call' },
      { '@id': 'https://pattern-paradise.shop/en/how-to#howto-tester-chat' },
    ],
    publisher: { '@id': 'https://pattern-paradise.shop/#organization' },
    translationOfWork: {
      '@type': 'CreativeWork',
      '@id': 'https://pattern-paradise.shop/de/how-to#page',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': 'https://pattern-paradise.shop/de/how-to#howto-upload-pattern',
    url: 'https://pattern-paradise.shop/de/how-to#howto-upload-pattern',
    name: 'So lädst du eine Anleitung auf Pattern Paradise hoch',
    inLanguage: 'de',
    description:
      'Diese Anleitung erklärt, wie du eine Häkel- oder Strickanleitung auf Pattern Paradise hochlädst, damit sie im Marktplatz sichtbar wird.',
    publisher: { '@id': 'https://pattern-paradise.shop/#organization' },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Basisdaten ausfüllen',
        text: 'Gib die Pflichtangaben ein, zum Beispiel Titel und Beschreibung.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Kategorie auswählen',
        text: 'Wähle die Technik wie Häkeln oder Stricken und passende Unterkategorien wie Amigurumi oder Kleidung.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Bilder hochladen',
        text: 'Lade 1 bis 6 hochwertige Bilder deines fertigen Projekts hoch. Du kannst Bilder per Drag-and-drop sortieren und entfernen. Mindestens ein Bild ist erforderlich.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Anleitungsdatei(en) hochladen',
        text: 'Lade die Anleitung als PDF hoch. Du kannst mehrere Dateien in verschiedenen Sprachen hochladen und sortieren. Jede PDF sollte die vollständige Anleitung enthalten.',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Optional: Mystery Pattern aktivieren',
        text: 'Wenn die Anleitung nicht kostenlos ist, kannst du sie optional für das Mystery-Pattern-Programm freigeben, um zusätzliche Reichweite über Mystery-Boxen für 3$ zu erhalten.',
      },
      {
        '@type': 'HowToStep',
        position: 6,
        name: 'Anleitung einreichen',
        text: 'Klicke auf Start Upload, lade Bilder und Dateien hoch und speichere das Listing.',
      },
      {
        '@type': 'HowToStep',
        position: 7,
        name: 'Bei Bedarf zurücksetzen',
        text: 'Mit Reset Form kannst du das Formular leeren und mit der nächsten Anleitung starten.',
      },
      {
        '@type': 'HowToStep',
        position: 8,
        name: 'Nach erfolgreichem Upload',
        text: 'Nach dem Upload wirst du auf eine Erfolgsseite weitergeleitet und kannst optional einen Tester Call starten, um Feedback zu sammeln.',
      },
    ],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://pattern-paradise.shop/de/how-to',
    },
    isPartOf: { '@id': 'https://pattern-paradise.shop/#website' },
    workTranslation: {
      '@type': 'CreativeWork',
      '@id': 'https://pattern-paradise.shop/en/how-to#howto-upload-pattern',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': 'https://pattern-paradise.shop/de/how-to#howto-apply-tester-call',
    url: 'https://pattern-paradise.shop/de/how-to#howto-apply-tester-call',
    name: 'So bewirbst du dich für einen Tester Call auf Pattern Paradise',
    inLanguage: 'de',
    description:
      'Diese Anleitung erklärt, wie du dich für einen Tester Call bewirbst, um neue Anleitungen vorab zu testen und Designer:innen beim Verbessern zu helfen.',
    publisher: { '@id': 'https://pattern-paradise.shop/#organization' },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Einloggen oder registrieren',
        text: 'Du musst eingeloggt sein, um dich zu bewerben. Wenn du nicht eingeloggt bist, wirst du zur Login- oder Registrierungsseite weitergeleitet.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Tester-Call-Seite öffnen',
        text: 'Öffne einen Tester Call über dein Dashboard, über Social-Media-Links oder über den Bereich Tester Calls. Prüfe Musterbeschreibung, Designer-Infos, Skill-Level, Zeitrahmen, Benefits und Anforderungen.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Anforderungen prüfen',
        text: 'Stelle sicher, dass du das geforderte Skill-Level erfüllst, im Zeitrahmen fertig wirst, Fortschritt und Feedback teilst und Abschlussfotos hochlädst.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Vorteile kennen',
        text: 'Tester:innen erhalten die Anleitung oft kostenlos, werden in der finalen Version erwähnt, bekommen frühzeitigen Zugang und knüpfen Kontakte in der Community.',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Als Tester:in bewerben',
        text: 'Klicke auf Apply as a Tester, bestätige im Popup und sende die Bewerbung ab. Der/die Designer:in prüft die Bewerbung. Bei Zusage erhältst du eine E-Mail mit den nächsten Schritten.',
      },
      {
        '@type': 'HowToStep',
        position: 6,
        name: 'Bei Bedarf austreten',
        text: 'Nutze die Leave-Option in der Bestätigungsmeldung, bestätige im Popup und du wirst von der Tester-Liste entfernt. Du kannst dich später erneut bewerben.',
      },
    ],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://pattern-paradise.shop/de/how-to',
    },
    isPartOf: { '@id': 'https://pattern-paradise.shop/#website' },
    workTranslation: {
      '@type': 'CreativeWork',
      '@id': 'https://pattern-paradise.shop/en/how-to#howto-apply-tester-call',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': 'https://pattern-paradise.shop/de/how-to#howto-tester-chat',
    url: 'https://pattern-paradise.shop/de/how-to#howto-tester-chat',
    name: 'So nutzt du den Tester-Chat auf Pattern Paradise',
    inLanguage: 'de',
    description:
      'Diese Anleitung erklärt, wie du den Tester-Chat nutzt, um während eines Tester Calls mit Designer:innen und anderen Tester:innen zusammenzuarbeiten.',
    publisher: { '@id': 'https://pattern-paradise.shop/#organization' },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Nachrichten senden',
        text: 'Nutze den Chat, um in Echtzeit mit dem/der Designer:in und anderen Tester:innen zu schreiben.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Fortschritt teilen',
        text: 'Hänge Fotos oder PDFs an, zum Beispiel WIP-Bilder oder Notizen.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Mit Kontext antworten',
        text: 'Antworte direkt auf Nachrichten, damit Feedback besser nachvollziehbar ist.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Aktuelle Anleitung herunterladen',
        text: 'Lade die neueste Version der Anleitungsdatei herunter und nutze sie für dein Projekt.',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Review abgeben',
        text: 'Gib nach Abschluss eine finale Bewertung ab.',
      },
      {
        '@type': 'HowToStep',
        position: 6,
        name: 'Andere Tester:innen ansehen',
        text: 'Sieh dir an, wer an der Testgruppe teilnimmt.',
      },
    ],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://pattern-paradise.shop/de/how-to',
    },
    isPartOf: { '@id': 'https://pattern-paradise.shop/#website' },
    workTranslation: {
      '@type': 'CreativeWork',
      '@id': 'https://pattern-paradise.shop/en/how-to#howto-tester-chat',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://pattern-paradise.shop/de/how-to#page',
    url: 'https://pattern-paradise.shop/de/how-to',
    name: 'How-To Guides',
    inLanguage: 'de',
    description:
      'How-to Guides für Pattern Paradise. Die Seite enthält Schritt-für-Schritt-Anleitungen für Uploads, Tester Calls und den Tester-Chat.',
    isPartOf: { '@id': 'https://pattern-paradise.shop/#website' },
    about: { '@id': 'https://pattern-paradise.shop/#organization' },
    hasPart: [
      { '@id': 'https://pattern-paradise.shop/de/how-to#howto-upload-pattern' },
      { '@id': 'https://pattern-paradise.shop/de/how-to#howto-apply-tester-call' },
      { '@id': 'https://pattern-paradise.shop/de/how-to#howto-tester-chat' },
    ],
    publisher: { '@id': 'https://pattern-paradise.shop/#organization' },
    workTranslation: {
      '@type': 'CreativeWork',
      '@id': 'https://pattern-paradise.shop/en/how-to#page',
    },
  },
];

export async function generateMetadata({ params }: { params: { lang: string } }) {
  return generatePageMetadata('/how-to', params.lang);
}

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function HowToPage({ params }: Props) {
  const p = await params;
  const lang = p.lang || 'en';
  const { default: messages } = await import(`@/i18n/translations/${lang}/messages.json`);

  const t = (key: string): any => {
    const path = key.split('.');
    return path.reduce((acc, part) => acc?.[part], messages);
  };

  return (
    <div>
      <div className="space-y-4 mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t('howTo.title')}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{t('howTo.subtitle')}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="grid w-full grid-cols-1 mb-6">
          <TabsTrigger value="all">{t('howTo.tabs.all')}</TabsTrigger>
        </TabsList>

        <WelcomeCard />

        {['all', 'patterns', 'testing', 'account', 'payments'].map((tabKey) => (
          <TabsContent key={tabKey} value={tabKey} className="space-y-6 mt-0">
            {tabKey === 'all' || tabKey === 'patterns' ? (
              <GuideSection
                title={t('howTo.sections.uploadPattern.title')}
                description={t('howTo.sections.uploadPattern.description')}
                defaultOpen={tabKey === 'all'}
              >
                <p className="text-muted-foreground mb-4">
                  {t('howTo.sections.uploadPattern.intro')}
                </p>
                {Object.entries(t('howTo.sections.uploadPattern.steps')).map(
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
                    {t('howTo.sections.uploadPattern.errors.title')}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {t('howTo.sections.uploadPattern.errors.items').map(
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
                title={t('howTo.sections.testerCall.title')}
                description={t('howTo.sections.testerCall.description')}
                defaultOpen={tabKey === 'all'}
              >
                <p className="text-muted-foreground mb-4">{t('howTo.sections.testerCall.intro')}</p>
                {Object.entries(t('howTo.sections.testerCall.steps')).map(
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
                    {t('howTo.sections.testerCall.limitations.title')}
                  </h4>
                  <ul className="mt-2 space-y-1">
                    {t('howTo.sections.testerCall.limitations.list').map(
                      (line: string, i: number) => (
                        <li key={i}>• {line}</li>
                      ),
                    )}
                  </ul>
                </div>

                <div className="mt-4 text-center p-4 border border-primary/20 rounded-lg bg-primary/5">
                  <h4 className="font-medium text-lg text-primary">
                    {t('howTo.sections.testerCall.cta.title')}
                  </h4>
                  <p className="mt-1">{t('howTo.sections.testerCall.cta.description')}</p>
                </div>
              </GuideSection>
            ) : null}

            {tabKey === 'all' || tabKey === 'testing' ? (
              <GuideSection
                title={t('howTo.sections.chat.title')}
                description={t('howTo.sections.chat.description')}
                defaultOpen={tabKey === 'all'}
              >
                <p className="text-muted-foreground mb-4">{t('howTo.sections.chat.intro')}</p>
                <div className="mb-8 rounded-lg bg-muted/50 p-4">
                  <h4 className="font-semibold text-lg mb-3">
                    {t('howTo.sections.chat.features.title')}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                    {t('howTo.sections.chat.features.items').map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-start gap-3">
                        <span className="font-medium flex-1 min-w-20">{item.title}</span>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {Object.entries(t('howTo.sections.chat.actions')).map(
                  ([key, value]: any, index) => (
                    <StepItem key={key} number={index + 1} title={value}>
                      <p>{value}</p>
                    </StepItem>
                  ),
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="rounded-lg bg-blue-50 p-4">
                    <h4 className="font-semibold text-lg mb-3 text-blue-700 flex items-center gap-2">
                      <span className="text-xl">🟢</span> {t('howTo.sections.chat.realtime.title')}
                    </h4>
                    <p>{t('howTo.sections.chat.realtime.description')}</p>
                  </div>

                  <div className="rounded-lg bg-purple-50 p-4">
                    <h4 className="font-semibold text-lg mb-3 text-primary flex items-center gap-2">
                      <span className="text-xl">📦</span> {t('howTo.sections.chat.systemBox.title')}
                    </h4>
                    <p>{t('howTo.sections.chat.systemBox.description')}</p>
                    <ul className="mt-2 space-y-1">
                      {t('howTo.sections.chat.systemBox.list').map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    <p className="mt-2 text-sm">{t('howTo.sections.chat.systemBox.note')}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-lg bg-destructive/10 p-4">
                  <h4 className="font-semibold text-lg mb-3 text-destructive">
                    {t('howTo.sections.chat.limitations.title')}
                  </h4>
                  <ul className="mt-2 space-y-1">
                    {t('howTo.sections.chat.limitations.list').map((line: string, i: number) => (
                      <li key={i}>• {line}</li>
                    ))}
                  </ul>
                  <p className="mt-3">{t('howTo.sections.chat.limitations.note')}</p>
                </div>

                <div className="mt-4 p-4 border border-primary/20 rounded-lg bg-primary/5">
                  <h4 className="font-medium text-lg mb-2">
                    {t('howTo.sections.chat.leaving.title')}
                  </h4>
                  <ol className="mt-2 space-y-1">
                    {t('howTo.sections.chat.leaving.steps').map((step: string, i: number) => (
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
        <h2 className="text-xl font-medium">{t('howTo.help.heading')}</h2>
        <p className="text-muted-foreground">{t('howTo.help.description')}</p>
        <div className="flex justify-center gap-3 mt-4">
          <Button asChild>
            <Link href="/help" className="space-x-2">
              <MessageSquare size={16} />
              {t('howTo.help.contact')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
