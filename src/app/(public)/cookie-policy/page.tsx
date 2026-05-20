import type { Metadata } from 'next'
import Link from 'next/link'
import { OG_BASE } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    "Informativa sull'uso dei cookie nel sito Terra Bonifica: tipologie, finalità e modalità di gestione del consenso.",
  openGraph: {
    ...OG_BASE,
    title: 'Cookie Policy | Terra Bonifica',
    description:
      "Informativa sull'uso dei cookie e tecnologie di tracciamento nel sito terrabonifica.it: cookie tecnici, cookie analitici GA4 e Consent Mode v2.",
    url: '/cookie-policy',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Cookie Policy Terra Bonifica',
      },
    ],
  },
}

export default function CookiePolicyPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-green-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Cookie Policy</h1>
          <p className="mt-4 max-w-2xl text-xl text-green-200">
            Informativa sull'uso dei cookie e di tecnologie di tracciamento analoghe sul sito
            terrabonifica.it.
          </p>
          <p className="mt-2 text-sm text-green-400">Ultimo aggiornamento: maggio 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12 text-gray-700">

            {/* Cosa sono i cookie */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">1. Cosa sono i cookie</h2>
              <p className="mt-4">
                I cookie sono piccoli file di testo che i siti web visitati dall'utente inviano al
                dispositivo dell'utente stesso, dove vengono memorizzati per essere poi ritrasmessi
                agli stessi siti alla visita successiva. I cookie permettono al sito di ricordare le
                azioni e le preferenze dell'utente per un certo periodo di tempo, evitando che
                debbano essere indicate nuovamente.
              </p>
              <p className="mt-3">
                Tecnologie analoghe ai cookie, come il local storage del browser, possono essere
                utilizzate per scopi equivalenti. Il presente documento si riferisce a entrambe le
                categorie.
              </p>
            </div>

            {/* Tipologie */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">2. Tipologie di cookie utilizzati</h2>
              <p className="mt-4">
                Il presente sito utilizza le seguenti tipologie di cookie e tecnologie assimilabili:
              </p>

              {/* Tecnici */}
              <div className="mt-6 rounded-xl border border-green-100 bg-green-50 p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
                    T
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">Cookie tecnici</h3>
                </div>
                <p className="mt-3 text-sm">
                  Sono necessari per il corretto funzionamento del sito e non richiedono il
                  consenso dell'utente. Comprendono:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                  <li>
                    <strong>Cookie di sessione</strong>: memorizzano temporaneamente lo stato della
                    navigazione e vengono eliminati alla chiusura del browser.
                  </li>
                  <li>
                    <strong>Cookie di autenticazione</strong>: riservati all'area backoffice, gestiti
                    da NextAuth.js per mantenere la sessione degli utenti autenticati.
                  </li>
                  <li>
                    <strong>Local storage — preferenze consenso</strong>: memorizza la scelta
                    dell'utente riguardo ai cookie analitici (chiave:{' '}
                    <code className="rounded bg-green-100 px-1 font-mono text-green-800">
                      cookie_consent
                    </code>
                    ) in modo da non riproporre il banner ad ogni visita.
                  </li>
                </ul>
                <p className="mt-3 text-xs text-gray-500">
                  Base giuridica: legittimo interesse / necessità tecnica (non soggetti a consenso).
                </p>
              </div>

              {/* Analitici */}
              <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
                    A
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">Cookie analitici di terze parti</h3>
                </div>
                <p className="mt-3 text-sm">
                  Utilizzati <strong>solo previo consenso</strong> per raccogliere informazioni
                  statistiche aggregate sull'utilizzo del sito. Consentono di migliorare la
                  struttura e i contenuti delle pagine web.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="border-b border-amber-200 text-left font-semibold text-gray-700">
                        <th className="py-2 pr-4">Cookie / Chiave</th>
                        <th className="py-2 pr-4">Fornitore</th>
                        <th className="py-2 pr-4">Scopo</th>
                        <th className="py-2">Durata</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100 text-gray-600">
                      <tr>
                        <td className="py-2 pr-4 font-mono">_ga</td>
                        <td className="py-2 pr-4">Google Analytics 4</td>
                        <td className="py-2 pr-4">Distingue gli utenti univoci</td>
                        <td className="py-2">2 anni</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-mono">_ga_*</td>
                        <td className="py-2 pr-4">Google Analytics 4</td>
                        <td className="py-2 pr-4">Mantiene lo stato della sessione</td>
                        <td className="py-2">2 anni</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-mono">_gid</td>
                        <td className="py-2 pr-4">Google Analytics 4</td>
                        <td className="py-2 pr-4">Distingue gli utenti nell'arco di 24 ore</td>
                        <td className="py-2">24 ore</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  Base giuridica: consenso dell'utente (art. 6, par. 1, lett. a GDPR). I dati
                  possono essere trasferiti negli Stati Uniti in base alle Clausole Contrattuali
                  Standard.
                </p>
              </div>
            </div>

            {/* Google Analytics e Consent Mode */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                3. Google Analytics 4 e Consent Mode v2
              </h2>
              <p className="mt-4">
                Il sito integra <strong>Google Analytics 4</strong> (Google LLC, 1600 Amphitheatre
                Parkway, Mountain View, CA 94043, USA) per l'analisi statistica del traffico.
              </p>
              <p className="mt-3">
                Il sito implementa la <strong>Consent Mode v2</strong> di Google: prima che
                l'utente abbia espresso una scelta, tutti i parametri di consenso (
                <code className="rounded bg-gray-100 px-1 font-mono text-sm">
                  analytics_storage
                </code>
                ,{' '}
                <code className="rounded bg-gray-100 px-1 font-mono text-sm">ad_storage</code>)
                vengono impostati su <em>denied</em>. Nessun dato personale viene inviato a Google
                prima del consenso. Solo dopo che l'utente clicca su "Accetta", lo stato di consenso
                viene aggiornato e il tracciamento viene attivato.
              </p>
              <p className="mt-3">
                Per informazioni dettagliate su come Google tratta i dati raccolti, consulta
                l'informativa privacy di Google all'indirizzo{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 underline hover:text-green-600"
                >
                  policies.google.com/privacy
                </a>
                .
              </p>
            </div>

            {/* Gestione */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">4. Come gestire i cookie</h2>

              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-5">
                  <h3 className="font-semibold text-gray-900">
                    Tramite il banner di consenso del sito
                  </h3>
                  <p className="mt-2 text-sm">
                    Al primo accesso al sito viene mostrato un banner che consente di accettare o
                    rifiutare i cookie analitici. La scelta viene memorizzata nel local storage del
                    browser e non viene riproposta nelle visite successive.
                  </p>
                </div>

                <div className="rounded-lg border border-gray-100 bg-gray-50 p-5">
                  <h3 className="font-semibold text-gray-900">
                    Modifica o revoca del consenso
                  </h3>
                  <p className="mt-2 text-sm">
                    Per modificare le preferenze già espresse, è sufficiente cancellare la voce{' '}
                    <code className="rounded bg-gray-100 px-1 font-mono">cookie_consent</code>{' '}
                    dal local storage del browser (Strumenti sviluppatore → Application → Local
                    Storage) e ricaricare la pagina: il banner verrà nuovamente visualizzato.
                  </p>
                </div>

                <div className="rounded-lg border border-gray-100 bg-gray-50 p-5">
                  <h3 className="font-semibold text-gray-900">
                    Tramite le impostazioni del browser
                  </h3>
                  <p className="mt-2 text-sm">
                    La maggior parte dei browser consente di bloccare o eliminare i cookie
                    direttamente dalle impostazioni. Di seguito i link alle istruzioni dei principali
                    browser:
                  </p>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                    <li>
                      <a
                        href="https://support.google.com/chrome/answer/95647"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-700 underline hover:text-green-600"
                      >
                        Google Chrome
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-700 underline hover:text-green-600"
                      >
                        Mozilla Firefox
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://support.apple.com/it-it/guide/safari/sfri11471/mac"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-700 underline hover:text-green-600"
                      >
                        Apple Safari
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-700 underline hover:text-green-600"
                      >
                        Microsoft Edge
                      </a>
                    </li>
                  </ul>
                  <p className="mt-3 text-xs text-gray-500">
                    Attenzione: la disabilitazione dei cookie tecnici potrebbe compromettere alcune
                    funzionalità del sito.
                  </p>
                </div>

                <div className="rounded-lg border border-gray-100 bg-gray-50 p-5">
                  <h3 className="font-semibold text-gray-900">Opt-out Google Analytics</h3>
                  <p className="mt-2 text-sm">
                    È possibile disattivare il tracciamento di Google Analytics installando
                    l'estensione ufficiale per il browser:{' '}
                    <a
                      href="https://tools.google.com/dlpage/gaoptout"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-700 underline hover:text-green-600"
                    >
                      tools.google.com/dlpage/gaoptout
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Modifiche */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">5. Modifiche alla Cookie Policy</h2>
              <p className="mt-4">
                Il titolare si riserva il diritto di aggiornare la presente Cookie Policy. Le
                modifiche vengono pubblicate su questa pagina con indicazione della data di
                revisione. In caso di modifiche sostanziali che richiedano un nuovo consenso,
                il banner di consenso sarà ripresentato agli utenti.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="bg-green-50 py-10">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-gray-600">
            Per il trattamento completo dei dati personali consulta la{' '}
            <Link href="/privacy-policy" className="font-medium text-green-700 hover:underline">
              Privacy Policy
            </Link>
            . Per richieste specifiche scrivi a{' '}
            <a
              href="mailto:privacy@terrabonifica.it"
              className="font-medium text-green-700 hover:underline"
            >
              privacy@terrabonifica.it
            </a>
            .
          </p>
        </div>
      </section>
    </>
  )
}
