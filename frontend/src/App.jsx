import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Suppliers from "./pages/Suppliers";
import BookingForm from "./pages/BookingForm";
import BookingsList from "./pages/BookingsList";


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
        path="/suppliers"
        element={
          <ProtectedRoute>
            <Suppliers />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/bookings" />} />
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