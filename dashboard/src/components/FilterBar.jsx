import { useFilterContext } from '../context/FilterContext';
import { useDataContext } from '../context/DataContext';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { getMemoryCueGroup } from '../utils/memoryCueMapper';
import CustomDropdown from './CustomDropdown';

const FILTER_LABELS = {
  severity: 'Severity',
  memoryCue: 'Memory Cue',
};

export default function FilterBar() {
  const { filters, setFilter, resetFilters, activeCount } = useFilterContext();
  const data = useDataContext();

  const FILTER_OPTIONS = useMemo(() => {
    const memoryCuesSet = new Set();
    (data.pain_points || []).forEach(p => {
      (p.memory_cues || []).forEach(c => memoryCuesSet.add(getMemoryCueGroup(c)));
    });

    return {
      severity: ['critical', 'high', 'medium', 'low'],
      memoryCue: Array.from(memoryCuesSet).sort(),
    };
  }, [data.pain_points]);

  return (
    <div className="sticky top-14 left-0 right-0 z-30 bg-surface-container-lowest border-b border-outline-variant px-4 lg:px-6 py-2 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-2 flex-wrap">
        {Object.entries(FILTER_OPTIONS).map(([key, options]) => {
          const isActive = !!filters[key];
          return (
            <CustomDropdown
              key={key}
              value={filters[key]}
              onChange={(val) => setFilter(key, val)}
              options={options}
              defaultLabel={FILTER_LABELS[key]}
            />
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
