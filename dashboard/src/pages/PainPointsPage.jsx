import { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { useFilterContext } from '../context/FilterContext';
import PageGuide from '../components/PageGuide';
import CustomDropdown from '../components/CustomDropdown';

const SEVERITY_STYLES = {
  critical: 'bg-error text-on-error',
  high: 'bg-tertiary-fixed-dim text-tertiary-container',
  medium: 'bg-surface-container-high text-on-surface',
  low: 'bg-surface-container text-on-surface-variant',
};

export default function PainPointsPage() {
  const data = useDataContext();
  const { filters, applyFilters, setFilter } = useFilterContext();
  const [sortBy, setSortBy] = useState('severity');

  const allPainPoints = data.pain_points || [];
  const filtered = applyFilters(allPainPoints);

  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'severity') return (severityOrder[a.severity] ?? 4) - (severityOrder[b.severity] ?? 4);
    if (sortBy === 'frequency') return (b.frequency || 0) - (a.frequency || 0);
    return 0;
  });

  return (
    <div className="flex flex-col gap-4">
      <PageGuide
        pageKey="pain-points"
        title="Pain Points Explorer"
        description="Browse individual user pain points ranked by severity. Each card shows real user quotes, affected geographies, and whether Google has addressed the issue. Use the filters on the left to drill down by severity, geography, or source."
      />

      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-semibold text-on-surface flex items-center">
            {filters.opportunity ? 'Filtered by Opportunity' : 'Active Pain Points Synthesis'}
            <span className="ml-2 text-xs font-medium bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full">
              {sorted.length} {filters.opportunity ? 'Issues' : 'Total Issues'}
            </span>
          </h1>
          {filters.opportunity && (
            <button
              onClick={() => setFilter('opportunity', '')}
              className="text-sm font-medium text-primary hover:text-primary-container hover:underline transition-colors flex items-center gap-1 w-fit"
            >
              Click to view all active pain points
            </button>
          )}
        </div>
        <div className="w-[160px] shrink-0 flex justify-end">
          <CustomDropdown
            value={sortBy}
            onChange={(val) => setSortBy(val)}
            options={[
              { value: 'severity', label: 'Sort: Severity' },
              { value: 'frequency', label: 'Sort: Frequency' }
            ]}
            hideClear={true}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {sorted.map((pp) => (
          <PainPointCard key={pp.id} pp={pp} />
        ))}
      </div>
    </div>
  );
}

function PainPointCard({ pp }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-outline-variant/40">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs text-primary font-medium mb-1">{pp.id?.toUpperCase()}</p>
          <h3 className="text-sm font-semibold text-on-surface">{pp.title}</h3>
        </div>
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${SEVERITY_STYLES[pp.severity] || SEVERITY_STYLES.low}`}>
          {pp.severity?.charAt(0).toUpperCase() + pp.severity?.slice(1)}
        </span>
      </div>

      {/* Tags */}
      {pp.memory_cues?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {pp.memory_cues.map((cue) => (
            <span key={cue} className="text-[11px] font-medium bg-primary-fixed text-primary px-2 py-0.5 rounded-full">
              #{cue}
            </span>
          ))}
        </div>
      )}

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-on-surface-variant">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">trending_up</span>
          Frequency: {pp.frequency}
        </span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">public</span>
          {pp.geographies?.join(', ')}
        </span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">group</span>
          {pp.segments?.join(', ')}
        </span>
      </div>

      {/* Quotes */}
      {pp.quotes?.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-on-surface-variant mb-2 flex items-center gap-1">
            <span className="text-base">❝</span> Synthesized User Verbatims
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {pp.quotes.slice(0, 2).map((q, i) => (
              <blockquote
                key={i}
                className="text-xs italic text-on-surface-variant bg-surface-container-low border-l-3 border-primary-container/50 p-3 rounded-r-lg leading-relaxed"
              >
                "{q.slice(0, 200)}{q.length > 200 ? '…' : ''}"
              </blockquote>
            ))}
          </div>
        </div>
      )}

      {/* Status */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-outline-variant/40">
        {pp.addressed_by_google ? (
          <span className="text-[11px] font-medium text-green-700 bg-green-100 px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">check_circle</span> Addressed
          </span>
        ) : (
          <span className="text-[11px] font-medium text-error bg-error-container px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">warning</span> Unaddressed
          </span>
        )}
      </div>
    </div>
  );
}
