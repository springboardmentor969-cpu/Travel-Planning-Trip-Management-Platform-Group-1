import {
    FaBars,
    FaBell,
    FaMoon,
    FaSun,
    FaUserCircle,
    FaCog,
    FaSignOutAlt
} from "react-icons/fa";

import { useEffect, useState } from "react";

import "../styles/header.css";

function Header({ setIsOpen }) {

    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const user = {
    username: "Traveler",
    role: "Traveler"
};

const logout = () => {
    console.log("Logout clicked");
};
    useEffect(() => {

        const savedTheme = localStorage.getItem("theme") || "light";

        setDarkMode(savedTheme === "dark");

        document.documentElement.setAttribute(
            "data-theme",
            savedTheme
        );

    }, []);

    const toggleTheme = () => {

        const newTheme = darkMode ? "light" : "dark";

        setDarkMode(!darkMode);

        document.documentElement.setAttribute(
            "data-theme",
            newTheme
        );

        localStorage.setItem(
            "theme",
            newTheme
        );

    };

    return (

        <header className="header">

            <div className="header-left">

                <button
                    className="menu-btn"
                    onClick={() => setIsOpen(true)}
                >
                    <FaBars />
                </button>

                <div>

                    <h2>
                        Welcome Back 👋
                    </h2>

                    <p>
                        Manage all your travel plans from one place.
                    </p>

                </div>

            </div>

            <div className="header-right">

                <button
                    className="icon-btn"
                    onClick={toggleTheme}
                    title="Toggle Theme"
                >

                    {
                        darkMode
                            ? <FaSun />
                            : <FaMoon />
                    }

                </button>

                <button className="icon-btn">

                    <FaBell />

                </button>

                <div className="profile">

    <FaUserCircle
        className="avatar"
        onClick={() => setShowProfileMenu(!showProfileMenu)}
    />

    {showProfileMenu && (

        <div className="profile-menu">

            <div className="profile-info">

                <FaUserCircle className="menu-avatar"/>

                <div>

                    <h4>Traveler</h4>

                    <small>Traveler</small>

                </div>

            </div>

            <hr/>

            <p>
                <FaCog />
                <span>Settings</span>
            </p>

            <p className="logout-option">
                <FaSignOutAlt />
                <span>Logout</span>
            </p>

        </div>

    )}

</div>
            </div>

        </header>

    );

}

export default Header;