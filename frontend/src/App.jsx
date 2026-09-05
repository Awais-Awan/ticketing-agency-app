import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Suppliers from "./pages/Suppliers";
import BookingForm from "./pages/BookingForm";
import BookingsList from "./pages/BookingsList";
import BookingDetail from "./pages/BookingDetail";
import CustomersList from "./pages/CustomersList";
import CustomerLedger from "./pages/CustomerLedger";
import SupplierDetail from "./pages/SupplierDetail";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";




function BookingsPlaceholder() {
  return <div>Bookings page placeholder - logged in!</div>;
}

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" />;
  }
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <BookingsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings/new"
        element={ 
          <ProtectedRoute>
            <BookingForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings/:id"
        element={
          <ProtectedRoute>
            <BookingDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/suppliers"
        element={
          <ProtectedRoute>
            <Suppliers />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/customers" 
        element={
          <ProtectedRoute>
            <CustomersList />
          </ProtectedRoute>} />

      <Route 
        path="/customers/:id" 
        element={
          <ProtectedRoute>
            <CustomerLedger />
          </ProtectedRoute>} />

      <Route 
        path="/suppliers/:id" 
        element={
          <ProtectedRoute>
            <SupplierDetail />
          </ProtectedRoute>} />

      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>} />

      <Route 
        path="/reports" 
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;