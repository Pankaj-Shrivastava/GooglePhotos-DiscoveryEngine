import { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { useFilterContext } from '../context/FilterContext';
import { getMemoryCueGroup } from '../utils/memoryCueMapper';
import { useNavigate } from 'react-router-dom';
import PageGuide from '../components/PageGuide';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

const SEVERITY_COLORS = { critical: '#BA1A1A', high: '#F9AB00', medium: '#FBBC04', low: '#727785' };
const SEVERITY_WEIGHTS = { critical: 4, high: 3, medium: 2, low: 1 };

export default function OverviewPage() {
  const data = useDataContext();
  const { applyFilters } = useFilterContext();
  const navigate = useNavigate();
  const [expandedGroupId, setExpandedGroupId] = useState(null);
  
  const painPoints = applyFilters(data.pain_points || []);
  const validPpIds = new Set(painPoints.map(p => p.id));
  
  const opportunities = (data.opportunity_areas || []).filter(opp => {
    const matchesCategorical = opp.supported_by?.some(id => validPpIds.has(id));
    return matchesCategorical || (opp.supported_by && opp.supported_by.length === 0);
  });

  // Calculate stats
  const totalFailures = painPoints.length;
  
  // Group pain points by memory group
  const groupStats = {};
  painPoints.forEach(p => {
    const group = p.memory_group || 'Other';
    if (!groupStats[group]) {
      groupStats[group] = {
        name: group,
        count: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        score: 0,
        topQuote: ''
      };
    }
    groupStats[group].count++;
    groupStats[group][p.severity || 'low']++;
    groupStats[group].score += SEVERITY_WEIGHTS[p.severity || 'low'];
    
    if (p.quotes && p.quotes.length > 0) {
      if (!groupStats[group].topQuote || p.quotes[0].length > groupStats[group].topQuote.length) {
         groupStats[group].topQuote = p.quotes[0]; // get the longest quote
      }
    }
  });

  const groupsArray = Object.values(groupStats);
  const groupsWithCritical = groupsArray.filter(g => g.critical > 0).length;
  
  // Highest volume group
  let highestVolumeGroup = { name: 'N/A', count: 0 };
  groupsArray.forEach(g => {
    if (g.count > highestVolumeGroup.count) highestVolumeGroup = g;
  });

  // % Unaddressed
  const unaddressedCount = painPoints.filter(p => !p.addressed_by_google).length;
  const unaddressedPct = totalFailures ? Math.round((unaddressedCount / totalFailures) * 100) : 0;

  // Chart data: stacked bar for groups
  const chartData = groupsArray.sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col gap-6">
      <PageGuide
        pageKey="overview"
        title="Memory Failure Command Center"
        description="This dashboard categorizes user struggles into 7 canonical human memory failure groups. Use the charts below to see which memory mechanisms fail most often, and click any group to see the raw user verbatims."
      />

      {/* Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard icon="memory" iconBg="bg-primary-fixed" iconColor="text-primary" label="Total Retrieval Failures" value={totalFailures} sub="Analyzed Pain Points" subColor="text-on-surface-variant" />
        <MetricCard icon="crisis_alert" iconBg="bg-error-container" iconColor="text-error" label="Critical Memory Groups" value={groupsWithCritical} sub="Groups with critical issues" subColor="text-error" />
        <MetricCard icon="trending_up" iconBg="bg-tertiary-fixed" iconColor="text-tertiary" label="Top Failure Mode" value={highestVolumeGroup.name} sub={`${highestVolumeGroup.count} issues`} subColor="text-tertiary" />
        <MetricCard icon="warning" iconBg="bg-surface-container-high" iconColor="text-primary" label="Unaddressed by Google" value={`${unaddressedPct}%`} sub={`${unaddressedCount} open issues`} subColor="text-on-surface-variant" />
      </section>

      {/* Chart Row */}
      <section className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-on-surface">Grouped Severity Landscape</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">Which memory failure groups have the most critical mass?</p>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 40, left: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid #e0e2e5' }} />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Bar dataKey="critical" stackId="a" fill={SEVERITY_COLORS.critical} name="Critical" />
            <Bar dataKey="high" stackId="a" fill={SEVERITY_COLORS.high} name="High" />
            <Bar dataKey="medium" stackId="a" fill={SEVERITY_COLORS.medium} name="Medium" />
            <Bar dataKey="low" stackId="a" fill={SEVERITY_COLORS.low} name="Low" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Memory Group Opportunities */}
      <section className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-base font-semibold text-on-surface">Memory Group Breakdown</h2>
          <span className="text-[11px] font-medium bg-tertiary-fixed text-tertiary-container px-2 py-0.5 rounded-full">
            7 Core Groups
          </span>
        </div>
        
        {opportunities.map((opp, i) => {
          const stats = groupStats[opp.title] || { count: 0, topQuote: '' };
          const isExpanded = expandedGroupId === opp.id;
          
          return (
            <div key={opp.id} className={`flex flex-col rounded-xl border transition-all ${
              i === 0 ? 'bg-primary-fixed/30 border-primary-container/20' : 'border-outline-variant/50'
            }`}>
              {/* Tile row */}
              <div 
                className="flex flex-col sm:flex-row gap-4 p-4 cursor-pointer hover:bg-surface-container-low/50"
                onClick={() => navigate(`/pain-points?opportunity=${opp.id}`)}
              >
                <div className="flex items-center gap-4 sm:w-1/3">
                  <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">{opp.icon || 'lightbulb'}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface leading-tight flex items-center gap-2">
                      {opp.title}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedGroupId(isExpanded ? null : opp.id);
                        }}
                        className={`px-2 py-1 rounded-full border transition-colors flex items-center gap-1 ${isExpanded ? 'bg-primary-container text-on-primary-container border-primary-container' : 'bg-surface-container-low border-outline-variant text-on-surface-variant hover:bg-surface-container-high'}`}
                        title="What does this mean?"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {isExpanded ? 'keyboard_arrow_up' : 'info'}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider">
                          {isExpanded ? 'Close' : 'Definition'}
                        </span>
                      </button>
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">{stats.count} Issues</p>
                  </div>
                </div>
                
                <div className="flex-1 border-l border-outline-variant/30 pl-4 flex flex-col justify-center">
                  <p className="text-xs font-medium text-on-surface-variant italic line-clamp-2" title={stats.topQuote || opp.problem_statement}>
                    "{stats.topQuote || opp.problem_statement}"
                  </p>
                </div>
                
                <div className="text-right shrink-0 flex flex-col justify-center items-end sm:w-24">
                  <p className="text-lg font-bold text-primary-container">{opp.impact_score}</p>
                  <p className="text-[10px] text-on-surface-variant">/10 Impact</p>
                </div>
              </div>

              {/* Definition Expandable Panel */}
              {isExpanded && (
                <div className="bg-surface-container-lowest p-4 border-t border-outline-variant/30 text-sm">
                  <div className="flex items-start gap-2 mb-3">
                    <span className="material-symbols-outlined text-primary text-[18px]">menu_book</span>
                    <div>
                      <span className="font-semibold text-on-surface text-xs uppercase tracking-wider block mb-1">What does this mean?</span>
                      <p className="text-on-surface-variant leading-relaxed text-[13px]">{opp.definition || opp.problem_statement}</p>
                    </div>
                  </div>
                  {opp.cognitive_note && (
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-tertiary text-[18px]">psychology</span>
                      <div>
                        <span className="font-semibold text-on-surface text-xs uppercase tracking-wider block mb-1">Cognitive Mechanism</span>
                        <p className="text-on-surface-variant leading-relaxed text-[13px] italic">{opp.cognitive_note}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}

function MetricCard({ icon, iconBg, iconColor, label, value, sub, subColor }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-all group border border-outline-variant/30">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-on-surface-variant">{label}</span>
        <div className={`w-9 h-9 rounded-full ${iconBg} flex items-center justify-center ${iconColor} transition-transform group-hover:scale-105`}>
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
      </div>
      <div className="mt-3">
        <div className="text-[24px] font-semibold text-on-surface tracking-tight leading-none truncate">{value}</div>
        <div className={`text-[11px] font-medium mt-1 ${subColor}`}>{sub}</div>
      </div>
    </div>
  );
}
