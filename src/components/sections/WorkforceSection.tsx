"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { WORKFORCE_CONFIGS } from "@/lib/constants";

export default function WorkforceSection() {
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
    <section id="workforce" className="relative py-24 lg:py-32 px-4">
      <div className="container-wide mx-auto max-w-6xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            Built Around Your Business Operations
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Not every business needs 17 agents. Some need 3. Some need 10. The agent count isn't the value. The solved business bottleneck is the value.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {WORKFORCE_CONFIGS.map((config, i) => (
            <motion.div
              key={config.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              className="relative p-6 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700 transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-white">{config.name}</span>
                <span className="text-xs font-mono text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
                  {config.agents} agents
                </span>
              </div>
              <p className="text-sm text-zinc-400 mb-4 leading-relaxed flex-1">{config.description}</p>
              <div className="space-y-1 mb-5">
                {config.agentsList.map((agent) => (
                  <div key={agent} className="flex items-center gap-2 text-xs text-zinc-500">
                    <span className="w-1 h-1 rounded-full bg-emerald-500" />
                    {agent}
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-zinc-800/50">
                <p className="text-xs text-zinc-600 mb-3">{config.suitable}</p>
                <p className="text-sm font-semibold text-white">{config.price}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold text-sm rounded-lg hover:bg-zinc-200 transition-all"
          >
            Find Your Right Configuration
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
