import { createContext, useContext, useEffect, useState, type ReactNode, Dispatch, SetStateAction } from 'react'

export type RequestDraft = {
  description?: string
  when?: string
  where?: string
  category?: string
}

type RequestDraftContextValue = {
  draft: RequestDraft
  setDraft: Dispatch<SetStateAction<RequestDraft>>
}

const RequestDraftContext = createContext<RequestDraftContextValue | undefined>(undefined)

const STORAGE_KEY = 'flashRequestDraft'

function loadInitialDraft(): RequestDraft {
  if (typeof window === 'undefined') return {}
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as RequestDraft) : {}
  } catch (error) {
    console.error('Failed to parse request draft from sessionStorage', error)
    return {}
  }
}

export function RequestDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<RequestDraft>(() => loadInitialDraft())

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      if (draft && Object.keys(draft).length > 0) {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
      } else {
        window.sessionStorage.removeItem(STORAGE_KEY)
      }
    } catch (error) {
      console.error('Failed to persist request draft', error)
    }
  }, [draft])

  return (
    <RequestDraftContext.Provider value={{ draft, setDraft }}>
      {children}
    </RequestDraftContext.Provider>
  )
}

export function useRequestDraft() {
  const context = useContext(RequestDraftContext)
  if (!context) {
    throw new Error('useRequestDraft must be used within a RequestDraftProvider')
  }
  return context
}

