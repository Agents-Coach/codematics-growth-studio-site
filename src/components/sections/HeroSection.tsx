"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 -z-10" />,
});

const marqueeItems = [
  "AI Workforce", "Growth Systems", "Agent Architecture",
  "Custom Deploy", "Scale Fast", "No Templates",
  "AI Workforce", "Growth Systems", "Agent Architecture",
  "Custom Deploy", "Scale Fast", "No Templates",
];

const stats = [
  { value: "17", label: "Specialist Agents" },
  { value: "3–17", label: "Agents Per Workforce" },
  { value: "100%", label: "Custom Architecture" },
  { value: "24h", label: "Response Time" },
];

function StatCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.unobserve(el); } },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center"
    >
      <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-zinc-500 uppercase tracking-widest">{label}</div>
    </motion.div>
  );
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* 3D Scene Background */}
      <HeroScene />

      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      {/* Corner Frames — Pixila style */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {/* Top-left */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
          <div className="w-8 h-8 border-l border-t border-zinc-600" />
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="block text-[10px] text-zinc-600 mt-2 font-mono tracking-widest"
          >
            CODEMATICS — STUDIO
          </motion.span>
        </div>
        {/* Top-right */}
        <div className="absolute top-6 right-6 sm:top-8 sm:right-8">
          <div className="w-8 h-8 border-r border-t border-zinc-600 ml-auto" />
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="block text-[10px] text-zinc-600 mt-2 font-mono tracking-widest text-right"
          >
            EST. 2024
          </motion.span>
        </div>
        {/* Bottom-left */}
        <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
          <div className="w-8 h-8 border-l border-b border-zinc-600" />
        </div>
        {/* Bottom-right */}
        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8">
          <div className="w-8 h-8 border-r border-b border-zinc-600 ml-auto" />
        </div>
      </div>

      {/* Scroll progress line */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-px bg-zinc-800 origin-top z-10"
        style={{ scaleY: scrollYProgress, opacity: 0.5 }}
      />

      {/* Main content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 min-h-screen flex flex-col"
      >
        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-20">
          <div className="max-w-5xl w-full">
            {/* Pre-heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-10 h-px bg-emerald-500" />
              <span className="text-xs text-zinc-500 uppercase tracking-[0.2em] font-medium">
                AI Growth Workforce Deployment
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.9] tracking-tight mb-8"
            >
              Deploy a Custom
              <br />
              <span className="text-emerald-400">AI Growth Team</span>
              <br />
              Inside Your Business
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-base sm:text-lg text-zinc-400 max-w-xl mb-10 leading-relaxed"
            >
              Research. Offers. Copy. Funnels. Email. SEO. Sales. Launch.
              Every discipline working as one coordinated AI workforce — built around your business goals.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <Link
                href="/contact"
                className="group flex items-center gap-2 px-8 py-3.5 bg-white text-black font-semibold text-sm rounded-lg hover:bg-zinc-200 transition-all duration-200"
              >
                Book a Strategy Call
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/services"
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors duration-200 px-2"
              >
                View Services
              </Link>
              <div className="hidden lg:block w-px h-4 bg-zinc-800 mx-2" />
              <Link
                href="/pricing"
                className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors duration-200 px-2"
              >
                From $497
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="border-t border-zinc-800/50 px-6 sm:px-12 lg:px-20 py-8"
        >
          <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <StatCounter key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Infinite marquee */}
      <div className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden py-4 border-t border-zinc-800/30">
        <div className="flex animate-marquee whitespace-nowrap">
          {marqueeItems.map((item, i) => (
            <span key={i} className="mx-8 text-sm text-zinc-600 font-medium tracking-wide flex items-center gap-8">
              {item}
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            </span>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-20 right-8 z-20 hidden lg:flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-zinc-600 uppercase tracking-widest writing-vertical">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-zinc-600 to-transparent" />
      </motion.div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .writing-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </div>
  );
}
