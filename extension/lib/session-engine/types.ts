export type SessionStatus = "RUNNING" | "PAUSED" | "SOLVED"
export type PauseReason = "MANUAL" | "IDLE" | "TAB" | "SLEEP" | null

export type TimelineEventType = 
  | "START" 
  | "PAUSE" 
  | "RESUME" 
  | "TAB_LOST" 
  | "TAB_CLAIM" 
  | "SUBMIT" 
  | "SOLVED"

export interface CompactTimelineEvent {
  t: number;  // Epoch ms
  e: TimelineEventType;
  d?: string; // Optional detail string
}

export interface PracticeSession {
  v: 2;                         // Schema Version
  id: string;                    // Session UUID
  slug: string;                 // LeetCode Problem Slug (Primary Key)
  st: SessionStatus;            // Execution Status
  pr: PauseReason;              // Active Pause Reason
  
  // Dual-Timer Timestamp Vector
  tElapsedStart: number;        // Epoch ms when attempt began
  tActiveStart: number | null;   // Epoch ms when active segment began (null if paused/idle)
  accActiveMs: number;          // Accumulated active focus duration (ms)
  accPausedMs: number;          // Accumulated paused duration (ms)
  
  // Ownership & Lease
  ownerTabId: number | null;     // Chrome Tab ID owning execution
  
  // Metrics (Primitive Counters)
  tabs: number;                 // Tab switches count
  pastes: number;               // External paste count
  
  // Capped Ring Timeline (Max 30 items)
  timeline: CompactTimelineEvent[];
}

export interface PracticeLog {
  v: 2;
  logId: string;
  sessionId: string;
  slug: string;
  startedAt: number;            // Epoch ms
  completedAt: number;          // Epoch ms
  activeSecs: number;
  elapsedSecs: number;
  focusScore: number;
  tabs: number;
  pastes: number;
  isSolved: boolean;
  language?: string;
}

export interface PracticeLogIndexItem {
  slug: string;
  ts: number;                   // Completed epoch ms
  actSecs: number;
  elSecs: number;
  score: number;
  solved: boolean;
}
