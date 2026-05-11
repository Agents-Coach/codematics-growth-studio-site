"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { SERVICE_TIERS } from "@/lib/constants";

export default function PackagesSection() {
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
    <section id="pricing" className="relative py-24 lg:py-32 px-4 bg-zinc-950/50">
      <div className="container-wide mx-auto max-w-5xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            How We Work Together
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Three ways to bring an AI workforce into your business.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICE_TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className={`relative p-6 rounded-xl flex flex-col ${
                tier.featured
                  ? "bg-zinc-900 border-2 border-emerald-500/50"
                  : "bg-zinc-900/50 border border-zinc-800/50"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500 text-xs font-semibold text-white">
                  Most Popular
                </div>
              )}

              <div className="mb-5">
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{tier.type}</p>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-3xl font-bold text-white">{tier.price}</span>
                </div>
                <p className="text-xs text-zinc-600">{tier.delivery}</p>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">{tier.name}</h3>
              <p className="text-sm text-zinc-400 mb-5 leading-relaxed flex-1">{tier.description}</p>

              <div className="space-y-2 mb-6">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-xs text-zinc-400">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href={tier.href}
                className={`w-full py-3 rounded-lg text-sm font-semibold text-center transition-all duration-200 ${
                  tier.featured
                    ? "bg-emerald-500 text-white hover:bg-emerald-400"
                    : "bg-zinc-800 text-white hover:bg-zinc-700"
                }`}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
