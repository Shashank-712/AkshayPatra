// src/pages/donor/DonorDashboard.js
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import CountUp from "react-countup";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sampleFoods = [
  {
    id: 1,
    title: "Rice & Dal (Boxed)",
    type: "Veg · Cooked",
    qty: "40 meals",
    expiry: "Today, 20:00",
    address: "Sector 12, Community Hall",
  },
  {
    id: 2,
    title: "Mixed Fruit Pack",
    type: "Veg · Fruits & Vegetables",
    qty: "30 packs",
    expiry: "Tomorrow, 14:00",
    address: "MG Road, Baker's Store",
  },
  {
    id: 3,
    title: "Event Leftovers (Meals)",
    type: "Non-Veg · Cooked",
    qty: "120 meals",
    expiry: "Today, 22:00",
    address: "City Convention Centre",
  },
];

export default function DonorDashboard() {
  const navigate = useNavigate();
  const [foods, setFoods] = useState(sampleFoods);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({});

  // FIX 1: Use gsap.context() for proper animation cleanup
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animations
      gsap.from(".dashboard-title", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".stat", {
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        delay: 0.1,
      });

      // Reveal each food card on scroll
      gsap.utils.toArray(".food-card").forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
          },
        });
      });

      // Floating blobs
      gsap.to(".dash-blob-1", {
        y: 25,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".dash-blob-2", {
        y: -25,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, rootRef); // scope all selectors to rootRef

    // FIX 1: ctx.revert() cleans up ALL tweens and ScrollTriggers created above
    return () => ctx.revert();
  }, []);

  const handleDelete = (id) =>
    setFoods((prev) => prev.filter((f) => f.id !== id));

  // FIX 2: Prevent re-claiming an already claimed item
  const handleMarkClaimed = (id) =>
    setFoods((prev) =>
      prev.map((f) => (f.id === id && !f.claimed ? { ...f, claimed: true } : f))
    );

  // FIX 3: Edit button now opens an inline edit form
  const handleEditOpen = (f) => {
    setEditingId(f.id);
    setEditDraft({ title: f.title, qty: f.qty, address: f.address });
  };

  const handleEditSave = (id) => {
    setFoods((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...editDraft } : f))
    );
    setEditingId(null);
    setEditDraft({});
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditDraft({});
  };

  return (
    // FIX 4: attach rootRef so gsap.context scopes correctly
    <div
      ref={rootRef}
      className="relative min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 overflow-hidden"
    >
      {/* Ambient background blobs */}
      <div className="dash-blob-1 absolute top-12 left-8 w-80 h-80 bg-green-400/10 rounded-full blur-3xl -z-10" />
      <div className="dash-blob-2 absolute bottom-16 right-12 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl -z-10" />

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="dashboard-title text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              🍽️ Donor Dashboard
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Manage your active donations, track impact, and post new food quickly.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-4 md:mt-0">
            <div className="stat glass-mini p-4 rounded-2xl text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Donations</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                <CountUp end={24} duration={1.4} />
              </div>
            </div>

            <div className="stat glass-mini p-4 rounded-2xl text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Meals Provided</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                <CountUp end={320} duration={1.4} separator="," />
              </div>
            </div>

            <div className="stat glass-mini p-4 rounded-2xl text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Active Donors</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                <CountUp end={156} duration={1.4} />
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 glass-card p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Have surplus food today?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Post it quickly and help feed families nearby.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/donor/create-food")}
              className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white px-5 py-3 rounded-full font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition"
            >
              + Post Food
            </button>

            <Link
              to="/donor/history"
              className="inline-flex items-center px-4 py-3 rounded-full border border-green-200 dark:border-green-900 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-gray-800 transition"
            >
              View History
            </Link>
          </div>
        </div>

        {/* Active Listings */}
        <section className="mt-10">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Your Active Listings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {foods.length === 0 ? (
              <div className="glass-card p-8 text-center col-span-full">
                {/* FIX 5: Better empty state with illustration */}
                <div className="text-5xl mb-4">🍱</div>
                <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                  No active listings yet!
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                  Post your first donation and help feed families nearby.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => navigate("/donor/create-food")}
                    className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white px-6 py-3 rounded-full font-semibold shadow transition"
                  >
                    + Post Food
                  </button>
                </div>
              </div>
            ) : (
              foods.map((f) => (
                <article
                  key={f.id}
                  className={`food-card glass-card p-6 rounded-2xl shadow-lg relative ${
                    f.claimed ? "opacity-70" : ""
                  }`}
                >
                  {/* FIX 3: Inline edit form */}
                  {editingId === f.id ? (
                    <div className="flex flex-col gap-3">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Title
                        <input
                          className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          value={editDraft.title}
                          onChange={(e) =>
                            setEditDraft((d) => ({ ...d, title: e.target.value }))
                          }
                        />
                      </label>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Quantity
                        <input
                          className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          value={editDraft.qty}
                          onChange={(e) =>
                            setEditDraft((d) => ({ ...d, qty: e.target.value }))
                          }
                        />
                      </label>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Pickup Address
                        <input
                          className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          value={editDraft.address}
                          onChange={(e) =>
                            setEditDraft((d) => ({ ...d, address: e.target.value }))
                          }
                        />
                      </label>
                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={() => handleEditSave(f.id)}
                          className="px-4 py-2 rounded-full bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl shrink-0">
                          🍱
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                            {f.title}
                          </h4>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {f.type} • {f.qty}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Pickup: {f.address}
                          </div>
                          <div className="text-sm text-red-500 dark:text-red-400 mt-1">
                            Expiry: {f.expiry}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-4 flex-wrap">
                        {/* FIX 2: Disable button after claiming */}
                        <button
                          onClick={() => handleMarkClaimed(f.id)}
                          disabled={f.claimed}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                            f.claimed
                              ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                              : "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-200 hover:scale-105"
                          }`}
                        >
                          {f.claimed ? "✓ Claimed" : "Mark Claimed"}
                        </button>

                        {/* FIX 3: Edit opens inline form */}
                        <button
                          onClick={() => handleEditOpen(f)}
                          disabled={f.claimed}
                          className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(f.id)}
                          className="px-4 py-2 rounded-full bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-sm hover:scale-105 transition"
                        >
                          Delete
                        </button>
                      </div>

                      {f.claimed && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-semibold">
                          Claimed
                        </div>
                      )}
                    </>
                  )}
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
          © {new Date().getFullYear()} AkshayPatra — Donor Panel
        </div>
      </footer>

      {/* FIX 4: Dark mode glass styles use [data-theme="dark"] or rely on Tailwind class strategy */}
      <style>{`
        .glass-mini {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(16,185,129,0.06);
          min-width: 110px;
        }
        .glass-card {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(16,185,129,0.06);
          border-radius: 16px;
        }
        /* Use :is(.dark *) so it works with Tailwind's class-based dark mode */
        :is(.dark) .glass-card,
        :is(.dark) .glass-mini {
          background: rgba(31,41,55,0.88);
          border: 1px solid rgba(4,120,87,0.08);
        }
        .stat { padding: 12px 18px; border-radius: 12px; min-width: 110px; }
        .food-card { overflow: hidden; }
        @media (max-width: 768px) {
          .glass-mini { min-width: 90px; }
        }
      `}</style>
    </div>
  );
}