// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";


import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import TriagePage from "./pages/TriagePage";
import DoctorsBySpecialtyPage from "./pages/DoctorsBySpecialtyPage";
import SlotSelectionPage from "./pages/SlotSelectionPage";
import BookingPageRoute from "./pages/BookingPageRoute";
import BookingStatusPage from "./pages/BookingStatusPage";


function App() {
  return (
    <div className="site-root">
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/triage" element={<TriagePage />} />
          <Route path="/doctors" element={<DoctorsBySpecialtyPage />} />
          <Route path="/booking/:id" element={<BookingPageRoute />} />
          <Route path="/slots/:doctorId" element={<SlotSelectionPage />} />
            <Route path="/booking-status/:bookingId" element={<BookingStatusPage />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
