import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Masters from './pages/Masters';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Payments from './pages/Payments';
import Reviews from './pages/Reviews';
import Notifications from './pages/Notifications';
import MasterRegistration from './pages/MasterRegistration';
import MasterDetail from './pages/MasterDetail';
import Chat from './pages/Chat';
import CallCenter from './pages/CallCenter';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
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
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="masters" element={<Masters />} />
            <Route path="masters/new" element={<MasterRegistration />} />
            <Route path="masters/:id" element={<MasterDetail />} />
            <Route path="categories" element={<Categories />} />
            <Route path="orders" element={<Orders />} />
            <Route path="payments" element={<Payments />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="chat" element={<Chat />} />
            <Route path="call-center" element={<CallCenter />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
