import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    "Informativa sul trattamento dei dati personali di Terra Bonifica ai sensi del Regolamento UE 2016/679 (GDPR).",
}

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-green-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 max-w-2xl text-xl text-green-200">
            Informativa sul trattamento dei dati personali ai sensi dell'art. 13 del Regolamento UE
            2016/679 (GDPR).
          </p>
          <p className="mt-2 text-sm text-green-400">Ultimo aggiornamento: maggio 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12 text-gray-700">

            {/* Titolare */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">1. Titolare del trattamento</h2>
              <p className="mt-4">
                Il titolare del trattamento dei dati personali raccolti tramite il presente sito web
                è <strong>Terra Bonifica</strong>, contattabile all'indirizzo e-mail{' '}
                <a
                  href="mailto:privacy@terrabonifica.it"
                  className="text-green-700 underline hover:text-green-600"
                >
                  privacy@terrabonifica.it
                </a>
                .
              </p>
            </div>

            {/* Dati raccolti */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">2. Dati personali raccolti</h2>
              <p className="mt-4">
                Durante la navigazione del sito possono essere trattate le seguenti categorie di
                dati:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>
                  <strong>Dati di navigazione</strong>: indirizzi IP, tipo di browser, sistema
                  operativo, pagine visitate, orario di accesso e altri parametri tecnici trasmessi
                  automaticamente dai protocolli di comunicazione.
                </li>
                <li>
                  <strong>Dati analitici (solo previo consenso)</strong>: informazioni aggregate sul
                  comportamento degli utenti raccolte tramite Google Analytics 4, quali pagine
                  visualizzate, tempo di permanenza e provenienza del traffico.
                </li>
                <li>
                  <strong>Dati forniti volontariamente</strong>: eventuali dati inseriti nei moduli
                  di contatto presenti sul sito, come nome e indirizzo e-mail.
                </li>
              </ul>
            </div>

            {/* Finalità e basi giuridiche */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                3. Finalità e basi giuridiche del trattamento
              </h2>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-5">
                  <h3 className="font-semibold text-gray-900">Erogazione del servizio</h3>
                  <p className="mt-2 text-sm">
                    I dati di navigazione sono trattati per garantire il corretto funzionamento del
                    sito e per fini di sicurezza informatica. La base giuridica è il{' '}
                    <strong>legittimo interesse</strong> del titolare (art. 6, par. 1, lett. f GDPR).
                  </p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-5">
                  <h3 className="font-semibold text-gray-900">Analisi statistica delle visite</h3>
                  <p className="mt-2 text-sm">
                    I dati analitici vengono raccolti solo previo <strong>consenso</strong>{' '}
                    dell'utente (art. 6, par. 1, lett. a GDPR) tramite il banner cookie. Il consenso
                    è revocabile in qualsiasi momento dalla stessa pagina o dalla{' '}
                    <Link href="/cookie-policy" className="text-green-700 underline hover:text-green-600">
                      Cookie Policy
                    </Link>
                    .
                  </p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-5">
                  <h3 className="font-semibold text-gray-900">Gestione delle richieste di contatto</h3>
                  <p className="mt-2 text-sm">
                    I dati forniti tramite moduli di contatto sono trattati per rispondere alle
                    richieste dell'utente. La base giuridica è l'<strong>esecuzione di misure
                    precontrattuali</strong> o il <strong>consenso</strong> dell'interessato
                    (art. 6, par. 1, lett. b e a GDPR).
                  </p>
                </div>
              </div>
            </div>

            {/* Cookie */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">4. Cookie e tecnologie di tracciamento</h2>
              <p className="mt-4">
                Il sito utilizza cookie tecnici strettamente necessari al funzionamento e, previo
                consenso, cookie analitici di Google Analytics 4. Per una descrizione dettagliata
                dei cookie impiegati, consulta la{' '}
                <Link href="/cookie-policy" className="text-green-700 underline hover:text-green-600">
                  Cookie Policy
                </Link>
                .
              </p>
            </div>

            {/* Trasferimento */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">5. Trasferimento dei dati</h2>
              <p className="mt-4">
                I dati analitici raccolti tramite Google Analytics 4 possono essere trasferiti verso
                paesi terzi (inclusi gli Stati Uniti). Google LLC ha adottato le Clausole
                Contrattuali Standard approvate dalla Commissione Europea (art. 46 GDPR) come
                garanzia adeguata per il trasferimento. Per ulteriori informazioni, consulta
                l'informativa privacy di Google:{' '}
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

            {/* Conservazione */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">6. Tempi di conservazione</h2>
              <p className="mt-4">I dati personali sono conservati per i tempi strettamente necessari alle finalità per cui sono stati raccolti:</p>
              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>
                  <strong>Dati di navigazione e log</strong>: al massimo 90 giorni, salvo esigenze
                  di accertamento di reati o difesa in giudizio.
                </li>
                <li>
                  <strong>Dati analitici (Google Analytics 4)</strong>: 14 mesi come impostazione
                  predefinita del servizio; la raccolta inizia solo previo consenso.
                </li>
                <li>
                  <strong>Richieste di contatto</strong>: per il tempo necessario a dare riscontro
                  alla richiesta e, successivamente, per il periodo previsto dagli obblighi di
                  conservazione legale.
                </li>
              </ul>
            </div>

            {/* Diritti */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">7. Diritti dell'interessato</h2>
              <p className="mt-4">
                Ai sensi degli artt. 15–22 del GDPR, ogni interessato ha il diritto di:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>
                  <strong>Accesso</strong>: ottenere conferma che siano in corso trattamenti di dati
                  che lo riguardano e riceverne copia.
                </li>
                <li>
                  <strong>Rettifica</strong>: ottenere la correzione di dati inesatti o incompleti.
                </li>
                <li>
                  <strong>Cancellazione</strong>: ottenere la cancellazione dei propri dati ("diritto
                  all'oblio"), nei casi previsti dalla normativa.
                </li>
                <li>
                  <strong>Limitazione del trattamento</strong>: richiedere la sospensione del
                  trattamento in determinati casi.
                </li>
                <li>
                  <strong>Portabilità</strong>: ricevere i propri dati in formato strutturato e di
                  uso comune, o richiederne il trasferimento a un altro titolare.
                </li>
                <li>
                  <strong>Opposizione</strong>: opporsi al trattamento fondato sul legittimo
                  interesse del titolare.
                </li>
                <li>
                  <strong>Revoca del consenso</strong>: revocare in qualsiasi momento il consenso
                  precedentemente prestato, senza pregiudicare la liceità del trattamento effettuato
                  prima della revoca.
                </li>
              </ul>
              <p className="mt-4">
                Per esercitare i propri diritti è possibile contattare il titolare all'indirizzo{' '}
                <a
                  href="mailto:privacy@terrabonifica.it"
                  className="text-green-700 underline hover:text-green-600"
                >
                  privacy@terrabonifica.it
                </a>
                . L'interessato ha altresì il diritto di proporre reclamo al Garante per la
                Protezione dei Dati Personali (
                <a
                  href="https://www.garanteprivacy.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 underline hover:text-green-600"
                >
                  www.garanteprivacy.it
                </a>
                ).
              </p>
            </div>

            {/* Modifiche */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">8. Modifiche alla presente informativa</h2>
              <p className="mt-4">
                Il titolare si riserva il diritto di apportare modifiche alla presente informativa in
                qualsiasi momento, dandone pubblicità sul sito. Si invita a consultare
                periodicamente questa pagina. Le modifiche hanno effetto dalla data di pubblicazione.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="bg-green-50 py-10">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-gray-600">
            Per informazioni sui cookie utilizzati consulta la{' '}
            <Link href="/cookie-policy" className="font-medium text-green-700 hover:underline">
              Cookie Policy
            </Link>
            . Per qualsiasi richiesta scrivi a{' '}
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
