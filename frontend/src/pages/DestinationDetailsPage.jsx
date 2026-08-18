import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Star,
  Calendar,
  DollarSign,
  CloudSun,
  Compass,
  ArrowLeft,
  PlusCircle,
  CheckCircle2,
  Wind,
  Droplets,
  ExternalLink
} from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const DestinationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(null);
  const [weather, setWeather] = useState(null);
  const [mapConfig, setMapConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destRes, weatherRes, mapRes] = await Promise.all([
          api.get(`/destinations/${id}`),
          api.get(`/destinations/${id}/weather`),
          api.get(`/destinations/${id}/map`)
        ]);

        if (destRes.data?.data) setDestination(destRes.data.data);
        if (weatherRes.data?.data) setWeather(weatherRes.data.data);
        if (mapRes.data?.data) setMapConfig(mapRes.data.data);
      } catch (err) {
        console.error('Failed to load destination details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading travel guide &amp; forecast..." />;
  }

  if (!destination) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Destination Not Found</h2>
        <Link to="/destinations" className="text-emerald-600 font-semibold text-sm">
          &larr; Back to all destinations
        </Link>
      </div>
    );
  }

  const attractions = destination.topAttractions
    ? destination.topAttractions.split(',').map((a) => a.trim())
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <div>
        <Link
          to="/destinations"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Destinations
        </Link>
      </div>

      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl h-80 sm:h-96">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

        <div className="absolute top-6 left-6 flex items-center gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-slate-900 shadow-sm">
            {destination.category}
          </span>
          <span className="flex items-center gap-1 px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-full text-xs font-bold text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            {destination.rating} / 5.0
          </span>
        </div>

        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold">
              <MapPin className="w-4 h-4 text-emerald-400" />
              {destination.city ? `${destination.city}, ` : ''}{destination.country}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              {destination.name}
            </h1>
          </div>

          <Link
            to={`/trips/new?destination=${encodeURIComponent(destination.name + ', ' + destination.country)}`}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold px-6 py-3 rounded-2xl shadow-lg transition hover:scale-105"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Plan Trip to {destination.name}</span>
          </Link>
        </div>
      </div>

      {/* Main Details & Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Travel Guide & Top Attractions */}
        <div className="lg:col-span-8 space-y-8">
          {/* Overview */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900">About {destination.name}</h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {destination.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Best Season</span>
                <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  {destination.bestTimeToVisit}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Daily Budget</span>
                <div className="font-bold text-emerald-600 text-sm flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  ${destination.avgDailyBudget} / day
                </div>
              </div>

              <div className="space-y-1 col-span-2 sm:col-span-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Coordinates</span>
                <div className="font-mono text-slate-700 text-xs">
                  {destination.latitude?.toFixed(4)}, {destination.longitude?.toFixed(4)}
                </div>
              </div>
            </div>
          </div>

          {/* Top Attractions Checklist */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-600" />
              <span>Must-Visit Sights &amp; Attractions</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {attractions.map((attraction, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-800"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{attraction}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive OpenStreetMap embed */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span>Location &amp; Surrounding Area</span>
            </h2>
            <div className="w-full h-72 rounded-2xl overflow-hidden border border-slate-200">
              <iframe
                title="Destination Location Map"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${(destination.longitude || 2.35) - 0.08}%2C${(destination.latitude || 48.85) - 0.08}%2C${(destination.longitude || 2.35) + 0.08}%2C${(destination.latitude || 48.85) + 0.08}&layer=mapnik&marker=${destination.latitude || 48.85}%2C${destination.longitude || 2.35}`}
              />
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Live Weather Widget & Action Hub */}
        <div className="lg:col-span-4 space-y-6">
          {/* Weather Widget */}
          {weather && (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                    {weather.isLive ? 'Live Weather' : 'Typical Weather Forecast'}
                  </span>
                  <h3 className="text-lg font-bold text-white">{weather.city}</h3>
                </div>
                <CloudSun className="w-8 h-8 text-amber-400" />
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black">{Math.round(weather.temp)}°C</span>
                <span className="text-sm text-slate-300 capitalize">{weather.condition}</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{weather.description}</p>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700/60 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <span>Humidity: {weather.humidity}%</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Wind className="w-4 h-4 text-emerald-400" />
                  <span>Wind: {weather.windSpeed} km/h</span>
                </div>
              </div>

              {/* 5-Day Forecast */}
              {weather.forecast && (
                <div className="space-y-2 pt-3 border-t border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400">5-Day Outlook</span>
                  <div className="space-y-1.5">
                    {weather.forecast.map((day, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1">
                        <span className="font-semibold text-slate-300 w-12">{day.dayOfWeek}</span>
                        <span className="text-slate-400 text-[11px] truncate flex-1 text-center">{day.condition}</span>
                        <span className="font-bold text-white">{day.highTemp}° / {day.lowTemp}°</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Itinerary Planner CTA */}
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-emerald-950">
              Ready to visit {destination.name}?
            </h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Create a customized trip to schedule sightseeing at {attractions[0] || destination.name}, allocate your daily budget, and invite your companions.
            </p>
            <Link
              to={`/trips/new?destination=${encodeURIComponent(destination.name + ', ' + destination.country)}`}
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl text-xs shadow transition"
            >
              <PlusCircle className="w-4 h-4" /> Start Custom Itinerary
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetailsPage;
