// src/components/layout/Navbar.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/Akshaypatra.png';
import NotificationBell from "../notifications/NotificationBell";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // 🌙 Dark Mode State
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'donor':
        return '/donor/dashboard';
      case 'ngo':
        return '/ngo/dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg transition-colors duration-500 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Akshaypatra Logo"
              className="h-14 w-auto object-contain"
            />
            <span className="text-2xl font-bold text-primary-600 tracking-wide">
              Akshaypatra
            </span>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-4">

            {/* 🌙 Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-2 rounded-full text-sm font-medium 
                         bg-gray-200 dark:bg-gray-700 
                         text-gray-800 dark:text-white 
                         transition hover:scale-105"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {isAuthenticated ? (
              <>
                {/* 🔔 Notifications */}
                <NotificationBell />

                {/* Dashboard Link */}
                <Link
                  to={getDashboardLink()}
                  className="text-gray-700 dark:text-gray-200 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Dashboard
                </Link>

                {/* User Info */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    👋 {user.name}
                  </span>

                  <span className="px-2 py-1 text-xs font-semibold text-white bg-primary-500 rounded-full capitalize">
                    {user.role}
                  </span>

                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium transition hover:scale-105"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-200 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-full text-sm font-medium transition hover:scale-105 shadow"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;