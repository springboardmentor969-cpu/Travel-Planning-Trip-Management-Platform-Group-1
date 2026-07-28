import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Plane, Sparkles, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-xl">
      <div className="flex min-h-[84px] items-center justify-between px-5 py-5 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-lg font-bold text-slate-950">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 text-white shadow-lg shadow-blue-200/70">
            <Plane className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            TripNest
            <span className="block text-xs font-medium text-slate-500">Travel planning workspace</span>
          </span>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/profile" className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-white">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="font-medium">{user?.name || 'Traveler'}</span>
            <span className="text-slate-400">({user?.email})</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <button
          className="rounded-full border border-slate-200 bg-white/80 p-2 shadow-sm transition hover:bg-white md:hidden"
          onClick={() => setShowMenu(!showMenu)}
        >
          {showMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {showMenu && (
        <div className="space-y-3 border-t border-slate-200/80 bg-white/90 p-4 md:hidden">
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            <div className="font-semibold text-slate-900">{user?.name}</div>
            <div className="text-slate-500">{user?.email}</div>
          </div>
          <Link
            to="/profile"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            View profile
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
