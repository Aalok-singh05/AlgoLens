import "~style.css"
import { useEffect, useState, useMemo } from "react"
import { Bolt, CircleX, Settings2, Star, Bug, Github } from "lucide-react"
import { TabBar, type Tab } from "./components/ui/TabBar"
import { Dashboard } from "./components/sidepanel/Dashboard"
import { Heatmap } from "./components/sidepanel/Heatmap"
import { Mastery } from "./components/sidepanel/Mastery"
import { Weakness } from "./components/sidepanel/Weakness"
import { Contest } from "./components/sidepanel/Contest"
import { Lists } from "./components/sidepanel/Lists"
import { Resources } from "./components/sidepanel/Resources"
import { Settings } from "./components/sidepanel/Settings"
import { getUsername } from "./lib/storage"
import { COMMUNITY_CONFIG, getRandomTagline } from "./lib/community"
import { ErrorBoundary } from "./components/ui/ErrorBoundary"
import { motion, AnimatePresence } from "framer-motion"
import { usePracticeSession } from "./hooks/usePracticeSession"

export default function SidePanel() {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard')
  const [username, setUsername] = useState<string>("")
  const { session, clocks } = usePracticeSession()
  const tagline = useMemo(() => getRandomTagline(), [])

  useEffect(() => {
    chrome.storage.local.get(["algovault.requestedTab", "algovault.lastActiveTab"], (result) => {
      if (result["algovault.requestedTab"] === "Lists") {
        setActiveTab("Lists")
        chrome.storage.local.remove("algovault.requestedTab")
      } else if (result["algovault.lastActiveTab"]) {
        setActiveTab(result["algovault.lastActiveTab"])
      }
    })
    getUsername().then((value) => setUsername(value || "Set username"))
    
    const handleStorageChange = (changes: any, areaName: string) => {
      if (areaName === "local") {
        if (changes["algovault.username"]) {
          setUsername(changes["algovault.username"].newValue || "Set username")
        }
        if (changes["algovault.requestedTab"]?.newValue === "Lists") {
          setActiveTab("Lists")
          chrome.storage.local.remove("algovault.requestedTab")
        }
      }
    }
    chrome.storage.onChanged.addListener(handleStorageChange)

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange)
    }
  }, [])

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    chrome.storage.local.set({ "algovault.lastActiveTab": tab })
  }

  return (
    <div className="min-h-screen bg-av-bg-primary text-zinc-300 p-4 flex flex-col justify-between overflow-y-auto overflow-x-hidden font-sans selection:bg-amber-400/20">
      <div>
        {/* ─── CLEAN HEADER ──────────────────────────────────── */}
        <header className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#dfa054] shadow-sm">
              <Bolt size={15} fill="currentColor" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-semibold leading-none text-zinc-100 font-sans">
                  AlgoVault
                </h1>
                <span className="text-[8px] font-mono text-zinc-500">v0.1</span>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">@{username || "Guest"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            {/* Minimal Subtle Star Icon */}
            <a
              href={COMMUNITY_CONFIG.STAR_URL}
              target="_blank"
              rel="noreferrer"
              title="Star on GitHub"
              className="p-1.5 text-zinc-500 hover:text-amber-400 hover:bg-zinc-900 rounded-md transition-colors"
            >
              <Star size={14} />
            </a>

            {/* Session Indicator */}
            {session ? (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.05] text-[9px] text-emerald-400 font-mono">
                {session.st === "RUNNING" && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                  </span>
                )}
                <span>{session.st === "RUNNING" ? "ACTIVE" : session.st}</span>
                <span className="text-emerald-500/40">|</span>
                <span className="tabular-nums">{clocks.focusScore ?? 100}%</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-zinc-800 bg-zinc-900/40 text-[9px] text-zinc-500 font-mono">
                <Settings2 size={9} /> Ready
              </div>
            )}
            
            <button 
              onClick={() => window.close()} 
              className="p-1.5 hover:bg-zinc-900 rounded-md transition-colors text-zinc-500 hover:text-zinc-300 ml-0.5"
              title="Close Sidebar"
            >
              <CircleX size={15} />
            </button>
          </div>
        </header>
        
        {/* ─── TAB NAVIGATION ────────────────────────────────── */}
        <TabBar activeTab={activeTab} setActiveTab={handleTabChange} />
        
        {/* ─── VIEWPORT ──────────────────────────────────────── */}
        <div className="mt-4 pb-4 relative min-w-0 w-full max-w-full overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
            >
              <ErrorBoundary>
                {activeTab === 'Dashboard' && <Dashboard />}
                {activeTab === 'Heatmap' && <Heatmap />}
                {activeTab === 'Mastery' && <Mastery />}
                {activeTab === 'Weakness' && <Weakness />}
                {activeTab === 'Contest' && <Contest />}
                {activeTab === 'Lists' && <Lists />}
                {activeTab === 'Resources' && <Resources />}
                {activeTab === 'Settings' && <Settings />}
              </ErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ─── SUBTLE & QUIET FOOTER ──────────────────────────── */}
      <footer className="mt-8 pt-3.5 border-t border-zinc-900/90 flex items-center justify-between text-[10px] text-zinc-600 font-mono select-none">
        <div>
          <span>Made with joy by </span>
          <a
            href={COMMUNITY_CONFIG.AUTHOR_URL}
            target="_blank"
            rel="noreferrer"
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {COMMUNITY_CONFIG.AUTHOR_HANDLE}
          </a>
        </div>
        <div className="flex items-center gap-2.5 text-zinc-600">
          <a
            href={COMMUNITY_CONFIG.STAR_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <Star size={10} /> Star
          </a>
          <span>•</span>
          <a
            href={COMMUNITY_CONFIG.ISSUES_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-zinc-400 transition-colors"
          >
            Issues
          </a>
          <span>•</span>
          <a
            href={COMMUNITY_CONFIG.REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-zinc-400 transition-colors"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  )
}
