import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/navbar.css";

function Navbar() {

    const [navbarState, setNavbarState] = useState("top");

    useEffect(() => {

        const handleScroll = () => {

            const scroll = window.scrollY;
            const heroHeight = window.innerHeight - 100;

            if (scroll < 80) {

                setNavbarState("top");

            } else if (scroll < heroHeight) {

                setNavbarState("glass");

            } else {

                setNavbarState("solid");

            }

        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);

    }, []);

    return (

        <nav className={`navbar ${navbarState}`}>

            <div className="logo">

                <Link to="/">
                    Trip<span>Nest</span>
                </Link>

            </div>

            <ul className="nav-links">

    <li>
        <a href="#home">Home</a>
    </li>

    <li>
        <a href="#destinations">Destinations</a>
    </li>

    <li>
        <a href="#packages">Packages</a>
    </li>

    <li>
        <a href="#features">Why TripNest</a>
    </li>

    <li>
        <a href="#testimonials">Reviews</a>
    </li>

    <li>
        <a href="#contact">Contact</a>
    </li>

</ul>

            <div className="nav-buttons">

                <Link to="/login" className="login-btn-nav">
                    Login
                </Link>

                <Link to="/register" className="register-btn-nav">
                    Register
                </Link>

            </div>

        </nav>

    );

}

export default Navbar;