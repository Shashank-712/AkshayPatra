// src/pages/ngo/NgoDashboard.js
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import CountUp from "react-countup";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TABS = ["Available", "Claimed", "Completed"];

const STATUS_META = {
  available: {
    label: "Available",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
  claimed: {
    label: "Claimed",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  completed: {
    label: "Completed",
    color: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  },
};

const sampleListings = [
  {
    id: 1,
    title: "Rice & Dal (Boxed)",
    type: "Veg · Cooked",
    qty: "40 meals",
    expiry: "Today, 20:00",
    address: "Sector 12, Community Hall",
    donor: "Ananya Sharma",
    status: "available",
    urgent: true,
  },
  {
    id: 2,
    title: "Mixed Fruit Pack",
    type: "Veg · Fruits & Vegetables",
    qty: "30 packs",
    expiry: "Tomorrow, 14:00",
    address: "MG Road, Baker's Store",
    donor: "Fresh Mart",
    status: "available",
    urgent: false,
  },
  {
    id: 3,
    title: "Event Leftovers (Meals)",
    type: "Non-Veg · Cooked",
    qty: "120 meals",
    expiry: "Today, 22:00",
    address: "City Convention Centre",
    donor: "Raj Caterers",
    status: "claimed",
    urgent: true,
    claimedAt: "10:30 AM",
    pickupEta: "6:00 PM",
  },
  {
    id: 4,
    title: "Bread & Pastries",
    type: "Veg · Bakery",
    qty: "60 packs",
    expiry: "Today, 21:00",
    address: "Civil Lines, The Bread Co.",
    donor: "The Bread Co.",
    status: "available",
    urgent: false,
  },
  {
    id: 5,
    title: "Biryani (Bulk)",
    type: "Non-Veg · Cooked",
    qty: "200 meals",
    expiry: "Yesterday, 20:00",
    address: "Phoenix Mall Food Court",
    donor: "Spice Garden",
    status: "completed",
    urgent: false,
    mealsServed: 198,
  },
];

const FOOD_EMOJI = {
  "Veg · Cooked": "🍛",
  "Veg · Fruits & Vegetables": "🍎",
  "Non-Veg · Cooked": "🍗",
  "Veg · Bakery": "🥖",
};

export default function NgoDashboard() {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const [listings, setListings] = useState(sampleListings);
  const [activeTab, setActiveTab] = useState("Available");
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".ngo-title", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".ngo-stat", {
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        delay: 0.1,
      });

      gsap.utils.toArray(".listing-card").forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 93%",
          },
        });
      });

      gsap.to(".ngo-blob-1", {
        y: 20,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".ngo-blob-2", {
        y: -20,
        x: 15,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, rootRef);

    return () => ctx.revert();
  }, [activeTab]); // re-run on tab change so new cards animate in

  const handleClaim = (id) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, status: "claimed", claimedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), pickupEta: "TBD" }
          : l
      )
    );
    setConfirmId(null);
  };

  const handleMarkCompleted = (id) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status: "completed", mealsServed: parseInt(l.qty) || 0 } : l
      )
    );
  };

  const handleUnclaim = (id) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status: "available", claimedAt: undefined, pickupEta: undefined } : l
      )
    );
  };

  const filteredListings = listings.filter(
    (l) => l.status === activeTab.toLowerCase()
  );

  const totalClaimed = listings.filter((l) => l.status === "claimed" || l.status === "completed").length;
  const totalMeals = listings
    .filter((l) => l.status === "completed")
    .reduce((sum, l) => sum + (l.mealsServed || 0), 0);
  const urgentCount = listings.filter((l) => l.status === "available" && l.urgent).length;

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 overflow-hidden"
    >
      {/* Ambient blobs */}
      <div className="ngo-blob-1 absolute top-10 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10" />
      <div className="ngo-blob-2 absolute bottom-20 left-8 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl -z-10" />

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="ngo-title text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              🤝 NGO Dashboard
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Browse available donations, claim food, and track your pickups.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-4 md:mt-0">
            <div className="ngo-stat glass-mini p-4 rounded-2xl text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Claimed</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                <CountUp end={totalClaimed + 18} duration={1.4} />
              </div>
            </div>

            <div className="ngo-stat glass-mini p-4 rounded-2xl text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Meals Received</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                <CountUp end={totalMeals + 1240} duration={1.4} separator="," />
              </div>
            </div>

            <div className="ngo-stat glass-mini p-4 rounded-2xl text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Urgent Near You</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
                <CountUp end={urgentCount} duration={1.0} />
              </div>
            </div>
          </div>
        </div>

        {/* Urgent Alert Banner */}
        {urgentCount > 0 && (
          <div className="mt-6 glass-card p-4 rounded-2xl flex items-center gap-4 border-l-4 border-red-400">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {urgentCount} donation{urgentCount > 1 ? "s" : ""} expiring soon!
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Claim before they expire and help reduce food waste.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("Available")}
              className="px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-full text-sm font-medium hover:scale-105 transition shrink-0"
            >
              View Now
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 glass-card p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Looking for food nearby?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Browse all available donations posted by donors in your area.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/ngo/browse")}
              className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white px-5 py-3 rounded-full font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition"
            >
              🔍 Browse All
            </button>
            <Link
              to="/ngo/history"
              className="inline-flex items-center px-4 py-3 rounded-full border border-blue-200 dark:border-blue-900 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 transition"
            >
              View History
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Food Listings
            </h3>
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  {tab}
                  <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                  }`}>
                    {listings.filter((l) => l.status === tab.toLowerCase()).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredListings.length === 0 ? (
              <div className="glass-card p-8 text-center col-span-full">
                <div className="text-5xl mb-4">
                  {activeTab === "Available" ? "🍽️" : activeTab === "Claimed" ? "📦" : "✅"}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                  {activeTab === "Available"
                    ? "No available donations right now."
                    : activeTab === "Claimed"
                    ? "You haven't claimed anything yet."
                    : "No completed pickups yet."}
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                  {activeTab === "Available"
                    ? "Check back soon — donors post regularly."
                    : activeTab === "Claimed"
                    ? "Browse available listings and claim food nearby."
                    : "Claimed items will appear here once marked as done."}
                </p>
                {activeTab !== "Available" && (
                  <button
                    onClick={() => setActiveTab("Available")}
                    className="mt-5 bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-6 py-3 rounded-full font-semibold shadow transition hover:-translate-y-0.5"
                  >
                    Browse Available
                  </button>
                )}
              </div>
            ) : (
              filteredListings.map((l) => (
                <article
                  key={l.id}
                  className={`listing-card glass-card p-6 rounded-2xl shadow-lg relative ${
                    l.status === "completed" ? "opacity-70" : ""
                  }`}
                >
                  {/* Urgent badge */}
                  {l.urgent && l.status === "available" && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-full text-xs font-bold animate-pulse">
                      ⚡ Expiring Soon
                    </div>
                  )}

                  {l.status === "completed" && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full text-xs font-semibold">
                      ✓ Completed
                    </div>
                  )}

                  {l.status === "claimed" && !l.urgent && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
                      📦 Claimed
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl shrink-0">
                      {FOOD_EMOJI[l.type] || "🍱"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white truncate pr-24">
                        {l.title}
                      </h4>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {l.type} • {l.qty}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        📍 {l.address}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        👤 Donor: {l.donor}
                      </div>
                      <div className={`text-sm mt-1 ${l.urgent ? "text-red-500 dark:text-red-400 font-semibold" : "text-gray-500 dark:text-gray-400"}`}>
                        🕐 Expiry: {l.expiry}
                      </div>

                      {/* Extra info for claimed */}
                      {l.status === "claimed" && (
                        <div className="mt-2 flex gap-3 flex-wrap">
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                            Claimed at {l.claimedAt}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300">
                            Pickup ETA: {l.pickupEta}
                          </span>
                        </div>
                      )}

                      {/* Extra info for completed */}
                      {l.status === "completed" && (
                        <div className="mt-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300">
                            🍽️ {l.mealsServed} meals served
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-5 flex-wrap">
                    {l.status === "available" && (
                      <>
                        {confirmId === l.id ? (
                          <>
                            <span className="text-sm text-gray-600 dark:text-gray-300 self-center">
                              Confirm claim?
                            </span>
                            <button
                              onClick={() => handleClaim(l.id)}
                              className="px-4 py-2 rounded-full bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition"
                            >
                              Yes, Claim
                            </button>
                            <button
                              onClick={() => setConfirmId(null)}
                              className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setConfirmId(l.id)}
                            className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-sm font-semibold hover:scale-105 transition shadow"
                          >
                            Claim This
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/ngo/listing/${l.id}`)}
                          className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        >
                          View Details
                        </button>
                      </>
                    )}

                    {l.status === "claimed" && (
                      <>
                        <button
                          onClick={() => handleMarkCompleted(l.id)}
                          className="px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-200 text-sm font-medium hover:scale-105 transition"
                        >
                          ✓ Mark Picked Up
                        </button>
                        <button
                          onClick={() => handleUnclaim(l.id)}
                          className="px-4 py-2 rounded-full bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-300 text-sm hover:scale-105 transition"
                        >
                          Release Claim
                        </button>
                      </>
                    )}

                    {l.status === "completed" && (
                      <button
                        onClick={() => navigate(`/ngo/listing/${l.id}`)}
                        className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                      >
                        View Summary
                      </button>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
          © {new Date().getFullYear()} AkshayPatra — NGO Panel
        </div>
      </footer>

      <style>{`
        .glass-mini {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(99,102,241,0.06);
          min-width: 110px;
        }
        .glass-card {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(99,102,241,0.06);
          border-radius: 16px;
        }
        :is(.dark) .glass-card,
        :is(.dark) .glass-mini {
          background: rgba(31,41,55,0.88);
          border: 1px solid rgba(79,70,229,0.08);
        }
        .listing-card { overflow: hidden; }
        @media (max-width: 768px) {
          .glass-mini { min-width: 90px; }
        }
      `}</style>
    </div>
  );
}