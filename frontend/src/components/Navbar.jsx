import { Link } from 'react-router-dom';
import { Plane } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-slate-950">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white">
            <Plane className="h-5 w-5" />
          </span>
          TripNest
        </Link>
        <div className="text-sm text-slate-500">Travel planning MVP</div>
      </div>
    </header>
  );
}
