import type { Metadata } from "next";
import Link from "next/link";
import { SERVICE_TIERS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services",
  description: "AI Growth Workforce services — audits, custom builds, and ongoing partnerships.",
};

const processSteps = [
  { step: 1, title: "Discovery Call", description: "We understand your business, goals, and current operations." },
  { step: 2, title: "Context Mapping", description: "Audit your workflows, tools, and identify the highest-leverage bottlenecks." },
  { step: 3, title: "Architecture Design", description: "Design a custom agent team — roles, skills, knowledge, and coordination flows." },
  { step: 4, title: "Build & Deploy", description: "Develop and deploy your agent workforce into your environment." },
  { step: 5, title: "Optimize & Scale", description: "Measure, refine, and expand your workforce based on real performance." },
];

const faqs = [
  { q: "How long does it take to deploy an agent workforce?", a: "A full build takes 2–4 weeks depending on complexity. An audit delivers in 5–7 business days. Partner engagements begin with a 2-week setup phase, then roll into monthly optimization." },
  { q: "What makes this different from using ChatGPT or Claude?", a: "Tools like ChatGPT are isolated — each conversation starts from scratch. An agent workforce has memory, context, and coordination. It compounds knowledge, maintains brand voice, and executes multi-step workflows without you re-explaining context every time." },
  { q: "Do I need technical skills to use this?", a: "No. We handle the technical build. Your role is defining business goals, reviewing outputs, and making decisions. We train your team on how to work with the agents." },
  { q: "How do you measure ROI?", a: "We track against your specific goals — time saved on specific tasks, content output volume, lead generation rates, conversion improvements. Every engagement starts with baseline metrics." },
  { q: "What if I need to change the agent setup later?", a: "That's built in. A good agent architecture adapts. Whether you pivot your offer, add a new channel, or scale to new markets — we adjust the workforce. Partner clients get ongoing refinement as part of their monthly engagement." },
];

export default function ServicesPage() {
  return (
    <main className="pt-32 pb-24 px-4">
      <div className="container-wide mx-auto max-w-4xl">
        <div className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 tracking-tight">
            AI Growth Workforce Services
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Three ways to bring an AI workforce into your business. From a focused audit to a fully managed partner engagement.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {SERVICE_TIERS.map((tier) => (
            <div key={tier.name} className={`p-6 rounded-xl flex flex-col ${tier.featured ? "bg-zinc-900 border-2 border-emerald-500/50" : "bg-zinc-900/50 border border-zinc-800/50"}`}>
              {tier.featured && <div className="mb-4 px-3 py-1 rounded-full bg-emerald-500 text-xs font-semibold text-white text-center w-fit">Most Popular</div>}
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{tier.type}</p>
              <span className="text-3xl font-bold text-white mb-1">{tier.price}</span>
              <p className="text-xs text-zinc-600 mb-4">{tier.delivery}</p>
              <h3 className="text-lg font-semibold text-white mb-2">{tier.name}</h3>
              <p className="text-sm text-zinc-400 mb-5 flex-1 leading-relaxed">{tier.description}</p>
              <div className="space-y-2 mb-6">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-xs text-zinc-400">{f}</span>
                  </div>
                ))}
              </div>
              <Link href={tier.href} className={`w-full py-3 rounded-lg text-sm font-semibold text-center transition-all ${tier.featured ? "bg-emerald-500 text-white hover:bg-emerald-400" : "bg-zinc-800 text-white hover:bg-zinc-700"}`}>
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white text-center mb-10">How We Work</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {processSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-bold text-white mx-auto mb-3">{step.step}</div>
                <h3 className="text-sm font-semibold text-white mb-1">{step.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white text-center mb-10">FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                <h3 className="text-base font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black font-semibold text-sm rounded-lg hover:bg-zinc-200 transition-all">
            Book a Strategy Call
          </Link>
        </div>
      </div>
    </main>
  );
}
