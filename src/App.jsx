import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import AppLayout from "./components/layout/AppLayout";
import { ROLES } from "./utils/roles";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OAuthCallback from "./pages/OAuthCallback";
import Unauthorized from "./pages/Unauthorized";

import Profile from "./pages/Profile";
import TravelHistory from "./pages/profile/TravelHistory";
import FavoriteDestinations from "./pages/profile/FavoriteDestinations";

import TripList from "./pages/trips/TripList";
import TripCreate from "./pages/trips/TripCreate";
import TripEdit from "./pages/trips/TripEdit";
import TripDetail from "./pages/trips/TripDetail";

import DestinationList from "./pages/destinations/DestinationList";
import DestinationDetail from "./pages/destinations/DestinationDetail";

import NotificationsPage from "./pages/notifications/NotificationsPage";

import Dashboard from "./pages/Dashboard";

function AdminDashboardPlaceholder() {
  return (
    <div className="p-10 text-center text-sm text-slate-500">
      Admin dashboard (Reports &amp; Analytics module)
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/oauth2/callback" element={<OAuthCallback />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/travel-history" element={<TravelHistory />} />
              <Route
                path="/profile/favorite-destinations"
                element={<FavoriteDestinations />}
              />

              <Route path="/trips" element={<TripList />} />
              <Route path="/trips/new" element={<TripCreate />} />
              <Route path="/trips/:tripId" element={<TripDetail />} />
              <Route path="/trips/:tripId/edit" element={<TripEdit />} />

              <Route path="/destinations" element={<DestinationList />} />
              <Route
                path="/destinations/:destinationId"
                element={<DestinationDetail />}
              />

              <Route path="/notifications" element={<NotificationsPage />} />

              <Route
                element={<RoleRoute allowedRoles={[ROLES.ADMINISTRATOR]} />}
              >
                <Route path="/admin" element={<AdminDashboardPlaceholder />} />
              </Route>
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}