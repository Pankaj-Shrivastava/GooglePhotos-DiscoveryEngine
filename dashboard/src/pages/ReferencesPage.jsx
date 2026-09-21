import { useState, useMemo } from 'react';
import { useDataContext } from '../context/DataContext';
import PageGuide from '../components/PageGuide';

export default function ReferencesPage() {
  const data = useDataContext();
  const references = data.references || [];
  
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [sourceFilter, setSourceFilter] = useState('');

  const sortedAndFiltered = useMemo(() => {
    let result = [...references];
    
    if (sourceFilter) {
      result = result.filter(r => r.source_type === sourceFilter);
    }
    
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return result;
  }, [references, sortConfig, sourceFilter]);

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      <PageGuide
        pageKey="references"
        title="Source References"
        description="A full log of all original source materials (Reddit posts, Play Store reviews, etc.) grouped by the pain point they map to. Click the external link icon to view the original source."
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-on-surface">Source References</h1>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-on-surface-variant">Filter Source:</span>
          <select 
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="h-8 px-3 rounded-lg text-xs font-medium bg-surface-container-low border border-outline-variant text-on-surface cursor-pointer focus:outline-none focus:border-primary"
          >
            <option value="">All Sources</option>
            <option value="reddit">Reddit</option>
            <option value="play_store">Play Store</option>
            <option value="google_actions">Google Actions</option>
          </select>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/40 overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="px-4 py-3 text-xs font-semibold text-on-surface-variant cursor-pointer hover:text-on-surface transition-colors" onClick={() => handleSort('date')}>
                <div className="flex items-center gap-1">Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</div>
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-on-surface-variant cursor-pointer hover:text-on-surface transition-colors" onClick={() => handleSort('source_type')}>
                <div className="flex items-center gap-1">Source {sortConfig.key === 'source_type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</div>
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-on-surface-variant w-1/2">Quote Excerpt</th>
              <th className="px-4 py-3 text-xs font-semibold text-on-surface-variant cursor-pointer hover:text-on-surface transition-colors" onClick={() => handleSort('pain_point_id')}>
                <div className="flex items-center gap-1">Pain Point {sortConfig.key === 'pain_point_id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</div>
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-on-surface-variant text-center">Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/40">
            {sortedAndFiltered.map((ref, idx) => (
              <tr key={idx} className="hover:bg-surface-container-low/50 transition-colors">
                <td className="px-4 py-3 text-xs text-on-surface whitespace-nowrap">{ref.date || 'Unknown'}</td>
                <td className="px-4 py-3 text-xs">
                  <span className={`inline-flex px-2 py-0.5 rounded-full font-medium ${
                    ref.source_type === 'reddit' ? 'bg-[#FF4500]/10 text-[#FF4500]' : 
                    ref.source_type === 'play_store' ? 'bg-[#00A859]/10 text-[#00A859]' : 
                    'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    {ref.source_type || 'Unknown'}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-on-surface-variant">
                  <p className="line-clamp-2 italic">"{ref.quote_excerpt || ref.title}"</p>
                </td>
                <td className="px-4 py-3 text-xs">
                  <span className="font-medium text-primary">{ref.pain_point_id}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  {ref.url ? (
                    <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-container transition-colors inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-primary-fixed/50">
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  ) : (
                    <span className="text-on-surface-variant/30 material-symbols-outlined text-sm">link_off</span>
                  )}
                </td>
              </tr>
            ))}
            {sortedAndFiltered.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-sm text-on-surface-variant">
                  No references found for the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
