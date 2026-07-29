import { CalendarDays, LayoutDashboard, ReceiptText, Compass, Plane } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/trips', label: 'Trips', icon: CalendarDays, end: true }, // <-- add end: true
  { to: '/trips/new', label: 'Create Trip', icon: ReceiptText, end: true },
  { to: '/destinations', label: 'Destinations', icon: Compass, end: true }
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-white/10 px-5 py-6 min-h-screen bg-gradient-to-b from-brand-light via-brand to-brand-light">
      
      {/* Logo - TripNest Colors */}
      <div className="mb-10 px-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-logo-gradient-br flex items-center justify-center">
            <Plane className="h-6 w-6 text-brand" strokeWidth={2.5} />
          </div>
          <h1 className="font-heading text-2xl font-bold bg-logo-gradient bg-clip-text text-transparent">
            TripNest
          </h1>
        </div>
        <p className="text-blue-400 text-sm font-body">Plan. Explore. Remember.</p>
      </div>

      {/* Nav Links */}
      <nav className="space-y-2">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end} // <-- this fixes it
            className={({ isActive }) =>
              `font-body flex items-center gap-4 rounded-2xl px-5 py-3.5 text-[15px] font-semibold transition-all duration-300 ${
                isActive 
              ? 'bg-logo-gradient text-brand shadow-logo-glow' 
                : 'text-white/80 hover:bg-white/5 hover:text-white hover:translate-x-1'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}