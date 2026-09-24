import { NavLink, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/', icon: 'dashboard', label: 'Overview', shortLabel: 'Overview' },
  { path: '/pain-points', icon: 'warning', label: 'Pain Points', shortLabel: 'Issues' },
  { path: '/frameworks', icon: 'bar_chart', label: 'Frameworks', shortLabel: 'Charts' },
  { path: '/google-actions', icon: 'rocket_launch', label: 'Google Actions', shortLabel: 'Actions' },
  { path: '/segmentation', icon: 'pie_chart', label: 'Segmentation', shortLabel: 'Segments' },
  { path: '/interview-guide', icon: 'assignment', label: 'Interview Guide', shortLabel: 'Guides' },
];

export default function Sidebar() {
  const location = useLocation();
  return (
    <aside className="group/sidebar fixed left-0 top-0 h-screen w-[72px] hover:w-60 bg-surface-container-lowest border-r border-outline-variant z-50 flex flex-col transition-all duration-300 ease-in-out overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] max-md:hidden">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 gap-3 border-b border-outline-variant shrink-0">
        <div className="w-8 h-8 shrink-0 flex items-center justify-center">
          <img src="/logo.svg" alt="Discovery Engine Logo" className="w-full h-full object-contain drop-shadow-sm" />
        </div>
        <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden flex flex-col">
          <span className="text-sm font-semibold text-on-surface leading-tight">Discovery Engine</span>
          <span className="text-[11px] text-on-surface-variant leading-none">Google Photos Intel</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 p-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={{ pathname: item.path, search: item.path === '/' ? '' : location.search }}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center h-11 px-3 rounded-xl gap-4 group transition-all ${
                isActive
                  ? 'bg-secondary-container text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`
            }
          >
            <span className="material-symbols-outlined text-xl shrink-0">{item.icon}</span>
            <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 text-sm whitespace-nowrap">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

    </aside>
  );
}

/* Mobile Bottom Tab Bar */
export function MobileTabBar() {
  const location = useLocation();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container-lowest border-t border-outline-variant z-50 flex items-center justify-between px-1 pb-safe">
      {NAV_ITEMS.slice(0, 5).map((item) => (
        <NavLink
          key={item.path}
          to={{ pathname: item.path, search: item.path === '/' ? '' : location.search }}
          end={item.path === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 min-w-0 h-full transition-all ${
              isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`material-symbols-outlined text-[22px] mb-1 transition-all ${isActive ? 'font-semibold' : ''}`}>
                {item.icon}
              </span>
              <span className={`text-[10px] leading-none whitespace-nowrap truncate w-full text-center px-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.shortLabel}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
