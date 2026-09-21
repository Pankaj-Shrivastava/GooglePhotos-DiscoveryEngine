import { useFilterContext } from '../context/FilterContext';

const FILTER_OPTIONS = {
  geography: ['US', 'India', 'Global', 'unknown'],
  severity: ['critical', 'high', 'medium', 'low'],
  source: ['play_store', 'google_actions'],
  platform: ['android', 'web', 'unknown'],
  memoryCue: ['location', 'people', 'time', 'visual', 'activity', 'emotion'],
};

const FILTER_LABELS = {
  geography: 'Geography',
  severity: 'Severity',
  source: 'Source',
  platform: 'Platform',
  memoryCue: 'Memory Cue',
};

export default function FilterBar() {
  const { filters, setFilter, resetFilters, activeCount } = useFilterContext();

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
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1).replace('_', ' ')}
                  </option>
                ))}
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
