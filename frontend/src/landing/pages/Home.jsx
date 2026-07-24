import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import PopularDestinations from "../components/PopularDestinations";
import FeaturedPackages from "../components/FeaturedPackages";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <div className="landing-content">
        <Hero />
        <PopularDestinations />
        <FeaturedPackages />
        <Features />
        <Testimonials />
        <Newsletter />
        <Footer />
      </div>
    </>
  );
}

export default Home;