import "../styles/packages.css";

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

const packages = [
    {
        id: 1,
        title: "Bali Escape",
        image: bali,
        days: "6 Days • 5 Nights",
        price: "₹45,999",
        rating: "4.9",
        discount: "20% OFF"
    },
    {
        id: 2,
        title: "Maldives Luxury",
        image: maldives,
        days: "5 Days • 4 Nights",
        price: "₹69,999",
        rating: "4.8",
        discount: "15% OFF"
    },
    {
        id: 3,
        title: "Swiss Alps Tour",
        image: switzerland,
        days: "7 Days • 6 Nights",
        price: "₹1,25,999",
        rating: "5.0",
        discount: "10% OFF"
    },
    {
        id: 4,
        title: "Dubai Adventure",
        image: dubai,
        days: "4 Days • 3 Nights",
        price: "₹55,999",
        rating: "4.8",
        discount: "18% OFF"
    },
    {
        id: 5,
        title: "Singapore Highlights",
        image: singapore,
        days: "5 Days • 4 Nights",
        price: "₹62,999",
        rating: "4.9",
        discount: "12% OFF"
    },
    {
        id: 6,
        title: "Munnar Retreat",
        image: munnar,
        days: "3 Days • 2 Nights",
        price: "₹18,999",
        rating: "4.9",
        discount: "25% OFF"
    },
    {
        id: 7,
        title: "Paris Romance",
        image: paris,
        days: "6 Days • 5 Nights",
        price: "₹1,05,999",
        rating: "4.9",
        discount: "14% OFF"
    },
    {
        id: 8,
        title: "Ireland Explorer",
        image: ireland,
        days: "7 Days • 6 Nights",
        price: "₹98,999",
        rating: "4.8",
        discount: "16% OFF"
    },
    {
        id: 9,
        title: "Germany Discovery",
        image: germany,
        days: "6 Days • 5 Nights",
        price: "₹92,999",
        rating: "4.8",
        discount: "11% OFF"
    },
    {
        id: 10,
        title: "Belgium Delights",
        image: belgium,
        days: "5 Days • 4 Nights",
        price: "₹88,999",
        rating: "4.7",
        discount: "13% OFF"
    },
    {
        id: 11,
        title: "Kerala Backwaters",
        image: kerala,
        days: "4 Days • 3 Nights",
        price: "₹22,999",
        rating: "4.9",
        discount: "22% OFF"
    },
    {
        id: 12,
        title: "Malaysia Adventure",
        image: malaysia,
        days: "5 Days • 4 Nights",
        price: "₹58,999",
        rating: "4.8",
        discount: "17% OFF"
    }
];

function FeaturedPackages() {

    return (

        <section className="featured-packages" id="packages">

            <div className="section-title">

                <h2>Featured Holiday Packages</h2>

                <p>
                    Handpicked travel experiences crafted for unforgettable memories.
                </p>

            </div>

            <div className="packages-grid">

                {packages.map((pkg) => (

                    <div
                        className="package-card"
                        key={pkg.id}
                    >

                        <div className="package-image-container">

                            <img
                                src={pkg.image}
                                alt={pkg.title}
                            />

                            <span className="discount-badge">
                                {pkg.discount}
                            </span>

                        </div>

                        <div className="package-content">

                            <div className="package-top">

                                <h3>{pkg.title}</h3>

                                <span className="rating">
                                    ⭐ {pkg.rating}
                                </span>

                            </div>

                            <p className="duration">
                                {pkg.days}
                            </p>

                            <ul className="package-features">

                                <li>✔ Flight Included</li>
                                <li>✔ Hotel Included</li>
                                <li>✔ Breakfast</li>
                                <li>✔ Local Guide</li>

                            </ul>

                            <div className="package-bottom">

                                <h4>{pkg.price}</h4>

                                <div className="package-buttons">

                                    <button className="details-btn">
                                        Details
                                    </button>

                                    <button className="book-btn">
                                        Book Now
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </section>

    );

}

export default FeaturedPackages;