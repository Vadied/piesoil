import Link from 'next/link'

const FOOTER_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/il-progetto', label: 'Il Progetto' },
  { href: '/chi-siamo', label: 'Chi Siamo' },
  { href: '/blog', label: 'Blog' },
  { href: '/contatti', label: 'Contatti' },
]

export function Footer() {
  return (
    <footer className="border-t border-green-900/20 bg-green-950 text-green-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
                TB
              </span>
              <span className="text-lg font-semibold text-white">Terra Bonifica</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-green-300">
              Ricerca, sviluppo e divulgazione su tecniche innovative di bonifica e rigenerazione
              del suolo contaminato.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-green-400">
              Sezioni
            </h3>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-green-300 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-green-400">
              Contatti
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-green-300">
              <li>
                <Link href="/contatti" className="transition-colors hover:text-white">
                  Scrivici
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-green-800 pt-6 text-center text-xs text-green-500">
          &copy; {new Date().getFullYear()} Terra Bonifica. Tutti i diritti riservati.
        </div>
      </div>
    </footer>
  )
}
