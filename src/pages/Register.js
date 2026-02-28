// src/pages/Register.js
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import gsap from "gsap";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE_MB = 5;

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [proofFile, setProofFile]       = useState(null);
  const [proofPreview, setProofPreview] = useState(null); // for image preview
  const fileInputRef = useRef(null);
  const rootRef      = useRef(null);

  const [formData, setFormData] = useState({
    name:     "",
    email:    "",
    password: "",
    role:     "donor",
  });

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

  // Clear proof when switching away from NGO
  useEffect(() => {
    if (formData.role !== "ngo") {
      setProofFile(null);
      setProofPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [formData.role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Only PDF, JPG, or PNG files are accepted.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`File must be under ${MAX_SIZE_MB}MB.`);
      e.target.value = "";
      return;
    }

    setProofFile(file);

    // Show preview only for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setProofPreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setProofPreview(null); // PDF — no preview
    }
  };

  const removeFile = () => {
    setProofFile(null);
    setProofPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    if (formData.role === "ngo" && !proofFile) {
      toast.error("Please upload your government-certified proof document.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Build FormData so the file can be sent to the backend
      const payload = new FormData();
      payload.append("name",     formData.name.trim());
      payload.append("email",    formData.email.trim());
      payload.append("password", formData.password);
      payload.append("role",     formData.role);
      if (proofFile) payload.append("govProof", proofFile);

      if (register) {
        const success = await register(payload);
        if (success) {
          toast.success("Registration successful 🎉");
          if (formData.role === "donor") navigate("/donor/dashboard");
          else navigate("/ngo/dashboard");
        } else {
          toast.error("Registration failed. Try again.");
        }
      } else {
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

            {/* Password */}
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

            {/* Role selector */}
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

            {/* ── NGO Government Proof Upload ── */}
            {formData.role === "ngo" && (
              <div className="rounded-2xl border-2 border-dashed border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10 p-5 transition-all duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🏛️</span>
                  <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Government Certification Proof
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Upload your NGO registration certificate, 80G/12A certificate, or any government-issued proof. Accepted: PDF, JPG, PNG · Max 5MB.
                </p>

                {/* File not yet chosen */}
                {!proofFile && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 transition cursor-pointer"
                  >
                    <span className="text-3xl">📄</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">Click to upload document</span>
                    <span className="text-xs text-gray-400">or drag and drop</span>
                  </button>
                )}

                {/* File chosen — show preview or filename */}
                {proofFile && (
                  <div className="rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-gray-800 p-3 flex items-center gap-3">
                    {proofPreview ? (
                      <img
                        src={proofPreview}
                        alt="Proof preview"
                        className="w-14 h-14 object-cover rounded-lg border border-gray-200 dark:border-gray-600 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0 text-2xl">
                        📑
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{proofFile.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {(proofFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-green-600 dark:text-green-400 hover:underline mt-1"
                      >
                        Change file
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      aria-label="Remove file"
                      className="text-gray-400 hover:text-red-500 transition text-lg px-1"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}

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

          <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 dark:text-green-400 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

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