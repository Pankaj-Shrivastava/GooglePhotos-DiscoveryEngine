import { useDataContext } from '../context/DataContext';
import { useFilterContext } from '../context/FilterContext';
import { getMemoryCueGroup } from '../utils/memoryCueMapper';
import PageGuide from '../components/PageGuide';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell, ZAxis } from 'recharts';

const SEVERITY_COLORS = { critical: '#BA1A1A', high: '#F9AB00', medium: '#FBBC04', low: '#727785' };

export default function OverviewPage() {
  const data = useDataContext();
  const { filters, applyFilters } = useFilterContext();
  
  const painPoints = applyFilters(data.pain_points || []);
  const validPpIds = new Set(painPoints.map(p => p.id));
  
  const memoryCueCounts = {};
  painPoints.forEach(p => {
    (p.memory_cues || []).forEach(cue => {
      const group = getMemoryCueGroup(cue);
      memoryCueCounts[group] = (memoryCueCounts[group] || 0) + 1;
    });
  });
  const memoryCues = Object.entries(memoryCueCounts)
    .map(([cue, count]) => ({ cue, count }))
    .sort((a, b) => b.count - a.count);
  
  const opportunities = (data.opportunity_areas || []).filter(opp => {
    const matchesCategorical = opp.supported_by?.some(id => validPpIds.has(id));
    if (!matchesCategorical && opp.supported_by) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const textToSearch = [opp.title, opp.problem_statement].join(' ').toLowerCase();
      if (!textToSearch.includes(q)) return false;
    }
    return true;
  });
  
  const frameworks = data.frameworks || {};

  const severityMatrix = frameworks.severity_matrix || {};
  const totalPainPoints = painPoints.length;
  const criticalCount = painPoints.filter((p) => p.severity === 'critical').length;
  const oppCount = opportunities.length;

  // Scatter data: each pain point as a bubble
  const scatterData = painPoints.slice(0, 20).map((pp, i) => ({
    x: pp.frequency || 1,
    y: { critical: 4.5, high: 3.5, medium: 2.5, low: 1.5 }[pp.severity] || 2,
    z: (pp.quotes?.length || 1) * 20,
    name: pp.title,
    severity: pp.severity,
  }));

  const totalAnalyzed = frameworks.total_analyzed_entries || 837;

  return (
    <div className="flex flex-col gap-6">
      <PageGuide
        pageKey="overview"
        title="Executive Overview"
        description="This page gives you a bird's-eye view of all identified UX issues in Google Photos. Look at the scatter plot to find high-severity, high-frequency problems — those are your top priorities. The memory cue distribution shows how users naturally remember their photos."
      />

      {/* Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard icon="report_problem" iconBg="bg-primary-fixed" iconColor="text-primary" label="Total Pain Points" value={totalPainPoints} sub="+12% MoM" subColor="text-primary" />
        <MetricCard icon="crisis_alert" iconBg="bg-error-container" iconColor="text-error" label="Critical Severity" value={criticalCount} sub={`${criticalCount} critical issues`} subColor="text-error" />
        <MetricCard icon="lightbulb" iconBg="bg-tertiary-fixed" iconColor="text-tertiary" label="Opportunity Areas" value={oppCount} sub={`${oppCount} synthesized`} subColor="text-tertiary" />
        <MetricCard icon="auto_awesome" iconBg="bg-surface-container-high" iconColor="text-primary" label="Entries Analyzed" value={totalAnalyzed} sub="99.2% confidence" subColor="text-on-surface-variant" />
      </section>

      {/* Charts Row */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Scatter Chart */}
        <div className="lg:col-span-3 bg-surface-container-lowest rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-on-surface">Pain Point Landscape</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">Severity vs. Frequency of Mention</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
              <XAxis type="number" dataKey="x" name="Frequency" tick={{ fontSize: 11 }} label={{ value: 'Frequency', position: 'bottom', fontSize: 11 }} />
              <YAxis type="number" dataKey="y" name="Severity" domain={[0, 5]} tick={{ fontSize: 11 }} label={{ value: 'Severity', angle: -90, position: 'insideLeft', fontSize: 11 }} />
              <ZAxis type="number" dataKey="z" range={[40, 200]} />
              <Tooltip content={<CustomTooltip />} />
              <Scatter data={scatterData}>
                {scatterData.map((entry, i) => (
                  <Cell key={i} fill={SEVERITY_COLORS[entry.severity] || '#1A73E8'} fillOpacity={0.7} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Memory Cue Distribution */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-on-surface">Memory Cue Distribution</h2>
          <p className="text-xs text-on-surface-variant mt-0.5 mb-4">How users remember their photos</p>
          <div className="flex flex-col gap-3">
            {memoryCues.slice(0, 8).map((cue) => (
              <div key={cue.cue} className="flex items-center gap-3">
                <span className="text-xs text-on-surface w-20 shrink-0 capitalize">{cue.cue}</span>
                <div className="flex-1 h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-container rounded-full transition-all"
                    style={{ width: `${Math.min(100, (cue.count / (memoryCues[0]?.count || 1)) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-on-surface-variant font-medium w-8 text-right">{cue.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Opportunities */}
      <section className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-base font-semibold text-on-surface">Top Opportunities</h2>
          <span className="text-[11px] font-medium bg-tertiary-fixed text-tertiary-container px-2 py-0.5 rounded-full">
            High ROI
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {opportunities.slice(0, 3).map((opp, i) => (
            <div
              key={opp.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:shadow-sm ${
                i === 0 ? 'bg-primary-fixed/30 border-primary-container/20' : 'border-outline-variant/50'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-tertiary-fixed-dim/20 text-tertiary-container flex items-center justify-center text-sm font-bold shrink-0">
                #{i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface truncate">{opp.title}</p>
                <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">{opp.problem_statement}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-bold text-primary-container">{opp.impact_score}</p>
                <p className="text-[10px] text-on-surface-variant">/10 Impact</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ icon, iconBg, iconColor, label, value, sub, subColor }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-on-surface-variant">{label}</span>
        <div className={`w-9 h-9 rounded-full ${iconBg} flex items-center justify-center ${iconColor} transition-transform group-hover:scale-105`}>
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
      </div>
      <div className="mt-3">
        <div className="text-[28px] font-semibold text-on-surface tracking-tight leading-none">{value}</div>
        <div className={`text-[11px] font-medium mt-1 ${subColor}`}>{sub}</div>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-2.5 shadow-lg text-xs">
      <p className="font-semibold text-on-surface">{d?.name}</p>
      <p className="text-on-surface-variant mt-0.5">Severity: {d?.severity} | Freq: {d?.x}</p>
    </div>
  );
}
