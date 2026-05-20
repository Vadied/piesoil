'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { TaxonomySelector, type TaxonomyItem } from './TaxonomySelector'
import { slugify } from '@/lib/slugify'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ArticleAuthor = {
  id: string
  name: string | null
  email: string
}

type ArticleData = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  coverImageUrl: string | null
  published: boolean
  /** ISO string or null */
  publishedAt: string | null
  authorId: string
  categories: { category: TaxonomyItem }[]
  tags: { tag: TaxonomyItem }[]
}

type ArticleFormProps = {
  /** Provided in edit mode; absent when creating a new article. */
  article?: ArticleData
  categories: TaxonomyItem[]
  tags: TaxonomyItem[]
  isAdmin: boolean
  /** Available authors shown in the author selector (admin only). */
  authors?: ArticleAuthor[]
  currentUserId: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Converts an ISO timestamp to the value expected by <input type="datetime-local">. */
function isoToDatetimeLocal(iso: string | null): string {
  if (!iso) return ''
  // "2024-01-15T10:30:00.000Z" → "2024-01-15T10:30"
  return iso.slice(0, 16)
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Shared create/edit form for backoffice articles.
 * Handles all fields: title, slug (auto-generated), excerpt, content
 * (Markdown with preview toggle), cover image URL, published status,
 * publication date, categories, tags, and author (admin-only).
 */
export function ArticleForm({
  article,
  categories: initialCategories,
  tags: initialTags,
  isAdmin,
  authors,
  currentUserId,
}: ArticleFormProps) {
  const router = useRouter()
  const isEdit = !!article

  // Core fields
  const [title, setTitle] = useState(article?.title ?? '')
  const [slug, setSlug] = useState(article?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(isEdit)
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? '')
  const [content, setContent] = useState(article?.content ?? '')
  const [coverImageUrl, setCoverImageUrl] = useState(article?.coverImageUrl ?? '')

  // Publication
  const [published, setPublished] = useState(article?.published ?? false)
  const [publishedAt, setPublishedAt] = useState(isoToDatetimeLocal(article?.publishedAt ?? null))

  // Author (admin only)
  const [authorId, setAuthorId] = useState(article?.authorId ?? currentUserId)

  // Taxonomy
  const [availableCategories, setAvailableCategories] = useState<TaxonomyItem[]>(initialCategories)
  const [availableTags, setAvailableTags] = useState<TaxonomyItem[]>(initialTags)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    article?.categories.map((c) => c.category.id) ?? [],
  )
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    article?.tags.map((t) => t.tag.id) ?? [],
  )

  // Upload state
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // UI state
  const [previewMode, setPreviewMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-generate slug from title when the user has not manually edited it
  useEffect(() => {
    if (!slugTouched && title) {
      setSlug(slugify(title))
    }
  }, [title, slugTouched])

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/backoffice/upload', {
        method: 'POST',
        body: formData,
      })

      const data = (await res.json()) as { url?: string; error?: string }

      if (!res.ok) {
        setUploadError(data.error ?? 'Errore durante il caricamento.')
        return
      }

      if (data.url) {
        setCoverImageUrl(data.url)
      }
    } catch {
      setUploadError('Errore di rete. Riprova.')
    } finally {
      setIsUploading(false)
      // Reset so the same file can be re-selected after an error
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!title.trim() || !slug.trim() || !content.trim()) {
      setError('Titolo, slug e contenuto sono obbligatori.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      content,
      excerpt: excerpt.trim() || null,
      coverImageUrl: coverImageUrl.trim() || null,
      published,
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
      categoryIds: selectedCategoryIds,
      tagIds: selectedTagIds,
      ...(isAdmin ? { authorId } : {}),
    }

    try {
      const url = article
        ? `/api/backoffice/articles/${article.id}`
        : '/api/backoffice/articles'
      const method = article ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = (await res.json()) as { error?: string }

      if (!res.ok) {
        setError(data.error ?? 'Errore durante il salvataggio.')
        return
      }

      router.push('/backoffice/articles')
      router.refresh()
    } catch {
      setError('Errore di rete. Riprova.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* Title */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Titolo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titolo dell'articolo"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value)
                setSlugTouched(true)
              }}
              placeholder="url-dell-articolo"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <p className="mt-1 text-xs text-gray-400">
              URL pubblico:{' '}
              <span className="font-mono">/blog/{slug || '…'}</span>
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Sommario</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="Breve descrizione mostrata nelle anteprime e nei meta tag"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Content editor */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Contenuto <span className="text-red-500">*</span>
              </label>
              <div className="flex overflow-hidden rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={() => setPreviewMode(false)}
                  className={[
                    'px-3 py-1 text-xs font-medium transition-colors',
                    !previewMode
                      ? 'bg-green-700 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50',
                  ].join(' ')}
                >
                  Modifica
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode(true)}
                  className={[
                    'px-3 py-1 text-xs font-medium transition-colors',
                    previewMode
                      ? 'bg-green-700 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50',
                  ].join(' ')}
                >
                  Anteprima
                </button>
              </div>
            </div>

            {previewMode ? (
              <div className="prose prose-sm prose-green min-h-[420px] max-w-none rounded-lg border border-gray-300 bg-white p-4">
                {content.trim() ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                ) : (
                  <p className="italic text-gray-400">Nessun contenuto da visualizzare.</p>
                )}
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={22}
                placeholder="Scrivi il contenuto in Markdown…"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Publish panel */}
          <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Pubblicazione</h3>

            {/* Toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={published}
                onClick={() => setPublished((v) => !v)}
                className={[
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
                  published ? 'bg-green-600' : 'bg-gray-200',
                ].join(' ')}
              >
                <span
                  className={[
                    'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform',
                    published ? 'translate-x-5' : 'translate-x-0',
                  ].join(' ')}
                />
              </button>
              <span className="text-sm text-gray-700">
                {published ? 'Pubblicato' : 'Bozza'}
              </span>
            </div>

            {/* Publication date */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Data di pubblicazione
              </label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <p className="mt-1 text-xs text-gray-400">
                Lascia vuoto per usare la data corrente al momento della pubblicazione.
              </p>
            </div>

            {/* Save button */}
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? 'Salvataggio…'
                : isUploading
                  ? 'Caricamento immagine…'
                  : isEdit
                    ? 'Aggiorna articolo'
                    : 'Crea articolo'}
            </button>
          </div>

          {/* Cover image */}
          <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Immagine di copertina</h3>

            {/* File upload button */}
            <div>
              <p className="mb-1.5 text-xs font-medium text-gray-500">Carica dal dispositivo</p>
              <label
                className={[
                  'flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed px-3 py-3 text-sm transition-colors',
                  isUploading
                    ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
                    : 'border-gray-300 text-gray-600 hover:border-green-400 hover:bg-green-50',
                ].join(' ')}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  disabled={isUploading}
                  onChange={(e) => void handleFileUpload(e)}
                  className="sr-only"
                />
                {isUploading ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Caricamento…
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Scegli immagine
                  </>
                )}
              </label>
              {uploadError && (
                <p className="mt-1 text-xs text-red-600">{uploadError}</p>
              )}
            </div>

            {/* URL fallback */}
            <div>
              <p className="mb-1.5 text-xs font-medium text-gray-500">oppure inserisci URL</p>
              <input
                type="url"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://…"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            {coverImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverImageUrl}
                alt=""
                className="h-32 w-full rounded-lg object-cover"
              />
            )}
          </div>

          {/* Author (admin only) */}
          {isAdmin && authors && authors.length > 0 && (
            <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900">Autore</h3>
              <select
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name ?? a.email}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Categories */}
          <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Categorie</h3>
            <TaxonomySelector
              type="categories"
              available={availableCategories}
              selected={selectedCategoryIds}
              onSelectionChange={setSelectedCategoryIds}
              onItemCreated={(item) => setAvailableCategories((prev) => [...prev, item])}
            />
          </div>

          {/* Tags */}
          <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Tag</h3>
            <TaxonomySelector
              type="tags"
              available={availableTags}
              selected={selectedTagIds}
              onSelectionChange={setSelectedTagIds}
              onItemCreated={(item) => setAvailableTags((prev) => [...prev, item])}
            />
          </div>
        </div>
      </div>
    </form>
  )
}
