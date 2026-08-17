import { BarChart3, CalendarDays, Globe2, LayoutDashboard, ReceiptText, UserCircle2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/trips', label: 'Trips', icon: CalendarDays },
  { to: '/destinations', label: 'Destinations', icon: Globe2 },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/trips/new', label: 'Create Trip', icon: ReceiptText },
  { to: '/profile', label: 'Profile', icon: UserCircle2 }
];

export default function Sidebar() {
  return (
    <aside className="border-r border-white/70 bg-white/70 px-3 py-5 backdrop-blur-xl lg:min-h-[calc(100vh-4.5rem)]">
      <div className="mb-4 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 p-4 text-white shadow-soft">
        <p className="text-xs uppercase tracking-[0.18em] text-blue-200/90">Workspace</p>
        <h2 className="mt-2 text-lg font-semibold">Plan, budget, and track every trip</h2>
        <p className="mt-1 text-sm text-slate-300">Keep all travel data in one place.</p>
      </div>

      <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-w-fit items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200/70'
                  : 'text-slate-600 hover:bg-white hover:text-slate-950'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
