import type { Metadata } from 'next'
import Link from 'next/link'
import { OG_BASE } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Chi Siamo',
  description:
    'Conosci il team di Terra Bonifica: professionisti e ricercatori impegnati nella bonifica e rigenerazione del suolo.',
  openGraph: {
    ...OG_BASE,
    title: 'Chi Siamo | Terra Bonifica',
    description:
      'Un gruppo interdisciplinare di ingegneri ambientali, pedologi, microbiologi e comunicatori scientifici uniti dalla missione di accelerare la bonifica dei suoli contaminati in Italia.',
    url: '/chi-siamo',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Chi Siamo — Il team di Terra Bonifica',
      },
    ],
  },
}

export default function ChiSiamoPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-green-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Chi Siamo</h1>
          <p className="mt-4 max-w-2xl text-xl text-green-200">
            Un gruppo interdisciplinare di professionisti, ricercatori e comunicatori accomunati
            dalla passione per la tutela del suolo.
          </p>
        </div>
      </section>

      {/* Mission statement */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">La nostra storia</h2>
            <p className="mt-5 text-lg text-gray-600">
              Terra Bonifica è nata dall'incontro tra esperti di ingegneria ambientale, pedologia,
              biologia del suolo e comunicazione scientifica che condividono una visione comune:
              il suolo è una risorsa non rinnovabile su scala umana e la sua protezione richiede
              approcci innovativi, interdisciplinari e accessibili a tutti.
            </p>
            <p className="mt-4 text-lg text-gray-600">
              La nostra piattaforma riunisce competenze che spaziano dalla chimica analitica alla
              normativa ambientale, dalla modellazione idrogeologica alla comunicazione pubblica,
              per offrire una prospettiva integrata sulla sfida della bonifica.
            </p>
          </div>
        </div>
      </section>

      {/* Competenze del team */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Le nostre competenze</h2>
          <p className="mt-4 max-w-2xl text-gray-600">
            Il team copre tutte le discipline necessarie a un approccio completo alla bonifica dei
            siti contaminati.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                area: 'Ingegneria Ambientale',
                description:
                  'Progettazione e supervisione di interventi di bonifica, analisi di rischio e valutazione delle opzioni tecnologiche.',
              },
              {
                area: 'Pedologia e Scienze del Suolo',
                description:
                  'Caratterizzazione delle proprietà fisico-chimiche del suolo e comprensione dei meccanismi di trasporto e ritenzione dei contaminanti.',
              },
              {
                area: 'Microbiologia Ambientale',
                description:
                  'Studio delle comunità microbiche del suolo e sviluppo di inoculi batterici per il biorisanamento di contaminanti organici.',
              },
              {
                area: 'Botanica Applicata',
                description:
                  'Selezione e coltura di specie vegetali adatte alla fitorimediazione e al recupero della biodiversità post-bonifica.',
              },
              {
                area: 'Normativa e Diritto Ambientale',
                description:
                  'Interpretazione e applicazione del quadro normativo nazionale ed europeo in materia di siti contaminati e procedure di bonifica.',
              },
              {
                area: 'Comunicazione Scientifica',
                description:
                  'Traduzione di contenuti tecnici complessi in informazioni accessibili per il pubblico generalista e gli stakeholder locali.',
              },
            ].map(({ area, description }) => (
              <div
                key={area}
                className="rounded-xl border border-green-100 bg-white p-6 shadow-sm"
              >
                <div className="h-1 w-12 rounded-full bg-green-600" />
                <h3 className="mt-4 font-semibold text-gray-900">{area}</h3>
                <p className="mt-2 text-sm text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valori */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">I nostri valori</h2>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            {[
              {
                title: 'Rigore scientifico',
                body: 'Basiamo ogni affermazione su evidenze peer-reviewed e dati empirici. Distinguiamo nettamente tra risultati consolidati, ipotesi di ricerca e opinioni degli autori.',
              },
              {
                title: 'Accessibilità',
                body: 'La conoscenza sulla bonifica deve essere alla portata di tutti: da chi vive vicino a un sito contaminato a chi deve decidere come intervenire.',
              },
              {
                title: 'Sostenibilità integrata',
                body: 'Valutiamo ogni tecnica di bonifica non solo per la sua efficacia tecnica, ma anche per il bilancio energetico, la riduzione delle emissioni e il ripristino degli ecosistemi.',
              },
              {
                title: 'Collaborazione aperta',
                body: 'Lavoriamo in rete con università, enti pubblici, associazioni di categoria e organizzazioni della società civile per moltiplicare l'impatto delle nostre attività.',
              },
            ].map(({ title, body }) => (
              <div key={title} className="flex gap-5">
                <div className="mt-1 flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="mt-1 text-gray-600">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner */}
      <section className="bg-green-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Con chi collaboriamo</h2>
          <p className="mt-4 max-w-2xl text-gray-600">
            La nostra rete include enti di ricerca, università, laboratori analitici e soggetti
            istituzionali con cui condividiamo dati, metodologie e risultati.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Istituti universitari di ingegneria ambientale',
              'Laboratori di analisi del suolo',
              'Enti pubblici di controllo ambientale',
              'Associazioni di agricoltori biologici',
              'Consorzi di bonifica idraulica',
              'Organizzazioni internazionali del settore',
            ].map((partner) => (
              <div
                key={partner}
                className="rounded-lg border border-green-200 bg-white px-5 py-4 text-sm text-gray-700"
              >
                {partner}
              </div>
            ))}
          </div>
          <p className="mt-8 text-gray-600">
            Sei un'istituzione o un'organizzazione interessata a collaborare?{' '}
            <Link href="/contatti" className="font-medium text-green-700 hover:underline">
              Contattaci
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  )
}
