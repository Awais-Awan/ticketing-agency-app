import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import BookingsList from "./pages/BookingsList";
import BookingForm from "./pages/BookingForm";
import BookingDetail from "./pages/BookingDetail";
import Suppliers from "./pages/Suppliers";
import SupplierDetail from "./pages/SupplierDetail";
import CustomersList from "./pages/CustomersList";
import CustomerLedger from "./pages/CustomerLedger";
import Reports from "./pages/Reports";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bookings" element={<BookingsList />} />
        <Route path="/bookings/new" element={<BookingForm />} />
        <Route path="/bookings/:id" element={<BookingDetail />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/suppliers/:id" element={<SupplierDetail />} />
        <Route path="/customers" element={<CustomersList />} />
        <Route path="/customers/:id" element={<CustomerLedger />} />
        <Route path="/reports" element={<Reports />} />
      </Route>

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