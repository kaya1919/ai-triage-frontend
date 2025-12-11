import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import BookingPageRoute from './pages/BookingPageRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/booking/:id" element={<BookingPageRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
