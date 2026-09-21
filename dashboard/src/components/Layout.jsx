import { Outlet } from 'react-router-dom';
import Sidebar, { MobileTabBar } from './Sidebar';
import FilterBar from './FilterBar';

export default function Layout() {
  return (
    <div className="bg-background min-h-screen">
      <Sidebar />
      <MobileTabBar />

      <div className="pl-0 md:pl-[72px]">
        {/* Top Header */}
        <header className="fixed top-0 left-0 md:left-[72px] right-0 h-14 bg-surface-container-lowest border-b border-outline-variant z-40 px-4 lg:px-6 flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                search
              </span>
              <input
                className="w-full h-9 pl-9 pr-3 text-xs bg-surface-container-low border border-outline-variant rounded-lg placeholder-on-surface-variant text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Search feedback, synthesis tags, verbatim quotes..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low text-on-surface-variant text-xs font-medium transition-colors">
              <span className="material-symbols-outlined text-lg">tune</span>
              <span className="hidden sm:inline">Filters</span>
            </button>
            <button className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary-container hover:bg-primary text-on-primary-container text-xs font-medium transition-all shadow-sm">
              <span className="material-symbols-outlined text-lg">ios_share</span>
              <span className="hidden sm:inline">Export</span>
            </button>
            <div className="h-5 w-px bg-outline-variant mx-1 hidden sm:block" />
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-sm font-bold cursor-pointer">
              P
            </div>
          </div>
        </header>

        {/* Filter Bar */}
        <div className="pt-14">
          <FilterBar />
        </div>

        {/* Main Content */}
        <main className="px-4 lg:px-6 py-4 lg:py-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
