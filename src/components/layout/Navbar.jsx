import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../notifications/NotificationBell";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/trips", label: "Trips", icon: "🧳" },
  { to: "/destinations", label: "Explore", icon: "🌍" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-8">
          <NavLink to="/dashboard" className="flex items-center gap-2 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-emerald-700 text-lg text-white shadow-sm transition group-hover:scale-105">
              🧭
            </span>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-teal-700 transition">
              Trip<span className="text-teal-600">Nest</span>
            </span>
          </NavLink>

          <nav className="hidden gap-1.5 sm:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                    isActive
                      ? "border border-teal-200/80 bg-teal-50/80 text-teal-700 shadow-2xs"
                      : "border border-transparent text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                  }`
                }
              >
                <span>{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell />
          
          <NavLink
            to="/profile"
            className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700 transition hover:border-teal-400 hover:bg-white"
            title={user?.name}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 text-xs font-bold text-white shadow-2xs">
              {user?.name?.charAt(0)?.toUpperCase() || "?"}
            </span>
            <span className="hidden md:inline max-w-[100px] truncate">{user?.name?.split(" ")[0]}</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="hidden rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:inline-block"
          >
            Sign out
          </button>
        </div>
      </div>

      <nav className="flex gap-1.5 overflow-x-auto border-t border-slate-100 px-4 py-2 sm:hidden">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-bold ${
                isActive ? "border border-teal-200 bg-teal-50 text-teal-700" : "text-slate-600"
              }`
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}