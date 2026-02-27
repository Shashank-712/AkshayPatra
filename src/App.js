// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { FoodProvider } from './context/FoodContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DonorDashboard from './pages/donor/DonorDashboard';
import CreateFood from './pages/donor/CreateFood';
import NGODashboard from './pages/ngo/NGODashboard';
import BrowseFood from './pages/ngo/BrowseFood';

// Temporary Protected Route (no auth logic yet)
const ProtectedRoute = ({ children }) => {
  return children;
};

function App() {
  return (
    <AuthProvider>
      <FoodProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
            
            <Toaster position="top-right" />

            <Routes>

              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Donor routes */}
              <Route
                path="/donor/dashboard"
                element={
                  <ProtectedRoute>
                    <DonorDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/donor/create-food"
                element={
                  <ProtectedRoute>
                    <CreateFood />
                  </ProtectedRoute>
                }
              />

              {/* NGO routes */}
              <Route
                path="/ngo/dashboard"
                element={
                  <ProtectedRoute>
                    <NGODashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/ngo/browse"
                element={
                  <ProtectedRoute>
                    <BrowseFood />
                  </ProtectedRoute>
                }
              />

            </Routes>

          </div>
        </Router>
      </FoodProvider>
    </AuthProvider>
  );
}

export default App;