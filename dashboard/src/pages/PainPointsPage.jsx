import { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { useFilterContext } from '../context/FilterContext';
import PageGuide from '../components/PageGuide';

const SEVERITY_STYLES = {
  critical: 'bg-error text-on-error',
  high: 'bg-tertiary-fixed-dim text-tertiary-container',
  medium: 'bg-surface-container-high text-on-surface',
  low: 'bg-surface-container text-on-surface-variant',
};

const SEVERITY_WEIGHTS = { critical: 4, high: 3, medium: 2, low: 1 };

const SEGMENT_CONFIG = {
  parent: { label: 'Parent', icon: 'child_care', bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200' },
  traveler: { label: 'Traveler', icon: 'flight', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  power_user: { label: 'Power User', icon: 'bolt', bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
  pet_owner: { label: 'Pet Owner', icon: 'pets', bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  casual: { label: 'Casual', icon: 'sentiment_satisfied', bg: 'bg-surface-container', text: 'text-on-surface-variant', border: 'border-outline-variant/50' }
};

export default function PainPointsPage() {
  const data = useDataContext();
  const { filters, applyFilters, setFilter } = useFilterContext();

  const allPainPoints = data.pain_points || [];
  const filtered = applyFilters(allPainPoints);

  // Group the filtered pain points by memory group
  const grouped = {};
  filtered.forEach(pp => {
    const groupName = pp.memory_group || 'Other';
    if (!grouped[groupName]) {
      grouped[groupName] = [];
    }
    grouped[groupName].push(pp);
  });

  // Sort groups by severity score
  const sortedGroupNames = Object.keys(grouped).sort((a, b) => {
    const scoreA = grouped[a].reduce((sum, p) => sum + (SEVERITY_WEIGHTS[p.severity || 'low'] || 0), 0);
    const scoreB = grouped[b].reduce((sum, p) => sum + (SEVERITY_WEIGHTS[p.severity || 'low'] || 0), 0);
    return scoreB - scoreA;
  });

  const isOpportunityFiltered = !!filters.opportunity;

  return (
    <div className="flex flex-col gap-6">
      <PageGuide
        pageKey="pain-points"
        title="Raw Memory Failure Verbatims"
        description="Browse real user pain points, categorized strictly by the 7 human memory failure mechanisms. Read the full, untruncated user quotes to build empathy and understand the exact context of their retrieval struggle."
      />

      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-semibold text-on-surface flex items-center">
            {isOpportunityFiltered ? 'Filtered by Target Group' : 'All Memory Failures'}
            <span className="ml-2 text-xs font-medium bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full">
              {filtered.length} {filtered.length === 1 ? 'Issue' : 'Issues'}
            </span>
          </h1>
          {isOpportunityFiltered && (
            <button
              onClick={() => setFilter('opportunity', '')}
              className="text-sm font-medium text-primary hover:text-primary-container hover:underline transition-colors flex items-center gap-1 w-fit"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              View all memory groups
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {sortedGroupNames.map(groupName => (
          <MemoryGroupSection key={groupName} name={groupName} painPoints={grouped[groupName]} initiallyOpen={isOpportunityFiltered || sortedGroupNames.length <= 2} />
        ))}
      </div>
    </div>
  );
}

function MemoryGroupSection({ name, painPoints, initiallyOpen }) {
  const [open, setOpen] = useState(initiallyOpen);

  // Group stats
  const criticalCount = painPoints.filter(p => p.severity === 'critical').length;
  const highCount = painPoints.filter(p => p.severity === 'high').length;
  const unaddressedCount = painPoints.filter(p => !p.addressed_by_google).length;

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/40 overflow-hidden">
      {/* Header */}
      <button 
        onClick={() => setOpen(!open)}
        className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-container-low/50 hover:bg-surface-container-low transition-colors text-left gap-4"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-xl transition-transform" style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>
            chevron_right
          </span>
          <div>
            <h2 className="text-base font-bold text-on-surface">{name}</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">{painPoints.length} total issues • {unaddressedCount} unaddressed</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pl-8 sm:pl-0">
          <div className="flex gap-1">
            {criticalCount > 0 && <span className="text-[10px] font-semibold bg-error text-on-error px-2 py-0.5 rounded-full">{criticalCount} Critical</span>}
            {highCount > 0 && <span className="text-[10px] font-semibold bg-tertiary-fixed-dim text-tertiary-container px-2 py-0.5 rounded-full">{highCount} High</span>}
          </div>
        </div>
      </button>

      {/* Content */}
      {open && (
        <div className="p-5 flex flex-col gap-4 bg-background border-t border-outline-variant/30">
          {/* Sort them inside the group by severity */}
          {painPoints
            .sort((a, b) => (SEVERITY_WEIGHTS[b.severity || 'low'] || 0) - (SEVERITY_WEIGHTS[a.severity || 'low'] || 0))
            .map(pp => (
              <PainPointCard key={pp.id} pp={pp} />
            ))}
        </div>
      )}
    </div>
  );
}

function PainPointCard({ pp }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-outline-variant/40">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md uppercase tracking-wider">
              {pp.id}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${SEVERITY_STYLES[pp.severity] || SEVERITY_STYLES.low}`}>
              {pp.severity?.charAt(0).toUpperCase() + pp.severity?.slice(1)}
            </span>
          </div>
          <h3 className="text-sm font-bold text-on-surface leading-snug">{pp.title}</h3>
          
          {/* Segment Pills */}
          {pp.segments?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {pp.segments.map(segKey => {
                const conf = SEGMENT_CONFIG[segKey] || SEGMENT_CONFIG.casual;
                return (
                  <span key={segKey} className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${conf.bg} ${conf.text} ${conf.border}`}>
                    <span className="material-symbols-outlined text-[12px]">{conf.icon}</span>
                    {conf.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Status */}
        <div className="shrink-0 flex sm:justify-end">
          {pp.addressed_by_google ? (
            <span className="text-[11px] font-medium text-green-700 bg-green-100 px-2.5 py-1 rounded-full flex items-center gap-1 border border-green-200">
              <span className="material-symbols-outlined text-sm">check_circle</span> Addressed
            </span>
          ) : (
            <span className="text-[11px] font-medium text-error bg-error-container px-2.5 py-1 rounded-full flex items-center gap-1 border border-error-container">
              <span className="material-symbols-outlined text-sm">warning</span> Unaddressed
            </span>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-on-surface-variant">
        <span className="flex items-center gap-1.5" title="Volume of feedback">
          <span className="material-symbols-outlined text-[16px]">bar_chart</span>
          {pp.frequency} mentions
        </span>
        <span className="flex items-center gap-1.5" title="Geographies">
          <span className="material-symbols-outlined text-[16px]">public</span>
          {pp.geographies?.join(', ') || 'Global'}
        </span>
      </div>

      {/* Memory Cue Tags */}
      {pp.memory_cues?.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          <span className="text-[10px] text-on-surface-variant font-medium mr-1 uppercase tracking-wider">Cues attempted:</span>
          {pp.memory_cues.map((cue) => (
            <span key={cue} className="text-[11px] font-medium bg-secondary-container/50 border border-secondary-container text-on-secondary-container px-2 py-0.5 rounded-md">
              {cue}
            </span>
          ))}
        </div>
      )}

      {/* Quotes (Full untruncated text) */}
      <div className="mt-4 pt-4 border-t border-outline-variant/30">
        <p className="text-[11px] font-semibold text-primary mb-2 flex items-center gap-1.5 uppercase tracking-wider">
          <span className="material-symbols-outlined text-sm">format_quote</span>
          User Verbatim
        </p>
        
        {pp.quotes?.length > 0 ? (
          <div className="flex flex-col gap-3">
            {pp.quotes.map((q, i) => (
              <div key={i} className="bg-surface-container-lowest border-l-4 border-primary-container p-3.5 rounded-r-lg shadow-sm">
                <p className="text-[13px] text-on-surface leading-relaxed whitespace-pre-wrap">
                  "{q.trim()}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface-container-lowest border-l-4 border-outline-variant p-3.5 rounded-r-lg shadow-sm flex items-center gap-2">
             <span className="material-symbols-outlined text-on-surface-variant text-lg">speaker_notes_off</span>
             <p className="text-[12px] text-on-surface-variant italic">
               No verbatim quote available for this pain point.
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
