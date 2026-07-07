import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout.jsx';
import Budget from './pages/Budget.jsx';
import CreateTrip from './pages/CreateTrip.jsx';
import Dashboard from './pages/Dashboard.jsx';
import EditTrip from './pages/EditTrip.jsx';
import Expenses from './pages/Expenses.jsx';
import NotFound from './pages/NotFound.jsx';
import TripDetails from './pages/TripDetails.jsx';
import Trips from './pages/Trips.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/trips/new" element={<CreateTrip />} />
          <Route path="/trips/:id" element={<TripDetails />} />
          <Route path="/trips/:id/edit" element={<EditTrip />} />
          <Route path="/trips/:id/budget" element={<Budget />} />
          <Route path="/trips/:id/expenses" element={<Expenses />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
