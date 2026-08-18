import React from 'react';
import { Compass, Heart, Globe2, ShieldCheck, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">TripNest</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your complete companion for effortless day-wise travel planning, budget control, and seamless group collaboration.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/destinations" className="hover:text-emerald-400 transition">Explore Destinations</Link>
              </li>
              <li>
                <Link to="/trips" className="hover:text-emerald-400 transition">Day-Wise Itineraries</Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-emerald-400 transition">Budget Analytics</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition">Traveler Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Collaboration & Security */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Features</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-emerald-400" />
                <span>Interactive Maps &amp; Weather</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Secure Document Vault</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>Group Expense Splits</span>
              </li>
            </ul>
          </div>

          {/* Built with Care */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Demo Accounts</h4>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 text-xs space-y-1.5 font-mono text-slate-300">
              <div><span className="text-emerald-400 font-bold">Admin:</span> admin@tripnest.com / admin123</div>
              <div><span className="text-emerald-400 font-bold">Traveler:</span> traveler@tripnest.com / traveler123</div>
              <div><span className="text-emerald-400 font-bold">Group Admin:</span> sarah@tripnest.com / sarah123</div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} TripNest Travel Platform. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Engineered with precision for global explorers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
