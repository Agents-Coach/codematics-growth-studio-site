"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      setIsClosing(false);
      onClose();
      document.body.style.overflow = "";
    }, 300);
  };

  const handleLinkClick = () => {
    handleClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-40 lg:hidden
          transition-all duration-300 ease-out
          ${isOpen && !isClosing
            ? "opacity-100"
            : "opacity-0"
          }
          ${!isOpen && !isClosing ? "pointer-events-none" : "pointer-events-auto"}
        `}
        onClick={handleClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Menu Panel */}
      <div
        className={`
          fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm
          bg-zinc-950/95 backdrop-blur-xl
          border-l border-zinc-800/50
          transition-transform duration-300 ease-out
          ${isOpen && !isClosing
            ? "translate-x-0"
            : "translate-x-full"
          }
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between h-16 lg:h-20 px-6 border-b border-zinc-800/50">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={handleLinkClick}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Codematics
            </span>
          </Link>

          <button
            type="button"
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors duration-200"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Content */}
        <nav className="flex flex-col p-6 gap-2">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className={`
                group flex items-center justify-between
                px-4 py-3.5
                text-zinc-300 hover:text-white
                rounded-lg hover:bg-zinc-800/50
                transition-all duration-200
              `}
            >
              <span className="text-base font-medium">{link.label}</span>
              <svg
                className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all duration-200"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </nav>

        {/* Menu Footer with CTA */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-zinc-800/50 bg-zinc-950/50">
          <Link
            href="/#contact"
            onClick={handleLinkClick}
            className="
              flex items-center justify-center gap-2 w-full
              px-6 py-3.5
              bg-gradient-to-r from-violet-600 to-purple-600
              text-white text-sm font-semibold rounded-full
              shadow-lg shadow-violet-500/25
              hover:shadow-violet-500/40 hover:from-violet-500 hover:to-purple-500
              active:scale-[0.98]
              transition-all duration-300
            "
          >
            Get Started
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-zinc-800/30">
            <a
              href="https://twitter.com/codematics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition-colors duration-200"
              aria-label="Twitter"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://github.com/codematics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition-colors duration-200"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/company/codematics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
