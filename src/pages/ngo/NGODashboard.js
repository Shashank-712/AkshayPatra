// src/pages/ngo/NgoDashboard.js
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import CountUp from "react-countup";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useSocket from "../../hooks/useSocket";
import { useNotifications } from "../../context/NotificationContext";

gsap.registerPlugin(ScrollTrigger);

const TABS = ["Available", "Claimed", "Completed"];

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
];

export default function NgoDashboard() {
  const navigate = useNavigate();
  const rootRef = useRef(null);

  const { addNotification } = useNotifications();

  const [listings, setListings] = useState(sampleListings);
  const [activeTab, setActiveTab] = useState("Available");
  const [confirmId, setConfirmId] = useState(null);

  /* =========================
     SOCKET REAL-TIME LISTENER
  ========================== */

  useSocket("ngo-demo-id", (data) => {
    const newFood = {
      id: Date.now(),
      title: data?.food?.title || "New Donation",
      type: "Veg · Cooked",
      qty: "50 meals",
      expiry: "Today, 23:00",
      address: data?.distanceText
        ? `📍 ${data.distanceText} away`
        : "Nearby Location",
      donor: "Live Donor",
      status: "available",
      urgent:
        data?.urgencyLevel === "critical" ||
        data?.urgencyLevel === "high",
      isNew: true,
    };

    setListings((prev) => [newFood, ...prev]);
    setActiveTab("Available");
    addNotification(data);

    // Remove glow after 5 sec
    setTimeout(() => {
      setListings((prev) =>
        prev.map((l) =>
          l.id === newFood.id ? { ...l, isNew: false } : l
        )
      );
    }, 5000);
  });

  /* =========================
     MOCK REAL-TIME EVENT
  ========================== */

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockData = {
        food: { title: "🔥 75 Fresh Meals Nearby" },
        urgencyLevel: "high",
        distanceText: "1.1km",
        matchScore: 93,
      };

      addNotification(mockData);

      const newFood = {
        id: Date.now(),
        title: mockData.food.title,
        type: "Veg · Cooked",
        qty: "75 meals",
        expiry: "Today, 21:30",
        address: "MG Road",
        donor: "Live Restaurant",
        status: "available",
        urgent: true,
        isNew: true,
      };

      setListings((prev) => [newFood, ...prev]);

      setTimeout(() => {
        setListings((prev) =>
          prev.map((l) =>
            l.id === newFood.id ? { ...l, isNew: false } : l
          )
        );
      }, 5000);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  /* =========================
     GSAP ANIMATIONS
  ========================== */

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".ngo-title", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.utils.toArray(".listing-card").forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, [activeTab, listings]);

  /* =========================
     ACTION HANDLERS
  ========================== */

  const handleClaim = (id) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status: "claimed" } : l
      )
    );
    setConfirmId(null);
  };

  const filteredListings = listings.filter(
    (l) => l.status === activeTab.toLowerCase()
  );

  const urgentCount = listings.filter(
    (l) => l.status === "available" && l.urgent
  ).length;

  /* =========================
     UI
  ========================== */

  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500"
    >
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">

        <h1 className="ngo-title text-3xl font-bold text-gray-900 dark:text-white">
          🤝 NGO Dashboard
        </h1>

        {urgentCount > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300">
            ⚠️ {urgentCount} urgent donation(s) available!
          </div>
        )}

        {/* Tabs */}
        <div className="mt-8 flex gap-3">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Listings */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {filteredListings.map((l) => (
            <div
              key={l.id}
              className={`listing-card p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg transition-all duration-500 ${
                l.isNew ? "ring-2 ring-blue-400 animate-pulse" : ""
              }`}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {l.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {l.type} • {l.qty}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                📍 {l.address}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                👤 {l.donor}
              </p>
              <p className="text-sm mt-1 text-red-500">
                🕐 Expiry: {l.expiry}
              </p>

              {l.status === "available" && (
                <div className="mt-4">
                  {confirmId === l.id ? (
                    <>
                      <button
                        onClick={() => handleClaim(l.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-full mr-2"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="px-4 py-2 border rounded-full"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmId(l.id)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-full"
                    >
                      Claim This
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}