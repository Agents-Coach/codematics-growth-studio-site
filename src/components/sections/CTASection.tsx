"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.unobserve(element); } },
      { threshold: 0.2 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" className="relative py-24 lg:py-40 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(16,185,129,0.06) 0%, transparent 70%)"
      }} />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: "radial-gradient(circle, #3f3f46 1px, transparent 1px)",
        backgroundSize: "32px 32px"
      }} />

      <div className="container-wide mx-auto max-w-3xl relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            Ready to Map Your AI Growth Workflow?
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Book a free strategy call. We'll map your business bottlenecks and show you exactly how an AI workforce could transform your operations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-semibold text-sm rounded-lg hover:bg-zinc-200 transition-all duration-200 text-center"
            >
              Book Your Free Strategy Call
            </Link>
            <a
              href="mailto:hello@codematics.ai"
              className="w-full sm:w-auto px-8 py-3.5 text-zinc-400 font-medium text-sm rounded-lg hover:text-white hover:bg-zinc-800/50 transition-all duration-200 text-center"
            >
              Or email hello@codematics.ai
            </a>
          </div>

          <p className="text-xs text-zinc-600 mt-6">
            No commitment. No sales pressure. Just clarity on what your AI growth workforce could look like.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
