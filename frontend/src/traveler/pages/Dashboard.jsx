import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import HeroBanner from "../components/HeroBanner";
import StatsCards from "../components/StatsCards";
import TripToolbar from "../components/TripToolbar";
import TripGrid from "../components/TripGrid";
import QuickActions from "../components/QuickActions";

import CreateTripModal from "../components/CreateTripModal";
import ViewTripModal from "../components/ViewTripModal";
import EditTripModal from "../components/EditTripModal";
import ShareTrip from "../components/ShareTrip";
import TimelineTrip from "../components/TimelineTrip";

import {
    getTrips,
    deleteTrip
} from "../services/tripService";

import "../styles/dashboard.css";

function Dashboard() {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [openModal, setOpenModal] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openShare, setOpenShare] = useState(false);
    const [openTimeline, setOpenTimeline] = useState(false);

    const [selectedTrip, setSelectedTrip] = useState(null);

    const [trips, setTrips] = useState([]);

    // Search / Filter / Sort

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("All");

    const [sort, setSort] = useState("latest");
    const [favorites, setFavorites] = useState([]);
const [selectedDestination, setSelectedDestination] = useState("");

    // =========================
    // Load Trips
    // =========================

    const loadTrips = async () => {

        try {

            const response = await getTrips();

            setTrips(response.data);

        }

        catch (error) {

            console.error(error);

        }

    };

    // =========================
    // Delete Trip
    // =========================

    const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this trip?"
    );

    if (!confirmDelete) return;

    try {

        await deleteTrip(id);

        await loadTrips();

    } catch (error) {

        console.error(error);

    }

};

const toggleFavorite = (trip) => {

    const exists = favorites.find(t => t.id === trip.id);

    if (exists) {

        setFavorites(favorites.filter(t => t.id !== trip.id));

    } else {

        setFavorites([...favorites, trip]);

    }

};

const isFavorite = (id) => {

    return favorites.some(t => t.id === id);

};

// =========================
// Hero Banner Actions
// =========================

const handleHeroPlanTrip = (destination) => {

    setSelectedDestination(destination);

    setOpenModal(true);

};

const handleHeroExplore = (destination) => {

    const query = encodeURIComponent(
        `Best tourist places in ${destination}`
    );

    window.open(
        `https://www.google.com/search?q=${query}`,
        "_blank"
    );

};
    useEffect(() => {

        loadTrips();

    }, []);

    // =========================
    // Search + Filter + Sort
    // =========================

    const filteredTrips = [...trips]

        .filter((trip) => {

            const matchesSearch =

                trip.tripName
                    .toLowerCase()
                    .includes(search.toLowerCase())

                ||

                trip.destination
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStatus =

                status === "All"

                ||

                trip.status === status;

            return matchesSearch && matchesStatus;

        })

        .sort((a, b) => {

            if (sort === "budget") {

                return b.budget - a.budget;

            }

            if (sort === "destination") {

                return a.destination.localeCompare(
                    b.destination
                );

            }

            return new Date(b.startDate) -
                new Date(a.startDate);

        });

    return (

        <div className="dashboard">

            <Sidebar

                isOpen={sidebarOpen}

                setIsOpen={setSidebarOpen}

            />

            <div className="main-content">

                <Header

                    setIsOpen={setSidebarOpen}

                />

                <HeroBanner
    onPlanTrip={handleHeroPlanTrip}
    onExplore={handleHeroExplore}
/>

                <StatsCards

                    trips={trips}

                />

                <QuickActions
    onCreateTrip={() => setOpenModal(true)}
    favorites={favorites}
/>

                <TripToolbar

                    onCreateTrip={() =>
                        setOpenModal(true)
                    }

                    search={search}

                    setSearch={setSearch}

                    status={status}

                    setStatus={setStatus}

                    sort={sort}

                    setSort={setSort}

                />

               <TripGrid
    trips={filteredTrips}

    favorites={favorites}

    toggleFavorite={toggleFavorite}

    isFavorite={isFavorite}

    onView={(trip)=>{
        setSelectedTrip(trip);
        setOpenView(true);
    }}

    onEdit={(trip)=>{
        setSelectedTrip(trip);
        setOpenEdit(true);
    }}

    onShare={(trip)=>{
        setSelectedTrip(trip);
        setOpenShare(true);
    }}

    onTimeline={(trip)=>{
        setSelectedTrip(trip);
        setOpenTimeline(true);
    }}

    onDelete={handleDelete}
/>

            </div>

            <CreateTripModal
    open={openModal}
    onClose={() => {
        setOpenModal(false);
        setSelectedDestination("");
    }}
    reloadTrips={loadTrips}
    selectedDestination={selectedDestination}
/>

            <ViewTripModal

                open={openView}

                trip={selectedTrip}

                onClose={() =>
                    setOpenView(false)
                }

            />

            <EditTripModal

                open={openEdit}

                trip={selectedTrip}

                onClose={() =>
                    setOpenEdit(false)
                }

                reloadTrips={loadTrips}

            />

            <ShareTrip

                open={openShare}

                trip={selectedTrip}

                onClose={() =>
                    setOpenShare(false)
                }

            />

            <TimelineTrip

                open={openTimeline}

                trip={selectedTrip}

                onClose={() =>
                    setOpenTimeline(false)
                }

            />

        </div>

    );

}

export default Dashboard;