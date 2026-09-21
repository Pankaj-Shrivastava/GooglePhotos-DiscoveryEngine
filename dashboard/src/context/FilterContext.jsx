import { createContext, useContext } from 'react';
import { useFilters } from '../hooks/useFilters';

const FilterContext = createContext(null);

export function FilterProvider({ children }) {
  const filterState = useFilters();
  return <FilterContext.Provider value={filterState}>{children}</FilterContext.Provider>;
}

export function useFilterContext() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilterContext must be used within FilterProvider');
  return ctx;
}
