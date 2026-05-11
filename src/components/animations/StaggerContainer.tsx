"use client";

import { useRef, useEffect, useState, ReactNode } from "react";
import { motion } from "motion/react";

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
  delay?: number;
}

export default function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = "",
  delay = 0,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (!isInView) {
    return <div ref={ref} className={className} />;
  }

  const childArray = Array.isArray(children) ? children : [children];

  return (
    <div ref={ref} className={className}>
      {childArray.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: delay + i * staggerDelay }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
