// src/pages/Home.js
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import CountUp from "react-countup";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import bgImage from "../assets/bg.jpeg";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  useEffect(() => {
    // Custom Cursor Effect
    const cursor = document.createElement('div');
    const cursorGlow = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursor);
    document.body.appendChild(cursorGlow);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let glowX = 0, glowY = 0;

    const updateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;

      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';

      requestAnimationFrame(updateCursor);
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Magnetic effect on buttons
    const magneticButtons = document.querySelectorAll('a, button');
    magneticButtons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(1.5)';
      });
      button.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    });

    if (window.innerWidth > 768) {
      document.addEventListener('mousemove', handleMouseMove);
      updateCursor();
    }

    // Fade in for sections
    const reveals = document.querySelectorAll(".fade-in");
    reveals.forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Subtle parallax on hero
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const hero = document.querySelector('.hero-parallax');
      if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.4}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (cursor.parentNode) cursor.remove();
      if (cursorGlow.parentNode) cursorGlow.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">

      {/* ── Background Image (blurred + low opacity) ── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'blur(6px)',
          opacity: 0.18,
          transform: 'scale(1.05)', // prevents blurred edges from showing a white border
          pointerEvents: 'none'
        }}
      />

      {/* Ambient Background Elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-40 right-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-green-300/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>

      <Navbar />

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-20 text-center hero-parallax relative z-10">
        <div className="animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              AkshayPatra
            </span>
          </h1>
          <p className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            From Surplus to Smiles
          </p>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
            Connecting donors and NGOs to fight hunger — ensuring no plate is left empty.
          </p>
          <Link
            to="/register"
            className="inline-block bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Join the Movement
          </Link>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="max-w-7xl mx-auto px-6 py-20 fade-in relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 md:p-16 border border-green-100 dark:border-green-900/30">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
            Our Impact
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent mb-2">
                <CountUp end={2456} duration={2.5} separator="," />
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">kg Food Saved</div>
            </div>

            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent mb-2">
                <CountUp end={9824} duration={2.5} separator="," />
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Meals Provided</div>
            </div>

            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent mb-2">
                <CountUp end={156} duration={2.5} />
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Active Donors</div>
            </div>

            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent mb-2">
                <CountUp end={312} duration={2.5} />
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Families Helped</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — 2 cards only */}
      <section className="max-w-7xl mx-auto px-6 py-20 fade-in relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
          How It Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          <div className="group bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-green-50 dark:border-green-900/20">
            <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
              🍽️
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              For Donors
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Post surplus food from events, restaurants, or homes. Track your contribution to reducing waste and helping communities.
            </p>
          </div>

          <div className="group bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-green-50 dark:border-green-900/20">
            <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
              ❤️
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              For NGOs
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Find available food donations nearby. Coordinate efficient pickups and distribute to those in need.
            </p>
          </div>

        </div>
      </section>

      {/* CTA SECTION */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center fade-in relative z-10">
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-12 md:p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join donors and NGOs working together to end hunger in our communities.
            </p>
            <Link
              to="/register"
              className="inline-block bg-white text-green-600 px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:bg-gray-50"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-8 mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} AkshayPatra — From Surplus to Smiles
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
        :global(.custom-cursor) {
          position: fixed;
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          transition: transform 0.2s ease;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
        }
        :global(.cursor-glow) {
          position: fixed;
          width: 40px;
          height: 40px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          transform: translate(-50%, -50%);
          transition: transform 0.2s ease;
          filter: blur(10px);
        }
        @media (min-width: 768px) {
          :global(*) { cursor: none !important; }
        }
        :global(.glass-effect) {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.9);
        }
        :is(.dark) :global(.glass-effect) {
          background: rgba(31, 41, 55, 0.9);
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        :global(.shimmer-hover:hover) {
          background-size: 200% auto;
          animation: shimmer 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;