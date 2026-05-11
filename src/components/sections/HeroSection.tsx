"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 -z-10" />,
});

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* 3D Scene Background */}
      <HeroScene />

      {/* Grid dot background */}
      <div className="absolute inset-0 opacity-15" style={{
        backgroundImage: "radial-gradient(circle, #3f3f46 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        zIndex: -1,
      }} />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,185,129,0.07) 0%, transparent 70%)",
        zIndex: -1,
      }} />

      {/* Content */}
      <div className="relative z-10 container-wide mx-auto text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400 mb-8 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Custom AI Workforce Deployment
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6"
        >
          Deploy a Custom AI Growth Team
          <br />
          <span className="text-emerald-400">Inside Your Business</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Codematics Growth Studio turns your growth operations into a coordinated AI workforce — research, offers, copy, funnels, email, SEO, sales, and automation working together around your business goals.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/contact"
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-semibold text-sm rounded-lg hover:bg-zinc-200 transition-all duration-200 text-center"
          >
            Book a Strategy Call
          </Link>
          <Link
            href="#how-it-works"
            className="w-full sm:w-auto px-8 py-3.5 text-zinc-400 font-medium text-sm rounded-lg hover:text-white hover:bg-zinc-800/50 transition-all duration-200 text-center flex items-center justify-center gap-2"
          >
            See How It Works
            <ChevronDown className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 border-zinc-600 flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-zinc-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
