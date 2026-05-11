// Agent node colors — emerald/green/white/zinc only, NO purple/blue
export const AGENT_COLORS = [
  "#10b981", // emerald-500
  "#34d399", // emerald-400
  "#6ee7b7", // emerald-300
  "#a1a1aa", // zinc-400
  "#fafafa", // white
  "#d4d4d8", // zinc-300
];

export const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export const SOCIAL_LINKS = [
  { name: "Twitter", href: "https://twitter.com/aby", label: "@aby" },
  { name: "GitHub", href: "https://github.com/Agents-Coach", label: "GitHub" },
  { name: "LinkedIn", href: "https://linkedin.com/company/codematics", label: "LinkedIn" },
];

export const CONTACT_INFO = {
  email: "hello@codematics.ai",
  calendly: "https://cal.com",
};

export const SERVICE_TIERS = [
  {
    name: "Audit",
    price: "$497",
    type: "One-time",
    description: "AI Growth Workflow Audit — map your bottlenecks, recommend the right agent stack, and produce a clear implementation roadmap.",
    features: [
      "Operations audit (current workflows + tools)",
      "AI tool inventory + gap analysis",
      "Bottleneck mapping session",
      "Recommended agent architecture",
      "Implementation roadmap (PDF)",
    ],
    delivery: "5–7 business days",
    cta: "Book Audit",
    href: "/contact",
  },
  {
    name: "Build",
    price: "$1,497+",
    type: "Project",
    description: "Custom Agent Workforce Build — architecture, build, deploy, and team training. A fully operational AI workforce tailored to your operations.",
    features: [
      "Business context analysis",
      "Custom agent architecture design",
      "Skill development + knowledge base",
      "Workflow coordination setup",
      "Integrations (CRM, email, tools)",
      "Team training + documentation",
    ],
    delivery: "2–4 weeks",
    cta: "Start Build",
    href: "/contact",
    featured: true,
  },
  {
    name: "Partner",
    price: "$2,997/mo",
    type: "Monthly",
    description: "Growth Studio Operating Partner — everything in Build, plus ongoing optimization, refinement, and new capability deployment every month.",
    features: [
      "Everything in Build tier",
      "Monthly optimization calls",
      "Agent refinement + tuning",
      "New capability deployment",
      "Monthly performance report",
      "Slack/priority access",
    ],
    delivery: "Ongoing",
    cta: "Become a Partner",
    href: "/contact",
  },
];

export const USE_CASES = [
  {
    title: "Launch a new offer",
    description: "Get your offer, copy, landing page, and launch sequence built by your agent team — in days, not weeks.",
  },
  {
    title: "Build SEO authority",
    description: "Deploy research, content, and SEO agents to systematically build topical authority and organic traffic.",
  },
  {
    title: "Fix a broken funnel",
    description: "Audit your funnel, identify drop-off points, and rebuild it with conversion-optimized copy and flow.",
  },
  {
    title: "Build a content engine",
    description: "Scale your content production with agents that research, write, optimize, and publish consistently.",
  },
  {
    title: "Create a sales follow-up system",
    description: "Never lose a lead again. Build automated email sequences, SMS follow-ups, and CRM workflows.",
  },
  {
    title: "Automate agency delivery",
    description: "Deliver client work faster with an agent workforce that handles research, reporting, and execution.",
  },
  {
    title: "Scale content production",
    description: "Multiply your content output 10x with agents that maintain your voice and brand standards.",
  },
  {
    title: "Build custom AI operations",
    description: "Design a bespoke AI operating system for your specific industry, audience, and business model.",
  },
];

export const WORKFORCE_CONFIGS = [
  {
    name: "Starter",
    agents: 3,
    description: "For early-stage businesses. A focused team covering your most critical growth gaps.",
    agentsList: ["Research Agent", "Offer Architect Agent", "Copy Agent"],
    suitable: "Solo founders, early-stage startups",
    price: "From $1,497",
  },
  {
    name: "Growth",
    agents: 7,
    description: "For scaling businesses. A full growth stack across research, content, funnels, and sales.",
    agentsList: ["Research", "Offer", "Copy", "Funnel", "Email", "SEO", "Sales"],
    suitable: "SMBs, growing agencies, product companies",
    price: "From $2,997",
  },
  {
    name: "Studio",
    agents: 17,
    description: "Full Hermes Growth Studio. Every growth discipline coordinated as one intelligent system.",
    agentsList: ["All Growth agents", "+ Strategy", "+ Launch", "+ Analytics", "+ Retention", "+ Custom"],
    suitable: "Agencies, mid-market companies, ambitious brands",
    price: "From $4,997",
  },
];

export const ARCHITECTURE_STEPS = [
  {
    step: 1,
    title: "Business Goal",
    description: "Tell us what you're trying to achieve. Launch a product? Scale content? Fix a funnel?",
  },
  {
    step: 2,
    title: "Context Mapping",
    description: "We audit your current operations, tools, workflows, and bottlenecks to understand what needs to change.",
  },
  {
    step: 3,
    title: "Agent Architecture",
    description: "Design a custom agent team that fits your operations — the right number, the right roles, the right coordination.",
  },
  {
    step: 4,
    title: "Build & Deploy",
    description: "Develop agent skills, knowledge bases, workflows, and integrations. Deploy into your environment.",
  },
  {
    step: 5,
    title: "Optimize",
    description: "Measure, refine, and expand your agent workforce continuously based on real business results.",
  },
];
