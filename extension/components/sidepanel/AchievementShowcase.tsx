import React, { useState, useRef } from "react"
import { motion, useMotionValue, useTransform, useSpring, useMotionTemplate } from "framer-motion"
import { Lock, Sparkles } from "lucide-react"
import { Card } from "../ui/Card"
import { getAchievementAssetUrl, type Achievement } from "../../lib/achievements"
import confetti from "canvas-confetti"

type AchievementShowcaseVariant = "compact" | "gallery"

interface AchievementShowcaseProps {
  achievements: Achievement[]
  variant?: AchievementShowcaseVariant
}

const tierStyle: Record<string, { text: string; border: string; glow: string; label: string; bg: string }> = {
  common: { 
    text: "text-zinc-400", 
    border: "border-zinc-700/80", 
    glow: "shadow-zinc-950/40", 
    label: "Common",
    bg: "bg-[#18181b]" 
  },
  rare: { 
    text: "text-sky-400", 
    border: "border-sky-500/50", 
    glow: "shadow-sky-500/10", 
    label: "Rare",
    bg: "bg-[#0c1a24]" 
  },
  epic: { 
    text: "text-violet-400", 
    border: "border-violet-500/50", 
    glow: "shadow-violet-500/15", 
    label: "Epic",
    bg: "bg-[#160f24]" 
  },
  legendary: { 
    text: "text-[#dfa054]", 
    border: "border-amber-500/50", 
    glow: "shadow-[#dfa054]/20", 
    label: "Legendary",
    bg: "bg-[#1c120c]" 
  }
}

function completionRate(achievements: Achievement[]) {
  if (!achievements.length) return 0
  return Math.round((achievements.filter((achievement) => achievement.earned).length / achievements.length) * 100)
}

function sortedForShowcase(achievements: Achievement[]) {
  const earned = achievements.filter((achievement) => achievement.earned)
  if (earned.length) return earned.slice(0, 7)
  return [...achievements].sort((left, right) => right.progress - left.progress).slice(0, 7)
}

function AchievementImage({ achievement, size = "md" }: { achievement: Achievement; size?: "sm" | "md" | "lg" }) {
  const style = tierStyle[achievement.tier]
  const sizeClass = size === "sm" ? "h-12 w-12" : size === "lg" ? "h-20 w-20" : "h-14 w-14"
  return (
    <div className={`relative ${sizeClass} shrink-0 overflow-hidden rounded-md border ${achievement.earned ? style.border : "border-zinc-800"} bg-zinc-950 shadow-lg ${achievement.earned ? style.glow : ""}`}>
      <img
        src={getAchievementAssetUrl(achievement.asset)}
        alt={achievement.title}
        className={`h-full w-full object-cover transition duration-300 ${achievement.earned ? "scale-100 group-hover:scale-110" : "scale-100 grayscale opacity-35 group-hover:opacity-55"}`}
      />
      {!achievement.earned && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/35">
          <Lock size={size === "lg" ? 20 : 15} className="text-zinc-500" />
        </div>
      )}
    </div>
  )
}

function VaultTrophy({ achievement, onHover }: { achievement: Achievement; onHover: (ach: Achievement | null, cardEl?: HTMLElement) => void }) {
  const isEarned = achievement.earned
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const ref = useRef<HTMLDivElement>(null)
  
  const springConfig = { stiffness: 150, damping: 18 }
  const rotateX = useTransform(y, [-50, 50], [12, -12])
  const rotateY = useTransform(x, [-50, 50], [-12, 12])
  const springRotateX = useSpring(rotateX, springConfig)
  const springRotateY = useSpring(rotateY, springConfig)

  const glareX = useTransform(x, [-50, 50], [0, 100])
  const glareY = useTransform(y, [-50, 50], [0, 100])
  const springGlareX = useSpring(glareX, springConfig)
  const springGlareY = useSpring(glareY, springConfig)
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${springGlareX}% ${springGlareY}%, rgba(255,255,255,0.18) 0%, transparent 60%)`

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEarned) return
    const rect = e.currentTarget.getBoundingClientRect()
    const clientX = e.clientX - rect.left
    const clientY = e.clientY - rect.top
    const valX = ((clientX / rect.width) - 0.5) * 100
    const valY = ((clientY / rect.height) - 0.5) * 100
    x.set(valX)
    y.set(valY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    onHover(null)
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEarned) return
    const rect = e.currentTarget.getBoundingClientRect()
    const originX = (rect.left + rect.width / 2) / window.innerWidth
    const originY = (rect.top + rect.height / 2) / window.innerHeight
    
    let colors = ['#a1a1aa', '#d4d4d8']
    if (achievement.tier === "rare") colors = ['#38bdf8', '#7dd3fc']
    if (achievement.tier === "epic") colors = ['#c084fc', '#e879f9']
    if (achievement.tier === "legendary") colors = ['#dfa054', '#fcd34d', '#fbbf24']

    confetti({
      particleCount: achievement.tier === "legendary" ? 120 : 60,
      spread: achievement.tier === "legendary" ? 100 : 70,
      origin: { x: originX, y: originY },
      colors,
      disableForReducedMotion: true,
      zIndex: 9999,
      gravity: 1.2,
      ticks: 200
    })
  }

  let borderStyle = "border-[#ffffff08]"
  let shadowStyle = "shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
  
  if (achievement.tier === "rare") {
    borderStyle = "border-[#38bdf8]/30"
  } else if (achievement.tier === "epic") {
    borderStyle = "border-[#a855f7]/30"
    shadowStyle += " shadow-[inset_0_0_20px_rgba(147,51,234,0.15)]"
  } else if (achievement.tier === "legendary") {
    borderStyle = "border-[#dfa054]/50"
  }

  return (
    <motion.div
      ref={ref}
      style={isEarned ? {
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d"
      } : {}}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => onHover(achievement, ref.current || undefined)}
      onClick={handleClick}
      whileTap={isEarned ? { scale: 0.88, rotateZ: (Math.random() - 0.5) * 12, zIndex: 50 } : {}}
      whileHover={isEarned ? { scale: 1.08, zIndex: 40 } : { scale: 1.02 }}
      animate={isEarned && achievement.tier === "legendary" ? { boxShadow: ["0px 0px 0px rgba(223,160,84,0)", "0px 0px 25px rgba(223,160,84,0.3)", "0px 0px 0px rgba(223,160,84,0)"] } : {}}
      transition={isEarned && achievement.tier === "legendary" ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : {}}
      className={`relative aspect-square rounded-xl bg-[#09090b] border cursor-pointer overflow-hidden transition-colors ${borderStyle} ${isEarned ? shadowStyle : 'border-zinc-900/60'}`}
    >
      {isEarned && achievement.tier === "legendary" && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 bg-[#dfa054] border border-[#0a0a0a] z-20" />
      )}

      {isEarned ? (
        <>
          {achievement.tier === "legendary" && (
            <>
              {/* Spotlight Beam */}
              <div 
                className="absolute -top-[20%] left-1/2 w-[200%] h-[200%] -translate-x-1/2 pointer-events-none z-0" 
                style={{ background: "conic-gradient(from 180deg at 50% 0%, transparent 140deg, rgba(223, 160, 84, 0.2) 180deg, transparent 220deg)" }} 
              />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[20%] bg-[#dfa054]/20 blur-xl rounded-full z-0 pointer-events-none" />
              
              {/* Sparkles */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <motion.div animate={{ y: [0, -8, 0], opacity: [0.3, 1, 0.3] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[20%] left-[15%] text-[#dfa054]">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/></svg>
                </motion.div>
              </div>
            </>
          )}

          {/* 3D Floating Badge Container */}
          <div 
            style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}
            className="w-full h-full p-2 pointer-events-none select-none flex items-center justify-center"
          >
            <img
              src={getAchievementAssetUrl(achievement.asset)}
              alt={achievement.title}
              className="h-full w-full object-cover select-none pointer-events-none rounded-lg shadow-md"
            />
          </div>

          {/* Glare Reflection */}
          <motion.div
            style={{
              background: glareBackground,
              transform: "translateZ(1px)"
            }}
            className="absolute inset-0 pointer-events-none z-10 mix-blend-overlay"
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-[#09090b] flex flex-col items-center justify-center p-2">
          <img
            src={getAchievementAssetUrl(achievement.asset)}
            alt="Locked"
            className="h-full w-full object-cover select-none pointer-events-none grayscale opacity-[0.22] brightness-75"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/70 p-2 text-center">
            <Lock size={14} className="text-zinc-500 mb-1" />
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mt-1">
              <div 
                className="h-full bg-amber-400/80 rounded-full transition-all duration-300"
                style={{ width: `${achievement.progress}%` }}
              />
            </div>
            <span className="text-[7.5px] font-mono text-zinc-500 mt-1">{achievement.progress}%</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export function AchievementShowcase({ achievements, variant = "gallery" }: AchievementShowcaseProps) {
  const [hoveredTrophy, setHoveredTrophy] = useState<Achievement | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const earned = achievements.filter((achievement) => achievement.earned)
  const showcase = sortedForShowcase(achievements)
  const nextUnlock = [...achievements]
    .filter((achievement) => !achievement.earned)
    .sort((left, right) => right.progress - left.progress)[0]

  const handleHoverTrophy = (achievement: Achievement | null, cardEl?: HTMLElement) => {
    if (!containerRef.current || !cardEl || !achievement) {
      setHoveredTrophy(achievement)
      return
    }
    
    const containerRect = containerRef.current.getBoundingClientRect()
    const cardRect = cardEl.getBoundingClientRect()
    
    const x = Math.max(10, Math.min(cardRect.left - containerRect.left + (cardRect.width / 2) - 110, containerRect.width - 230))
    const y = cardRect.top - containerRect.top - 120
    
    setTooltipPos({ x, y })
    setHoveredTrophy(achievement)
  }

  const commonTrophies = achievements.filter(a => a.tier === "common")
  const rareTrophies = achievements.filter(a => a.tier === "rare")
  const epicTrophies = achievements.filter(a => a.tier === "epic")
  const legendaryTrophies = achievements.filter(a => a.tier === "legendary")

  if (variant === "compact") {
    return (
      <Card className="overflow-hidden p-0 border border-zinc-800/80 bg-zinc-950/60 shadow-md">
        <div className="border-b border-zinc-800/80 bg-zinc-900/40 px-4 py-3.5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-200">Achievement Showcase</div>
              <div className="mt-0.5 text-[9px] text-zinc-500 font-mono">
                {earned.length ? "Pinned from earned achievements" : "Closest unlocks shown until your first badge"}
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-[#dfa054]/30 bg-[#dfa054]/10 px-2 py-0.5 text-[9px] font-mono font-bold text-[#dfa054]">
              <Sparkles size={11} className="text-[#dfa054]" />
              {completionRate(achievements)}% COMPLETE
            </div>
          </div>
          <div className="mt-3.5 flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-zinc-800">
            {showcase.map((achievement) => (
              <div 
                key={achievement.id} 
                className="group relative cursor-pointer" 
                title={`${achievement.title}: ${achievement.requirement}`}
              >
                <AchievementImage achievement={achievement} size="sm" />
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 divide-x divide-zinc-800/80 bg-zinc-950/40 font-mono">
          <div className="px-4 py-3 text-center">
            <div className="text-lg font-bold text-zinc-100 tabular-nums">{earned.length}</div>
            <div className="text-[8px] uppercase tracking-wider text-zinc-500 font-semibold mt-0.5">Earned</div>
          </div>
          <div className="px-4 py-3 text-center">
            <div className="text-lg font-bold text-[#dfa054] tabular-nums">
              {achievements.filter((a) => a.earned && a.tier === "legendary").length}
            </div>
            <div className="text-[8px] uppercase tracking-wider text-zinc-500 font-semibold mt-0.5">Legendary</div>
          </div>
          <div className="px-4 py-3 text-center">
            <div className="text-lg font-bold text-emerald-400 tabular-nums truncate max-w-full">
              {nextUnlock ? `${nextUnlock.progress}%` : "100%"}
            </div>
            <div className="text-[8px] uppercase tracking-wider text-zinc-500 font-semibold mt-0.5 truncate max-w-full">
              {nextUnlock ? nextUnlock.title : "Complete"}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <section className="relative font-sans select-none mt-2 pb-6 space-y-5" ref={containerRef}>
      <div className="flex items-end justify-between px-1 border-b border-zinc-800/80 pb-3">
        <div>
          <h3 className="text-[11px] font-mono tracking-[0.2em] text-zinc-400 uppercase font-bold">The Vault</h3>
          <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Trophy collection & competitive milestones</p>
        </div>
        <div className="text-sm font-bold text-zinc-300 font-mono bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg">
          {earned.length} <span className="text-zinc-500">/ {achievements.length}</span>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {/* COMMON SECTION (TOP) */}
        {commonTrophies.length > 0 && (
          <div>
            <div className="text-[9.5px] font-mono font-bold tracking-widest text-zinc-400 uppercase mb-2 px-1">Common</div>
            <div className="grid grid-cols-3 gap-3 bg-zinc-950/60 border border-zinc-800/80 p-3.5 rounded-xl relative shadow-inner">
              {commonTrophies.map((achievement) => (
                <VaultTrophy 
                  key={achievement.id} 
                  achievement={achievement} 
                  onHover={handleHoverTrophy} 
                />
              ))}
            </div>
          </div>
        )}

        {/* RARE SECTION */}
        {rareTrophies.length > 0 && (
          <div>
            <div className="text-[9.5px] font-mono font-bold tracking-widest text-sky-400 uppercase mb-2 px-1">Rare</div>
            <div className="grid grid-cols-3 gap-3 bg-zinc-950/60 border border-sky-500/20 p-3.5 rounded-xl relative shadow-inner">
              {rareTrophies.map((achievement) => (
                <VaultTrophy 
                  key={achievement.id} 
                  achievement={achievement} 
                  onHover={handleHoverTrophy} 
                />
              ))}
            </div>
          </div>
        )}

        {/* EPIC SECTION */}
        {epicTrophies.length > 0 && (
          <div>
            <div className="text-[9.5px] font-mono font-bold tracking-widest text-purple-400 uppercase mb-2 px-1">Epic</div>
            <div className="grid grid-cols-3 gap-3 bg-zinc-950/60 border border-purple-500/20 p-3.5 rounded-xl relative shadow-inner">
              {epicTrophies.map((achievement) => (
                <VaultTrophy 
                  key={achievement.id} 
                  achievement={achievement} 
                  onHover={handleHoverTrophy} 
                />
              ))}
            </div>
          </div>
        )}

        {/* LEGENDARY SECTION (BOTTOM) */}
        {legendaryTrophies.length > 0 && (
          <div>
            <div className="text-[9.5px] font-mono font-bold tracking-widest text-[#dfa054] uppercase mb-2 px-1">Legendary</div>
            <div className="grid grid-cols-3 gap-3 bg-zinc-950/60 border border-amber-500/20 p-3.5 rounded-xl relative shadow-inner">
              {legendaryTrophies.map((achievement) => (
                <VaultTrophy 
                  key={achievement.id} 
                  achievement={achievement} 
                  onHover={handleHoverTrophy} 
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hover Floating Popover Tooltip */}
      {hoveredTrophy && (
        <div
          className="absolute z-50 p-3 rounded-xl border border-zinc-700/90 bg-zinc-950/95 backdrop-blur-md shadow-2xl text-xs min-w-[210px] max-w-[240px] pointer-events-none transition-all duration-75 font-sans"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`
          }}
        >
          <div className="font-bold text-zinc-100 border-b border-zinc-800 pb-1.5 mb-2 flex justify-between items-center font-mono">
            <span className="truncate max-w-[130px] text-xs">{hoveredTrophy.title}</span>
            <span className={`shrink-0 font-bold text-[9px] uppercase ${tierStyle[hoveredTrophy.tier].text}`}>
              {tierStyle[hoveredTrophy.tier].label}
            </span>
          </div>
          <div className="text-[10px] text-zinc-300 leading-relaxed mb-2">
            {hoveredTrophy.requirement}
          </div>
          <div className="flex flex-col gap-1 font-mono text-[9px] border-t border-zinc-800/80 pt-2">
            <span className="text-zinc-500">{hoveredTrophy.insight}</span>
            {hoveredTrophy.earned ? (
              <span className="text-[#dfa054] font-bold mt-0.5">{hoveredTrophy.earnedLabel || "Unlocked 🏆"}</span>
            ) : (
              <span className="text-amber-400 font-bold mt-0.5">Progress: {hoveredTrophy.progressLabel} ({hoveredTrophy.progress}%)</span>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
