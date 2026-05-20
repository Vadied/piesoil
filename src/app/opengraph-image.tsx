import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Terra Bonifica — Bonifica e rigenerazione del suolo contaminato'

export const size = { width: 1200, height: 630 }

export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #14532d 0%, #166534 55%, #065f46 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: 700,
              color: 'white',
            }}
          >
            TB
          </div>
          <span
            style={{
              fontSize: '30px',
              fontWeight: 600,
              color: 'white',
              letterSpacing: '-0.01em',
            }}
          >
            Terra Bonifica
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: '68px',
            fontWeight: 800,
            color: 'white',
            lineHeight: 1.05,
            margin: 0,
            maxWidth: '900px',
            letterSpacing: '-0.02em',
          }}
        >
          Bonifica e rigenerazione del suolo
        </h1>

        {/* Sub-headline */}
        <p
          style={{
            fontSize: '26px',
            color: '#86efac',
            marginTop: '28px',
            maxWidth: '820px',
            lineHeight: 1.45,
          }}
        >
          Ricerca, sperimentazione e divulgazione di tecniche innovative per la
          bonifica dei terreni contaminati.
        </p>
      </div>
    ),
    { ...size },
  )
}
