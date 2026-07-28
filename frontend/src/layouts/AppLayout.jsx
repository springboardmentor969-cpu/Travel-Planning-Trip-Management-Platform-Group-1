import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function AppLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_28%),linear-gradient(180deg,rgba(248,250,252,0.85),rgba(238,242,255,0.92))]" />
      <Navbar />
      <div className="mx-auto grid max-w-[1600px] gap-4 px-3 pb-4 pt-[84px] lg:grid-cols-[280px_1fr] lg:px-4 lg:pb-6">
        <Sidebar />
        <main className="min-h-[calc(100vh-4.5rem)] rounded-[2rem] border border-white/70 bg-white/60 p-4 shadow-soft backdrop-blur-xl lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
