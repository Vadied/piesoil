import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // Provides `prose` classes for rendering markdown / rich-text content.
    // Used in the article detail page: `prose prose-green prose-lg max-w-none`
    require('@tailwindcss/typography'),
  ],
}

export default config
