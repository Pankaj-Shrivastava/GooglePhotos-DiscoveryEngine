import { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar, { MobileTabBar } from './Sidebar';
import FilterBar from './FilterBar';
import { exportToPdf, exportToCsv } from '../utils/exportUtils';
import { useDataContext } from '../context/DataContext';
import { useFilterContext } from '../context/FilterContext';

export default function Layout() {
  const [exportOpen, setExportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  
  const dropdownRef = useRef(null);
  const location = useLocation();
  const data = useDataContext();
  const { filters, setFilter, activeCount } = useFilterContext();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportPdf = async () => {
    setExportOpen(false);
    setIsExporting(true);
    const pageName = location.pathname === '/' ? 'overview' : location.pathname.slice(1);
    await exportToPdf('exportable-content', `discovery_engine_${pageName}.pdf`);
    setIsExporting(false);
  };

  const handleExportCsv = () => {
    setExportOpen(false);
    let dataset = [];
    let filename = 'data.csv';
    
    if (location.pathname === '/pain-points') { dataset = data.pain_points; filename = 'pain_points.csv'; }
    else if (location.pathname === '/opportunities') { dataset = data.opportunity_areas; filename = 'opportunities.csv'; }
    else if (location.pathname === '/google-actions') { dataset = data.google_actions_2026; filename = 'google_actions.csv'; }
    else if (location.pathname === '/references') { dataset = data.references; filename = 'references.csv'; }
    else {
      dataset = data.pain_points; 
      filename = 'dashboard_export.csv';
    }
    
    exportToCsv(dataset, filename);
  };

  return (
    <div className="bg-background min-h-screen">
      <Sidebar />
      <MobileTabBar />

      <div className="pl-0 md:pl-[72px]">
        {/* Top Header */}
        <header className="print-hide fixed top-0 left-0 md:left-[72px] right-0 h-14 bg-surface-container-lowest border-b border-outline-variant z-40 px-4 lg:px-6 flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="flex-1"></div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-outline-variant text-xs font-medium transition-colors ${
                showFilters || activeCount > 0 
                  ? 'bg-primary-container text-on-primary-container border-transparent' 
                  : 'bg-surface-container-lowest hover:bg-surface-container-low text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-lg">tune</span>
              <span className="hidden sm:inline">Filters</span>
              {activeCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 ml-1 rounded-full bg-primary text-on-primary text-[10px] font-bold">
                  {activeCount}
                </span>
              )}
            </button>
            
            {/* Export Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setExportOpen(!exportOpen)}
                disabled={isExporting}
                className={`inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-medium transition-all shadow-sm ${
                  isExporting ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed' : 'bg-primary hover:bg-primary/90 text-on-primary'
                }`}
              >
                {isExporting ? (
                  <span className="w-4 h-4 border-2 border-on-surface-variant border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-lg">ios_share</span>
                )}
                <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export'}</span>
              </button>
              
              {exportOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg py-1 z-50">
                  <button 
                    onClick={handleExportPdf}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm text-primary">picture_as_pdf</span>
                    Save Page as PDF
                  </button>
                  <button 
                    onClick={handleExportCsv}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm text-[#00A859]">table_view</span>
                    Export Data as CSV
                  </button>
                </div>
              )}
            </div>

            <div className="h-5 w-px bg-outline-variant mx-1 hidden sm:block" />
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-sm font-bold cursor-pointer">
              P
            </div>
          </div>
        </header>

        {/* Filter Bar */}
        {showFilters && (
          <div className="pt-14 print-hide transition-all">
            <FilterBar />
          </div>
        )}

        {/* Main Content */}
        <main id="exportable-content" className={`px-4 lg:px-6 py-4 lg:py-6 pb-20 md:pb-6 bg-background ${!showFilters ? 'pt-18' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
