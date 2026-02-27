// src/pages/Login.js
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import gsap from "gsap";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEMO_ACCOUNTS = [
  { role: "Donor", emoji: "🍽️", email: "donor@test.com", password: "password123" },
  { role: "NGO",   emoji: "🤝", email: "ngo@test.com",   password: "password123" },
];

const Login = () => {
  const navigate         = useNavigate();
  const { login }        = useAuth();
  const rootRef          = useRef(null);

  const [formData, setFormData]         = useState({ email: "", password: "" });
  const [loading, setLoading]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // FIX 1: GSAP with context + cleanup
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".login-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  // FIX 8: Clicking a demo account auto-fills the form
  const fillDemo = (account) => {
    setFormData({ email: account.email, password: account.password });
    toast(`Filled ${account.role} demo credentials`, { icon: account.emoji });
  };

  // FIX 6: Client-side validation before hitting the API
  const validate = () => {
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const success = await login(formData.email.trim(), formData.password);

      if (success) {
        toast.success("Welcome back! 👋");

        // FIX 4: Safe localStorage read with null guard
        let role = null;
        try {
          const stored = localStorage.getItem("user");
          if (stored) role = JSON.parse(stored)?.role;
        } catch {
          // JSON parse failed — fall through to default redirect
        }

        if (role === "donor") navigate("/donor/dashboard");
        else                navigate("/ngo/dashboard");
      } else {
        toast.error("Invalid email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err?.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // FIX 2 + FIX 1: dark mode + rootRef for GSAP scoping
    <div
      ref={rootRef}
      className="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500"
    >
      {/* FIX 3: Navbar added — consistent with Register */}
      <Navbar />

      <div className="flex items-center justify-center px-6 py-16">
        <div
          className="login-card w-full max-w-md glass-card p-8 md:p-10 rounded-3xl shadow-2xl"
          role="region"
          aria-labelledby="login-heading"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block text-3xl font-extrabold mb-3">
              <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                🌿 AkshayPatra
              </span>
            </Link>
            <h2
              id="login-heading"
              className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
            >
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Sign in to continue making a difference
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition"
              />
            </div>

            {/* Password — FIX 5: show/hide toggle added */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-green-600 dark:text-green-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white px-2 py-1 rounded transition"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit — FIX 7: inline button, no external component */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg transform transition-all duration-200 bg-gradient-to-r from-green-600 to-emerald-500 ${
                loading
                  ? "opacity-70 cursor-wait"
                  : "hover:-translate-y-0.5 hover:shadow-2xl hover:from-green-700 hover:to-emerald-600"
              }`}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {/* Demo Accounts — FIX 8: clickable cards that auto-fill */}
          <div className="mt-7">
            <div className="relative flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                Demo Accounts
              </span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.role}
                  type="button"
                  onClick={() => fillDemo(a)}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition text-center group"
                >
                  <span className="text-xl">{a.emoji}</span>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-400 transition">
                    {a.role}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
              Click any card to auto-fill credentials
            </p>
          </div>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-green-600 dark:text-green-400 font-medium hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* FIX 2: :is(.dark) selector — matches Register.js pattern */}
      <style>{`
        .glass-card {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(16,185,129,0.07);
        }
        :is(.dark) .glass-card {
          background: rgba(17,24,39,0.88);
          border: 1px solid rgba(4,120,87,0.06);
        }
      `}</style>
    </div>
  );
};

export default Login;