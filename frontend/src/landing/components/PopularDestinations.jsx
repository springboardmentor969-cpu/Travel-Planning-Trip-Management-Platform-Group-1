import "../styles/destinations.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";


import bali from "../../assets/images/destinations/bali.jpeg";
import maldives from "../../assets/images/destinations/maldives.jpeg";
import kerala from "../../assets/images/destinations/kerala.jpeg";
import switzerland from "../../assets/images/destinations/switzerland.jpeg";
import dubai from "../../assets/images/destinations/dubai.jpeg";
import paris from "../../assets/images/destinations/paris.jpeg";
import belgium from "../../assets/images/destinations/belgium.jpeg";
import germany from "../../assets/images/destinations/germany.jpeg";
import ireland from "../../assets/images/destinations/ireland.jpeg";
import malaysia from "../../assets/images/destinations/malaysia.jpeg";
import munnar from "../../assets/images/destinations/munnar.jpeg";
import singapore from "../../assets/images/destinations/singapore.jpeg";

const destinations = [
  {
    name: "Bali",
    image: bali,
    rating: "4.9",
    description: "Tropical Paradise"
  },
  {
    name: "Maldives",
    image: maldives,
    rating: "4.8",
    description: "Crystal Clear Beaches"
  },
  {
    name: "Kerala",
    image: kerala,
    rating: "4.9",
    description: "God's Own Country"
  },
  {
    name: "Switzerland",
    image: switzerland,
    rating: "5.0",
    description: "Snowy Alps"
  },
  {
    name: "Dubai",
    image: dubai,
    rating: "4.8",
    description: "Luxury & Adventure"
  },
  {
    name: "Paris",
    image: paris,
    rating: "4.9",
    description: "City of Love"
  },
  {
    name: "Belgium",
    image: belgium,
    rating: "4.8",
    description: "Historic Beauty"
  },
  {
    name: "Germany",
    image: germany,
    rating: "4.8",
    description: "Castles & Culture"
  },
  {
    name: "Ireland",
    image: ireland,
    rating: "4.9",
    description: "Emerald Isle"
  },
  {
    name: "Malaysia",
    image: malaysia,
    rating: "4.8",
    description: "Nature & Modern Life"
  },
  {
    name: "Munnar",
    image: munnar,
    rating: "4.9",
    description: "Tea Gardens"
  },
  {
    name: "Singapore",
    image: singapore,
    rating: "4.9",
    description: "City of the Future"
  }
];

function PopularDestinations() {
  return (
    <section className="popular-destinations" id="destinations">

      <div className="section-title">
        <h2>Popular Destinations</h2>
        <p>Explore the world's most loved travel destinations.</p>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{
          delay: 3000,
          disableOnInteraction: false
        }}
        loop={true}
        spaceBetween={30}
        breakpoints={{
          320: {
            slidesPerView: 1
          },
          768: {
            slidesPerView: 2
          },
          1024: {
            slidesPerView: 3
          },
          1400: {
            slidesPerView: 4
          }
        }}
      >
        {destinations.map((place, index) => (
          <SwiperSlide key={index}>
            <div className="destination-card">

              <img src={place.image} alt={place.name} />

              <div className="destination-info">

                <h3>{place.name}</h3>

                <p>{place.description}</p>

                <div className="card-bottom">

                  <span>⭐ {place.rating}</span>

                  <button>Explore</button>

                </div>

              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>

    </section>
  );
}

export default PopularDestinations;