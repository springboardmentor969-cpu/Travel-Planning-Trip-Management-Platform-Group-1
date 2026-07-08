import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, LogOut, Menu, X } from 'lucide-react';
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
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-slate-950">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white">
            <Plane className="h-5 w-5" />
          </span>
          TripNest
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <div className="text-sm text-slate-600">
            <span className="font-medium">{user?.name}</span>
            <span className="text-slate-400 ml-2">({user?.email})</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <button
          className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition"
          onClick={() => setShowMenu(!showMenu)}
        >
          {showMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {showMenu && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-3">
          <div className="text-sm text-slate-600 mb-3">
            <div className="font-medium">{user?.name}</div>
            <div className="text-slate-400">{user?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
