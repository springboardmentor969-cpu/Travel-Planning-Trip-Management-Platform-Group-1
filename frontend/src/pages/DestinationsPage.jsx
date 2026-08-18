import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, DollarSign, Sparkles, Filter, Compass, Globe2 } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = ['ALL', 'Cultural', 'Beach', 'Mountain', 'Historical', 'City', 'Adventure'];

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedCountry, setSelectedCountry] = useState('ALL');

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.query = searchQuery;
      if (selectedCategory !== 'ALL') params.category = selectedCategory;

      const res = await api.get('/destinations', { params });
      if (res.data?.data) {
        setDestinations(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDestinations();
  };

  // Extract unique countries
  const countries = useMemo(() => {
    const set = new Set();
    destinations.forEach((d) => {
      if (d.country) set.add(d.country);
    });
    return ['ALL', ...Array.from(set).sort()];
  }, [destinations]);

  // Client-side country filter if chosen
  const filteredDestinations = useMemo(() => {
    if (selectedCountry === 'ALL') return destinations;
    return destinations.filter((d) => d.country === selectedCountry);
  }, [destinations, selectedCountry]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Search Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <Globe2 className="w-3.5 h-3.5" /> Worldwide Travel Catalog
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Explore Global Wonders
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Discover {destinations.length}+ curated destinations across Europe, Asia, Americas, Africa, and Oceania with day guides and live weather insights.
        </p>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto pt-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by country, city, or landmark (e.g. Japan, Paris, Taj Mahal, Bali)..."
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition"
            >
              Search
            </button>
          </div>
        </form>

        {/* Filter Controls: Categories & Country Dropdown */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {/* Category Pills */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition duration-200 ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Country Selector Dropdown */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border border-slate-200 shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="text-xs font-bold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Countries ({countries.length - 1})</option>
              {countries
                .filter((c) => c !== 'ALL')
                .map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-b border-slate-100 pb-3">
        <span className="font-semibold">
          Showing <span className="font-bold text-slate-900">{filteredDestinations.length}</span> destinations
          {selectedCountry !== 'ALL' && ` in ${selectedCountry}`}
        </span>
        {(searchQuery || selectedCategory !== 'ALL' || selectedCountry !== 'ALL') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setSelectedCountry('ALL');
              fetchDestinations();
            }}
            className="text-emerald-600 font-bold hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Destinations Grid */}
      {loading ? (
        <LoadingSpinner text="Searching global destinations..." />
      ) : filteredDestinations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDestinations.map((dest) => (
            <Link
              key={dest.id}
              to={`/destinations/${dest.id}`}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col hover:-translate-y-1"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-slate-800 shadow-sm">
                  {dest.category}
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-[11px] font-bold text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{dest.rating}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {dest.city ? `${dest.city}, ` : ''}{dest.country}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                    {dest.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated Cost</span>
                    <span className="font-extrabold text-emerald-600 text-sm">
                      ${dest.avgDailyBudget} <span className="text-slate-400 text-xs font-normal">/ day</span>
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {dest.bestTimeToVisit}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-md mx-auto space-y-4">
          <Compass className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No destinations matched your criteria</h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search query or choosing "ALL" categories or countries.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setSelectedCountry('ALL');
              fetchDestinations();
            }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default DestinationsPage;
