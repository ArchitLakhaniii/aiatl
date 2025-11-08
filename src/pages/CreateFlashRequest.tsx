import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowRight, ArrowLeft, Flame, ShieldCheck, Sparkles, Star, Tag, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { detectCategory } from "@/lib/nlp"
import { parseFromText } from "@/utils/request/parseFromText"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { RequestDraftProvider, useRequestDraft } from "@/features/request/RequestDraftContext"

interface RequestForm {
  need: string
  category: string
  when: string
  where: string
}

type Step = 1 | 2

type ReviewErrors = {
  when: string | null
  where: string | null
}

const validateReview = (values: Pick<RequestForm, 'when' | 'where'>): ReviewErrors => ({
  when: values.when && values.when.trim().length > 0 ? null : 'Add a time (e.g., Today 5PM)',
  where: values.where && values.where.trim().length > 1 ? null : 'Add a location (e.g., Student Center)',
})

export default function CreateFlashRequest() {
  return (
    <RequestDraftProvider>
      <CreateFlashRequestInner />
    </RequestDraftProvider>
  )
}

function CreateFlashRequestInner() {
  const navigate = useNavigate()
  const { draft, setDraft } = useRequestDraft()
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<RequestForm>({
    need: draft.description ?? "",
    category: draft.category ?? "Other",
    when: draft.when ?? "",
    where: draft.where ?? "",
  })
  const [error, setError] = useState<string>("")
  const whenInputRef = useRef<HTMLInputElement>(null)
  const whereInputRef = useRef<HTMLInputElement>(null)
  const [descDraft, setDescDraft] = useState(form.need)
  const [dirty, setDirty] = useState<{ when: boolean; where: boolean }>({
    when: Boolean(form.when),
    where: Boolean(form.where),
  })

  const reviewErrors = useMemo(
    () => validateReview({ when: form.when, where: form.where }),
    [form.when, form.where],
  )

  const isReviewValid = !reviewErrors.when && !reviewErrors.where

  const words = useMemo(() => {
    const trimmed = form.need.trim()
    return trimmed ? trimmed.split(/\s+/).length : 0
  }, [form.need])

  useEffect(() => {
    const trimmed = form.need.trim()
    const nextCategory = trimmed ? detectCategory(form.need) : "Other"
    setForm((prev) => (prev.category === nextCategory ? prev : { ...prev, category: nextCategory }))
    setDraft((prev) => ({ ...prev, description: form.need, category: nextCategory }))
    if (trimmed) {
      setError("")
    }
  }, [form.need, setDraft])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!descDraft.trim()) return
      const parsed = parseFromText(descDraft)
      setForm((prev) => ({
        ...prev,
        when: !dirty.when ? parsed.when : prev.when,
        where: !dirty.where ? parsed.where : prev.where,
      }))
      if (!dirty.when) {
        setDraft((prev) => ({ ...prev, when: parsed.when }))
      }
      if (!dirty.where) {
        setDraft((prev) => ({ ...prev, where: parsed.where }))
      }
    }, 250)
    return () => clearTimeout(timeout)
  }, [descDraft, dirty.when, dirty.where, setDraft])

  const examples = [
    "Need a calculus textbook tomorrow afternoon at the library help desk.",
    "Looking for ibuprofen—headache at Student Center around 5pm.",
    "Winter jacket, size M for tonight in the dorm courtyard.",
    "MacBook Pro charger at Clough Commons before 3pm.",
  ]

  const applySuggestion = (text: string) => {
    const parsed = parseFromText(text)
    const detectedCategory = detectCategory(text)
    setDirty({ when: false, where: false })
    setDescDraft(text)
    setForm({
      need: text,
      category: detectedCategory,
      when: parsed.when,
      where: parsed.where,
    })
    setDraft({
      description: text,
      category: detectedCategory,
      when: parsed.when,
      where: parsed.where,
    })
    setError("")
  }

  const totalSteps = 2

  const next = () => {
    if (step === 1 && !form.need.trim()) {
      setError("Tell us what you need before continuing.")
      return
    }

    if (step === 1) {
      const parsed = parseFromText(form.need)
      setForm((prev) => ({
        ...prev,
        when: !dirty.when ? parsed.when : prev.when,
        where: !dirty.where ? parsed.where : prev.where,
      }))
      setDraft((prev) => ({ ...prev, description: form.need }))
      if (!dirty.when) {
        setDraft((prev) => ({ ...prev, when: parsed.when }))
      }
      if (!dirty.where) {
        setDraft((prev) => ({ ...prev, where: parsed.where }))
      }
    }

    setError("")
    setStep((prev) => (prev === 2 ? 2 : ((prev + 1) as Step)))
  }

  const back = () => setStep((prev) => (prev === 1 ? 1 : ((prev - 1) as Step)))

  const resetToFirst = () => {
    setStep(1)
    setError("")
    setForm({ need: "", category: "Other", when: "", where: "" })
    setDescDraft("")
    setDirty({ when: false, where: false })
    setDraft({})
  }

  const submit = () => {
    alert("Request submitted! 🎉")
    setDraft({})
    navigate('/smart-ping')
  }

  const handleSubmit = () => {
    if (step === 2 && !isReviewValid) {
      toast.error('Please add time and location before submitting.')
      if (reviewErrors.when) {
        whenInputRef.current?.focus()
        whenInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }
      if (reviewErrors.where) {
        whereInputRef.current?.focus()
        whereInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    submit()
  }

  return (
    <div className="min-h-screen bg-[var(--background-light)] text-black transition-colors duration-200 dark:bg-black dark:text-white">
      <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-black/10 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/60">
        <div className="mx-auto flex h-full max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500 shadow-md shadow-rose-500/40" />
            <span className="text-sm font-semibold tracking-tight">FLASH</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/5 px-2 py-1 text-xs dark:bg-white/10">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Verified Campus
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-black/5 px-2 py-1 text-xs dark:bg-white/10">
              <Sparkles className="h-4 w-4 text-fuchsia-500" />
              MIT
            </span>
          </div>
        </div>
      </header>

      <div className="h-16" />

      <main className="mx-auto max-w-4xl px-4 pb-40">
        <section className="mt-6">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium">Step {step} of {totalSteps}</span>
            <div className="flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
              <div
                className="h-1 rounded-full bg-gradient-to-r from-fuchsia-500 to-rose-500 transition-all"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
            Create {" "}
            <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
              Flash Request
            </span>
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full border border-black/10 px-2.5 py-1 dark:border-white/10">
              <Star className="h-3.5 w-3.5 text-yellow-400" /> Fast responses
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-black/10 px-2.5 py-1 dark:border-white/10">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> ID verified
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-black/10 px-2.5 py-1 dark:border-white/10">
              <Flame className="h-3.5 w-3.5 text-rose-500" /> Hot on campus
            </span>
          </div>
        </section>

        {step === 1 && (
          <section className="mt-6 rounded-3xl border border-black/10 bg-white p-5 shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition-colors dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
            <label htmlFor="need" className="text-sm text-neutral-600 dark:text-neutral-300">
              Describe your need
            </label>
            <div className="relative mt-2">
              <textarea
                id="need"
                rows={5}
                value={form.need}
                onChange={(event) => {
                  const value = event.target.value
                  setForm((prev) => ({ ...prev, need: value }))
                  setDescDraft(value)
                  setDraft((prev) => ({ ...prev, description: value }))
                }}
                placeholder="Need 2 MacBook chargers at Student Center around 5pm. Prefer USB-C."
                className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[15px] leading-6 shadow-inner focus:outline-none focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/25 dark:border-neutral-800 dark:bg-black dark:text-white"
                aria-describedby="need-hint"
              />
              <div className="pointer-events-none absolute bottom-2 right-3 select-none text-xs text-neutral-500 tabular-nums dark:text-neutral-400">
                {words} words
              </div>
            </div>
            <p id="need-hint" className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
              Include when and where if relevant.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <span className="text-sm text-neutral-600 dark:text-neutral-300">Detected category:</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-1.5 text-sm dark:border-neutral-800">
                <Tag className="h-4 w-4 text-fuchsia-500" />
                {form.category}
              </span>
            </div>

            <div className="mt-5">
              <div className="mb-2 text-sm text-neutral-600 dark:text-neutral-300">Try one:</div>
              <div className="flex flex-wrap gap-2">
                {examples.map((example) => (
                  <button
                    key={example}
                    onClick={() => applySuggestion(example)}
                    type="button"
                    className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm transition will-change-transform hover:-translate-y-[1px] hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-neutral-800 dark:hover:bg-neutral-900 dark:focus-visible:ring-offset-black"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="mt-4 text-sm text-rose-500 dark:text-rose-400" role="alert">
                {error}
              </p>
            )}

            <div className="mt-6 rounded-2xl border border-transparent bg-gradient-to-r from-fuchsia-500/10 to-rose-500/10 p-4 text-sm text-neutral-700 dark:text-neutral-200">
              <p>
                Pro tip: short + clear requests get accepted faster. Add <strong>when</strong> and {" "}
                <strong>where</strong>.
              </p>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="mt-6 rounded-3xl border border-black/10 bg-white p-5 shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition-colors dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
            <h2 className="mb-4 text-lg font-semibold">Review & Submit</h2>
            <div className="space-y-5">
              <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                All fields below are required to submit.
              </p>
              <div>
                <label htmlFor="review-need" className="text-sm text-neutral-600 dark:text-neutral-300">
                  Description
                </label>
                <textarea
                  id="review-need"
                  rows={4}
                  value={descDraft}
                  onChange={(event) => {
                    const value = event.target.value
                    setDescDraft(value)
                    setForm((prev) => ({ ...prev, need: value }))
                    setDraft((prev) => ({ ...prev, description: value }))
                    if (!value.trim()) {
                      setDirty({ when: false, where: false })
                    }
                  }}
                  className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm leading-6 shadow-inner focus:outline-none focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/25 dark:border-neutral-800 dark:bg-black dark:text-white"
                />
              </div>

              <div className="space-y-2 rounded-2xl border border-neutral-200 bg-white/60 p-4 text-sm dark:border-neutral-800 dark:bg-black/40">
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400">Detected category:</span> {form.category || '—'}
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label htmlFor="review-when" className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                      When
                    </label>
                    <input
                      id="review-when"
                      value={form.when}
                      onChange={(event) => {
                        const value = event.target.value
                        setForm((prev) => ({ ...prev, when: value }))
                        setDirty((prev) => ({ ...prev, when: value === '' ? false : true }))
                        if (value === '') {
                          setDraft((prev) => {
                            const next = { ...prev }
                            delete next.when
                            return next
                          })
                        } else {
                          setDraft((prev) => ({ ...prev, when: value }))
                        }
                      }}
                      placeholder="Today 5PM"
                      aria-invalid={Boolean(reviewErrors.when)}
                      ref={whenInputRef}
                      className={cn(
                        "mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm shadow-inner focus:outline-none focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/25 dark:border-neutral-800 dark:bg-black dark:text-white",
                        reviewErrors.when && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
                      )}
                    />
                    {!dirty.when && form.when ? (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] uppercase tracking-wide text-neutral-500 dark:bg-neutral-800 dark:text-neutral-300">
                        auto
                      </span>
                    ) : null}
                    {reviewErrors.when ? (
                      <p className="mt-1 text-xs text-rose-500 dark:text-rose-400" role="alert">
                        {reviewErrors.when}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="review-where" className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                      Where
                    </label>
                    <input
                      id="review-where"
                      value={form.where}
                      onChange={(event) => {
                        const value = event.target.value
                        setForm((prev) => ({ ...prev, where: value }))
                        setDirty((prev) => ({ ...prev, where: value === '' ? false : true }))
                        if (value === '') {
                          setDraft((prev) => {
                            const next = { ...prev }
                            delete next.where
                            return next
                          })
                        } else {
                          setDraft((prev) => ({ ...prev, where: value }))
                        }
                      }}
                      placeholder="Student Center"
                      aria-invalid={Boolean(reviewErrors.where)}
                      ref={whereInputRef}
                      className={cn(
                        "mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm shadow-inner focus:outline-none focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/25 dark:border-neutral-800 dark:bg-black dark:text-white",
                        reviewErrors.where && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
                      )}
                    />
                    {!dirty.where && form.where ? (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] uppercase tracking-wide text-neutral-500 dark:bg-neutral-800 dark:text-neutral-300">
                        auto
                      </span>
                    ) : null}
                    {reviewErrors.where ? (
                      <p className="mt-1 text-xs text-rose-500 dark:text-rose-400" role="alert">
                        {reviewErrors.where}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50">
        <div className="mx-auto max-w-4xl px-4 pb-5">
          <div className="rounded-3xl border border-black/10 bg-white/90 backdrop-blur shadow-[0_-8px_24px_rgba(0,0,0,0.08)] transition-colors dark:border-white/10 dark:bg-neutral-950/90">
            <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between md:p-5">
              <div className="flex-1">
                <div className="text-xs text-neutral-600 dark:text-neutral-400">Step {step} of {totalSteps}</div>
                <div className="text-sm font-semibold tracking-tight">
                  {step === 1 && 'Describe your need'}
                  {step === 2 && 'Review & submit'}
                </div>
                {error && step === 1 ? (
                  <div className="mt-2 text-xs text-rose-500 dark:text-rose-400" role="alert">
                    {error}
                  </div>
                ) : null}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={back}
                  disabled={step === 1}
                  className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium transition hover:bg-neutral-100 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-neutral-800 dark:hover:bg-neutral-900 dark:focus-visible:ring-offset-black"
                >
                  <ArrowLeft className="mr-1 inline size-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={step === 2 ? handleSubmit : next}
                  disabled={step === 2 && !isReviewValid}
                  className={cn(
                    "group inline-flex items-center rounded-2xl bg-[conic-gradient(from_180deg_at_50%_50%,theme(colors.fuchsia.500),theme(colors.rose.500),theme(colors.pink.500),theme(colors.fuchsia.500))] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(244,63,94,0.35)] transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/30",
                    step === 2 && !isReviewValid && "opacity-60 cursor-not-allowed",
                  )}
                >
                  {step === 2 ? 'Submit' : 'Next'}
                  <ArrowRight className="ml-1 inline size-4 translate-x-0 transition group-hover:translate-x-[2px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={resetToFirst}
        aria-label="Start new flash request"
        className="fixed bottom-6 right-6 z-40 rounded-full p-4 text-white shadow-[0_16px_32px_rgba(244,63,94,0.4)] transition hover:brightness-110 active:translate-y-[1px] focus:outline-none focus:ring-4 focus:ring-rose-500/50 md:p-5"
        style={{
          background:
            'conic-gradient(from 180deg at 50% 50%, rgba(244,63,94,1), rgba(239,68,68,1), rgba(236,72,153,1), rgba(244,63,94,1))',
        }}
      >
        <Plus className="size-6" />
      </button>

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-66%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

