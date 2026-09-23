import { useFilterContext } from '../context/FilterContext';
import { useDataContext } from '../context/DataContext';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { getMemoryCueGroup } from '../utils/memoryCueMapper';

const FILTER_LABELS = {
  severity: 'Severity',
  memoryCue: 'Memory Cue',
  opportunity: 'All Pain Points',
};

export default function FilterBar() {
  const { filters, setFilter, resetFilters, activeCount } = useFilterContext();
  const data = useDataContext();
  const { pathname } = useLocation();
  const isPainPointsPage = pathname === '/pain-points';

  const FILTER_OPTIONS = useMemo(() => {
    const memoryCuesSet = new Set();
    (data.pain_points || []).forEach(p => {
      (p.memory_cues || []).forEach(c => memoryCuesSet.add(getMemoryCueGroup(c)));
    });

    const options = {
      severity: ['critical', 'high', 'medium', 'low'],
      memoryCue: Array.from(memoryCuesSet).sort(),
    };

    if (isPainPointsPage) {
      options.opportunity = (data.opportunity_areas || []).map(o => ({ value: o.id, label: o.title }));
    }

    return options;
  }, [data.pain_points, data.opportunity_areas, isPainPointsPage]);

  return (
    <div className="sticky top-14 left-0 right-0 z-30 bg-surface-container-lowest border-b border-outline-variant px-4 lg:px-6 py-2 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-2 overflow-x-auto">
        {Object.entries(FILTER_OPTIONS).map(([key, options]) => {
          const isActive = !!filters[key];
          return (
            <div key={key} className="relative shrink-0">
              <select
                value={filters[key]}
                onChange={(e) => setFilter(key, e.target.value)}
                className={`appearance-none h-7 pl-3 pr-7 rounded-full text-xs font-medium cursor-pointer transition-colors border-none outline-none ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container shadow-sm'
                    : 'bg-secondary-container text-on-secondary-container hover:bg-surface-container-high'
                }`}
              >
                <option value="">{FILTER_LABELS[key]}</option>
                {options.map((opt) => {
                  const val = typeof opt === 'object' ? opt.value : opt;
                  const label = typeof opt === 'object' ? opt.label : (opt.charAt(0).toUpperCase() + opt.slice(1).replace('_', ' '));
                  // Truncate long opportunity labels for the dropdown
                  const displayLabel = label.length > 40 ? label.substring(0, 40) + '...' : label;
                  return (
                    <option key={val} value={val}>
                      {displayLabel}
                    </option>
                  );
                })}
              </select>
              <span className="material-symbols-outlined text-sm absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none">
                arrow_drop_down
              </span>
            </div>
          );
        })}
      </div>
      {activeCount > 0 && (
        <button
          onClick={resetFilters}
          className="text-primary hover:text-primary-container text-xs font-semibold transition-colors shrink-0 ml-4"
        >
          Reset All
        </button>
      )}
    </div>
  );
}
