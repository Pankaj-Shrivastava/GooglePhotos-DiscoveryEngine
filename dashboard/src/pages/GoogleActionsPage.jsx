import { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { useFilterContext } from '../context/FilterContext';
import PageGuide from '../components/PageGuide';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function GoogleActionsPage() {
  const data = useDataContext();
  const { applyFilters } = useFilterContext();
  const actions = applyFilters(data.google_actions_2026 || []);
  const painPoints = applyFilters(data.pain_points || []);

  // Map groups to coverage
  const groupCoverage = {};
  painPoints.forEach(p => {
    const g = p.memory_group || 'Other';
    if (!groupCoverage[g]) groupCoverage[g] = { name: g, total: 0, addressed: 0 };
    groupCoverage[g].total++;
    if (p.addressed_by_google) groupCoverage[g].addressed++;
  });

  const coverageData = Object.values(groupCoverage)
    .map(g => ({ ...g, pct: g.total > 0 ? Math.round((g.addressed / g.total) * 100) : 0 }))
    .sort((a, b) => b.pct - a.pct); // Sort by highest coverage first

  const openGaps = coverageData.filter(c => c.pct === 0);

  return (
    <div className="flex flex-col gap-6">
      <PageGuide
        pageKey="google-actions"
        title="Google Memory Interventions (2026)"
        description="See which memory failure groups Google has actively tried to solve this year. Use the coverage heatmap to identify completely ignored memory groups."
      />

      <h1 className="text-xl font-semibold text-on-surface">Google Actions 2026</h1>

      {/* Group Coverage Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30">
          <h2 className="text-sm font-semibold text-on-surface mb-1">Memory Group Coverage Heatmap</h2>
          <p className="text-xs text-on-surface-variant mb-4">% of pain points addressed by Google's 2026 actions</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={coverageData} layout="vertical" margin={{ left: 140, right: 20 }}>
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={val => `${val}%`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={140} 
                tickFormatter={(val) => val.length > 20 ? val.substring(0, 20) + '...' : val} 
              />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ fontSize: '12px', borderRadius: '8px' }} formatter={val => `${val}%`} />
              <Bar dataKey="pct" radius={[0, 4, 4, 0]} barSize={20}>
                {coverageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.pct > 50 ? '#1E8E3E' : entry.pct > 0 ? '#F9AB00' : '#BA1A1A'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-error">
            <span className="material-symbols-outlined">warning</span>
            <h2 className="text-sm font-semibold">Critical Open Gaps</h2>
          </div>
          <p className="text-xs text-on-surface-variant mb-2">Memory groups with 0% coverage from Google in 2026:</p>
          <div className="flex flex-col gap-2 overflow-y-auto">
            {openGaps.map(gap => (
              <div key={gap.name} className="bg-error-container/30 border border-error-container p-3 rounded-lg flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface">{gap.name}</span>
                <span className="text-[10px] bg-surface-container-lowest px-2 py-0.5 rounded text-error font-medium">{gap.total} Issues</span>
              </div>
            ))}
            {openGaps.length === 0 && <p className="text-xs text-on-surface-variant italic">All groups have at least some coverage!</p>}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <h2 className="text-base font-semibold text-on-surface mt-2">Action Timeline</h2>
      <div className="relative pl-8">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-outline-variant" />
        {actions.map((action, i) => {
          // Find which groups this action addresses
          const addressedGroups = new Set();
          (action.addressed_pain_points || []).forEach(ppId => {
            const pp = painPoints.find(p => p.id === ppId);
            if (pp && pp.memory_group) addressedGroups.add(pp.memory_group);
          });
          
          return (
            <ActionCard key={i} action={action} addressedGroups={Array.from(addressedGroups)} />
          );
        })}
      </div>
    </div>
  );
}

function ActionCard({ action, addressedGroups }) {
  const [expanded, setExpanded] = useState(false);
  const needsToggle = action.description && action.description.length > 150;

  return (
    <div className="relative mb-6 last:mb-0">
      <div className="absolute left-[-20px] top-2 w-3 h-3 rounded-full bg-primary-container border-2 border-surface-container-lowest" />
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/40 ml-2 hover:shadow-md transition-all">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-on-surface">{action.title}</h3>
            <p className="text-xs text-primary font-semibold mt-1">{action.date}</p>
          </div>
          {action.url && (
            <a href={action.url} target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary transition-colors text-xs font-medium flex items-center gap-1 shrink-0 bg-surface-container px-2 py-1 rounded-md border border-outline-variant/50">
              <span className="material-symbols-outlined text-sm">open_in_new</span> Source
            </a>
          )}
        </div>
        
        {/* Description with Expand Toggle */}
        <div className="mt-3">
          <p className={`text-[13px] text-on-surface-variant leading-relaxed ${!expanded && needsToggle ? 'line-clamp-2' : ''}`}>
            {action.description}
          </p>
          {needsToggle && (
            <button 
              onClick={() => setExpanded(!expanded)} 
              className="text-xs font-semibold text-primary mt-1 hover:underline"
            >
              {expanded ? 'Read less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Memory Relevance Note */}
        {action.memory_relevance && (
           <div className="mt-3 bg-tertiary-fixed/30 border border-tertiary-container/30 p-2.5 rounded-lg flex items-start gap-2">
             <span className="material-symbols-outlined text-tertiary text-[16px] mt-0.5">psychology</span>
             <div>
               <p className="text-[11px] font-bold uppercase tracking-wider text-tertiary">Memory Relevance</p>
               <p className="text-[12px] text-on-surface-variant leading-snug">{action.memory_relevance}</p>
             </div>
           </div>
        )}
        
        {/* Target Memory Groups */}
        {addressedGroups.length > 0 && (
          <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center gap-2">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Targets Memory Group:</span>
            <div className="flex flex-wrap gap-1.5">
              {addressedGroups.map(g => (
                <span key={g} className="text-[11px] font-semibold bg-primary-fixed/50 text-on-primary-fixed border border-primary-container/30 px-2 py-0.5 rounded-md">
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
