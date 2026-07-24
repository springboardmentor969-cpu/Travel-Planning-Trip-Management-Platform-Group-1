import {
  FaRoute,
  FaMoneyBillWave,
  FaGlobeAsia,
  FaShieldAlt,
  FaCalendarCheck,
  FaHeadset,
} from "react-icons/fa";

import "../styles/features.css";
import statsBg from "../../assets/images/stats-bg.png";

function Features() {
  const features = [
    {
      icon: <FaRoute />,
      title: "Smart Trip Planning",
      description:
        "Create personalized itineraries with AI-powered recommendations.",
    },
    {
      icon: <FaMoneyBillWave />,
      title: "Best Price Guarantee",
      description:
        "Affordable travel packages with transparent pricing and no hidden charges.",
    },
    {
      icon: <FaGlobeAsia />,
      title: "150+ Destinations",
      description:
        "Explore beautiful domestic and international destinations worldwide.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Safe & Secure",
      description:
        "Secure payments, verified organizers, and trusted travel partners.",
    },
    {
      icon: <FaCalendarCheck />,
      title: "Easy Booking",
      description:
        "Book your entire trip in just a few clicks with instant confirmation.",
    },
    {
      icon: <FaHeadset />,
      title: "24/7 Support",
      description:
        "Dedicated travel experts available whenever you need assistance.",
    },
  ];

  const stats = [
    {
      number: "12K+",
      title: "Happy Travelers",
    },
    {
      number: "150+",
      title: "Destinations",
    },
    {
      number: "500+",
      title: "Tour Packages",
    },
    {
      number: "4.9★",
      title: "Average Rating",
    },
  ];

  return (
   <section className="features-section" id="features">

      <div className="section-title">

        <h2>Why Choose TripNest?</h2>

        <p>
          Everything you need for a memorable travel experience in one place.
        </p>

      </div>

      <div className="features-grid">

        {features.map((feature, index) => (

          <div className="feature-card" key={index}>

            <div className="feature-icon">
              {feature.icon}
            </div>

            <h3>{feature.title}</h3>

            <p>{feature.description}</p>

          </div>

        ))}

      </div>

      <div
    className="stats-banner"
    style={{ backgroundImage: `url(${statsBg})` }}
>

    <div className="stats-overlay">

        <h2>Explore Without Limits</h2>

        <p>
            Trusted by thousands of travelers creating unforgettable memories around the world.
        </p>

        <div className="stats-row">

            <div className="stat-item">

                <span>👥</span>

                <h3>15K+</h3>

                <p>Happy Travelers</p>

            </div>

            <div className="stat-item">

                <span>✈</span>

                <h3>500+</h3>

                <p>Tour Packages</p>

            </div>

            <div className="stat-item">

                <span>🌍</span>

                <h3>120+</h3>

                <p>Destinations</p>

            </div>

            <div className="stat-item">

                <span>⭐</span>

                <h3>4.9</h3>

                <p>Average Rating</p>

            </div>

        </div>

    </div>

</div>

    </section>
  );
}

export default Features;