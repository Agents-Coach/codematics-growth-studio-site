"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { ARCHITECTURE_STEPS } from "@/lib/constants";

export default function ArchitectureSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.unobserve(element); } },
      { threshold: 0.1 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="relative py-24 lg:py-32 px-4">
      <div className="container-wide mx-auto max-w-5xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            How the Studio Works
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            From business goal to deployed AI workforce — in five steps.
          </p>
        </motion.div>

        {/* Desktop: horizontal flow */}
        <div className="hidden lg:flex items-start gap-3">
          {ARCHITECTURE_STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.12 }}
              className="flex-1 relative"
            >
              <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/50 h-full">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-bold text-white mb-3">
                  {step.step}
                </div>
                <h3 className="text-base font-semibold text-white mb-1.5">{step.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
              </div>
              {i < ARCHITECTURE_STEPS.length - 1 && (
                <div className="absolute top-1/2 -right-3 w-6 flex items-center justify-center z-10">
                  <svg className="w-4 h-4 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Mobile: vertical flow */}
        <div className="lg:hidden flex flex-col gap-4">
          {ARCHITECTURE_STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {step.step}
                </div>
                {i < ARCHITECTURE_STEPS.length - 1 && (
                  <div className="w-px flex-1 bg-zinc-800 my-2" />
                )}
              </div>
              <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/50 flex-1">
                <h3 className="text-base font-semibold text-white mb-1.5">{step.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
