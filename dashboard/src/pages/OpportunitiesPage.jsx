import { useDataContext } from '../context/DataContext';
import { useFilterContext } from '../context/FilterContext';
import PageGuide from '../components/PageGuide';

export default function OpportunitiesPage() {
  const data = useDataContext();
  const { filters, applyFilters } = useFilterContext();
  const painPoints = applyFilters(data.pain_points || []);
  const validPpIds = new Set(painPoints.map(p => p.id));
  
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

  return (
    <div className="flex flex-col gap-4">
      <PageGuide
        pageKey="opportunities"
        title="Opportunity Areas"
        description="These are synthesized product opportunities derived from clustering multiple pain points. The #1 ranked item is the primary recommendation with the highest potential impact. Use these to prioritize your product roadmap."
      />

      <h1 className="text-xl font-semibold text-on-surface">Opportunity Areas</h1>

      <div className="flex flex-col gap-4">
        {opportunities.map((opp, i) => (
          <div
            key={opp.id}
            className={`bg-surface-container-lowest rounded-xl p-5 shadow-sm hover:shadow-md transition-all border-l-4 ${
              i === 0 ? 'border-l-tertiary-fixed-dim' : 'border-l-outline-variant'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-tertiary-fixed/30 text-tertiary-container flex items-center justify-center text-base font-bold shrink-0">
                #{i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-semibold text-on-surface">{opp.title}</h3>
                  {opp.is_primary_recommendation && (
                    <span className="text-[10px] font-semibold bg-tertiary-fixed text-tertiary-container px-2 py-0.5 rounded-full">
                      P0 Strategy
                    </span>
                  )}
                </div>
                <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">{opp.problem_statement}</p>

                {opp.supported_by?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {opp.supported_by.map((id) => (
                      <span key={id} className="text-[11px] font-medium bg-primary-fixed text-primary px-2 py-0.5 rounded-full">
                        {id}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-center shrink-0">
                <div className="w-16 h-16 rounded-full border-4 border-primary-container/30 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-container">{opp.impact_score}</span>
                </div>
                <p className="text-[10px] text-on-surface-variant mt-1">/10 Impact</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
