import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "About Codematics Growth Studio — we design and deploy custom AI agent workforces around your specific operations.",
};

export default function AboutPage() {
  return (
    <main className="pt-32 pb-24 px-4">
      <div className="container-wide mx-auto max-w-4xl">
        <div className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 tracking-tight">
            About Codematics Growth Studio
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            We build custom AI workforces that think, plan, and execute across every growth discipline — without the coordination overhead.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Who We Are</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              We started Codematics Growth Studio with a simple observation: most businesses aren't failing because they lack AI tools. They're failing because they lack an AI operating system.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              After years of watching teams pile on subscriptions, duct-tape workflows together, and wonder why nothing compounds — we built a different approach. One where every AI agent knows the business, shares context, and works toward the same outcomes.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">What We Do</h2>
            <ul className="space-y-3">
              {[
                "Design custom agent architectures for your specific operations",
                "Build skills, knowledge bases, and coordination workflows",
                "Deploy and integrate agents into your existing stack",
                "Continuously optimize based on real business results",
                "Train your team to work with and lead AI agents",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span className="text-zinc-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 mb-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" className="w-5 h-5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Built on Hermes Growth Studio</h2>
          </div>
          <p className="text-zinc-400 leading-relaxed mb-4">
            Our agent architecture is powered by Hermes Growth Studio — a production-grade, open-source AI agent framework. It's the same architecture behind our own operations and the 17-agent system that powers our workflow.
          </p>
          <p className="text-zinc-400 leading-relaxed">
            Hermes is MIT licensed, meaning every agent workforce we build for you is built on solid, auditable infrastructure — not a black-box SaaS. When we build your workforce, you're not locked into proprietary systems.
          </p>
        </div>

        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white text-center mb-10">Our Values</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { title: "Clarity Over Complexity", description: "We simplify, not complicate. If something doesn't serve the outcome, we cut it." },
              { title: "Agents Serve, Not Replace", description: "AI agents amplify human judgment. We design systems that make your team sharper, not redundant." },
              { title: "Systems Thinking", description: "We don't optimize parts in isolation. We look at the whole operation and find where leverage lives." },
              { title: "Continuous Optimization", description: "A deployed workforce isn't done. It's a living system that gets better with every cycle." },
            ].map((v) => (
              <div key={v.title} className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                <h3 className="text-base font-semibold text-white mb-2">{v.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to build your AI workforce?</h2>
          <p className="text-zinc-400 mb-8">Start with an audit or jump straight into a build.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black font-semibold text-sm rounded-lg hover:bg-zinc-200 transition-all">
            Book a Strategy Call
          </Link>
        </div>
      </div>
    </main>
  );
}
