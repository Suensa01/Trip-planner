import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Destinations from './Pages/Destinations/Destinations';
import Holidays from './Pages/Holidays/Holidays';
import CityBreaks from './Pages/CityBreaks/CityBreaks';
import Login from './Pages/Login/Login';
import Planner from './Pages/Planner/Planner';
import Explore from './Pages/Explore/Explore';
import BookingPage from './Pages/Booking/BookingPage';
import ToolsPage from './Pages/Tools/ToolsPage';
import ProfilePage from './Pages/Profile/ProfilePage';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import ProtectedRoute from './Components/Common/ProtectedRoute';
import AdminRoute from './Components/Common/AdminRoute';
import NavigationBar from './Components/NavigationBar/NavigationBar';
import Footer from './Components/Footer/Footer';

function App() {
  return (
    <div className="App">
      <NavigationBar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/planner' element={<ProtectedRoute><Planner /></ProtectedRoute>} />
        <Route path='/explore' element={<Explore />} />
        <Route path='/booking' element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
        <Route path='/tools' element={<ProtectedRoute><ToolsPage /></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path='/admin' element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path='/city-breaks' element={<CityBreaks />} />
        <Route path='/holidays' element={<Holidays />} />
        <Route path='/destinations' element={<Destinations />} />
        <Route path='/login' element={<Login />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
