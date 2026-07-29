import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, LogOut, Menu, X, LayoutDashboard, Calendar, PlusCircle, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#050A18]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:px-10">
        {/* Brand Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 text-xl font-bold tracking-tight">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-teal-500 text-[#050A18] shadow-lg shadow-amber-500/20">
            <Plane className="h-5 w-5 -rotate-45" />
          </span>
          <span className="font-heading bg-gradient-to-r from-amber-400 to-teal-400 bg-clip-text text-transparent">TripNest</span>
        </Link>

        {/* Desktop Nav Links + User Info & Actions */}
        <div className="hidden md:flex items-center gap-6">
          {/* User Info */}
          <div className="flex items-center gap-3 border-l border-white/10 pl-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-teal-500/20 text-sm font-bold text-amber-400 border-amber-400/20">
              {getInitials(user?.name)}
            </span>
            <div className="text-left">
              <span className="block text-sm font-semibold text-white leading-none">{user?.name}</span>
              <span className="text-xs text-white/50 font-medium">{user?.email}</span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-2xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 px-4 py-2.5 text-sm font-medium text-white/70 transition border-white/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          className="rounded-2xl p-2 text-white/70 hover:bg-white/5 md:hidden transition"
          onClick={() => setShowMenu(!showMenu)}
          aria-label="Toggle menu"
        >
          {showMenu? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {showMenu && (
        <div className="border-t border-white/10 bg-[#050A18]/90 backdrop-blur-xl p-5 md:hidden space-y-4 shadow-2xl">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-teal-500/20 text-sm font-bold text-amber-400 border-amber-400/20">
              {getInitials(user?.name)}
            </span>
            <div>
              <div className="text-sm font-semibold text-white">{user?.name}</div>
              <div className="text-xs text-white/50">{user?.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {[
              { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { to: '/trips', icon: Calendar, label: 'Trips' },
              { to: '/destinations', icon: MapPin, label: 'Destinations' },
              { to: '/trips/new', icon: PlusCircle, label: 'Create Trip' }
            ].map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/70 rounded-2xl hover:bg-white/5 hover:text-white transition"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-red-500/10 hover:bg-red-500/20 py-3 text-sm font-semibold text-red-400 transition border-red-500/20"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </header>
  );
}