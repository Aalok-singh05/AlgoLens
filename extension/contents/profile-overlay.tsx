import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import cssText from "data-text:~style.css"
import { useEffect, useMemo, useState } from "react"
import { BarChart3, ExternalLink, RefreshCw, Search, ShieldCheck, Zap, X, ShieldAlert, CheckCircle2 } from "lucide-react"
import { analyzeEvents, type CheatReport } from "../lib/api/leetcode"
import { loadRecentAttendedContests, type ContestLifecycleItem } from "../lib/contest-lifecycle"

export const config: PlasmoCSConfig = { matches: ["https://leetcode.com/u/*"] }
export const getInlineAnchor: PlasmoGetInlineAnchor = async () => document.body
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

interface ReplaySummary {
  loading: boolean
  reports: Array<{ title: string; report: CheatReport }>
  error?: string
}

function message<T>(payload: Record<string, unknown>): Promise<T> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(payload, (response) => {
      const error = chrome.runtime.lastError
      if (error) reject(new Error(error.message))
      else resolve(response as T)
    })
  })
}

function displayDelta(contest?: ContestLifecycleItem) {
  if (!contest) return "Contest analytics"
  const delta = contest.ratingDelta;
  const rating = contest.ratingAfter;
  if (delta == null) {
    if (contest.status === "FINALIZED" && rating != null) return `${Math.round(rating)} official`
    return "Pending"
  }
  return `${delta >= 0 ? "+" : ""}${Math.round(delta)} official`
}

// In-memory quick cache for instant load
const memoryCache: Record<string, ContestLifecycleItem[]> = {}

export default function ProfileOverlay() {
  const username = useMemo(() => decodeURIComponent(location.pathname.match(/\/u\/([^/]+)/)?.[1] || ""), [])
  const [open, setOpen] = useState(false)
  const [contests, setContests] = useState<ContestLifecycleItem[]>(() => {
    if (!username) return []
    try {
      if (memoryCache[username]) return memoryCache[username]
      const cached = sessionStorage.getItem(`av_overlay_${username}`)
      if (cached) return JSON.parse(cached)
    } catch {}
    return []
  })
  const [replays, setReplays] = useState<Record<string, ReplaySummary>>({})
  const [loading, setLoading] = useState(!contests.length)
  const [error, setError] = useState("")

  const refresh = async () => {
    if (!username) return
    if (!contests.length) setLoading(true)
    setError("")
    try {
      const data = await loadRecentAttendedContests(username, 5)
      setContests(data)
      memoryCache[username] = data
      try {
        sessionStorage.setItem(`av_overlay_${username}`, JSON.stringify(data))
      } catch {}
    } catch (cause) {
      if (!contests.length) {
        setError(cause instanceof Error ? cause.message : "Contest data unavailable")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
    const interval = window.setInterval(() => void refresh(), 2 * 60 * 1000)
    return () => window.clearInterval(interval)
  }, [username])

  const scanReplay = async (contest: ContestLifecycleItem) => {
    setReplays((current) => ({ ...current, [contest.contestSlug]: { loading: true, reports: [] } }))
    try {
      const questionResponse = await message<any>({ action: "get_contest_questions", payload: { contestSlug: contest.contestSlug } })
      const questions = questionResponse?.ok && Array.isArray(questionResponse.data) ? questionResponse.data : []
      const reports = await Promise.all(questions.map(async (question: any) => {
        const replayResponse = await message<any>({
          action: "get_replay_events",
          payload: { username, contestSlug: contest.contestSlug, questionSlug: question.titleSlug }
        }).catch(() => null)
        const events = replayResponse?.ok && Array.isArray(replayResponse.data) ? replayResponse.data : []
        return { title: question.title, report: analyzeEvents(events) }
      }))
      setReplays((current) => ({ ...current, [contest.contestSlug]: { loading: false, reports } }))
    } catch (cause) {
      setReplays((current) => ({
        ...current,
        [contest.contestSlug]: { loading: false, reports: [], error: cause instanceof Error ? cause.message : "Replay unavailable" }
      }))
    }
  }

  const latest = contests[0]
  const evidenceCount = Object.values(replays).reduce((count, summary) => count + summary.reports.filter(({ report }) => report.focusLoss > 10 || report.pasteCount > 0).length, 0)

  return (
    <div className="fixed right-5 top-20 z-[2147483646] font-sans text-zinc-100">
      {/* Trigger Button with Amber Glow */}
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2.5 rounded-full border border-amber-500/30 bg-zinc-950/90 px-3.5 py-2 text-xs font-semibold shadow-[0_4px_25px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-300 hover:border-amber-400/70 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:bg-zinc-900 group"
        title="Open AlgoVault profile analytics"
      >
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)] group-hover:scale-110 transition-transform">
          <BarChart3 size={12} />
        </div>
        <span className="font-mono text-zinc-200 tracking-tight">
          {loading && !contests.length ? "Loading..." : displayDelta(latest)}
        </span>
        {evidenceCount > 0 && (
          <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.2 text-[10px] font-bold text-amber-300 font-mono shadow-[0_0_8px_rgba(245,158,11,0.3)]">
            {evidenceCount}
          </span>
        )}
      </button>

      {/* Main Glassmorphic Panel */}
      {open && (
        <section className="absolute right-0 mt-3 w-[390px] max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-b from-zinc-950 via-zinc-950/98 to-zinc-950/95 shadow-[0_20px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl animate-fadeIn">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-zinc-800/80 bg-gradient-to-r from-amber-950/30 via-zinc-950 to-zinc-950 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/30 text-amber-400 font-bold text-xs font-mono shadow-[0_0_12px_rgba(245,158,11,0.15)]">
                AV
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                  AlgoVault Analytics
                  <span className="relative flex h-2 w-2 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                </div>
                <div className="text-[10px] font-mono text-zinc-400">@{username}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => void refresh()} 
                title="Refresh analytics" 
                className="p-1.5 text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-900 transition-colors"
              >
                <RefreshCw size={13} className={loading ? "animate-spin text-amber-400" : ""} />
              </button>
              <button 
                onClick={() => setOpen(false)} 
                title="Close panel" 
                className="p-1.5 text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-900 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </header>

          {/* Replay Evidence Subheader Banner */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-4 py-2.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-[11px] font-bold font-mono text-amber-400">
              <ShieldCheck size={14} className="text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]" />
              <span className="tracking-wide">REPLAY EVIDENCE</span>
            </div>
            <span className="text-[9.5px] font-mono font-semibold text-amber-300/90 bg-amber-500/10 border border-amber-500/25 px-2.5 py-0.5 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.1)]">
              Last 5 Contests
            </span>
          </div>

          {/* Content Container */}
          <div className="max-h-[490px] overflow-y-auto p-3.5 space-y-3">
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-950/30 p-3 text-xs text-red-300 font-mono flex items-center gap-2">
                <ShieldAlert size={14} className="shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-transparent p-2.5 text-[10.5px] text-amber-200/90 font-mono">
              <Zap size={13} className="shrink-0 text-amber-400" />
              <span>Real-time telemetry scanning focus loss & paste events.</span>
            </div>

            {contests.slice(0, 5).map((contest) => {
              const summary = replays[contest.contestSlug]
              const replayPage = contest.rank ? Math.max(1, Math.ceil(contest.rank / 25)) : 1
              const delta = contest.ratingDelta
              const isPositive = delta != null && delta >= 0

              return (
                <div 
                  key={contest.contestSlug} 
                  className="group rounded-xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/60 via-zinc-950/80 to-zinc-950 p-3.5 transition-all duration-200 hover:border-amber-500/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-zinc-900/90 pb-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-xs font-bold text-zinc-100 group-hover:text-amber-400 transition-colors">
                          {contest.contestTitle}
                        </span>
                        {delta != null && (
                          <span className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded border font-mono shrink-0 shadow-sm ${
                            isPositive 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 shadow-[0_0_6px_rgba(16,185,129,0.15)]" 
                              : "bg-rose-500/10 text-rose-400 border-rose-500/25 shadow-[0_0_6px_rgba(244,63,94,0.15)]"
                          }`}>
                            {isPositive ? `+${Math.round(delta)}` : Math.round(delta)}
                          </span>
                        )}
                      </div>
                      {contest.rank != null && (
                        <div className="mt-1 flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                          <span className="bg-zinc-900/90 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-300 font-semibold">
                            Rank #{contest.rank.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center shrink-0 gap-1.5">
                      <a 
                        href={`https://leetcode.com/contest/${contest.contestSlug}/ranking/${replayPage}/?region=global`} 
                        target="_blank" 
                        rel="noreferrer" 
                        title="Open official replay ranking" 
                        className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg transition-colors"
                      >
                        <ExternalLink size={13} />
                      </a>
                      <button 
                        onClick={() => void scanReplay(contest)} 
                        disabled={summary?.loading} 
                        title="Analyze replay events" 
                        className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-gradient-to-r from-amber-500/15 to-amber-600/10 px-2.5 py-1 text-[10.5px] font-mono font-semibold text-amber-300 hover:border-amber-500/60 hover:from-amber-500/25 hover:to-amber-600/20 active:scale-95 disabled:opacity-50 transition-all shadow-[0_0_10px_rgba(245,158,11,0.1)]"
                      >
                        <Search size={11} className={summary?.loading ? "animate-spin text-amber-400" : ""} />
                        {summary?.loading ? "Scanning..." : "Scan"}
                      </button>
                    </div>
                  </div>

                  {summary?.error && (
                    <div className="mt-2 text-[10px] text-rose-400 font-mono bg-rose-950/20 border border-rose-500/20 rounded p-2 flex items-center gap-1.5">
                      <ShieldAlert size={12} className="shrink-0" />
                      <span>{summary.error}</span>
                    </div>
                  )}

                  {summary?.reports.map(({ title, report }) => {
                    const isManual = report.status === 'CLEAN';
                    const badgeColor = report.status === 'HEAVY_PASTE' 
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.2)]' 
                      : report.status === 'MILD_PASTE' 
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]' 
                        : report.status === 'SKIPPED'
                          ? 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]';
                    const labelText = report.status === 'CLEAN' ? 'Clean Telemetry' : report.label;

                    return (
                      <div key={title} className="mt-2.5 border-t border-zinc-900/90 pt-2.5 font-mono">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[11px] font-semibold text-zinc-200 truncate" title={title}>{title}</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${badgeColor}`}>
                            {labelText}
                          </span>
                        </div>
                        <ul className="mt-1.5 space-y-1 text-[10px] text-zinc-400">
                          {report.details.map((detail: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-1.5 text-zinc-300">
                              <span className="text-amber-500/70 text-[9px]">•</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                          {isManual && (
                            <li className="text-emerald-400/90 flex items-center gap-1">
                              <CheckCircle2 size={11} className="text-emerald-400 shrink-0" />
                              <span>No external paste detected</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              )
            })}

            {!loading && contests.length === 0 && (
              <div className="py-12 text-center text-xs font-mono text-zinc-500 flex flex-col items-center justify-center gap-2">
                <ShieldCheck size={24} className="text-zinc-700" />
                <span>No finalized contests available for replay analysis.</span>
              </div>
            )}
          </div>

          {/* Footer */}
          {latest?.refreshedAt && (
            <footer className="border-t border-zinc-800/80 bg-zinc-950/90 px-4 py-2 flex items-center justify-between text-[9.5px] font-mono text-zinc-500">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                Auto-sync active
              </span>
              <span>Refreshed {new Date(latest.refreshedAt).toLocaleTimeString()}</span>
            </footer>
          )}
        </section>
      )}
    </div>
  )
}
