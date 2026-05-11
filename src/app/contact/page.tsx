import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a free strategy call with Codematics Growth Studio. Map your AI growth workflow.",
};

export default function ContactPage() {
  return (
    <main className="pt-32 pb-24 px-4">
      <div className="container-wide mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 tracking-tight">
            Book a Strategy Call
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Tell us about your business and we'll map the best path forward.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Form */}
          <div className="lg:col-span-3">
            <form className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Full name <span className="text-zinc-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Jane Smith"
                    className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Work email <span className="text-zinc-600">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="jane@company.com"
                    className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    placeholder="Acme Inc."
                    className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Your role
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    placeholder="Founder / CEO / Marketing Lead"
                    className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="challenge" className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Biggest business challenge right now <span className="text-zinc-600">*</span>
                </label>
                <textarea
                  id="challenge"
                  name="challenge"
                  required
                  rows={4}
                  placeholder="We're launching a new offer but struggling to create enough copy and content to support the launch..."
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Budget range
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Select range</option>
                    <option value="<1k">Less than $1,000</option>
                    <option value="1k-3k">$1,000 – $3,000</option>
                    <option value="3k-5k">$3,000 – $5,000</option>
                    <option value="5k+">$5,000+</option>
                    <option value="unsure">Not sure yet</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="source" className="block text-sm font-medium text-zinc-300 mb-1.5">
                    How did you hear about us?
                  </label>
                  <select
                    id="source"
                    name="source"
                    className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Select one</option>
                    <option value="twitter">Twitter / X</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="search">Google / Search</option>
                    <option value="friend">Friend or colleague</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-semibold text-sm rounded-lg hover:bg-zinc-200 transition-all duration-200"
                >
                  Book My Strategy Call
                </button>
                <p className="text-xs text-zinc-600 mt-3">
                  We'll review your submission within 24 hours and reach out to schedule.
                </p>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <h3 className="text-sm font-semibold text-white mb-4">What happens next</h3>
              <ul className="space-y-3">
                {[
                  "We review your submission within 24 hours",
                  "Book a 30-minute discovery call",
                  "We map your bottlenecks together on the call",
                  "Get a custom recommendation within 48 hours",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xs font-semibold text-emerald-400 shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-zinc-400">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <h3 className="text-sm font-semibold text-white mb-3">Prefer email?</h3>
              <p className="text-sm text-zinc-400 mb-3">
                Reach us directly at{" "}
                <a href="mailto:hello@codematics.ai" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  hello@codematics.ai
                </a>
              </p>
              <p className="text-xs text-zinc-600">
                We respond to all inquiries within one business day.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-zinc-800/50">
              <h3 className="text-sm font-semibold text-white mb-3">FAQ</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-white mb-1">Is this call really free?</p>
                  <p className="text-xs text-zinc-500">Yes. The discovery call is completely free and has no commitment.</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-white mb-1">How long is the call?</p>
                  <p className="text-xs text-zinc-500">30 minutes. We keep it focused and actionable.</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-white mb-1">Do you work with early-stage businesses?</p>
                  <p className="text-xs text-zinc-500">Yes. Our Audit tier is designed for early-stage businesses and solopreneurs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
