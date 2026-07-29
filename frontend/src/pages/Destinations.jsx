import { useNavigate } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";

// STEP 1: Import images from assets
import goaImg from "../assets/goa2.jpg";
import keralaImg from "../assets/kerala.jpg";
import manaliImg from "../assets/manali1.jpg";
import rajasthanImg from "../assets/rajasthan.jpg";
import himachalImg from "../assets/himachal.jpg";
import kolkataImg from "../assets/kolkata.jpg";

const DESTINATIONS = [
  { id: 1, name: "Goa", image: goaImg, tag: "Beaches" },
  { id: 2, name: "Kerala", image: keralaImg, tag: "Backwaters" },
  { id: 3, name: "Manali", image: manaliImg, tag: "Mountains" },
  { id: 4, name: "Rajasthan", image: rajasthanImg, tag: "Heritage" },
  { id: 5, name: "Himachal", image: himachalImg, tag: "Adventure" },
  { id: 6, name: "Kolkata", image: kolkataImg, tag: "Culture" },
];

export default function Destinations() {
  const navigate = useNavigate();

  const handleSelect = (destination) => {
    navigate(`/trips/new?destination=${destination.name}`)
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-heading text-4xl font-bold text-white tracking-tight">
          Explore <span className="bg-logo-gradient bg-clip-text text-transparent">Destinations</span>
        </h1>
        <p className="font-sans text-white/60">Pick a place and start planning your next trip</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {DESTINATIONS.map(dest => (
          <div
            key={dest.id}
            onClick={() => handleSelect(dest)}
            className="group cursor-pointer rounded-2xl overflow-hidden bg-white/5 backdrop-blur border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-active-glow hover:border-amber-500/30 transition-all duration-300"
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              <span className="absolute top-3 left-3 bg-white/10 backdrop-blur border-white/20 px-3 py-1 rounded-full text-[11px] font-semibold text-white uppercase tracking-wide">
                {dest.tag}
              </span>
            </div>
            
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-amber-400" />
                    {dest.name}
                  </h3>
                </div>
                <button className="flex items-center gap-1 text-amber-400 text-sm font-semibold group-hover:gap-2 transition-all">
                  Plan Trip <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}