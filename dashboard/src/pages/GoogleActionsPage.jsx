import { useDataContext } from '../context/DataContext';
import PageGuide from '../components/PageGuide';

export default function GoogleActionsPage() {
  const data = useDataContext();
  const actions = data.google_actions_2026 || [];
  const painPoints = data.pain_points || [];

  const totalPP = painPoints.length;
  const addressedCount = painPoints.filter((p) => p.addressed_by_google).length;

  return (
    <div className="flex flex-col gap-4">
      <PageGuide
        pageKey="google-actions"
        title="Google Actions 2026"
        description="See what Google has shipped in 2026 for Google Photos and which user pain points remain unaddressed. The unaddressed items represent your biggest opportunity gaps for product innovation."
      />

      <h1 className="text-xl font-semibold text-on-surface">Google Actions 2026</h1>

      {/* Summary Banner */}
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
        <p className="text-sm font-semibold text-on-surface">
          {addressedCount} of {totalPP} pain points addressed by Google in 2026
        </p>
        <div className="w-full h-2.5 bg-surface-container-high rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-primary-container rounded-full transition-all"
            style={{ width: `${totalPP > 0 ? (addressedCount / totalPP) * 100 : 0}%` }}
          />
        </div>
        <p className="text-xs text-on-surface-variant mt-2">{totalPP - addressedCount} pain points remain unaddressed</p>
      </div>

      {/* Timeline */}
      <div className="relative pl-8">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-outline-variant" />
        {actions.map((action, i) => (
          <div key={i} className="relative mb-6 last:mb-0">
            <div className="absolute left-[-20px] top-2 w-3 h-3 rounded-full bg-primary-container border-2 border-surface-container-lowest" />
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm ml-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-on-surface">{action.title}</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">{action.date}</p>
                </div>
                {action.url && (
                  <a href={action.url} target="_blank" rel="noopener noreferrer" className="text-primary text-xs font-medium flex items-center gap-1 shrink-0">
                    <span className="material-symbols-outlined text-sm">open_in_new</span> Source
                  </a>
                )}
              </div>
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">{action.description}</p>
              {action.addressed_pain_points?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {action.addressed_pain_points.map((id) => (
                    <span key={id} className="text-[11px] font-medium bg-primary-fixed text-primary px-2 py-0.5 rounded-full">
                      {id}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
