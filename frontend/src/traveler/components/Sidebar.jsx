import {
    FaTimes,
    FaHome,
    FaSuitcase,
    FaPlusCircle,
    FaHeart,
    
} from "react-icons/fa";

import "../styles/sidebar.css";

function Sidebar({ isOpen, setIsOpen }) {

    return (

        <>

            {isOpen && (

                <div
                    className="overlay"
                    onClick={() => setIsOpen(false)}
                />

            )}

            <div className={`sidebar ${isOpen ? "show" : ""}`}>

                <div className="sidebar-top">

                    <h2>TripNest</h2>

                    <FaTimes
                        className="close-btn"
                        onClick={() => setIsOpen(false)}
                    />

                </div>

                <nav>

                    <a href="#">
                        <FaHome />
                        Dashboard
                    </a>

                    <a href="#">
                        <FaSuitcase />
                        My Trips
                    </a>

                    <a href="#">
                        <FaPlusCircle />
                        Create Trip
                    </a>

                    <a href="#">
                        <FaHeart />
                        Favorites
                    </a>


                </nav>

            </div>

        </>

    );

}

export default Sidebar;
