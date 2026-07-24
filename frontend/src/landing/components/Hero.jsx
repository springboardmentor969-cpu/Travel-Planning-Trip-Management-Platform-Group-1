import { Link } from "react-router-dom";
import "../../landing/styles/hero.css";
import travelVideo from "../../assets/videos/travel.mp4";

function Hero() {

    return (

        <section className="hero" id="home">

            <video
                autoPlay
                muted
                loop
                playsInline
                className="hero-video"
            >
                <source src={travelVideo} type="video/mp4" />
            </video>

            <div className="hero-overlay"></div>

            <div className="hero-content">

                <h1>
                    Explore the World with
                    <span> TripNest</span>
                </h1>

                <p>

                    Plan smarter, discover hidden gems,
                    and create unforgettable travel memories.

                </p>

                <div className="hero-buttons">

                    <Link
                        to="/register"
                        className="hero-primary-btn"
                    >
                        Start Planning
                    </Link>

                    <Link
                        to="/packages"
                        className="hero-secondary-btn"
                    >
                        Explore Packages
                    </Link>

                </div>

                <div className="hero-search">

                    <input
                        type="text"
                        placeholder="Search destinations..."
                    />

                    <button>

                        Search

                    </button>

                </div>

            </div>

            <div className="scroll-indicator">

                ↓ Scroll

            </div>

        </section>

    );

}

export default Hero;