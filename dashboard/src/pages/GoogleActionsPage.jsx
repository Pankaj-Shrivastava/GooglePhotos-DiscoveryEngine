import { useDataContext } from '../context/DataContext';
import { useFilterContext } from '../context/FilterContext';
import PageGuide from '../components/PageGuide';

export default function GoogleActionsPage() {
  const data = useDataContext();
  const { applyFilters } = useFilterContext();
  const actions = applyFilters(data.google_actions_2026 || []);
  const painPoints = applyFilters(data.pain_points || []);

  return (
    <div className="flex flex-col gap-6">
      <PageGuide
        pageKey="google-actions"
        title="Google Memory Interventions (2026)"
        description="See which memory failure groups Google has actively tried to solve this year."
      />

      <h1 className="text-xl font-semibold text-on-surface">Google Actions 2026</h1>

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
