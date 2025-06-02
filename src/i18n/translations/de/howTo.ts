const howTo = {
  title: 'Anleitungen',
  subtitle: 'Schritt-für-Schritt-Anleitungen, um dich auf Pattern Paradise zurechtzufinden',
  tabs: {
    all: 'Alle Anleitungen',
    patterns: 'Muster-Anleitungen',
    testing: 'Test-Anleitungen',
    account: 'Konto-Anleitungen',
    payments: 'Zahlungs-Anleitungen',
  },
  sections: {
    uploadPattern: {
      title: 'So lädst du ein Muster hoch',
      description: 'Lerne, wie du deine Häkel- oder Strickmuster mit der Community teilen kannst',
      intro:
        'Willkommen bei Pattern Paradise! Folge diesen Schritten, um dein Häkel- oder Strickmuster auf der Plattform hochzuladen und mit der Welt zu teilen.',
      steps: {
        step1: {
          title: 'Gib die Basisinformationen ein',
          requiredFields: 'Pflichtfelder:',
          optionalFields: 'Optional:',
          hashtags: 'Füge bis zu 10 Hashtags hinzu, damit dein Muster leichter gefunden wird.',
          fields: {
            title: 'Titel: Halte ihn unter 30 Zeichen.',
            description: 'Beschreibung: Beschreibe dein Muster klar und deutlich.',
            price: 'Preis:',
            priceDetails: [
              'Gib deinen Preis in USD an.',
              'Oder wähle "Dieses Muster kostenlos anbieten", wenn es kostenlos ist.',
            ],
            experience:
              'Schwierigkeitsgrad: Wähle zwischen Anfänger, Mittelstufe oder Fortgeschritten.',
          },
        },
        step2: {
          title: 'Wähle die Kategorie',
          description:
            'Wähle eine Handarbeitsart (z. B. Häkeln oder Stricken) und die zugehörigen Unterkategorien (z. B. Spielzeug/Amigurumi, Kleidung usw.). So wird dein Muster im Marktplatz organisiert.',
        },
        step3: {
          title: 'Bilder hochladen',
          tips: [
            'Lade 1 bis 6 hochwertige Bilder deines fertigen Projekts hoch.',
            'Verwende den Drag-and-drop-Bereich, um die Bilder bei Bedarf neu anzuordnen.',
            'Du kannst ein Bild durch Klicken auf ✖️ entfernen.',
          ],
          warning: '⚠️ Du musst mindestens ein Bild hochladen, um fortzufahren.',
        },
        step4: {
          title: 'Musterdatei(en) hochladen',
          tips: [
            'Lade dein Muster im PDF-Format hoch.',
            'Du kannst mehrere Dateien in verschiedenen Sprachen hochladen.',
            'Ordne die Dateien bei Bedarf per Drag-and-drop neu.',
            'Jede PDF sollte dein vollständiges Muster enthalten.',
          ],
        },
        step5: {
          title: 'Option: Mystery-Muster',
          description1:
            'Wenn dein Muster nicht kostenlos ist, kannst du es im Mystery-Muster-Programm anbieten:',
          description2:
            'Sag "Ja", um deinem Muster durch Mystery-Boxen für 3 $ zusätzliche Sichtbarkeit zu verschaffen.',
        },
        step6: {
          title: 'Muster einreichen',
          description: 'Klicke unten auf "Upload starten".',
          systemSteps: [
            'Bilder hochladen.',
            'Musterdatei(en) hochladen.',
            'Musteranzeige speichern.',
          ],
          note: 'Bitte verlasse die Seite nicht, während der Upload läuft!',
        },
        step7: {
          title: 'Zurücksetzen, wenn nötig',
          description:
            'Einen Fehler gemacht oder ein neues Muster hochladen? Klicke auf "Formular zurücksetzen", um alles zu löschen und von vorne zu beginnen.',
        },
        step8: {
          title: 'Nach dem erfolgreichen Upload',
          description: 'Nach dem Upload:',
          items: [
            'Wirst du auf eine Erfolgsseite weitergeleitet.',
            'Kannst du einen Testaufruf für dein Muster starten, um Feedback zu sammeln.',
          ],
        },
      },
      errors: {
        title: 'Häufige Upload-Fehler (und Lösungen)',
        items: [
          {
            title: 'Titel/Beschreibung fehlt',
            description: 'Fülle alle mit * markierten Pflichtfelder aus',
          },
          {
            title: 'Zu viele Bilder',
            description: 'Lade nur 1–6 Bilder hoch',
          },
          {
            title: 'Keine Musterdatei hochgeladen',
            description: 'Lade mindestens eine PDF- oder Bilddatei hoch',
          },
          {
            title: 'Upload-Fehler',
            description: 'Erneut versuchen, wenn beim Hochladen ein Fehler auftritt',
          },
        ],
      },
    },

    testerCall: {
      title: 'So bewirbst du dich für einen Testaufruf',
      description:
        'Erfahre, wie du neue Muster vorab testen und Designer bei der Weiterentwicklung unterstützen kannst',
      intro:
        'Testaufrufe sind eine tolle Möglichkeit, neue Häkel- oder Strickmuster vorab zu sehen und den Designern beim Feinschliff zu helfen. So bewirbst du dich:',
      steps: {
        step1: {
          title: 'Einloggen oder registrieren',
          description:
            'Um dich für einen Testaufruf zu bewerben, musst du in deinem Konto eingeloggt sein.',
          note: 'Wenn du auf "Als Tester bewerben" klickst, ohne eingeloggt zu sein, wirst du zur Login-/Registrierungsseite weitergeleitet.',
        },
        step2: {
          title: 'Gehe zur Seite für Testaufrufe',
          list: [
            'In deinem Dashboard',
            'Über Links in sozialen Medien',
            'Oder im Bereich "Testaufrufe" auf Pattern Paradise',
          ],
          includes: [
            'Beschreibung des Musters',
            'Designer-Informationen',
            'Benötigtes Können',
            'Zeitaufwand',
            'Vorteile für Tester',
          ],
        },
        step3: {
          title: 'Überprüfe die Anforderungen',
          list: [
            'Benötigtes Können haben (z. B. Mittelstufe Häkeln)',
            'Projekt im angegebenen Zeitraum abschließen',
            'Fortschritte und Feedback teilen',
            'Abschlussfotos einreichen',
          ],
        },
        step4: {
          title: 'Vorteile kennen',
          list: [
            'Du erhältst das Muster kostenlos',
            'Du wirst im endgültigen Design erwähnt',
            'Du bekommst vorab Zugang zu exklusiven Mustern',
            'Du wirst Teil einer unterstützenden Community',
          ],
        },
        step5: {
          title: 'Als Tester bewerben',
          steps: [
            'Klicke auf "Als Tester bewerben".',
            'Ein Bestätigungsfenster erscheint – klicke auf "Weiter".',
            'Fertig! Du siehst eine Bestätigungsmeldung.',
          ],
          reviewNote:
            'Der Designer prüft deine Bewerbung. Wenn du angenommen wirst, erhältst du eine E-Mail mit den nächsten Schritten.',
        },
        step6: {
          title: 'Du hast es dir anders überlegt?',
          steps: [
            'Klicke im Erfolgsfenster auf "Hier klicken, um zu verlassen".',
            'Bestätige im Pop-up-Fenster deine Entscheidung.',
            'Du wirst aus der Tester-Liste entfernt (und kannst dich später erneut bewerben).',
          ],
        },
      },
      limitations: {
        title: 'Wann du dich nicht bewerben kannst',
        list: [
          'Du bist der Ersteller des Testaufrufs',
          'Du hast dich bereits beworben',
          'Der Aufruf ist geschlossen (z. B. "In Bearbeitung", "Genehmigt" oder "Abgelehnt")',
        ],
      },
      cta: {
        title: 'Bereit, ein Muster mitzugestalten?',
        description:
          'Gehe einfach auf die Seite eines Testaufrufs und klicke auf "Als Tester bewerben", um loszulegen!',
      },
    },

    chat: {
      title: 'So nutzt du den Tester-Chat',
      description: 'Erfahre, wie du im Chat mit Designern und anderen Testern zusammenarbeitest',
      intro:
        'Sobald du als Tester für ein Muster ausgewählt wurdest, wird ein dedizierter Chatraum erstellt. Dort kannst du mit anderen Testern und dem Designer kommunizieren, Fortschritte teilen und Feedback geben.',
      features: {
        title: 'Funktionen im Überblick',
        items: [
          {
            title: 'Chat',
            description:
              'Sende und empfange Nachrichten in Echtzeit mit dem Designer und anderen Testern',
          },
          {
            title: 'Dateien anhängen',
            description: 'Teile Fotos oder PDFs (z. B. WIP-Bilder, Notizen)',
          },
          {
            title: 'Antworten',
            description: 'Antworte auf bestimmte Nachrichten im Kontext',
          },
          {
            title: 'Systemnachrichten',
            description:
              'Erhalte Benachrichtigungen über wichtige Aktionen (z. B. Zuweisungen, Uploads)',
          },
          {
            title: 'Muster herunterladen',
            description: 'Zugriff auf die neueste Version der Musterdatei',
          },
          {
            title: 'Bewertung abgeben',
            description: 'Reiche deine abschließende Bewertung nach Projektabschluss ein',
          },
          {
            title: 'Andere Tester ansehen',
            description: 'Sieh, wer noch zur Testgruppe gehört',
          },
        ],
      },
      actions: {
        step1: 'Nachricht senden',
        step2: 'Fortschrittsbilder teilen',
        step3: 'Auf eine Nachricht antworten',
        step4: 'Muster herunterladen',
        step5: 'Bewertung abgeben',
        step6: 'Andere Tester ansehen',
      },
      realtime: {
        title: 'Echtzeit-Nachrichten',
        description: 'Nachrichten erscheinen in Echtzeit. Du musst die Seite nicht aktualisieren!',
      },
      systemBox: {
        title: 'Systemnachrichten',
        description: 'Achte auf Systemmeldungen von Pattern Paradise zu:',
        list: ['Muster-Updates', 'Fristen', 'Anweisungen vom Designer'],
        note: 'Diese erscheinen in einer orangefarbenen Box.',
      },
      limitations: {
        title: 'Wann du keine Nachrichten senden kannst',
        list: [
          'Der Test läuft nicht',
          'Deine Bewerbung wurde abgelehnt',
          'Der Test wurde abgebrochen oder storniert',
        ],
        note: 'Du kannst weiterhin den Chatverlauf ansehen und Muster herunterladen.',
      },
      leaving: {
        title: 'Du möchtest den Test verlassen?',
        steps: [
          'Bitte kontaktiere den Ersteller des Testaufrufs',
          'Nur der Ersteller kann dich aus der Gruppe entfernen',
        ],
      },
    },
  },
  help: {
    heading: 'Brauchst du weitere Hilfe?',
    description:
      'Nicht gefunden, was du suchst? Kontaktiere unser Support-Team oder sieh dir unsere zusätzlichen Ressourcen an.',
    contact: 'Support kontaktieren',
  },
};

export default howTo;
