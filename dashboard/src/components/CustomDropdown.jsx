import { useState, useRef, useEffect } from 'react';

export default function CustomDropdown({ value, onChange, options, defaultLabel, hideClear }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Find currently selected label
  const selectedOption = options.find((opt) => {
    const val = typeof opt === 'object' ? opt.value : opt;
    return val === value;
  });

  let displayLabel = defaultLabel;
  if (selectedOption) {
    const label = typeof selectedOption === 'object' ? selectedOption.label : selectedOption;
    // Format if it's a simple string option
    displayLabel = typeof selectedOption === 'object' 
      ? label 
      : label.charAt(0).toUpperCase() + label.slice(1).replace(/_/g, ' ');
    // Truncate if long
    if (displayLabel.length > 30) displayLabel = displayLabel.substring(0, 30) + '...';
  }

  const isActive = !!value;

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 h-7 pl-3 pr-2.5 rounded-full text-xs font-medium cursor-pointer transition-all border outline-none ${
          isActive
            ? 'bg-primary-container text-on-primary-container border-primary-container shadow-sm hover:shadow'
            : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container-high'
        }`}
      >
        <span>{displayLabel}</span>
        <span className={`material-symbols-outlined text-sm transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          arrow_drop_down
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1.5 left-0 min-w-[180px] max-w-[280px] bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-[300px] overflow-y-auto py-1.5 custom-scrollbar">
            {/* Default clear option */}
            {!hideClear && (
              <>
                <button
                  className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center justify-between ${
                    !value ? 'bg-primary/5 text-primary font-semibold' : 'text-on-surface hover:bg-surface-container-low'
                  }`}
                  onClick={() => {
                    onChange('');
                    setIsOpen(false);
                  }}
                >
                  <span>{defaultLabel}</span>
                  {!value && <span className="material-symbols-outlined text-[14px]">check</span>}
                </button>
                {options.length > 0 && <div className="h-px bg-outline-variant/30 my-1 mx-2" />}
              </>
            )}

            {options.map((opt) => {
              const val = typeof opt === 'object' ? opt.value : opt;
              const rawLabel = typeof opt === 'object' ? opt.label : opt;
              const label = typeof opt === 'object' ? rawLabel : rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1).replace(/_/g, ' ');
              const isSelected = value === val;

              return (
                <button
                  key={val}
                  className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center justify-between ${
                    isSelected ? 'bg-primary/5 text-primary font-semibold' : 'text-on-surface hover:bg-surface-container-low'
                  }`}
                  onClick={() => {
                    onChange(val);
                    setIsOpen(false);
                  }}
                  title={label}
                >
                  <span className="truncate pr-4">{label}</span>
                  {isSelected && <span className="material-symbols-outlined text-[14px] shrink-0">check</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
