import type { Metadata } from 'next'
import Link from 'next/link'
import { OG_BASE } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Il Progetto',
  description:
    'Scopri la missione, gli obiettivi e la metodologia di Terra Bonifica nel campo della bonifica del suolo contaminato.',
  openGraph: {
    ...OG_BASE,
    title: 'Il Progetto | Terra Bonifica',
    description:
      'Scopri la missione, gli obiettivi e la metodologia di Terra Bonifica: ricerca applicata, validazione sul campo e advocacy per la bonifica sostenibile dei siti contaminati.',
    url: '/il-progetto',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Il Progetto Terra Bonifica — Missione e metodologia',
      },
    ],
  },
}

export default function IlProgettoPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-green-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Il Progetto</h1>
          <p className="mt-4 max-w-2xl text-xl text-green-200">
            Un'iniziativa nata per affrontare uno dei problemi ambientali più urgenti del nostro
            tempo: la contaminazione del suolo.
          </p>
        </div>
      </section>

      {/* Origine */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Origine e motivazione</h2>
              <p className="mt-5 text-lg text-gray-600">
                In Italia, migliaia di siti industriali dismessi presentano livelli di contaminazione
                che rendono il suolo inutilizzabile e potenzialmente pericoloso per la salute umana
                e degli ecosistemi circostanti. Le procedure di bonifica esistenti sono spesso
                costose, lente e invasive.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                Terra Bonifica nasce dalla convinzione che la condivisione di conoscenze e
                l'adozione di approcci innovativi possano accelerare il processo di risanamento,
                riducendone i costi e l'impatto ambientale.
              </p>
            </div>
            <div className="rounded-2xl bg-green-50 p-8">
              <h3 className="text-xl font-semibold text-green-900">Numeri chiave in Italia</h3>
              <dl className="mt-6 space-y-4">
                {[
                  { value: '~15.000', label: 'siti potenzialmente contaminati censiti' },
                  { value: '3.200+', label: 'siti inseriti nel registro nazionale' },
                  { value: '57', label: 'Siti di Interesse Nazionale (SIN)' },
                ].map(({ value, label }) => (
                  <div key={label} className="flex items-baseline gap-3">
                    <span className="text-2xl font-extrabold text-green-700">{value}</span>
                    <span className="text-gray-700">{label}</span>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Missione */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">La nostra missione</h2>
          <p className="mt-5 max-w-3xl text-lg text-gray-600">
            Accelerare l'adozione di tecniche di bonifica sostenibili attraverso la ricerca
            applicata, la sperimentazione sul campo e la diffusione capillare delle conoscenze
            acquisite.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: '01',
                title: 'Monitoraggio tecnologico',
                body: 'Seguiamo la letteratura scientifica e i brevetti per identificare le tecniche di bonifica più promettenti a livello globale.',
              },
              {
                number: '02',
                title: 'Validazione sul campo',
                body: 'Conduciamo studi pilota in collaborazione con enti di ricerca per verificare l'efficacia delle tecniche in contesti reali italiani.',
              },
              {
                number: '03',
                title: 'Formazione',
                body: 'Offriamo risorse formative per tecnici ambientali, amministratori pubblici e portatori di interesse coinvolti in processi di bonifica.',
              },
              {
                number: '04',
                title: 'Advocacy',
                body: 'Promuoviamo politiche pubbliche che favoriscano l'adozione di standard più aggiornati e procedure più efficienti.',
              },
            ].map(({ number, title, body }) => (
              <div key={number} className="rounded-xl bg-white p-6 shadow-sm">
                <span className="text-3xl font-extrabold text-green-200">{number}</span>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm text-gray-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tecniche */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Tecniche allo studio</h2>
          <p className="mt-4 max-w-2xl text-gray-600">
            Il nostro programma di ricerca copre un ampio spettro di metodologie, ciascuna adatta
            a specifiche tipologie di contaminanti e condizioni pedologiche.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Fitorimediazione',
                description:
                  'Utilizzo di piante iperacumulatrici per estrarre metalli pesanti e altri contaminanti organici dal suolo in modo naturale e a basso costo.',
              },
              {
                title: 'Biorisanamento',
                description:
                  'Impiego di microrganismi selezionati per degradare idrocarburi, solventi clorurati e altri composti organici persistenti.',
              },
              {
                title: 'Stabilizzazione/solidificazione',
                description:
                  'Immobilizzazione chimica o fisica dei contaminanti per ridurne la mobilità e la biodisponibilità nel suolo.',
              },
              {
                title: 'Soil washing',
                description:
                  'Trattamento ex situ con soluzioni acquose per separare e concentrare i contaminanti dalla matrice solida.',
              },
              {
                title: 'Elettrorisanamento',
                description:
                  'Applicazione di campi elettrici a bassa intensità per mobilizzare contaminanti nei suoli a bassa permeabilità.',
              },
              {
                title: 'Biochar e ammendanti',
                description:
                  'Utilizzo di biochar e altri ammendanti per adsorbire contaminanti e migliorare contemporaneamente la struttura del suolo.',
              },
            ].map(({ title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm"
              >
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-900 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold">Vuoi saperne di più?</h2>
          <p className="mt-3 text-green-200">
            Leggi i nostri approfondimenti sul blog o mettiti in contatto con il team.
          </p>
          <div className="mt-6 flex justify-center gap-4 flex-wrap">
            <Link
              href="/blog"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-green-900 transition hover:bg-green-50"
            >
              Vai al Blog
            </Link>
            <Link
              href="/contatti"
              className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Contattaci
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
