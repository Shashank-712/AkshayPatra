// src/pages/Register.js
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import gsap from "gsap";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // FIX 1: useRef so GSAP can scope animations properly
  const rootRef = useRef(null);

  const [formData, setFormData] = useState({
    name:     "",
    email:    "",
    password: "",
    role:     "donor",
  });

  // FIX 1: gsap.context() + ctx.revert() for proper cleanup
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".register-card", {
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

  const validate = () => {
    if (!formData.name || formData.name.trim().length < 2) {
      toast.error("Please enter your full name (at least 2 characters).");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }
    if (!["donor", "ngo"].includes(formData.role)) {
      toast.error("Please choose a valid role.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (register) {
        const success = await register({
          name:     formData.name.trim(),
          email:    formData.email.trim(),
          password: formData.password,
          role:     formData.role,
        });

        if (success) {
          toast.success("Registration successful 🎉");
          if (formData.role === "donor") navigate("/donor/dashboard");
          else navigate("/ngo/dashboard");
        } else {
          toast.error("Registration failed. Try again.");
        }
      } else {
        // FIX 3: removed setTimeout — navigate directly, no unmounted-state risk
        toast.success("Registered (simulated). Redirecting...");
        if (formData.role === "donor") navigate("/donor/dashboard");
        else navigate("/ngo/dashboard");
      }
    } catch (err) {
      console.error("Register error:", err);
      toast.error(err?.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // FIX 1: attach rootRef so gsap.context scopes correctly
    <div
      ref={rootRef}
      className="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500"
    >
      <Navbar />

      <div className="flex items-center justify-center px-6 py-16">
        <div
          className="register-card w-full max-w-lg glass-card p-8 md:p-10 rounded-3xl shadow-2xl"
          role="region"
          aria-labelledby="register-heading"
        >
          <h2
            id="register-heading"
            className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-6"
          >
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Ramesh Kumar"
                className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition"
              />
            </div>

            {/* Password with toggle */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="At least 6 characters"
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

            {/* Role — styled role selector cards */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Register As
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "donor", label: "Donor", emoji: "🍽️", desc: "Share surplus food" },
                  { value: "ngo",   label: "NGO",   emoji: "🤝", desc: "Claim food for communities" },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setFormData((s) => ({ ...s, role: r.value }))}
                    className={`flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.role === r.value
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm"
                        : "border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700"
                    }`}
                  >
                    <span className="text-2xl">{r.emoji}</span>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">{r.label}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 text-center">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "opacity-70 cursor-wait" : "hover:-translate-y-0.5 hover:shadow-2xl"
              } bg-gradient-to-r from-green-600 to-emerald-500 text-white py-3 rounded-xl font-semibold shadow-lg transform transition-all duration-200`}
            >
              {loading ? "Creating account…" : "Register"}
            </button>
          </form>

          {/* Login redirect */}
          <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 dark:text-green-400 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* FIX 2: Changed `.dark .glass-card` → `:is(.dark) .glass-card` */}
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

export default Register;