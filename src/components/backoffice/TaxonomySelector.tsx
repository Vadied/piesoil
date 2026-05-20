'use client'

import { useState } from 'react'

export type TaxonomyItem = {
  id: string
  name: string
  slug: string
}

type TaxonomySelectorProps = {
  /** API path segment: 'categories' or 'tags' */
  type: 'categories' | 'tags'
  available: TaxonomyItem[]
  selected: string[]
  onSelectionChange: (ids: string[]) => void
  onItemCreated: (item: TaxonomyItem) => void
}

/**
 * Multi-select list for categories or tags with inline creation.
 * Sends POST /api/backoffice/{type} when the user adds a new item.
 */
export function TaxonomySelector({
  type,
  available,
  selected,
  onSelectionChange,
  onItemCreated,
}: TaxonomySelectorProps) {
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  function toggle(id: string) {
    onSelectionChange(
      selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id],
    )
  }

  async function handleCreate() {
    const name = newName.trim()
    if (!name || creating) return

    setCreating(true)
    setCreateError(null)

    try {
      const res = await fetch(`/api/backoffice/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      const data = (await res.json()) as { data?: TaxonomyItem; error?: string }

      if (!res.ok) {
        setCreateError(data.error ?? 'Errore durante la creazione')
        return
      }

      if (data.data) {
        onItemCreated(data.data)
        onSelectionChange([...selected, data.data.id])
        setNewName('')
      }
    } catch {
      setCreateError('Errore di rete. Riprova.')
    } finally {
      setCreating(false)
    }
  }

  const placeholder = type === 'categories' ? 'Nuova categoria…' : 'Nuovo tag…'

  return (
    <div className="space-y-2">
      {available.length > 0 ? (
        <div className="max-h-44 overflow-y-auto space-y-1 pr-1">
          {available.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-2 cursor-pointer rounded px-1 py-0.5 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selected.includes(item.id)}
                onChange={() => toggle(item.id)}
                className="h-3.5 w-3.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">{item.name}</span>
            </label>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400 italic">Nessun elemento disponibile.</p>
      )}

      <div className="flex gap-1.5 pt-1 border-t border-gray-100">
        <input
          type="text"
          value={newName}
          onChange={(e) => {
            setNewName(e.target.value)
            setCreateError(null)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              void handleCreate()
            }
          }}
          placeholder={placeholder}
          className="min-w-0 flex-1 rounded border border-gray-300 px-2 py-1 text-xs focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
        <button
          type="button"
          onClick={() => void handleCreate()}
          disabled={creating || !newName.trim()}
          className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
        >
          {creating ? '…' : 'Aggiungi'}
        </button>
      </div>

      {createError && <p className="text-xs text-red-600">{createError}</p>}
    </div>
  )
}
