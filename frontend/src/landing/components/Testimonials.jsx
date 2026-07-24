import "../styles/testimonials.css";

import person1 from "../../assets/images/testimonials/person1.jpg";
import person2 from "../../assets/images/testimonials/person2.jpg";
import person3 from "../../assets/images/testimonials/person3.jpg";
import person4 from "../../assets/images/testimonials/person4.jpg";
import person5 from "../../assets/images/testimonials/person5.jpg";
import person6 from "../../assets/images/testimonials/person6.jpg";
import person7 from "../../assets/images/testimonials/person7.jpg";
import person8 from "../../assets/images/testimonials/person8.jpg";

const testimonials = [
  {
    image: person1,
    name: "Rahul Sharma",
    city: "Bangalore",
    trip: "Switzerland",
    review:
      "The itinerary was perfectly organized. Hotels, transport and sightseeing were flawless.",
  },
  {
    image: person2,
    name: "Priya Nair",
    city: "Chennai",
    trip: "Bali",
    review:
      "Booking with TripNest was effortless. Every day felt perfectly planned.",
  },
  {
    image: person3,
    name: "Arjun Kumar",
    city: "Hyderabad",
    trip: "Singapore",
    review:
      "Our family vacation became completely stress free. Highly recommended!",
  },
  {
    image: person4,
    name: "Sneha Patel",
    city: "Mumbai",
    trip: "Malaysia",
    review:
      "Professional organizers, amazing hotels and quick customer support.",
  },
  {
    image: person5,
    name: "Karthik",
    city: "Coimbatore",
    trip: "Munnar",
    review:
      "Affordable package with a premium experience. Loved every moment.",
  },
  {
    image: person6,
    name: "Meera",
    city: "Kochi",
    trip: "Ireland",
    review:
      "Beautiful itinerary and wonderful stays. Everything exceeded expectations.",
  },
  {
    image: person7,
    name: "Daniel",
    city: "Delhi",
    trip: "Germany",
    review:
      "Excellent planning from beginning to end. Will definitely book again.",
  },
  {
    image: person8,
    name: "Sophia",
    city: "Pune",
    trip: "Belgium",
    review:
      "One of the best travel experiences I've had. Smooth, safe and memorable.",
  },
];

function Testimonials() {
  return (
   <section className="testimonials" id="testimonials">

      <div className="section-title">
        <h2>❤️ Loved by Thousands of Travelers</h2>
        <p>
          Real stories from travelers who explored the world with TripNest.
        </p>
      </div>

      <div className="testimonial-slider">

        <div className="testimonial-track">

          {[...testimonials, ...testimonials].map((item, index) => (

            <div className="testimonial-card" key={index}>

              <img src={item.image} alt={item.name} />

              <h3>{item.name}</h3>

              <span>{item.city}</span>

              <div className="stars">★★★★★</div>

              <p>{item.review}</p>

              <small>Visited {item.trip}</small>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Testimonials;