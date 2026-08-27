import React, { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Clock,
  CheckCircle2,
  Trophy,
  BarChart3,
  Calendar,
  Layers,
  Target,
  Copy,
  Check,
  ExternalLink,
  ArrowRight,
  Activity,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Tag,
  Zap,
  Flame
} from "lucide-react"
import type { ZerotracProblem, WeaknessSnapshot } from "../../lib/types"
import { STUDY_LISTS } from "../../lib/study-lists"
import { PATTERN_EXHIBITS } from "../../lib/patterns-data"

interface DayActivity {
  key: string
  label: string
  dateLabel: string
  focusSeconds: number
  solves: number
  sessions: number
}

interface SolvedProblemItem {
  title: string
  slug: string
  rating?: number
  difficulty?: string
  topics: string[]
  solvedAt?: string | number | Date
  focusSeconds?: number
}

interface WeeklyReportModalProps {
  isOpen: boolean
  onClose: () => void
  days: DayActivity[]
  weekFocusSeconds: number
  weekSolves: number
  weekSessions: number
  strongestDay?: DayActivity
  recentSolves?: any[]
  localLogs?: any[]
  zerotracMap?: Map<string, number>
  zerotrac?: ZerotracProblem[]
  weakness?: WeaknessSnapshot | null
  username?: string
}

// 1. Study lists mapping
const STUDY_LIST_TOPICS = new Map<string, string[]>()
for (const list of STUDY_LISTS) {
  for (const p of list.problems) {
    if (p.slug && p.topic) {
      const clean = p.slug.toLowerCase().trim()
      const existing = STUDY_LIST_TOPICS.get(clean) || []
      if (!existing.includes(p.topic)) existing.push(p.topic)
      STUDY_LIST_TOPICS.set(clean, existing)
    }
  }
}

// 2. Pattern exhibits mapping
const PATTERN_TOPICS = new Map<string, string[]>()
for (const [patternId, exhibit] of Object.entries(PATTERN_EXHIBITS)) {
  if (exhibit && Array.isArray(exhibit.practiceProblems)) {
    const formattedPattern = patternId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    for (const p of exhibit.practiceProblems) {
      if (p.slug) {
        const clean = p.slug.toLowerCase().trim()
        const existing = PATTERN_TOPICS.get(clean) || []
        if (!existing.includes(formattedPattern)) existing.push(formattedPattern)
        PATTERN_TOPICS.set(clean, existing)
      }
    }
  }
}

// 3. Topic color & styling palette (Harmonized with AlgoVault Dark Palette)
interface TopicTheme {
  bar: string
  text: string
  bg: string
  border: string
  dot: string
}

const TOPIC_PALETTES: Record<string, TopicTheme> = {
  "Array": { bar: "bg-amber-400", text: "text-amber-300", bg: "bg-amber-500/10", border: "border-amber-500/25", dot: "bg-amber-400" },
  "Hash Table": { bar: "bg-sky-400", text: "text-sky-300", bg: "bg-sky-500/10", border: "border-sky-500/25", dot: "bg-sky-400" },
  "Dynamic Programming": { bar: "bg-purple-400", text: "text-purple-300", bg: "bg-purple-500/10", border: "border-purple-500/25", dot: "bg-purple-400" },
  "String": { bar: "bg-rose-400", text: "text-rose-300", bg: "bg-rose-500/10", border: "border-rose-500/25", dot: "bg-rose-400" },
  "Tree": { bar: "bg-emerald-400", text: "text-emerald-300", bg: "bg-emerald-500/10", border: "border-emerald-500/25", dot: "bg-emerald-400" },
  "Binary Search": { bar: "bg-cyan-400", text: "text-cyan-300", bg: "bg-cyan-500/10", border: "border-cyan-500/25", dot: "bg-cyan-400" },
  "Breadth-First Search": { bar: "bg-teal-400", text: "text-teal-300", bg: "bg-teal-500/10", border: "border-teal-500/25", dot: "bg-teal-400" },
  "Depth-First Search": { bar: "bg-emerald-500", text: "text-emerald-200", bg: "bg-emerald-500/10", border: "border-emerald-500/25", dot: "bg-emerald-500" },
  "Greedy": { bar: "bg-lime-400", text: "text-lime-300", bg: "bg-lime-500/10", border: "border-lime-500/25", dot: "bg-lime-400" },
  "Sliding Window": { bar: "bg-blue-400", text: "text-blue-300", bg: "bg-blue-500/10", border: "border-blue-500/25", dot: "bg-blue-400" },
  "Prefix Sum": { bar: "bg-indigo-400", text: "text-indigo-300", bg: "bg-indigo-500/10", border: "border-indigo-500/25", dot: "bg-indigo-400" },
  "Bit Manipulation": { bar: "bg-violet-400", text: "text-violet-300", bg: "bg-violet-500/10", border: "border-violet-500/25", dot: "bg-violet-400" },
  "Sorting": { bar: "bg-fuchsia-400", text: "text-fuchsia-300", bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/25", dot: "bg-fuchsia-400" },
  "Database": { bar: "bg-zinc-400", text: "text-zinc-300", bg: "bg-zinc-500/10", border: "border-zinc-500/25", dot: "bg-zinc-400" },
  "Math": { bar: "bg-orange-400", text: "text-orange-300", bg: "bg-orange-500/10", border: "border-orange-500/25", dot: "bg-orange-400" },
  "Two Pointers": { bar: "bg-amber-500", text: "text-amber-200", bg: "bg-amber-500/10", border: "border-amber-500/25", dot: "bg-amber-500" },
  "Stack": { bar: "bg-pink-400", text: "text-pink-300", bg: "bg-pink-500/10", border: "border-pink-500/25", dot: "bg-pink-400" },
  "Graph": { bar: "bg-teal-500", text: "text-teal-200", bg: "bg-teal-500/10", border: "border-teal-500/25", dot: "bg-teal-500" }
}

const DEFAULT_TOPIC_THEME: TopicTheme = {
  bar: "bg-[#dfa054]",
  text: "text-[#dfa054]",
  bg: "bg-[#dfa054]/10",
  border: "border-[#dfa054]/25",
  dot: "bg-[#dfa054]"
}

function getTopicTheme(topic: string): TopicTheme {
  if (TOPIC_PALETTES[topic]) return TOPIC_PALETTES[topic]
  return DEFAULT_TOPIC_THEME
}

// 4. Rating Band Configurations
interface RatingBandDef {
  key: string
  label: string
  tierName: string
  color: string
  glow: string
  bg: string
  border: string
  min: number
  max: number
}

const RATING_BANDS: RatingBandDef[] = [
  { key: "easy", label: "< 1400", tierName: "Easy", color: "#10b981", glow: "rgba(16,185,129,0.35)", bg: "bg-emerald-500/10", border: "border-emerald-500/25", min: 0, max: 1399 },
  { key: "medium", label: "1400–1699", tierName: "Medium", color: "#eab308", glow: "rgba(234,179,8,0.35)", bg: "bg-amber-500/10", border: "border-amber-500/25", min: 1400, max: 1699 },
  { key: "hard", label: "1700–1999", tierName: "Hard", color: "#fb923c", glow: "rgba(251,146,60,0.35)", bg: "bg-orange-500/10", border: "border-orange-500/25", min: 1700, max: 1999 },
  { key: "expert", label: "2000–2299", tierName: "Expert", color: "#f43f5e", glow: "rgba(244,63,94,0.35)", bg: "bg-rose-500/10", border: "border-rose-500/25", min: 2000, max: 2299 },
  { key: "master", label: "2300+", tierName: "Master", color: "#a855f7", glow: "rgba(168,85,247,0.35)", bg: "bg-purple-500/10", border: "border-purple-500/25", min: 2300, max: 4000 }
]

function formatDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return "0m"
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

function formatDetailedDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return "0 mins"
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  if (hours > 0) {
    return `${hours} hr${hours === 1 ? "" : "s"} ${minutes} min${minutes === 1 ? "" : "s"}`
  }
  return `${minutes} min${minutes === 1 ? "" : "s"}`
}

function getRatingTierBadge(rating: number) {
  if (rating >= 2300) return { name: "Master", color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10" }
  if (rating >= 2000) return { name: "Expert", color: "text-rose-400", border: "border-rose-500/30", bg: "bg-rose-500/10" }
  if (rating >= 1700) return { name: "Hard", color: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/10" }
  if (rating >= 1400) return { name: "Medium", color: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10" }
  return { name: "Easy", color: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" }
}

export function WeeklyReportModal({
  isOpen,
  onClose,
  days,
  weekFocusSeconds,
  weekSolves,
  weekSessions,
  strongestDay,
  recentSolves = [],
  localLogs = [],
  zerotracMap = new Map(),
  zerotrac = [],
  weakness = null,
  username = "Developer"
}: WeeklyReportModalProps) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "problems" | "plan">("overview")
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [selectedRatingBand, setSelectedRatingBand] = useState<string | null>(null)
  const [showAllTopics, setShowAllTopics] = useState(false)
  const [dynamicTagsMap, setDynamicTagsMap] = useState<Map<string, string[]>>(new Map())
  const [hoveredDay, setHoveredDay] = useState<DayActivity | null>(null)
  const [hoveredSpectrum, setHoveredSpectrum] = useState<{ topic: string; count: number; pct: number } | null>(null)

  // 1. Preload stored problem tags from local storage
  useEffect(() => {
    chrome.storage.local.get(["algovault.problem_tags", "algovault.solvedSlugs"], (res) => {
      const map = new Map<string, string[]>()

      const storedTags = res["algovault.problem_tags"]
      if (storedTags && typeof storedTags === "object" && !Array.isArray(storedTags)) {
        for (const [slug, tags] of Object.entries(storedTags)) {
          if (Array.isArray(tags) && tags.length > 0) {
            map.set(slug.toLowerCase().trim(), tags)
          }
        }
      }

      const solvedSlugsData = res["algovault.solvedSlugs"]
      if (solvedSlugsData && Array.isArray(solvedSlugsData.rawProblems)) {
        for (const p of solvedSlugsData.rawProblems) {
          if (p?.titleSlug && Array.isArray(p.topicTags)) {
            const clean = String(p.titleSlug).toLowerCase().trim()
            const tags = p.topicTags
              .map((t: any) => (typeof t === "string" ? t : t?.name))
              .filter(Boolean)
            if (tags.length > 0) map.set(clean, tags)
          }
        }
      }

      setDynamicTagsMap(map)
    })
  }, [])

  // 2. Date Range (7-day window)
  const dateRangeLabel = useMemo(() => {
    if (!days || days.length === 0) return "Last 7 Days"
    const first = days[0]?.dateLabel || ""
    const last = days[days.length - 1]?.dateLabel || ""
    return `${first} — ${last}`
  }, [days])

  // Helper: Retrieve real verified topics
  const getVerifiedTopics = (slug: string, fallbackLogTopic?: string): string[] => {
    const cleanSlug = slug.toLowerCase().trim()

    if (dynamicTagsMap.has(cleanSlug)) {
      const tags = dynamicTagsMap.get(cleanSlug)!
      if (tags.length > 0) return tags
    }

    if (STUDY_LIST_TOPICS.has(cleanSlug)) {
      return STUDY_LIST_TOPICS.get(cleanSlug)!
    }

    if (PATTERN_TOPICS.has(cleanSlug)) {
      return PATTERN_TOPICS.get(cleanSlug)!
    }

    if (fallbackLogTopic && fallbackLogTopic.trim() && fallbackLogTopic !== "General" && fallbackLogTopic !== "Unknown") {
      return [fallbackLogTopic.trim()]
    }

    return ["Untagged"]
  }

  // 3. Extract solved problems
  const solvedProblems = useMemo(() => {
    const map = new Map<string, SolvedProblemItem>()
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

    for (const log of localLogs) {
      if (!log.ts || log.ts < sevenDaysAgo) continue
      if ((log.solved || log.isSolved) && log.slug) {
        const cleanSlug = String(log.slug).toLowerCase().trim()
        const rating = zerotracMap.get(cleanSlug)
        const existing = map.get(cleanSlug)
        const focusSecs = Number(log.actSecs ?? log.activeSecs ?? log.focusSeconds ?? 0)
        const title = log.title || cleanSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        const topics = getVerifiedTopics(cleanSlug, log.topic)

        map.set(cleanSlug, {
          slug: cleanSlug,
          title,
          topics,
          rating: rating ?? existing?.rating,
          difficulty: log.difficulty ?? existing?.difficulty,
          solvedAt: log.ts,
          focusSeconds: (existing?.focusSeconds || 0) + focusSecs
        })
      }
    }

    for (const solve of recentSolves) {
      if (!solve.titleSlug) continue
      const cleanSlug = String(solve.titleSlug).toLowerCase().trim()
      const rating = zerotracMap.get(cleanSlug)
      if (!map.has(cleanSlug)) {
        const title = solve.title || cleanSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        const topics = getVerifiedTopics(cleanSlug)
        map.set(cleanSlug, {
          slug: cleanSlug,
          title,
          topics,
          rating,
          difficulty: solve.difficulty,
          solvedAt: solve.solvedAt
        })
      }
    }

    return Array.from(map.values())
  }, [localLogs, recentSolves, zerotracMap, dynamicTagsMap])

  // 4. Auto-fetch missing real LeetCode topic tags via GraphQL batch
  useEffect(() => {
    if (!isOpen || solvedProblems.length === 0) return

    const missingSlugs = solvedProblems
      .filter((p) => p.topics.length === 1 && p.topics[0] === "Untagged")
      .map((p) => p.slug)

    if (missingSlugs.length === 0) return

    chrome.runtime.sendMessage(
      { action: "get_problem_metadata_batch", slugs: missingSlugs },
      (response) => {
        if (response?.ok && Array.isArray(response.data)) {
          const newMap = new Map(dynamicTagsMap)
          const objToPersist: Record<string, string[]> = {}

          for (const item of response.data) {
            if (item?.titleSlug && Array.isArray(item.topicTags)) {
              const clean = String(item.titleSlug).toLowerCase().trim()
              const tags = item.topicTags
                .map((t: any) => (typeof t === "string" ? t : t?.name))
                .filter(Boolean)
              if (tags.length > 0) {
                newMap.set(clean, tags)
                objToPersist[clean] = tags
              }
            }
          }

          if (Object.keys(objToPersist).length > 0) {
            setDynamicTagsMap(newMap)
            chrome.storage.local.get(["algovault.problem_tags"], (res) => {
              const current = res["algovault.problem_tags"] || {}
              chrome.storage.local.set({
                "algovault.problem_tags": { ...current, ...objToPersist }
              })
            })
          }
        }
      }
    )
  }, [isOpen, solvedProblems, dynamicTagsMap])

  // 5. Peak rating conquered
  const peakProblem = useMemo(() => {
    const withRatings = solvedProblems.filter((p) => typeof p.rating === "number" && p.rating > 0)
    if (withRatings.length === 0) return null
    return [...withRatings].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0]
  }, [solvedProblems])

  // 6. Mathematically Accurate Rating Distribution (% of total output)
  const totalSolvedCount = useMemo(() => solvedProblems.length || 1, [solvedProblems])

  const ratingBandsData = useMemo(() => {
    return RATING_BANDS.map((band) => {
      const matched = solvedProblems.filter((p) => {
        if (typeof p.rating === "number" && p.rating > 0) {
          return p.rating >= band.min && p.rating <= band.max
        }
        if (band.key === "easy" && p.difficulty === "Easy") return true
        if (band.key === "medium" && p.difficulty === "Medium") return true
        if (band.key === "hard" && p.difficulty === "Hard") return true
        return false
      })

      const count = matched.length
      const percentage = Math.round((count / totalSolvedCount) * 100)

      return {
        ...band,
        count,
        percentage,
        problems: matched
      }
    })
  }, [solvedProblems, totalSolvedCount])

  // 7. Topic distribution
  const topicDistribution = useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of solvedProblems) {
      for (const t of p.topics) {
        counts.set(t, (counts.get(t) || 0) + 1)
      }
    }

    return Array.from(counts.entries())
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => {
        if (a.topic === "Untagged") return 1
        if (b.topic === "Untagged") return -1
        return b.count - a.count
      })
  }, [solvedProblems])

  const totalTopicInstances = useMemo(() => {
    return topicDistribution.reduce((acc, t) => acc + t.count, 0) || 1
  }, [topicDistribution])

  // Clean spectrum segments (Top 5 categories + Others)
  const spectrumSegments = useMemo(() => {
    if (topicDistribution.length === 0) return []
    if (topicDistribution.length <= 6) {
      return topicDistribution.map((t) => ({
        ...t,
        pct: Math.round((t.count / totalTopicInstances) * 100)
      }))
    }

    const top5 = topicDistribution.slice(0, 5).map((t) => ({
      ...t,
      pct: Math.round((t.count / totalTopicInstances) * 100)
    }))
    const otherCount = topicDistribution.slice(5).reduce((acc, t) => acc + t.count, 0)
    const otherPct = Math.round((otherCount / totalTopicInstances) * 100)

    return [...top5, { topic: "Other Categories", count: otherCount, pct: otherPct }]
  }, [topicDistribution, totalTopicInstances])

  const avgMinutesPerSolve = useMemo(() => {
    if (!weekSolves || weekSolves === 0 || !weekFocusSeconds) return null
    return Math.round((weekFocusSeconds / 60) / weekSolves)
  }, [weekFocusSeconds, weekSolves])

  const sessionSuccessRate = useMemo(() => {
    if (!weekSessions || weekSessions === 0) return weekSolves > 0 ? 100 : 0
    return Math.min(100, Math.round((weekSolves / weekSessions) * 100))
  }, [weekSessions, weekSolves])

  // 8. Next-Week Actionable Targets
  const nextTargetProblems = useMemo(() => {
    const solvedSet = new Set(solvedProblems.map((p) => p.slug))
    const targetRating = peakProblem?.rating ? Math.round(peakProblem.rating + 50) : 1650
    
    if (zerotrac && zerotrac.length > 0) {
      const candidates = zerotrac
        .filter((p) => !solvedSet.has(p.TitleSlug.toLowerCase()) && p.Rating >= targetRating - 80 && p.Rating <= targetRating + 120)
        .sort((a, b) => Math.abs(a.Rating - targetRating) - Math.abs(b.Rating - targetRating))
        .slice(0, 3)
      
      if (candidates.length > 0) return candidates
    }

    return []
  }, [zerotrac, peakProblem, solvedProblems])

  // Copy Markdown Summary
  const handleCopyMarkdown = () => {
    const summaryText = [
      `### ⚡ AlgoVault Engineering Debrief [${dateRangeLabel}]`,
      `**Developer:** @${username}`,
      ``,
      `#### 📊 Core Metrics`,
      `* **Total Active Practice:** ${formatDetailedDuration(weekFocusSeconds)}`,
      `* **Problems Solved:** ${weekSolves} across ${weekSessions} focused sessions`,
      avgMinutesPerSolve ? `* **Average Velocity:** ~${avgMinutesPerSolve} mins / solve` : ``,
      peakProblem?.rating ? `* **Peak Elo Conquered:** ★ ${Math.round(peakProblem.rating)} (${peakProblem.title})` : ``,
      strongestDay?.focusSeconds ? `* **Peak Productivity Day:** ${strongestDay.dateLabel} (${formatDuration(strongestDay.focusSeconds)})` : ``,
      ``,
      topicDistribution.length > 0 ? `#### 🏷️ Topics Solved: ${topicDistribution.map((t) => `${t.topic} (${t.count})`).join(", ")}` : ``,
      ``,
      `*Generated by AlgoVault*`
    ].filter(Boolean).join("\n")

    navigator.clipboard.writeText(summaryText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Slice visible topics for high-density elegance
  const displayedTopics = showAllTopics ? topicDistribution : topicDistribution.slice(0, 8)
  const hasMoreTopics = topicDistribution.length > 8

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md font-sans"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 340
            }}
            className="relative flex flex-col w-full max-w-xl max-h-[92vh] rounded-2xl border border-zinc-800/80 bg-[#0d0d0f] shadow-2xl text-zinc-200 overflow-hidden"
          >
            {/* Subtle AlgoVault Ambient Glow Backdrop */}
            <div
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(ellipse 72% 60% at 95% 0%, rgba(251,191,36,0.08), transparent), radial-gradient(ellipse 50% 60% at 0% 100%, rgba(14,165,233,0.04), transparent)"
              }}
            />

            {/* Top Header Bar */}
            <div className="relative z-10 flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/90 px-5 py-4 backdrop-blur shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#dfa054]/30 bg-[#dfa054]/10 text-[#dfa054] shadow-sm">
                  <Activity size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-[0.16em] text-[#dfa054]">
                      AlgoVault Telemetry
                    </span>
                    <span className="text-zinc-700">•</span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      7-Day Debrief
                    </span>
                  </div>
                  <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5 mt-0.5">
                    Weekly Performance Report
                    <span className="text-[10px] font-normal text-zinc-500 font-mono">
                      ({dateRangeLabel})
                    </span>
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCopyMarkdown}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 text-[11px] font-mono transition-colors cursor-pointer"
                  title="Copy markdown debrief to clipboard"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={onClose}
                  className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X size={16} />
                </motion.button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="relative z-10 flex border-b border-zinc-800/80 bg-zinc-950/40 px-5 pt-2 shrink-0 gap-6 text-xs font-mono">
              {[
                { key: "overview", label: "Executive Summary" },
                { key: "problems", label: `Problems Conquered (${solvedProblems.length})` },
                { key: "plan", label: "Next Week Targets" }
              ].map((tab) => {
                const active = activeTab === tab.key
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`pb-2.5 font-medium transition-colors relative cursor-pointer ${
                      active ? "text-[#dfa054] font-bold" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {tab.label}
                    {active && (
                      <motion.div
                        layoutId="activeReportTab"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#dfa054]"
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Modal Scrollable Body */}
            <div className="relative z-10 p-5 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-zinc-800">
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="space-y-4"
                  >
                    {/* 4 Clean Metric Cards (Flat subtle border, NO bright outlines) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 border border-zinc-800/80 rounded-2xl bg-[#0d0d0f] shadow-sm overflow-hidden">
                      {/* Practice Time */}
                      <div className="p-3.5 text-left border-r border-b sm:border-b-0 border-zinc-850/60">
                        <span className="text-[8.5px] font-bold font-mono uppercase tracking-[0.14em] text-zinc-500 block">
                          active time
                        </span>
                        <span className="block text-[18px] font-bold font-mono tabular-nums text-zinc-100 mt-1">
                          {formatDuration(weekFocusSeconds)}
                        </span>
                        <span className="text-[9.5px] text-zinc-400 font-mono mt-0.5 block truncate">
                          {avgMinutesPerSolve ? `~${avgMinutesPerSolve}m / solve` : formatDetailedDuration(weekFocusSeconds)}
                        </span>
                      </div>

                      {/* Solves */}
                      <div className="p-3.5 text-left border-b sm:border-b-0 sm:border-r border-zinc-850/60">
                        <span className="text-[8.5px] font-bold font-mono uppercase tracking-[0.14em] text-zinc-500 block">
                          problems solved
                        </span>
                        <span className="block text-[18px] font-bold font-mono tabular-nums text-emerald-400 mt-1">
                          {weekSolves} Solved
                        </span>
                        <span className="text-[9.5px] text-zinc-400 font-mono mt-0.5 block">
                          in 7-day window
                        </span>
                      </div>

                      {/* Peak ZeroTrac Elo */}
                      <div className="p-3.5 text-left border-r border-zinc-850/60">
                        <span className="text-[8.5px] font-bold font-mono uppercase tracking-[0.14em] text-zinc-500 block">
                          peak conquered
                        </span>
                        <span className="block text-[18px] font-bold font-mono tabular-nums text-[#dfa054] mt-1 truncate">
                          {peakProblem?.rating ? `★ ${Math.round(peakProblem.rating)}` : "—"}
                        </span>
                        <span className="text-[9.5px] text-zinc-400 font-mono mt-0.5 block truncate" title={peakProblem?.title || "No rated problems"}>
                          {peakProblem ? peakProblem.title : "Unrated practice"}
                        </span>
                      </div>

                      {/* Practice Sessions */}
                      <div className="p-3.5 text-left">
                        <span className="text-[8.5px] font-bold font-mono uppercase tracking-[0.14em] text-zinc-500 block">
                          focus sessions
                        </span>
                        <span className="block text-[18px] font-bold font-mono tabular-nums text-sky-400 mt-1">
                          {weekSessions} Sessions
                        </span>
                        <span className="text-[9.5px] text-zinc-400 font-mono mt-0.5 block">
                          {sessionSuccessRate}% completed
                        </span>
                      </div>
                    </div>

                    {/* 7-Day Focus Rhythm with Interactive Hover Tooltip */}
                    <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0d0f] p-4 sm:p-5 space-y-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-100 font-sans tracking-tight flex items-center gap-1.5">
                          <BarChart3 size={14} className="text-[#dfa054]" />
                          Weekly Focus Rhythm
                        </span>
                        {hoveredDay ? (
                          <span className="text-[10px] font-mono text-[#dfa054] bg-[#dfa054]/10 border border-[#dfa054]/25 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold animate-fadeIn">
                            {hoveredDay.dateLabel}: {formatDuration(hoveredDay.focusSeconds)} · {hoveredDay.solves} Solves
                          </span>
                        ) : strongestDay && strongestDay.focusSeconds > 0 ? (
                          <span className="text-[9.5px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Sparkles size={10} className="text-[#dfa054]" />
                            Peak: {strongestDay.dateLabel} ({formatDuration(strongestDay.focusSeconds)})
                          </span>
                        ) : null}
                      </div>

                      <div className="grid grid-cols-7 gap-2 pt-2">
                        {days.map((day, idx) => {
                          const maxSecs = Math.max(...days.map((d) => d.focusSeconds), 3600)
                          const heightPercent = day.focusSeconds > 0 ? Math.max(14, Math.round((day.focusSeconds / maxSecs) * 100)) : 6
                          const isStrongest = strongestDay && day.key === strongestDay.key && day.focusSeconds > 0
                          const isHovered = hoveredDay?.key === day.key

                          return (
                            <div
                              key={day.key}
                              onMouseEnter={() => setHoveredDay(day)}
                              onMouseLeave={() => setHoveredDay(null)}
                              className="flex flex-col items-center gap-2 cursor-pointer group"
                            >
                              <div className={`h-24 w-full flex items-end justify-center bg-zinc-900/40 rounded-lg p-1 border transition-colors overflow-hidden ${
                                isHovered ? "border-amber-500/40 bg-zinc-900/80" : "border-zinc-800/40"
                              }`}>
                                <motion.div
                                  initial={{ height: "0%" }}
                                  animate={{ height: `${heightPercent}%` }}
                                  transition={{
                                    duration: 0.55,
                                    delay: 0.1 + idx * 0.04,
                                    ease: [0.16, 1, 0.3, 1]
                                  }}
                                  className={`w-full rounded-t-md rounded-b-sm transition-all ${
                                    isStrongest
                                      ? "bg-gradient-to-t from-[#c88a3e] to-[#dfa054] shadow-[0_0_14px_rgba(223,160,84,0.35)]"
                                      : isHovered
                                      ? "bg-amber-400"
                                      : day.focusSeconds > 0
                                      ? "bg-gradient-to-t from-zinc-600 to-zinc-400 group-hover:from-zinc-500 group-hover:to-zinc-300"
                                      : "bg-zinc-850/40"
                                  }`}
                                />
                              </div>
                              <div className="flex flex-col items-center gap-0.5">
                                <span className={`text-[10px] font-mono font-bold transition-colors ${
                                  isHovered ? "text-[#dfa054]" : "text-zinc-300"
                                }`}>
                                  {day.label}
                                </span>
                                <span className="text-[8.5px] font-mono text-zinc-500 tabular-nums">
                                  {day.focusSeconds > 0 ? formatDuration(day.focusSeconds) : "0m"}
                                </span>
                                {day.solves > 0 ? (
                                  <span className="text-[8px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded-full">
                                    {day.solves}✓
                                  </span>
                                ) : (
                                  <span className="text-[8px] font-mono text-zinc-600">—</span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Mathematically Accurate ZeroTrac Rating Distribution */}
                    <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0d0f] p-4 sm:p-5 space-y-3.5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Trophy size={14} className="text-amber-400" />
                          <span className="text-xs font-semibold text-zinc-100 font-sans tracking-tight">
                            ZeroTrac Rating Distribution
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {selectedRatingBand ? "Click tier to reset" : "Hover / click tier to filter"}
                        </span>
                      </div>

                      {/* Clean Flat Rows (NO divide-y, NO curved white outline brackets!) */}
                      <div className="space-y-1 pt-0.5">
                        {ratingBandsData.map((band, idx) => {
                          const isSelected = selectedRatingBand === band.key
                          // Calculate exact proportional width (% of weekly total solves)
                          const fillWidth = band.count > 0 ? Math.max(4, band.percentage) : 0

                          return (
                            <div
                              key={band.key}
                              onClick={() => setSelectedRatingBand(isSelected ? null : band.key)}
                              className={`group flex items-center justify-between py-2 px-2.5 rounded-xl border transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-zinc-850/80 border-zinc-700 shadow-sm"
                                  : "border-transparent hover:bg-zinc-900/60 hover:border-zinc-800/60"
                              }`}
                              title={`${band.tierName} (${band.label}): ${band.count} problems (${band.percentage}% of weekly output)`}
                            >
                              {/* Left: Tier Badge & Range */}
                              <div className="flex items-center gap-2.5 min-w-[130px] font-mono">
                                <span
                                  className="text-[9.5px] font-bold px-1.5 py-0.5 rounded border shrink-0"
                                  style={{
                                    color: band.color,
                                    backgroundColor: `${band.color}14`,
                                    borderColor: `${band.color}35`
                                  }}
                                >
                                  {band.tierName}
                                </span>
                                <span className="text-[11px] text-zinc-400 font-medium group-hover:text-zinc-200 transition-colors">
                                  {band.label}
                                </span>
                              </div>

                              {/* Middle: Smooth Capsule Track with True Proportional Fill */}
                              <div className="flex-1 mx-3 h-2 bg-zinc-850/60 rounded-full overflow-hidden flex items-center">
                                {fillWidth > 0 && (
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${fillWidth}%` }}
                                    transition={{
                                      duration: 0.55,
                                      delay: 0.08 + idx * 0.04,
                                      ease: [0.16, 1, 0.3, 1]
                                    }}
                                    className="h-full rounded-full"
                                    style={{
                                      backgroundColor: band.color,
                                      boxShadow: `0 0 6px ${band.glow}`
                                    }}
                                  />
                                )}
                              </div>

                              {/* Right: Solved Count & Percentage */}
                              <div className="text-right min-w-[75px] shrink-0 font-mono">
                                <span className={`text-xs font-bold tabular-nums ${band.count > 0 ? "text-zinc-200 group-hover:text-white" : "text-zinc-600"}`}>
                                  {band.count} <span className="text-[10px] font-normal text-zinc-500">({band.percentage}%)</span>
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Ultra-Aesthetic Seamless Solved Problems Drawer */}
                      <AnimatePresence>
                        {selectedRatingBand && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                            className="rounded-xl border border-zinc-800/80 bg-zinc-950/90 p-2 space-y-1 overflow-hidden shadow-inner mt-2"
                          >
                            {(() => {
                              const band = ratingBandsData.find((b) => b.key === selectedRatingBand)
                              if (!band) return null

                              return (
                                <>
                                  <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-zinc-850/60">
                                    <div className="flex items-center gap-2">
                                      <span
                                        className="h-1.5 w-1.5 rounded-full"
                                        style={{ backgroundColor: band.color }}
                                      />
                                      <span className="text-[11px] font-mono font-bold tracking-wide uppercase text-zinc-300">
                                        {band.tierName} Solves
                                      </span>
                                      <span className="text-[10px] font-mono text-zinc-500">
                                        ({band.count} problems · {band.percentage}% of week)
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => setSelectedRatingBand(null)}
                                      className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                                    >
                                      Close
                                    </button>
                                  </div>

                                  <div className="space-y-0.5 pt-1">
                                    {band.problems.length > 0 ? (
                                      band.problems.map((p) => (
                                        <div
                                          key={p.slug}
                                          className="group flex items-center justify-between py-2 px-2.5 rounded-lg hover:bg-zinc-900/80 transition-colors"
                                        >
                                          <div className="flex items-center gap-2.5 min-w-0 pr-3">
                                            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400/90 shadow-[0_0_6px_rgba(52,211,153,0.6)] shrink-0" />
                                            <a
                                              href={`https://leetcode.com/problems/${p.slug}/`}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="font-sans text-[13px] font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors truncate flex items-center gap-1.5"
                                            >
                                              <span className="truncate">{p.title}</span>
                                              <ExternalLink size={11} className="opacity-0 group-hover:opacity-60 transition-opacity text-zinc-400 shrink-0" />
                                            </a>
                                          </div>

                                          <div className="flex items-center gap-2 shrink-0 font-mono">
                                            {typeof p.rating === "number" && p.rating > 0 ? (
                                              <span className="text-[11px] font-semibold text-zinc-400 group-hover:text-[#dfa054] tabular-nums transition-colors">
                                                ★ {Math.round(p.rating)}
                                              </span>
                                            ) : p.difficulty ? (
                                              <span className="text-[10px] text-zinc-500 font-mono">
                                                {p.difficulty}
                                              </span>
                                            ) : null}
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-xs text-zinc-500 py-3 text-center font-mono">
                                        No problems in this rating band.
                                      </p>
                                    )}
                                  </div>
                                </>
                              )
                            })()}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Topics Solved This Week with Interactive Spectrum Hover Tooltips */}
                    <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0d0f] p-4 sm:p-5 space-y-3.5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold text-zinc-100 font-sans tracking-tight flex items-center gap-1.5">
                            <Tag size={14} className="text-sky-400" />
                            Topics Solved This Week
                          </span>
                          <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
                            {topicDistribution.length} Categories · {solvedProblems.length} Problems
                          </p>
                        </div>
                        {hoveredSpectrum ? (
                          <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-md font-semibold animate-fadeIn">
                            {hoveredSpectrum.topic}: {hoveredSpectrum.count} Solves ({hoveredSpectrum.pct}%)
                          </span>
                        ) : selectedTopic ? (
                          <button
                            onClick={() => setSelectedTopic(null)}
                            className="text-[10px] font-mono text-[#dfa054] hover:underline cursor-pointer"
                          >
                            Reset selection
                          </button>
                        ) : null}
                      </div>

                      {topicDistribution.length > 0 ? (
                        <div className="space-y-3">
                          {/* Segmented Distribution Spectrum Bar with Interactive Hover Tooltip */}
                          <div className="h-2.5 w-full bg-zinc-850/60 rounded-full overflow-hidden flex gap-[2px] p-[1px]">
                            {spectrumSegments.map(({ topic, count, pct }, idx) => {
                              const theme = getTopicTheme(topic)
                              const isHovered = hoveredSpectrum?.topic === topic
                              return (
                                <motion.div
                                  key={topic}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.max(3, pct)}%` }}
                                  transition={{
                                    duration: 0.5,
                                    delay: 0.12 + idx * 0.04,
                                    ease: [0.16, 1, 0.3, 1]
                                  }}
                                  onMouseEnter={() => setHoveredSpectrum({ topic, count, pct })}
                                  onMouseLeave={() => setHoveredSpectrum(null)}
                                  className={`h-full ${theme.bar} transition-all cursor-pointer ${
                                    isHovered ? "brightness-125 scale-y-110 shadow-sm" : "hover:brightness-110"
                                  }`}
                                />
                              )
                            })}
                          </div>

                          {/* Fluid Topic Badges */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {displayedTopics.map(({ topic, count }) => {
                              const theme = getTopicTheme(topic)
                              const isSelected = selectedTopic === topic
                              const isHovered = hoveredSpectrum?.topic === topic
                              const isUntagged = topic === "Untagged"

                              return (
                                <motion.button
                                  key={topic}
                                  type="button"
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => setSelectedTopic(isSelected ? null : topic)}
                                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-all cursor-pointer ${
                                    isSelected || isHovered
                                      ? "bg-[#dfa054]/15 border-[#dfa054]/40 text-[#dfa054] shadow-sm ring-1 ring-[#dfa054]/30"
                                      : isUntagged
                                      ? "border-zinc-800/80 bg-zinc-900/30 text-zinc-500 hover:border-zinc-700"
                                      : "border-zinc-800/80 bg-zinc-900/60 hover:bg-zinc-850 hover:border-zinc-700 text-zinc-300"
                                  }`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected || isHovered ? "bg-[#dfa054]" : theme.dot}`} />
                                  <span className={`font-medium ${isSelected || isHovered ? "font-bold text-zinc-100" : isUntagged ? "italic" : "text-zinc-200"}`}>
                                    {topic}
                                  </span>
                                  <span className="text-[10px] text-zinc-500 font-semibold">
                                    {count}
                                  </span>
                                </motion.button>
                              )
                            })}
                          </div>

                          {/* Toggle more topics */}
                          {hasMoreTopics && (
                            <div className="pt-0.5">
                              <button
                                onClick={() => setShowAllTopics(!showAllTopics)}
                                className="flex items-center gap-1 text-[10.5px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                              >
                                {showAllTopics ? (
                                  <>
                                    <span>Show fewer categories</span>
                                    <ChevronUp size={12} />
                                  </>
                                ) : (
                                  <>
                                    <span>+ {topicDistribution.length - 8} more categories</span>
                                    <ChevronDown size={12} />
                                  </>
                                )}
                              </button>
                            </div>
                          )}

                          {/* Smooth Accordion Expanded Problems under Topic */}
                          <AnimatePresence>
                            {selectedTopic && (
                              <motion.div
                                initial={{ opacity: 0, height: 0, scale: 0.98 }}
                                animate={{ opacity: 1, height: "auto", scale: 1 }}
                                exit={{ opacity: 0, height: 0, scale: 0.98 }}
                                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                                className="rounded-xl border border-zinc-800/80 bg-zinc-950/90 p-2 space-y-1 font-mono overflow-hidden shadow-inner mt-2"
                              >
                                <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-zinc-850/60">
                                  <div className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                                    <span className="text-[11px] font-bold text-zinc-200 tracking-wide">
                                      {selectedTopic} Solves
                                    </span>
                                    <span className="text-[10px] text-zinc-500 font-normal">
                                      ({solvedProblems.filter((p) => p.topics.includes(selectedTopic)).length} problems)
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => setSelectedTopic(null)}
                                    className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                                  >
                                    Close
                                  </button>
                                </div>

                                <div className="space-y-0.5 pt-1 font-sans">
                                  {solvedProblems
                                    .filter((p) => p.topics.includes(selectedTopic))
                                    .map((p) => {
                                      const hasRating = typeof p.rating === "number" && p.rating > 0

                                      return (
                                        <div
                                          key={p.slug}
                                          className="group flex items-center justify-between py-2 px-2.5 rounded-lg hover:bg-zinc-900/80 transition-colors"
                                        >
                                          <div className="flex items-center gap-2.5 min-w-0 pr-3">
                                            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400/90 shadow-[0_0_6px_rgba(52,211,153,0.6)] shrink-0" />
                                            <a
                                              href={`https://leetcode.com/problems/${p.slug}/`}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="text-[13px] font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors truncate flex items-center gap-1.5"
                                            >
                                              <span className="truncate">{p.title}</span>
                                              <ExternalLink size={11} className="opacity-0 group-hover:opacity-60 transition-opacity text-zinc-400 shrink-0" />
                                            </a>
                                          </div>

                                          <div className="flex items-center gap-2 shrink-0 font-mono">
                                            {p.focusSeconds && p.focusSeconds > 0 && (
                                              <span className="text-[10px] text-zinc-500">
                                                {formatDuration(p.focusSeconds)}
                                              </span>
                                            )}
                                            {hasRating ? (
                                              <span className="text-[11px] font-semibold text-zinc-400 group-hover:text-[#dfa054] tabular-nums transition-colors">
                                                ★ {Math.round(p.rating!)}
                                              </span>
                                            ) : p.difficulty ? (
                                              <span className="text-[10px] text-zinc-500">
                                                {p.difficulty}
                                              </span>
                                            ) : null}
                                          </div>
                                        </div>
                                      )
                                    })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <p className="text-xs text-zinc-500 font-mono py-2">
                          No problems solved in the last 7 days yet.
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === "problems" && (
                  <motion.div
                    key="problems"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs border-b border-zinc-800/80 pb-2 px-1">
                      <span className="text-zinc-400 font-mono text-[11px]">
                        Chronological Solve Log ({solvedProblems.length} problems)
                      </span>
                      <span className="text-zinc-500 font-mono text-[10px]">
                        Verified Tags & Rating
                      </span>
                    </div>

                    {solvedProblems.length > 0 ? (
                      <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0d0f] p-2 space-y-1 shadow-sm">
                        {solvedProblems.map((p, idx) => {
                          const hasRating = typeof p.rating === "number" && p.rating > 0

                          return (
                            <motion.div
                              key={p.slug}
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.18, delay: idx * 0.015 }}
                              className="group flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-zinc-900/80 border border-transparent hover:border-zinc-800/60 transition-all"
                            >
                              <div className="flex items-center gap-3 min-w-0 pr-3">
                                <span className="text-[10px] text-zinc-600 font-mono w-4 text-right shrink-0">
                                  {idx + 1}
                                </span>
                                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400/90 shadow-[0_0_6px_rgba(52,211,153,0.6)] shrink-0" />
                                <div className="min-w-0">
                                  <a
                                    href={`https://leetcode.com/problems/${p.slug}/`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-sans text-[13px] font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors truncate flex items-center gap-1.5"
                                  >
                                    <span className="truncate">{p.title}</span>
                                    <ExternalLink size={11} className="opacity-0 group-hover:opacity-60 transition-opacity text-zinc-400 shrink-0" />
                                  </a>
                                  <div className="flex flex-wrap items-center gap-1 mt-0.5 font-mono">
                                    {p.topics.slice(0, 3).map((t) => (
                                      <span
                                        key={t}
                                        className="text-[9px] text-zinc-500 hover:text-zinc-300 transition-colors"
                                      >
                                        #{t}
                                      </span>
                                    ))}
                                    {p.topics.length > 3 && (
                                      <span className="text-[9px] text-zinc-600">
                                        +{p.topics.length - 3}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0 font-mono">
                                {p.focusSeconds && p.focusSeconds > 0 && (
                                  <span className="text-[10px] text-zinc-500">
                                    {formatDuration(p.focusSeconds)}
                                  </span>
                                )}
                                {hasRating ? (
                                  <span className="text-[11px] font-semibold text-zinc-400 group-hover:text-[#dfa054] tabular-nums transition-colors">
                                    ★ {Math.round(p.rating!)}
                                  </span>
                                ) : p.difficulty ? (
                                  <span className="text-[10px] text-zinc-500">
                                    {p.difficulty}
                                  </span>
                                ) : null}
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-zinc-500 font-mono text-xs border border-dashed border-zinc-800 rounded-xl">
                        No solves recorded in the last 7 days.
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "plan" && (
                  <motion.div
                    key="plan"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="space-y-4"
                  >
                    {/* Executive Strategy Box */}
                    <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-r from-amber-500/10 via-zinc-950 to-zinc-950 p-4 sm:p-5 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#dfa054] uppercase tracking-wider">
                        <Target size={14} />
                        Tactical Practice Directive
                      </div>
                      <p className="text-xs leading-relaxed text-zinc-300 font-sans">
                        {peakProblem?.rating
                          ? `Your current conquered rating frontier is ★ ${Math.round(peakProblem.rating)}. To break into the next performance tier, target 3 problems at the ${Math.floor(peakProblem.rating / 100) * 100 + 50}–${Math.floor(peakProblem.rating / 100) * 100 + 150} Elo band this week.`
                          : `Establish consistent problem-solving velocity by recording 25-minute practice sessions across foundational patterns.`}
                      </p>
                    </div>

                    {/* 3 Recommended Frontier Problems */}
                    {nextTargetProblems.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-zinc-200 font-sans flex items-center gap-1.5">
                          <Sparkles size={13} className="text-[#dfa054]" />
                          Frontier Targets for Next Week
                        </div>

                        <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0d0f] p-2 space-y-1 shadow-sm">
                          {nextTargetProblems.map((prob) => {
                            const isAlreadySolved = solvedProblems.some((s) => s.slug === prob.TitleSlug.toLowerCase())

                            return (
                              <div
                                key={prob.TitleSlug}
                                className="group flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-zinc-900/80 border border-transparent hover:border-zinc-800/60 transition-all"
                              >
                                <div>
                                  <div className="text-[13px] font-medium text-zinc-200 font-sans group-hover:text-white transition-colors">
                                    {prob.Title}
                                  </div>
                                  <div className="text-[9.5px] font-mono text-zinc-500 mt-0.5">
                                    {prob.ContestID_en || "Contest Challenge"} · Index {prob.ProblemIndex || "Q"}
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 font-mono">
                                  <span className="text-[11px] font-semibold text-[#dfa054] tabular-nums">
                                    ★ {Math.round(prob.Rating)}
                                  </span>
                                  {isAlreadySolved ? (
                                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                                      <Check size={12} />
                                      <span>Done</span>
                                    </span>
                                  ) : (
                                    <a
                                      href={`https://leetcode.com/problems/${prob.TitleSlug}/`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-sans font-semibold transition-colors flex items-center gap-1"
                                    >
                                      <span>Solve</span>
                                      <ArrowRight size={12} />
                                    </a>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Modal Footer */}
            <div className="relative z-10 flex items-center justify-between border-t border-zinc-800/80 bg-zinc-950/80 px-5 py-3.5 shrink-0">
              <span className="text-[10px] font-mono text-zinc-500">
                AlgoVault Performance Telemetry
              </span>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="px-5 py-1.5 rounded-lg bg-[#dfa054] hover:bg-[#e6ab62] text-zinc-950 font-bold text-xs font-sans transition-colors cursor-pointer shadow-sm"
              >
                Done
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
