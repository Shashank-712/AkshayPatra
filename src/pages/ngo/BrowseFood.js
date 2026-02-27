// src/pages/ngo/BrowseFood.js
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────
const ALL_LISTINGS = [
  { id: 1,  title: "Rice & Dal (Boxed)",       type: "Cooked",   diet: "Veg",     qty: 40,  unit: "meals",   expiry: "Today, 20:00",      address: "Sector 12, Community Hall",    donor: "Ananya Sharma",     distance: 1.2, urgent: true  },
  { id: 2,  title: "Mixed Fruit Pack",          type: "Raw",      diet: "Veg",     qty: 30,  unit: "packs",   expiry: "Tomorrow, 14:00",   address: "MG Road, Baker's Store",       donor: "Fresh Mart",        distance: 2.4, urgent: false },
  { id: 3,  title: "Event Leftovers (Meals)",   type: "Cooked",   diet: "Non-Veg", qty: 120, unit: "meals",   expiry: "Today, 22:00",      address: "City Convention Centre",       donor: "Raj Caterers",      distance: 3.1, urgent: true  },
  { id: 4,  title: "Bread & Pastries",          type: "Packaged", diet: "Veg",     qty: 60,  unit: "packs",   expiry: "Today, 21:00",      address: "Civil Lines, The Bread Co.",   donor: "The Bread Co.",     distance: 0.8, urgent: false },
  { id: 5,  title: "Biryani (Bulk)",            type: "Cooked",   diet: "Non-Veg", qty: 200, unit: "meals",   expiry: "Today, 19:30",      address: "Phoenix Mall Food Court",      donor: "Spice Garden",      distance: 4.5, urgent: true  },
  { id: 6,  title: "Vegetable Pulao",           type: "Cooked",   diet: "Veg",     qty: 80,  unit: "meals",   expiry: "Tomorrow, 12:00",   address: "Rajendra Nagar, Home Kitchen", donor: "Meena Iyer",        distance: 1.9, urgent: false },
  { id: 7,  title: "Canned Goods Assortment",   type: "Packaged", diet: "Veg",     qty: 45,  unit: "cans",    expiry: "Next Week",         address: "DLF Phase 2, Warehouse",       donor: "BigBasket Surplus", distance: 6.0, urgent: false },
  { id: 8,  title: "Fresh Milk (Packets)",      type: "Dairy",    diet: "Veg",     qty: 50,  unit: "packets", expiry: "Today, 18:00",      address: "Sector 4, Dairy Booth",        donor: "Mother Dairy Hub",  distance: 0.5, urgent: true  },
  { id: 9,  title: "Chapati + Sabzi",           type: "Cooked",   diet: "Veg",     qty: 60,  unit: "meals",   expiry: "Today, 21:30",      address: "Laxmi Nagar, Temple Kitchen",  donor: "Ram Mandir Trust",  distance: 2.0, urgent: false },
  { id: 10, title: "Paneer Butter Masala",      type: "Cooked",   diet: "Veg",     qty: 90,  unit: "meals",   expiry: "Tomorrow, 10:00",   address: "Connaught Place, Hotel Grand", donor: "Hotel Grand",       distance: 5.2, urgent: false },
  { id: 11, title: "Grilled Chicken Packs",     type: "Cooked",   diet: "Non-Veg", qty: 35,  unit: "packs",   expiry: "Today, 20:30",      address: "Saket Mall, Food Court",       donor: "KFC Surplus",       distance: 3.8, urgent: true  },
  { id: 12, title: "Fresh Vegetables Box",      type: "Raw",      diet: "Veg",     qty: 25,  unit: "boxes",   expiry: "Tomorrow, 16:00",   address: "INA Market, Stall 7",          donor: "INA Vendors Co-op", distance: 1.5, urgent: false },
];

const TYPE_OPTIONS = ["All", "Cooked", "Raw", "Packaged", "Dairy"];
const SORT_OPTIONS = [
  { value: "distance", label: "Nearest First" },
  { value: "urgent",   label: "Urgent First"  },
  { value: "qty_desc", label: "Most Quantity" },
];
const FOOD_EMOJI = { Cooked: "🍛", Raw: "🥦", Packaged: "📦", Dairy: "🥛" };

// ─── Component ────────────────────────────────────────────────────────────
export default function BrowseFood() {
  const navigate = useNavigate();
  const rootRef  = useRef(null);

  const [search,     setSearch]     = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [dietFilter, setDietFilter] = useState("All");
  const [sortBy,     setSortBy]     = useState("distance");
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [claimed,    setClaimed]    = useState({});
  const [confirmId,  setConfirmId]  = useState(null);

  // ── GSAP — identical pattern to NgoDashboard ────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".browse-title", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.utils.toArray(".food-card").forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 94%" },
        });
      });

      gsap.to(".browse-blob-1", {
        y: 20,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".browse-blob-2", {
        y: -20,
        x: 15,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, rootRef);

    return () => ctx.revert();
  }, [typeFilter, dietFilter, sortBy, urgentOnly, search]);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleClaim = (id) => {
    setClaimed((prev) => ({ ...prev, [id]: true }));
    setConfirmId(null);
  };

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("All");
    setDietFilter("All");
    setUrgentOnly(false);
  };

  const hasActiveFilters = search || typeFilter !== "All" || dietFilter !== "All" || urgentOnly;

  // ── Derived list ────────────────────────────────────────────────────────
  const displayed = useMemo(() => {
    let list = ALL_LISTINGS.filter((f) => {
      if (search && ![f.title, f.donor, f.address].some((s) => s.toLowerCase().includes(search.toLowerCase()))) return false;
      if (typeFilter !== "All" && f.type !== typeFilter) return false;
      if (dietFilter !== "All" && f.diet !== dietFilter) return false;
      if (urgentOnly && !f.urgent) return false;
      return true;
    });
    if (sortBy === "distance") list.sort((a, b) => a.distance - b.distance);
    if (sortBy === "urgent")   list.sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0));
    if (sortBy === "qty_desc") list.sort((a, b) => b.qty - a.qty);
    return list;
  }, [search, typeFilter, dietFilter, sortBy, urgentOnly]);

  const urgentCount = ALL_LISTINGS.filter((f) => f.urgent && !claimed[f.id]).length;

  // ────────────────────────────────────────────────────────────────────────
  return (
    <div
      ref={rootRef}
      className="relative min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 overflow-hidden"
    >
      {/* Ambient blobs — same as NgoDashboard */}
      <div className="browse-blob-1 absolute top-10 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10" />
      <div className="browse-blob-2 absolute bottom-20 left-8 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl -z-10" />

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="browse-title text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              🔍 Browse Food
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              <span className="font-semibold text-gray-800 dark:text-white">{displayed.length}</span> donation{displayed.length !== 1 ? "s" : ""} available
              {urgentCount > 0 && (
                <span className="ml-2 text-red-500 dark:text-red-400 font-semibold">
                  · ⚡ {urgentCount} urgent
                </span>
              )}
            </p>
          </div>

          <button
            onClick={() => navigate("/ngo/dashboard")}
            className="inline-flex items-center px-4 py-3 rounded-full border border-blue-200 dark:border-blue-900 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 transition self-start md:self-auto"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* ── Urgent banner — identical to NgoDashboard ────────────────── */}
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
              onClick={() => { setUrgentOnly(true); setSortBy("urgent"); }}
              className="px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-full text-sm font-medium hover:scale-105 transition shrink-0"
            >
              View Now
            </button>
          </div>
        )}

        {/* ── Filter bar ──────────────────────────────────────────────── */}
        <div className="mt-6 glass-card p-4 rounded-2xl flex flex-wrap items-center gap-3">

          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search food, donor, location…"
              className="w-full pl-9 pr-8 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 border-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >✕</button>
            )}
          </div>

          {/* Type pills */}
          <div className="flex gap-2 flex-wrap">
            {TYPE_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  typeFilter === t
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Diet pills */}
          <div className="flex gap-2">
            <button
              onClick={() => setDietFilter(dietFilter === "Veg" ? "All" : "Veg")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                dietFilter === "Veg"
                  ? "bg-emerald-500 text-white shadow"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              🟢 Veg
            </button>
            <button
              onClick={() => setDietFilter(dietFilter === "Non-Veg" ? "All" : "Non-Veg")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                dietFilter === "Non-Veg"
                  ? "bg-red-500 text-white shadow"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              🔴 Non-Veg
            </button>
          </div>

          {/* Urgent toggle */}
          <button
            onClick={() => setUrgentOnly((v) => !v)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
              urgentOnly
                ? "bg-red-500 text-white shadow"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            ⚡ Urgent Only
          </button>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer border-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Clear */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-300 text-xs font-semibold hover:scale-105 transition"
            >
              ✕ Clear All
            </button>
          )}
        </div>

        {/* ── Grid ────────────────────────────────────────────────────── */}
        <section className="mt-8">
          {displayed.length === 0 ? (
            <div className="glass-card p-14 text-center rounded-2xl">
              <div className="text-5xl mb-4">🤷</div>
              <p className="text-gray-600 dark:text-gray-300 text-lg font-semibold">
                No listings match your filters.
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                Try adjusting your search or clearing the filters.
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white px-6 py-3 rounded-full font-semibold shadow transition hover:-translate-y-0.5"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayed.map((f) => {
                const isClaimed = !!claimed[f.id];
                return (
                  <article
                    key={f.id}
                    className={`food-card glass-card p-6 rounded-2xl shadow-lg relative flex flex-col gap-4 ${
                      isClaimed ? "opacity-70" : ""
                    }`}
                  >
                    {/* Badges — same positioning as NgoDashboard */}
                    <div className="absolute top-4 right-4 flex flex-col gap-1.5 items-end">
                      {f.urgent && !isClaimed && (
                        <div className="px-3 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-full text-xs font-bold animate-pulse">
                          ⚡ Expiring Soon
                        </div>
                      )}
                      {isClaimed && (
                        <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
                          📦 Claimed
                        </div>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        f.diet === "Veg"
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                          : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300"
                      }`}>
                        {f.diet === "Veg" ? "🟢 Veg" : "🔴 Non-Veg"}
                      </span>
                    </div>

                    {/* Card header — matches NgoDashboard listing card */}
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl shrink-0">
                        {FOOD_EMOJI[f.type] || "🍱"}
                      </div>
                      <div className="flex-1 min-w-0 pr-20">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                          {f.title}
                        </h4>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {f.type} · {f.qty} {f.unit}
                        </div>
                      </div>
                    </div>

                    {/* Details — same as NgoDashboard */}
                    <div className="space-y-1.5">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        📍 {f.address}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        👤 Donor: {f.donor}
                      </div>
                      <div className={`text-sm ${f.urgent ? "text-red-500 dark:text-red-400 font-semibold" : "text-gray-500 dark:text-gray-400"}`}>
                        🕐 Expiry: {f.expiry}
                      </div>
                      <div className="text-sm text-indigo-500 dark:text-indigo-400 font-medium">
                        📏 {f.distance} km away
                      </div>
                    </div>

                    {/* Quantity bar */}
                    <div>
                      <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-1.5">
                        <span>Quantity</span>
                        <span className="font-semibold text-gray-600 dark:text-gray-300">{f.qty} {f.unit}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-400"
                          style={{ width: `${Math.min((f.qty / 200) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions — exact same confirm pattern as NgoDashboard */}
                    <div className="flex gap-3 mt-1 flex-wrap">
                      {!isClaimed ? (
                        confirmId === f.id ? (
                          <>
                            <span className="text-sm text-gray-600 dark:text-gray-300 self-center">
                              Confirm claim?
                            </span>
                            <button
                              onClick={() => handleClaim(f.id)}
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
                          <>
                            <button
                              onClick={() => setConfirmId(f.id)}
                              className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-sm font-semibold hover:scale-105 transition shadow"
                            >
                              Claim This
                            </button>
                            <button
                              onClick={() => navigate(`/ngo/listing/${f.id}`)}
                              className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            >
                              View Details
                            </button>
                          </>
                        )
                      ) : (
                        <button
                          onClick={() => navigate("/ngo/dashboard")}
                          className="flex-1 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-semibold text-center transition"
                        >
                          ✓ Claimed — Go to Dashboard
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
          © {new Date().getFullYear()} AkshayPatra — NGO Panel
        </div>
      </footer>

      {/* Exact same glass styles as NgoDashboard */}
      <style>{`
        .glass-card {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(99,102,241,0.06);
          border-radius: 16px;
        }
        :is(.dark) .glass-card {
          background: rgba(31,41,55,0.88);
          border: 1px solid rgba(79,70,229,0.08);
        }
        .food-card { overflow: hidden; }
      `}</style>
    </div>
  );
}