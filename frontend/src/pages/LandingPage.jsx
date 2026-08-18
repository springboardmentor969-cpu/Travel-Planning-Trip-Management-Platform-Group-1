import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Shield,
  ArrowRight,
  Sparkles,
  Star,
  CheckCircle2,
  CloudSun,
  FileText
} from 'lucide-react';
import api from '../services/api';

const LandingPage = () => {
  const [popularDestinations, setPopularDestinations] = useState([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await api.get('/destinations/popular');
        if (res.data?.data) {
          setPopularDestinations(res.data.data.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching popular destinations:', err);
      }
    };
    fetchDestinations();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 bg-gradient-to-b from-emerald-50/70 via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Next-Gen Travel Planning Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Plan your dream trip <br />
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  with total confidence.
                </span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Build day-by-day itineraries, track your budget in real-time, invite travel companions, and manage all your documents and bookings in one intuitive space.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 transition duration-200"
                >
                  <span>Start Planning Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/destinations"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 shadow-sm transition"
                >
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span>Browse Destinations</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/60 max-w-md mx-auto lg:mx-0 text-slate-600">
                <div>
                  <div className="text-2xl font-black text-slate-900">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Free to start</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">Day-Wise</div>
                  <div className="text-xs text-slate-500 font-medium">Itinerary Builder</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">Instant</div>
                  <div className="text-xs text-slate-500 font-medium">Expense Splits</div>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-950/10 border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&auto=format&fit=crop&q=80"
                    alt="Traveler enjoying mountain landscape"
                    className="w-full h-[440px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>

                  {/* Floating Activity Card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                          Day 1
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">Eiffel Tower &amp; Seine Cruise</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-600" /> Paris, France • 17:30 PM
                          </div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg">
                        $45.00
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
              Inspiration for your next adventure
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Top Trending Destinations
            </h2>
          </div>
          <Link
            to="/destinations"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDestinations.length > 0 ? (
            popularDestinations.map((dest) => (
              <Link
                key={dest.id}
                to={`/destinations/${dest.id}`}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-slate-800 shadow-sm">
                    {dest.category}
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-xs font-bold text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{dest.rating}</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-600" /> {dest.country}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                      {dest.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Avg Daily</span>
                    <span className="font-bold text-emerald-600 text-sm">
                      ${dest.avgDailyBudget}/day
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400 text-sm">
              Loading destinations...
            </div>
          )}
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Why Travelers Choose TripNest
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Everything you need for seamless journeys
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              No more messy spreadsheets, scattered email confirmations, or awkward bill-splitting math.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/60 hover:border-emerald-500/40 transition group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Day-Wise Itinerary Creator</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Organize sightseeing, dining, flights, and activities with exact time slots, durations, location addresses, and notes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/60 hover:border-emerald-500/40 transition group">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Real-Time Budget Control</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Set category limits for hotel, food, and transport. Record expenses on the go with automated budget utilization alerts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/60 hover:border-emerald-500/40 transition group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Group Expense Splitting</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Invite friends via email, plan together, and let TripNest calculate exact settlement transfers so nobody overpays.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/60 hover:border-emerald-500/40 transition group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <CloudSun className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Live Weather &amp; Coordinates</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Integrated OpenWeather forecasts and interactive location maps for all your scheduled stops and destinations.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/60 hover:border-emerald-500/40 transition group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Document Vault</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Store boarding passes, hotel confirmation PDFs, visa copies, and travel photos safely in one shared trip repository.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/60 hover:border-emerald-500/40 transition group">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Enterprise-Grade Security</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                State-of-the-art JWT authentication, BCrypt password hashing, and role-based permissions protecting your plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 sm:p-14 text-white text-center shadow-xl shadow-emerald-600/15">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Ready to organize your next journey?
          </h2>
          <p className="text-emerald-50 text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Join thousands of travelers planning smarter, stress-free trips worldwide.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition duration-200"
          >
            <span>Create Your Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
