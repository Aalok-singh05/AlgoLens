import React, { useEffect, useMemo, useState } from "react"
import { Card } from "../ui/Card"
import { BarChart3, Crosshair, Sparkles, Trophy, Target, Zap } from "lucide-react"
import { fetchDashboard, fetchHeatmap } from "../../lib/api/backend"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { getCachedDashboard, getCachedHeatmap, setCachedDashboard, setCachedHeatmap } from "../../lib/storage"
import { AchievementShowcase } from "./AchievementShowcase"
import { buildAchievementStats, getAchievements } from "../../lib/achievements"

const getRatingTier = (rating: number) => {
  if (rating >= 2300) return { name: "Master", color: "#a855f7", glow: "rgba(168,85,247,0.35)", bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.3)" }
  if (rating >= 2000) return { name: "Expert", color: "#f43f5e", glow: "rgba(244,63,94,0.35)", bg: "rgba(244,63,94,0.12)", border: "rgba(244,63,94,0.3)" }
  if (rating >= 1700) return { name: "Hard", color: "#fb923c", glow: "rgba(251,146,60,0.35)", bg: "rgba(251,146,60,0.12)", border: "rgba(251,146,60,0.3)" }
  if (rating >= 1400) return { name: "Medium", color: "#eab308", glow: "rgba(234,179,8,0.35)", bg: "rgba(234,179,8,0.12)", border: "rgba(234,179,8,0.3)" }
  return { name: "Easy", color: "#10b981", glow: "rgba(16,185,129,0.35)", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)" }
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    const tier = getRatingTier(d.bucketRating)
    const solveRate = d.attempted > 0 ? ((d.solved / d.attempted) * 100).toFixed(1) : "0.0";
    const firstAcRate = d.solved > 0 ? ((d.firstAcCount / d.solved) * 100).toFixed(1) : "0.0";

    return (
      <div className="rounded-xl border border-zinc-800/90 bg-zinc-950/95 p-3 text-xs text-zinc-300 shadow-2xl backdrop-blur-xl flex flex-col gap-2 min-w-[200px] font-mono">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-zinc-100">{d.bucketRating}</span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border" style={{ backgroundColor: tier.bg, color: tier.color, borderColor: tier.border }}>
              {tier.name}
            </span>
          </div>
          <span className="text-zinc-500 text-[10px]">Rating Band</span>
        </div>

        <div className="space-y-1.5 pt-0.5 font-sans">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-zinc-400">Solved:</span>
            <span className="font-bold text-emerald-400 font-mono tabular-nums">{d.solved} <span className="text-zinc-600 font-normal">/ {d.attempted}</span></span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-zinc-400">Conversion Rate:</span>
            <span className="font-bold text-sky-400 font-mono tabular-nums">{solveRate}%</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-zinc-400">1st-Try AC:</span>
            <span className="font-bold text-amber-400 font-mono tabular-nums">{firstAcRate}%</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-zinc-400">Avg Attempts:</span>
            <span className="font-bold text-zinc-300 font-mono tabular-nums">{d.avgAttempts ? Number(d.avgAttempts).toFixed(1) : "1.0"}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const NestedBarShape = (props: any) => {
  const { x, y, width, height, payload } = props;
  if (!payload || height <= 0 || width <= 0) return null;

  const attempted = payload.attempted || 0;
  const solved = payload.solved || 0;
  const solvedRatio = attempted > 0 ? Math.min(1, solved / attempted) : 0;
  const solvedWidth = Math.max(0, width * solvedRatio);
  const tier = getRatingTier(payload.bucketRating);

  const barH = Math.max(8, height - 10);
  const barY = y + (height - barH) / 2;

  return (
    <g>
      {/* Background Track (Attempted) */}
      <rect
        x={x}
        y={barY}
        width={width}
        height={barH}
        fill="rgba(39, 39, 42, 0.35)"
        stroke="rgba(63, 63, 70, 0.3)"
        strokeWidth={1}
        rx={barH / 2}
      />
      {/* Solved Fill with Tier Color */}
      {solvedWidth > 0 && (
        <rect
          x={x}
          y={barY}
          width={solvedWidth}
          height={barH}
          fill={tier.color}
          fillOpacity={0.9}
          rx={barH / 2}
          style={{ filter: `drop-shadow(0 0 4px ${tier.glow})` }}
        />
      )}
    </g>
  );
};

const CustomLegend = () => {
  return (
    <div className="flex items-center justify-between text-xs mb-3.5 px-0.5 select-none font-sans">
      <div className="flex items-center gap-1.5 text-zinc-300 font-semibold text-xs tracking-wide">
        <BarChart3 size={14} className="text-[#dfa054]" />
        <span>ZeroTrac Rating Distribution</span>
      </div>
      <div className="flex items-center gap-3.5 text-[10.5px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-zinc-600"></span>
          <span className="text-zinc-400">Attempted</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]"></span>
          <span className="text-emerald-400 font-semibold">Solved</span>
        </div>
      </div>
    </div>
  );
};

export const Heatmap = () => {
  const [data, setData] = useState<any[]>([]);
  const [dashboard, setDashboard] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      getCachedHeatmap().catch(() => null),
      getCachedDashboard().catch(() => null)
    ]).then(([cachedHeatmap, cachedDashboard]) => {
      if (cachedHeatmap) setData(cachedHeatmap);
      if (cachedDashboard) setDashboard(cachedDashboard);
      if (cachedHeatmap || cachedDashboard) setLoading(false);
    });

    fetchHeatmap().then((freshHeatmap) => {
      if (freshHeatmap && Array.isArray(freshHeatmap) && freshHeatmap.length > 0) {
        setData(freshHeatmap);
        setCachedHeatmap(freshHeatmap);
      }
    }).catch(console.error).finally(() => setLoading(false));

    fetchDashboard().then((freshDashboard) => {
      if (freshDashboard) {
        setDashboard(freshDashboard);
        setCachedDashboard(freshDashboard);
      }
    }).catch(console.error);
  }, []);

  const sortedData = useMemo(() => {
    return [...data]
      .filter((d) => d.attempted > 0)
      .sort((a, b) => a.bucketRating - b.bucketRating);
  }, [data]);

  const achievements = useMemo(() => {
    return getAchievements(buildAchievementStats(dashboard || {}, sortedData))
  }, [dashboard, sortedData])

  const chartHeight = useMemo(() => {
    if (sortedData.length === 0) return 200;
    return Math.max(220, sortedData.length * 30 + 16);
  }, [sortedData]);

  const summary = useMemo(() => {
    const attempted = sortedData.reduce((total, bucket) => total + Number(bucket.attempted || 0), 0)
    const solved = sortedData.reduce((total, bucket) => total + Number(bucket.solved || 0), 0)
    const best = [...sortedData].filter((bucket) => bucket.solved > 0).sort((left, right) => right.bucketRating - left.bucketRating)[0]
    return {
      attempted,
      solved,
      conversion: attempted ? Math.round((solved / attempted) * 100) : 0,
      best: best?.bucketRating ?? null
    }
  }, [sortedData])

  const selectedBucket = selectedRating == null
    ? null
    : sortedData.find((bucket) => bucket.bucketRating === selectedRating) ?? null

  if (loading) return <div className="p-6 text-center text-zinc-500 text-sm font-mono animate-pulse">Loading rating matrix...</div>;
  if (!data || data.length === 0 || sortedData.length === 0) {
    return (
      <div className="grid gap-4 font-sans">
        <Card className="text-center py-10 border-zinc-800/80 bg-zinc-950/60">
          <h3 className="font-bold text-zinc-200 mb-2">No Submissions Logged</h3>
          <p className="text-sm text-zinc-500 px-4">
            Please run a sync in the Settings tab to populate your historical problem rating metrics.
          </p>
        </Card>
        <AchievementShowcase achievements={achievements} variant="gallery" />
      </div>
    );
  }

  return (
    <div className="grid gap-3.5 font-sans animate-fadeIn">
      {/* Sleek Header Banner */}
      <div className="relative overflow-hidden rounded-xl border border-[#dfa054]/25 bg-gradient-to-r from-[#1c140c] via-zinc-950/90 to-zinc-950 p-3.5 shadow-lg">
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="panel-label text-[#dfa054] font-bold tracking-wider">Rating Map Matrix</span>
              <span className="text-[9px] bg-[#dfa054]/15 text-[#dfa054] border border-[#dfa054]/30 px-1.5 py-0.5 rounded font-mono font-bold">ZeroTrac</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
              Solve conversion rate and volume mapped across official contest rating bands.
            </p>
          </div>
          <div className="shrink-0 text-xs font-mono font-bold text-[#dfa054] bg-[#dfa054]/10 border border-[#dfa054]/25 px-2.5 py-1.5 rounded-lg shadow-inner">
            {sortedData.length} Bands
          </div>
        </div>
      </div>

      {/* 4 Primary Summary Metric Strip */}
      <div className="grid grid-cols-4 divide-x divide-zinc-800/80 overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/60 shadow-md">
        <div className="px-3 py-3 text-center">
          <div className="panel-label text-[9px] text-zinc-400">Solved</div>
          <div className="metric-value mt-0.5 text-lg font-bold text-emerald-400 font-mono tabular-nums">{summary.solved}</div>
        </div>
        <div className="px-3 py-3 text-center">
          <div className="panel-label text-[9px] text-zinc-400">Attempted</div>
          <div className="metric-value mt-0.5 text-lg font-bold text-zinc-200 font-mono tabular-nums">{summary.attempted}</div>
        </div>
        <div className="px-3 py-3 text-center">
          <div className="panel-label text-[9px] text-zinc-400">Conversion</div>
          <div className="metric-value mt-0.5 text-lg font-bold text-sky-400 font-mono tabular-nums">{summary.conversion}%</div>
        </div>
        <div className="px-3 py-3 text-center">
          <div className="panel-label text-[9px] text-zinc-400">Best Band</div>
          <div className="metric-value mt-0.5 text-lg font-bold text-[#dfa054] font-mono tabular-nums">{summary.best ?? "—"}</div>
        </div>
      </div>

      {/* Solve Distribution Bar Chart */}
      <Card className="p-4 bg-zinc-950/60 border border-zinc-800/80 shadow-lg">
        <CustomLegend />
        <div style={{ height: chartHeight }} className="w-full transition-all duration-300">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={sortedData} 
              layout="vertical" 
              margin={{ top: 0, right: 10, left: -24, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis 
                dataKey="bucketRating" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} 
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.02)' }} 
                content={<CustomTooltip />} 
              />
              <Bar 
                dataKey="attempted" 
                shape={<NestedBarShape />} 
                name="Progress"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Interactive Band Inspector */}
      <Card className="p-4 bg-zinc-950/50 border border-zinc-800/80">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <Crosshair size={13} className="text-sky-400" />
            <span className="text-xs font-bold text-zinc-200 font-sans">Explore Rating Bands</span>
          </div>
          {selectedBucket && (
            <span className="text-[10px] font-mono text-sky-400 font-semibold px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
              {selectedBucket.bucketRating} Selected
            </span>
          )}
        </div>
        
        <p className="text-[10px] text-zinc-500 mb-3">Click any rating band to inspect detailed performance & attempt statistics.</p>

        {/* Rating Band Buttons */}
        <div className="flex flex-wrap gap-1.5">
          {sortedData.map((bucket) => {
            const active = selectedRating === bucket.bucketRating
            const tier = getRatingTier(bucket.bucketRating)
            const rate = bucket.attempted > 0 ? Math.round((bucket.solved / bucket.attempted) * 100) : 0

            return (
              <button
                key={bucket.bucketRating}
                onClick={() => setSelectedRating(active ? null : bucket.bucketRating)}
                className={`rounded-lg border px-2.5 py-1.5 text-[10.5px] font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                  active 
                    ? "border-sky-400/80 bg-sky-500/20 text-sky-200 shadow-md font-bold" 
                    : "border-zinc-800/80 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/60"
                }`}
              >
                <span>{bucket.bucketRating}</span>
                <span className="text-[9px] opacity-80 font-semibold" style={{ color: tier.color }}>
                  ({rate}%)
                </span>
              </button>
            )
          })}
        </div>

        {/* Selected Band Detailed Breakdown Card */}
        {selectedBucket && (
          <div className="mt-3.5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5 space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-zinc-100">{selectedBucket.bucketRating} Breakdown</span>
                {(() => {
                  const tier = getRatingTier(selectedBucket.bucketRating)
                  return (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded border" style={{ backgroundColor: tier.bg, color: tier.color, borderColor: tier.border }}>
                      {tier.name}
                    </span>
                  )
                })()}
              </div>
              <span className="text-[10.5px] text-zinc-400 font-semibold">{selectedBucket.solved} / {selectedBucket.attempted} Solved</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-zinc-950 p-2.5 border border-zinc-800/60 shadow-inner">
                <div className="text-[8px] uppercase text-zinc-500 font-bold tracking-wider">Solve Rate</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">
                  {selectedBucket.attempted > 0 ? Math.round((selectedBucket.solved / selectedBucket.attempted) * 100) : 0}%
                </div>
              </div>

              <div className="rounded-lg bg-zinc-950 p-2.5 border border-zinc-800/60 shadow-inner">
                <div className="text-[8px] uppercase text-zinc-500 font-bold tracking-wider">First AC</div>
                <div className="text-sm font-bold text-sky-400 mt-0.5">
                  {selectedBucket.firstAcCount || 0}
                </div>
              </div>

              <div className="rounded-lg bg-zinc-950 p-2.5 border border-zinc-800/60 shadow-inner">
                <div className="text-[8px] uppercase text-zinc-500 font-bold tracking-wider">Avg Attempts</div>
                <div className="text-sm font-bold text-zinc-200 mt-0.5">
                  {selectedBucket.avgAttempts ? Number(selectedBucket.avgAttempts).toFixed(1) : "1.0"}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Trophy Collection */}
      <AchievementShowcase achievements={achievements} variant="gallery" />
    </div>
  )
}
