import type { Metadata } from 'next'
import Link from 'next/link'
import { OG_BASE } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Terra Bonifica — ricerca e divulgazione sulle tecniche innovative di bonifica e rigenerazione del suolo contaminato.',
  openGraph: {
    ...OG_BASE,
    title: 'Terra Bonifica — Bonifica e rigenerazione del suolo',
    description:
      "Un progetto dedicato alla ricerca, allo sviluppo e alla divulgazione di tecniche innovative per la bonifica dei terreni contaminati e la loro restituzione all'uso agricolo e naturalistico.",
    url: '/',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Terra Bonifica — Bonifica e rigenerazione del suolo',
      },
    ],
  },
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 py-28 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Bonifica e rigenerazione del suolo
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-green-100">
              Un progetto dedicato alla ricerca, allo sviluppo e alla divulgazione di tecniche
              innovative per la bonifica dei terreni contaminati e la loro restituzione all'uso
              agricolo e naturalistico.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/il-progetto"
                className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-green-900 shadow-md transition hover:bg-green-50"
              >
                Scopri il progetto
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center rounded-lg border border-white/40 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Leggi gli articoli
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Cosa facciamo</h2>
            <p className="mt-4 text-lg text-gray-600">
              Tre pilastri fondamentali per affrontare la sfida della contaminazione del suolo.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: '🔬',
                title: 'Ricerca',
                description:
                  'Monitoriamo le tecnologie emergenti di fitorimediazione, biorisanamento e stabilizzazione chimica per identificare gli approcci più efficaci e sostenibili.',
              },
              {
                icon: '🌱',
                title: 'Sperimentazione',
                description:
                  'Collaboriamo con istituti scientifici per testare protocolli di bonifica su terreni con diverse tipologie di contaminazione, dai metalli pesanti agli idrocarburi.',
              },
              {
                icon: '📢',
                title: 'Divulgazione',
                description:
                  'Rendiamo accessibile la conoscenza tecnico-scientifica a cittadini, enti locali e operatori del settore attraverso articoli, guide e seminari.',
              },
            ].map(({ icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-8 shadow-sm"
              >
                <div className="text-4xl">{icon}</div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{title}</h3>
                <p className="mt-3 text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-2xl font-bold text-green-900">Hai un progetto di bonifica?</h2>
            <p className="max-w-xl text-gray-700">
              Siamo disponibili a condividere risorse, orientare la ricerca e mettere in contatto
              i soggetti coinvolti in interventi di risanamento ambientale.
            </p>
            <Link
              href="/contatti"
              className="inline-flex items-center rounded-lg bg-green-800 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-green-700"
            >
              Contattaci
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
