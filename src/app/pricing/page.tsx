import type { Metadata } from "next";
import Link from "next/link";
import { SERVICE_TIERS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Investment in your AI growth workforce — audits from $497, custom builds from $1,497, partnerships from $2,997/mo.",
};

const comparisonFeatures = [
  { feature: "Operations audit", audit: true, build: true, partner: true },
  { feature: "Agent architecture design", audit: false, build: true, partner: true },
  { feature: "Skill development", audit: false, build: true, partner: true },
  { feature: "Workflow building", audit: false, build: true, partner: true },
  { feature: "Team training", audit: false, build: true, partner: true },
  { feature: "Ongoing optimization", audit: false, build: false, partner: true },
  { feature: "Monthly calls", audit: false, build: false, partner: true },
  { feature: "Priority Slack access", audit: false, build: false, partner: true },
  { feature: "New capability deployment", audit: false, build: false, partner: true },
];

const faqs = [
  { q: "How long does it take to deploy an agent workforce?", a: "A full build takes 2–4 weeks depending on complexity. An audit delivers in 5–7 business days. Partner engagements begin with a 2-week setup phase." },
  { q: "What makes this different from using ChatGPT or Claude?", a: "Tools like ChatGPT are isolated — each conversation starts from scratch. An agent workforce has memory, context, and coordination. It compounds knowledge and executes multi-step workflows without re-explaining context every time." },
  { q: "Do I need technical skills to use this?", a: "No. We handle the technical build. Your role is defining business goals, reviewing outputs, and making decisions. We train your team on how to work with the agents." },
  { q: "What if I need to change the agent setup later?", a: "A good agent architecture adapts. Whether you pivot your offer, add a new channel, or scale to new markets — we adjust the workforce. Partner clients get ongoing refinement as part of their monthly engagement." },
  { q: "Do you offer payment plans?", a: "Yes. Build engagements can be split into milestones. Partner engagements are monthly. Audit is a one-time payment." },
];

export default function PricingPage() {
  return (
    <main className="pt-32 pb-24 px-4">
      <div className="container-wide mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 tracking-tight">
            Investment in Your AI Growth Workforce
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Three tiers. No hidden fees. Choose the engagement that fits where you are right now.
          </p>
        </div>

        {/* Pricing Cards */}
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

        {/* Comparison */}
        <div className="mb-20 overflow-x-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">What's Included</h2>
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 text-sm font-semibold text-white">Feature</th>
                <th className="text-center py-3 text-xs text-zinc-500 px-2">Audit<br /><span className="font-normal text-zinc-600">$497</span></th>
                <th className="text-center py-3 text-xs text-zinc-500 px-2">Build<br /><span className="font-normal text-zinc-600">$1,497+</span></th>
                <th className="text-center py-3 text-xs text-zinc-500 px-2">Partner<br /><span className="font-normal text-zinc-600">$2,997/mo</span></th>
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((row) => (
                <tr key={row.feature} className="border-b border-zinc-800/50">
                  <td className="py-3 text-sm text-zinc-400">{row.feature}</td>
                  <td className="py-3 text-center">{row.audit ? <svg className="w-4 h-4 text-emerald-500 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg> : <svg className="w-4 h-4 text-zinc-700 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>}</td>
                  <td className="py-3 text-center">{row.build ? <svg className="w-4 h-4 text-emerald-500 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg> : <svg className="w-4 h-4 text-zinc-700 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>}</td>
                  <td className="py-3 text-center">{row.partner ? <svg className="w-4 h-4 text-emerald-500 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg> : <svg className="w-4 h-4 text-zinc-700 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Not sure */}
        <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 mb-12">
          <h2 className="text-xl font-bold text-white mb-3">Not sure which tier fits?</h2>
          <p className="text-zinc-400 leading-relaxed">
            Most businesses start with the Audit. It's a one-time $497 investment that gives you complete clarity on where your biggest operational bottlenecks are and what a custom AI workforce would actually look like for your business. From there, you can decide if a full build makes sense — or skip straight to a Partner engagement if you want to move fast.
          </p>
        </div>

        {/* Guarantee */}
        <div className="p-6 rounded-xl border border-zinc-800/50 mb-12">
          <p className="text-center text-sm text-zinc-500">
            <span className="text-emerald-400 font-medium">100% satisfaction guarantee.</span> If the audit doesn't deliver actionable insights, we'll refund it. No questions.
          </p>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white text-center mb-8">FAQ</h2>
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
