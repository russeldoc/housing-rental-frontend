import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import About from "./pages/About";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

import UserDashboard from "./pages/dashboard/UserDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

import RentalRequest from "./pages/user/RentalRequest";
import MyRequests from "./pages/user/MyRequests";
import RentalRequests from "./pages/admin/RentalRequests";

import ManageProperties from "./pages/admin/ManageProperties";
import AddProperty from "./pages/admin/AddProperty";
import EditProperty from "./pages/admin/EditProperty";

function App() {
  return (
    <div className="min-h-screen flex flex-col">

      <Navbar />

      <main className="flex-1">
        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/properties" element={<Properties />} />

          <Route
            path="/properties/:id"
            element={<PropertyDetails />}
          />

          <Route path="/about" element={<About />} />

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/properties/:id/request"
            element={
              <ProtectedRoute>
                <RentalRequest />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-requests"
            element={
              <ProtectedRoute>
                <MyRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/requests"
            element={
              <AdminRoute>
                <RentalRequests />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/properties"
            element={
              <AdminRoute>
                <ManageProperties />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/properties/add"
            element={
              <AdminRoute>
                <AddProperty />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/properties/edit/:id"
            element={
              <AdminRoute>
                <EditProperty />
              </AdminRoute>
            }
          />

        </Routes>
      </main>

      <Footer />

    </div>
  );
}

export default App;