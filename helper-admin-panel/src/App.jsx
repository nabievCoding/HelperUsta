import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { translations, defaultLanguage } from './locales';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Masters from './pages/Masters';
import MasterProfile from './pages/MasterProfile';
import Orders from './pages/Orders';
import Categories from './pages/Categories';
import Payments from './pages/Payments';
import Reviews from './pages/Reviews';
import Notifications from './pages/Notifications';
import CallCenter from './pages/CallCenter';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <LanguageProvider translations={translations} defaultLanguage={defaultLanguage}>
      <Router>
        <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="masters" element={<Masters />} />
          <Route path="masters/:id" element={<MasterProfile />} />
          <Route path="orders" element={<Orders />} />
          <Route path="categories" element={<Categories />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="call-center" element={<CallCenter />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
    </LanguageProvider>
  );
}

export default App;
