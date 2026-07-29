import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050A18] via-[#0B1229] to-[#050A18] text-white font-sans">
      <Navbar />
      <div className="flex-1 max-w-[1400px] w-full mx-auto grid lg:grid-cols-[260px_1fr]">
        <Sidebar />
        <main className="p-6 lg:p-10 overflow-y-auto">
          <div className="animate-fade-in duration-300">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}