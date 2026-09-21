import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/', icon: 'dashboard', label: 'Overview' },
  { path: '/pain-points', icon: 'warning', label: 'Pain Points' },
  { path: '/opportunities', icon: 'lightbulb', label: 'Opportunities' },
  { path: '/frameworks', icon: 'bar_chart', label: 'Frameworks' },
  { path: '/google-actions', icon: 'rocket_launch', label: 'Google Actions' },
  { path: '/segmentation', icon: 'pie_chart', label: 'Segmentation' },
  { path: '/interview-guide', icon: 'assignment', label: 'Interview Guide' },
  { path: '/references', icon: 'link', label: 'References' },
];

export default function Sidebar() {
  return (
    <aside className="group/sidebar fixed left-0 top-0 h-screen w-[72px] hover:w-60 bg-surface-container-lowest border-r border-outline-variant z-50 flex flex-col transition-all duration-300 ease-in-out overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] max-md:hidden">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 gap-3 border-b border-outline-variant shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
          <span className="text-on-primary-container font-bold text-sm">DE</span>
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
            to={item.path}
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

      {/* Footer */}
      <div className="p-2 border-t border-outline-variant shrink-0">
        <div className="flex items-center px-3 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors gap-4">
          <span className="material-symbols-outlined text-xl shrink-0">help_outline</span>
          <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 text-xs font-medium whitespace-nowrap">
            Research Spec v2.4
          </span>
        </div>
      </div>
    </aside>
  );
}

/* Mobile Bottom Tab Bar */
export function MobileTabBar() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-surface-container-lowest border-t border-outline-variant z-50 flex items-center justify-around px-2">
      {NAV_ITEMS.slice(0, 5).map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
              isActive ? 'text-primary' : 'text-on-surface-variant'
            }`
          }
        >
          <span className="material-symbols-outlined text-xl">{item.icon}</span>
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
