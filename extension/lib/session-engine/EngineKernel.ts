import type { PracticeSession, SessionStatus, PauseReason, CompactTimelineEvent } from "./types"

const MAX_TIMELINE_EVENTS = 30

/**
 * Generates a lightweight UUID v4 string
 */
export function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Creates a fresh, initialized PracticeSession state vector.
 */
export function createSession(slug: string, tabId: number | null = null, now = Date.now()): PracticeSession {
  return {
    v: 2,
    id: generateUUID(),
    slug,
    st: "RUNNING",
    pr: null,
    tElapsedStart: now,
    tActiveStart: now,
    accActiveMs: 0,
    accPausedMs: 0,
    ownerTabId: tabId,
    tabs: 0,
    pastes: 0,
    timeline: [
      { t: now, e: "START" }
    ]
  }
}

/**
 * Pushes a timeline event into the capped ring buffer.
 */
export function pushTimelineEvent(
  session: PracticeSession, 
  e: CompactTimelineEvent["e"], 
  d?: string, 
  now = Date.now()
): PracticeSession {
  const updatedTimeline = [...session.timeline, { t: now, e, d }]
  if (updatedTimeline.length > MAX_TIMELINE_EVENTS) {
    // Keep first START event, drop oldest micro-events
    const startEvent = updatedTimeline[0]
    const rest = updatedTimeline.slice(updatedTimeline.length - (MAX_TIMELINE_EVENTS - 1))
    return { ...session, timeline: [startEvent, ...rest] }
  }
  return { ...session, timeline: updatedTimeline }
}

/**
 * Transitions a session into a new status / pause reason using immutable timestamp math.
 */
export function transitionSession(
  session: PracticeSession,
  nextStatus: SessionStatus,
  reason: PauseReason = null,
  now = Date.now()
): PracticeSession {
  if (session.st === nextStatus && session.pr === reason) {
    return session
  }

  let newAccActiveMs = typeof session.accActiveMs === "number" && !isNaN(session.accActiveMs) ? session.accActiveMs : 0
  let newAccPausedMs = typeof session.accPausedMs === "number" && !isNaN(session.accPausedMs) ? session.accPausedMs : 0
  let newActiveStart: number | null = session.tActiveStart

  // 1. Commit active segment if transitioning away from RUNNING
  if (session.st === "RUNNING") {
    const activeOrigin = (typeof session.tActiveStart === "number" && !isNaN(session.tActiveStart))
      ? session.tActiveStart
      : (typeof session.tElapsedStart === "number" && !isNaN(session.tElapsedStart) ? session.tElapsedStart : now)
    
    const segment = Math.max(0, now - activeOrigin)
    newAccActiveMs += segment
    newActiveStart = null
  }

  // 2. Commit paused segment if transitioning away from PAUSED
  if (session.st === "PAUSED") {
    const lastEvent = session.timeline && session.timeline.length ? session.timeline[session.timeline.length - 1] : null
    const pauseStarted = (lastEvent && typeof lastEvent.t === "number" && !isNaN(lastEvent.t)) ? lastEvent.t : (session.tElapsedStart || now)
    const pauseSegment = Math.max(0, now - pauseStarted)
    newAccPausedMs += pauseSegment
  }

  // 3. Set up new state variables
  let eventType: CompactTimelineEvent["e"] = "PAUSE"
  if (nextStatus === "RUNNING") {
    newActiveStart = now
    eventType = session.st === "PAUSED" ? "RESUME" : "START"
  } else if (nextStatus === "PAUSED") {
    eventType = reason === "TAB" ? "TAB_LOST" : "PAUSE"
  } else if (nextStatus === "SOLVED") {
    eventType = "SOLVED"
  }

  const updated: PracticeSession = {
    ...session,
    st: nextStatus,
    pr: reason,
    accActiveMs: newAccActiveMs,
    accPausedMs: newAccPausedMs,
    tActiveStart: newActiveStart
  }

  return pushTimelineEvent(updated, eventType, reason || undefined, now)
}

/**
 * Derives activeSeconds, elapsedSeconds, and focusScore synchronously at 60FPS with ZERO storage writes.
 */
export function deriveClocks(sessionInput: PracticeSession | string | null, now = Date.now()) {
  let session: PracticeSession | null = null
  if (typeof sessionInput === "string") {
    try {
      session = JSON.parse(sessionInput)
    } catch {
      session = null
    }
  } else {
    session = sessionInput
  }

  if (!session || typeof session !== "object") {
    return { activeSeconds: 0, elapsedSeconds: 0, focusScore: 100, isRunning: false, isPaused: false, isSolved: false }
  }

  // Safe field extraction with fallback defaults against NaN/legacy schema
  const accActiveMs = typeof session.accActiveMs === "number" && !isNaN(session.accActiveMs) ? session.accActiveMs : 0
  const accPausedMs = typeof session.accPausedMs === "number" && !isNaN(session.accPausedMs) ? session.accPausedMs : 0
  
  let tElapsedStart = now
  if (typeof session.tElapsedStart === "number" && !isNaN(session.tElapsedStart)) {
    tElapsedStart = session.tElapsedStart
  } else if (typeof (session as any).startedAt === "string") {
    const parsed = new Date((session as any).startedAt).getTime()
    if (!isNaN(parsed)) tElapsedStart = parsed
  }

  let currentSegmentMs = 0
  if (session.st === "RUNNING") {
    const activeOrigin = (typeof session.tActiveStart === "number" && !isNaN(session.tActiveStart))
      ? session.tActiveStart
      : tElapsedStart
    currentSegmentMs = Math.max(0, now - activeOrigin)
  }

  const totalActiveMs = accActiveMs + currentSegmentMs
  const activeSeconds = Math.max(0, Math.floor(totalActiveMs / 1000))

  let elapsedMs = 0
  if (session.st === "SOLVED") {
    const lastEvent = session.timeline && session.timeline.length ? session.timeline[session.timeline.length - 1] : null
    const solvedAt = (lastEvent && typeof lastEvent.t === "number" && !isNaN(lastEvent.t)) ? lastEvent.t : now
    elapsedMs = Math.max(0, solvedAt - tElapsedStart)
  } else {
    elapsedMs = Math.max(0, now - tElapsedStart)
  }

  const elapsedSeconds = Math.max(0, Math.floor(elapsedMs / 1000))
  const focusScore = elapsedSeconds > 0 
    ? Math.min(100, Math.round((activeSeconds / elapsedSeconds) * 100))
    : 100

  return {
    activeSeconds: isNaN(activeSeconds) ? 0 : activeSeconds,
    elapsedSeconds: isNaN(elapsedSeconds) ? 0 : elapsedSeconds,
    focusScore: isNaN(focusScore) ? 100 : focusScore,
    isRunning: session.st === "RUNNING",
    isPaused: session.st === "PAUSED",
    isSolved: session.st === "SOLVED"
  }
}
