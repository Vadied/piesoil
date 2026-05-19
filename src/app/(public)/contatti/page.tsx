import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contatti',
  description:
    'Mettiti in contatto con il team di Terra Bonifica per collaborazioni, informazioni o richieste specifiche.',
}

export default function ContattiPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-green-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Contatti</h1>
          <p className="mt-4 max-w-2xl text-xl text-green-200">
            Hai domande, proposte di collaborazione o vuoi segnalarci un sito contaminato da
            approfondire? Scrivici.
          </p>
        </div>
      </section>

      {/* Contact section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Come possiamo aiutarti</h2>
              <p className="mt-4 text-gray-600">
                Siamo disponibili per rispondere a richieste di approfondimento, per valutare
                possibili collaborazioni scientifiche o per orientare chi si trova ad affrontare
                un problema di contaminazione del suolo.
              </p>

              <dl className="mt-8 space-y-6">
                {[
                  {
                    icon: (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    ),
                    label: 'Email',
                    value: 'Utilizza il modulo di contatto qui accanto',
                  },
                  {
                    icon: (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    label: 'Tempo di risposta',
                    value: 'Di norma rispondiamo entro 2-3 giorni lavorativi',
                  },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex gap-4">
                    <div className="flex-shrink-0 text-green-700">{icon}</div>
                    <div>
                      <dt className="font-semibold text-gray-900">{label}</dt>
                      <dd className="mt-1 text-gray-600">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              <div className="mt-10">
                <h3 className="font-semibold text-gray-900">Per cosa possiamo aiutarti</h3>
                <ul className="mt-3 space-y-2 text-sm text-gray-600">
                  {[
                    'Informazioni su tecniche di bonifica specifiche',
                    'Orientamento normativo su siti contaminati',
                    'Collaborazioni di ricerca e co-autorialità',
                    'Consulenza a enti locali e associazioni',
                    'Segnalazione di siti contaminati da approfondire',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">Inviaci un messaggio</h2>
              <form className="mt-6 space-y-5" action="#" method="POST">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                      Nome
                    </label>
                    <input
                      id="nome"
                      name="nome"
                      type="text"
                      autoComplete="given-name"
                      required
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="cognome" className="block text-sm font-medium text-gray-700">
                      Cognome
                    </label>
                    <input
                      id="cognome"
                      name="cognome"
                      type="text"
                      autoComplete="family-name"
                      required
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="oggetto" className="block text-sm font-medium text-gray-700">
                    Oggetto
                  </label>
                  <input
                    id="oggetto"
                    name="oggetto"
                    type="text"
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="messaggio" className="block text-sm font-medium text-gray-700">
                    Messaggio
                  </label>
                  <textarea
                    id="messaggio"
                    name="messaggio"
                    rows={5}
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-green-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Invia messaggio
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
