import { createContext, useContext } from 'react';
import { useData } from '../hooks/useData';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { data, loading, error } = useData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant text-sm font-medium">Loading data…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-error-container text-error rounded-xl p-6 max-w-md text-center">
          <span className="material-symbols-outlined text-3xl mb-2">error</span>
          <p className="font-semibold">Failed to load data</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}

export function useDataContext() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useDataContext must be used within DataProvider');
  return ctx;
}
