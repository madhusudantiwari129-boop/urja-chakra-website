import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  BatteryCharging,
  Bolt,
  BrainCircuit,
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Factory,
  Gauge,
  Globe2,
  Leaf,
  Lightbulb,
  LineChart as LineChartIcon,
  Menu,
  Moon,
  MoveUpRight,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type IconType = typeof Bolt;

interface Step {
  number: string;
  title: string;
  description: string;
  detail: string;
  icon: IconType;
}

interface FlowStep {
  label: string;
  description: string;
  icon: IconType;
}

interface Transaction {
  title: string;
  amount: string;
  date: string;
  positive: boolean;
}

const chartData = [
  { day: "01", baseline: 420, actual: 438 },
  { day: "05", baseline: 455, actual: 462 },
  { day: "09", baseline: 440, actual: 471 },
  { day: "13", baseline: 480, actual: 468 },
  { day: "17", baseline: 462, actual: 503 },
  { day: "21", baseline: 490, actual: 515 },
  { day: "25", baseline: 474, actual: 446 },
  { day: "29", baseline: 510, actual: 432 },
  { day: "30", baseline: 505, actual: 418 },
];

const anomalyData = [
  { hour: "06:00", load: 36, expected: 34 },
  { hour: "08:00", load: 41, expected: 40 },
  { hour: "10:00", load: 45, expected: 43 },
  { hour: "12:00", load: 48, expected: 45 },
  { hour: "14:00", load: 71, expected: 46 },
  { hour: "16:00", load: 76, expected: 47 },
  { hour: "18:00", load: 51, expected: 45 },
  { hour: "20:00", load: 44, expected: 42 },
];

const problemCards = [
  { title: "Idle & Off-Shift Running", copy: "Machines consume electricity while producing nothing.", icon: Activity, color: "amber" },
  { title: "Compressed-Air Leaks", copy: "Continuous hidden energy loss quietly compounds every hour.", icon: Gauge, color: "sky" },
  { title: "Maximum-Demand Spikes", copy: "Poorly timed demand increases electricity costs.", icon: TrendingUp, color: "rose" },
  { title: "Equipment Drift", copy: "Growing consumption can signal waste or equipment problems.", icon: TrendingDown, color: "emerald" },
];

const flowSteps: FlowStep[] = [
  { label: "Measure", description: "Bring every meter and operating signal into one view.", icon: Gauge },
  { label: "Baseline", description: "Understand what good performance looks like for this facility.", icon: LineChartIcon },
  { label: "Detect Waste", description: "Surface idle loads, drift and unusual patterns early.", icon: Search },
  { label: "Save Energy", description: "Turn insights into ranked, practical improvements.", icon: Leaf },
  { label: "Verify", description: "Compare actual consumption with the expected baseline.", icon: ShieldCheck },
  { label: "Earn UEC", description: "Convert verified savings into URJA Energy Credits.", icon: CircleDollarSign },
  { label: "Trade", description: "Give verified efficiency a market value.", icon: ArrowDownRight },
  { label: "Reinvest", description: "Put value back into the next improvement.", icon: Wallet },
];

const howItWorks: Step[] = [
  { number: "01", title: "Connect", description: "Meter and facility data enters the platform.", detail: "URJA-CHAKRA is designed to accept smart-meter readings, CT clamps and production context without asking a facility to replace its operating systems.", icon: Network },
  { number: "02", title: "Understand", description: "Build a machinery-aware energy baseline.", detail: "Registered equipment, operating hours, historical consumption and production become the context behind every expected-value calculation.", icon: BrainCircuit },
  { number: "03", title: "Detect", description: "Find waste before it becomes a monthly surprise.", detail: "The intelligence layer flags unusual consumption, idle loads, equipment drift and potential anomalies for an operator to review.", icon: Search },
  { number: "04", title: "Improve", description: "Rank action by savings and payback.", detail: "Recommendations turn a signal into a decision: what to fix first, how much it could save and how quickly it can pay back.", icon: Sparkles },
  { number: "05", title: "Verify", description: "Prove performance against the expected baseline.", detail: "Actual consumption is compared against the facility-specific baseline, creating a transparent evidence trail for savings.", icon: ShieldCheck },
  { number: "06", title: "Earn", description: "Generate URJA Energy Credits.", detail: "Every 1,000 kWh of verified electricity saved becomes 1 UEC — a unit that can be held, traded or reinvested.", icon: CircleDollarSign },
];

const architecture = [
  { label: "EDGE", tech: "ESP32 / Smart Meter / CT Clamps", copy: "Collect high-frequency readings where energy is consumed.", icon: Gauge },
  { label: "INGEST", tech: "MQTT / FastAPI / Validation", copy: "Validate and stream trusted data into the platform.", icon: Network },
  { label: "STORE", tech: "TimescaleDB / PostgreSQL / Redis", copy: "Keep time-series, facility and live-state data ready to query.", icon: BarChart3 },
  { label: "INTELLIGENCE", tech: "Regression / LSTM / Isolation Forest", copy: "Translate raw readings into baselines, forecasts and anomalies.", icon: BrainCircuit },
  { label: "APPLICATION", tech: "React Dashboard / Console / Marketplace", copy: "Make efficiency visible to operators, regulators and buyers.", icon: Building2 },
];

const recommendations = [
  { title: "Compressed-Air Leak", savings: 9100, payback: 2, priority: 1, label: "High impact", icon: Zap },
  { title: "IE4 Motor Upgrade", savings: 18400, payback: 11, priority: 2, label: "Strategic", icon: Factory },
  { title: "Off-Peak Furnace Preheat", savings: 6750, payback: 0, priority: 3, label: "Quick win", icon: BatteryCharging },
];

const initialTransactions: Transaction[] = [
  { title: "Verified Energy Saving", amount: "+18 UEC", date: "Today · 09:42", positive: true },
  { title: "Credit Trade", amount: "−12 UEC", date: "Yesterday · 16:20", positive: false },
  { title: "Verified Energy Saving", amount: "+24 UEC", date: "12 Jun · 11:08", positive: true },
];

const energyTips = [
  "Switch off standby devices after operating hours.",
  "Keep AC set points near 24°C to reduce avoidable cooling load.",
  "Use natural lighting before switching on floor-wide fixtures.",
  "Avoid unnecessary appliance and machinery usage during idle shifts.",
  "Monitor peak-hour consumption before scheduling high-load equipment.",
];

const heroFlowSteps = [
  { label: "Factory", icon: Factory, description: "Energy is consumed by appliances and machinery across the facility." },
  { label: "Smart Meter", icon: Gauge, description: "Smart meters measure electricity consumption at useful intervals." },
  { label: "Analytics", icon: BarChart3, description: "Analytics identifies consumption patterns, anomalies and saving opportunities." },
  { label: "Verified Savings", icon: ShieldCheck, description: "Validated energy reduction is converted into URJA Credits." },
  { label: "UEC", icon: CircleDollarSign, description: "Verified savings become a transparent, traceable energy-credit unit." },
  { label: "Green Wallet", icon: Wallet, description: "Credit value is held for trading or reinvestment into the next improvement." },
];

const achievementBadges = [
  { icon: "⚡", title: "First Saver", copy: "Earned after the first verified saving.", unlocked: true },
  { icon: "🌱", title: "100 kWh Saved", copy: "Earned after 100 kWh of cumulative savings.", unlocked: true },
  { icon: "🏆", title: "Top Performer", copy: "Unlock by reaching the top 10% of facilities.", unlocked: false },
  { icon: "🔥", title: "7-Day Saving Streak", copy: "Earned by staying below baseline for seven days.", unlocked: true },
];

const faqs = [
  { question: "What is URJA-CHAKRA?", answer: "URJA-CHAKRA is a proposed unified energy-accounting platform that measures, analyzes and verifies electricity savings before turning them into usable value." },
  { question: "What are URJA Credits?", answer: "URJA Credits are prototype digital units representing verified energy savings. The calculator below uses a simplified 1 kWh = 1 credit demonstration rule." },
  { question: "How are energy savings verified?", answer: "Actual consumption is compared with a machinery-aware baseline using operating hours, production context and validated meter readings." },
  { question: "How does the Smart Meter work?", answer: "A smart meter records electricity consumption and sends interval data to the platform for validation, analysis and reporting." },
  { question: "How can users earn credits?", answer: "Users implement an improvement, operate below their expected baseline and receive credits after the resulting saving is verified." },
  { question: "How can URJA-CHAKRA reduce energy wastage?", answer: "It makes idle loads, demand spikes, equipment drift and other hidden waste visible, then ranks practical improvements by savings and payback." },
];

const EXACT_LOGO_URL = "https://customer-assets-wrfwihn1.emergentagent.net/job_verified-savings-app/artifacts/w26ga0fs_image.png";

function formatLakhs(value: number) {
  return `₹${(value / 100000).toFixed(2)}L`;
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function SectionHeading({ eyebrow, title, copy, light = false }: { eyebrow: string; title: string; copy: string; light?: boolean }) {
  return (
    <div className={`max-w-3xl ${light ? "text-white" : "text-slate-950"}`} data-testid={`section-heading-${eyebrow.toLowerCase().replaceAll(" ", "-")}`}>
      <div className={`mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] ${light ? "text-emerald-300" : "text-emerald-700"}`} data-testid={`section-eyebrow-${eyebrow.toLowerCase().replaceAll(" ", "-")}`}>
        <span className="h-px w-8 bg-current" /> {eyebrow}
      </div>
      <h2 className="font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl" data-testid={`section-title-${eyebrow.toLowerCase().replaceAll(" ", "-")}`}>{title}</h2>
      <p className={`mt-6 max-w-2xl text-base leading-7 ${light ? "text-slate-300" : "text-slate-600"}`} data-testid={`section-copy-${eyebrow.toLowerCase().replaceAll(" ", "-")}`}>{copy}</p>
    </div>
  );
}

function LogoPlaceholder({ small = false }: { small?: boolean }) {
  return (
    <div className={`logo-placeholder ${small ? "logo-placeholder-small" : ""}`} data-testid={small ? "footer-logo-placeholder" : "hero-logo-placeholder"}>
      <div className="logo-placeholder-ring" />
      <div className="logo-placeholder-face">
        <img src={EXACT_LOGO_URL} alt="Exact URJA-CHAKRA logo supplied by the user" data-testid={small ? "footer-exact-logo" : "hero-exact-logo"} />
      </div>
      <span className="logo-placeholder-note">supplied logo asset</span>
    </div>
  );
}

function AnimatedCounter({ target, suffix, label, index }: { target: number; suffix: string; label: string; index: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let animationFrame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setValue(target);
      } else {
        const start = performance.now();
        const animate = (time: number) => {
          const progress = Math.min(1, (time - start) / 1200);
          setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
          if (progress < 1) animationFrame = requestAnimationFrame(animate);
        };
        animationFrame = requestAnimationFrame(animate);
      }
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [target]);

  return <div ref={ref} className="impact-counter" data-testid={`impact-counter-${index}`}><strong>{value.toLocaleString("en-IN")}{suffix}</strong><span>{label}</span><small>Prototype / demo value</small></div>;
}

function Home() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [activeFlow, setActiveFlow] = useState(0);
  const [investigating, setInvestigating] = useState(false);
  const [improvementApplied, setImprovementApplied] = useState(false);
  const [energySaved, setEnergySaved] = useState(18200);
  const [uecEarned, setUecEarned] = useState(118);
  const [walletUec, setWalletUec] = useState(142);
  const [walletValue, setWalletValue] = useState(116000);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [marketMessage, setMarketMessage] = useState("Ready for a simulated trade");
  const [sortMode, setSortMode] = useState("savings");
  const [aiMode, setAiMode] = useState(0);
  const [activeHeroFlow, setActiveHeroFlow] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [creditInput, setCreditInput] = useState("120");
  const [optimizedKwh, setOptimizedKwh] = useState(95);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const sortedRecommendations = useMemo(() => {
    return [...recommendations].sort((a, b) => {
      if (sortMode === "payback") return a.payback - b.payback;
      if (sortMode === "priority") return a.priority - b.priority;
      return b.savings - a.savings;
    });
  }, [sortMode]);

  const progress = Math.min(100, Math.round((energySaved / 32000) * 100));
  const calculatorCredits = Math.max(0, Math.floor(Number(creditInput) || 0));
  const reductionPercentage = Math.round(((120 - optimizedKwh) / 120) * 100);

  const handleImprovement = () => {
    if (improvementApplied) return;
    setImprovementApplied(true);
    setEnergySaved((value) => value + 12000);
    setUecEarned((value) => value + Math.floor(12000 / 1000));
    setWalletUec((value) => value + 12);
    setWalletValue(128000);
    setTransactions((items) => [{ title: "Energy saving verified", amount: "+12 UEC", date: "Just now · 14:06", positive: true }, ...items]);
  };

  const handleTrade = (type: "buy" | "sell") => {
    if (type === "sell") {
      if (walletUec < 20) return;
      setWalletUec((value) => value - 20);
      setWalletValue((value) => value + 18000);
      setMarketMessage("20 UEC sold · ₹18,000 added to Green Wallet");
      setTransactions((items) => [{ title: "Credit Trade", amount: "−20 UEC", date: "Just now · 14:18", positive: false }, ...items]);
    } else {
      setWalletUec((value) => value + 20);
      setWalletValue((value) => Math.max(0, value - 18000));
      setMarketMessage("20 UEC purchased · settlement simulated");
      setTransactions((items) => [{ title: "Credit Purchase", amount: "+20 UEC", date: "Just now · 14:18", positive: true }, ...items]);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7faf8] text-slate-950" data-testid="urja-chakra-website">
      <header className="site-header" data-testid="sticky-navigation">
        <a href="#home" className="brand-lockup" data-testid="brand-home-link" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark"><img src={EXACT_LOGO_URL} alt="URJA-CHAKRA logo" data-testid="header-exact-logo" /></span>
          <span><strong>URJA-CHAKRA</strong><small>ऊर्जा चक्र</small></span>
        </a>
        <nav className={menuOpen ? "site-nav site-nav-open" : "site-nav"} data-testid="primary-navigation">
          {["Home", "Problem", "Solution", "How It Works", "Technology", "Impact", "Demo", "About"].map((item) => {
            const id = item.toLowerCase().replaceAll(" ", "-");
            return <a href={`#${id}`} key={item} data-testid={`nav-link-${id}`} onClick={() => setMenuOpen(false)}>{item}</a>;
          })}
          <Button className="header-demo-button" onClick={() => { navigate("/demo"); setMenuOpen(false); }} data-testid="header-launch-demo-button">Launch Demo <ArrowRight size={15} /></Button>
        </nav>
        <div className="header-utility-actions"><button className="theme-toggle-button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} data-testid="website-theme-toggle">{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}<span>{theme === "dark" ? "Light" : "Dark"}</span></button><Button variant="ghost" size="icon" className="mobile-menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" data-testid="mobile-menu-toggle">{menuOpen ? <X /> : <Menu />}</Button></div>
      </header>

      <section id="home" className="hero-section" data-testid="hero-section">
        <div className="hero-grid">
          <div className="hero-copy" data-testid="hero-copy">
            <Badge variant="outline" className="eyebrow-badge" data-testid="hero-eyebrow"><span className="status-dot" /> Smart India Hackathon 2026 · Prototype</Badge>
            <h1 data-testid="hero-title">Account for <em>every</em> watt.</h1>
            <p className="hero-lede" data-testid="hero-description">URJA-CHAKRA is a unified energy accounting platform that transforms verified electricity savings into tradable energy credits.</p>
            <div className="hero-actions" data-testid="hero-actions">
              <Button className="primary-cta" onClick={() => navigate("/demo")} data-testid="hero-launch-demo-button">Launch Interactive Demo <ArrowRight size={17} /></Button>
              <Button variant="outline" className="secondary-cta" onClick={() => scrollToId("solution")} data-testid="hero-explore-solution-button">Explore the Solution <MoveUpRight size={16} /></Button>
            </div>
            <div className="hero-proof" data-testid="hero-proof-points"><span>Measure.</span><span>Save.</span><span>Verify.</span><span>Earn.</span><span>Reinvest.</span></div>
          </div>
          <div className="hero-visual" data-testid="hero-visual">
            <div className="hero-visual-glow" />
            <div className="hero-orbit hero-orbit-one" /><div className="hero-orbit hero-orbit-two" />
            <LogoPlaceholder />
            <div className="hero-flow-card" data-testid="hero-energy-flow">
              <div className="flow-card-label"><span className="status-dot" /> Live energy flow</div>
              <div className="hero-flow-list">
                {heroFlowSteps.map(({ label, icon: FlowIcon }, index) => (
                  <button className={activeHeroFlow === index ? "hero-flow-node active" : "hero-flow-node"} onClick={() => setActiveHeroFlow(index)} key={label} data-testid={`hero-flow-node-${index}`}><span className="flow-node-icon"><FlowIcon size={14} /></span><span>{label}</span>{index < heroFlowSteps.length - 1 && <ArrowRight size={12} className="flow-arrow" />}</button>
                ))}
              </div>
              <div className="hero-flow-explanation" data-testid="hero-flow-explanation"><strong>{heroFlowSteps[activeHeroFlow].label}</strong><span>{heroFlowSteps[activeHeroFlow].description}</span></div>
            </div>
            <div className="hero-uec-chip" data-testid="hero-uec-equivalence"><span>1 UEC</span><small>1,000 kWh verified saved</small></div>
          </div>
        </div>
        <div className="hero-scroll-cue" data-testid="hero-scroll-cue"><span>Scroll to account for more</span><ChevronDown size={16} /></div>
      </section>

      <section id="problem" className="section-shell problem-section" data-testid="problem-section">
        <div className="section-topline"><span>01 / The gap</span><span>Energy efficiency is everywhere. Reward is not.</span></div>
        <SectionHeading eyebrow="The Problem" title="Industry saves energy. But who rewards the saving?" copy="The existing PAT mechanism primarily covers designated consumers. MSMEs, commercial buildings, malls and campuses need the same visibility — and an incentive to keep improving." />
        <div className="problem-grid" data-testid="problem-cards">
          {problemCards.map(({ title, copy, icon: ProblemIcon, color }, index) => <Card className={`problem-card problem-card-${color}`} key={title} data-testid={`problem-card-${index}`}><div className="card-index">0{index + 1}</div><div className="problem-icon"><ProblemIcon size={21} /></div><h3 data-testid={`problem-card-title-${index}`}>{title}</h3><p data-testid={`problem-card-copy-${index}`}>{copy}</p><ArrowRight size={17} className="card-arrow" /></Card>)}
        </div>
        <div className="missing-link" data-testid="missing-link-callout"><div><span className="callout-label">The missing link</span><h3>A smaller electricity bill is not enough.</h3></div><p>A facility can save thousands of units of electricity and receive nothing beyond the bill. URJA-CHAKRA makes the invisible visible — then makes it valuable.</p></div>
        <div className="stat-strip" data-testid="problem-statistics"><div><strong>3 years</strong><span>typical verification cycle</span></div><div><strong>MSMEs</strong><span>outside the designated consumer net</span></div><div><strong>1,000 kWh</strong><span>to create 1 UEC</span></div><div><strong>24 / 7</strong><span>machine-aware monitoring</span></div></div>
        <div className="daily-tip-card" data-testid="energy-tip-card"><span className="daily-tip-icon"><Lightbulb size={20} /></span><div><span className="mini-kicker">ENERGY SAVING TIP · {tipIndex + 1} / {energyTips.length}</span><strong>{energyTips[tipIndex]}</strong><small>Small operating habits can compound into measurable savings.</small></div><button onClick={() => setTipIndex((index) => (index + 1) % energyTips.length)} data-testid="next-energy-tip-button">Next Tip <ArrowRight size={14} /></button></div>
      </section>

      <section id="solution" className="section-shell solution-section" data-testid="solution-section">
        <div className="section-topline"><span>02 / The platform</span><span>One loop. Every watt accounted for.</span></div>
        <SectionHeading eyebrow="The Solution" title="One platform. Every watt accounted for." copy="URJA-CHAKRA connects measurement, intelligence, verification and value in one continuous operating loop." />
        <div className="solution-layout">
          <div className="flow-wheel" data-testid="solution-flow-wheel">
            <div className="flow-wheel-center"><span className="mini-kicker">THE LOOP</span><strong>Save<br /><em>→</em> value</strong><span>energy accounting, closed</span></div>
            {flowSteps.map(({ label, icon: FlowIcon }, index) => { const angle = (index / flowSteps.length) * 360 - 90; const x = 50 + 40 * Math.cos((angle * Math.PI) / 180); const y = 50 + 40 * Math.sin((angle * Math.PI) / 180); return <button key={label} className={activeFlow === index ? "flow-wheel-step active" : "flow-wheel-step"} style={{ left: `${x}%`, top: `${y}%` }} onMouseEnter={() => setActiveFlow(index)} onFocus={() => setActiveFlow(index)} onClick={() => setActiveFlow(index)} data-testid={`solution-flow-step-${index}`}><span><FlowIcon size={15} /></span><small>{label}</small></button>; })}
          </div>
          <div className="flow-explanation" data-testid="solution-flow-explanation"><span className="flow-step-number">0{activeFlow + 1} / 08</span><h3>{flowSteps[activeFlow].label}</h3><p>{flowSteps[activeFlow].description}</p><div className="flow-explanation-foot"><Check size={15} /> Hover or select any node to explore the loop</div></div>
        </div>
      </section>

      <section id="how-it-works" className="dark-section how-section" data-testid="how-it-works-section">
        <div className="section-shell">
          <div className="section-topline dark-line"><span>03 / The method</span><span>From signal to verified value</span></div>
          <SectionHeading light eyebrow="How It Works" title="Six steps from raw energy to earned value." copy="A clear operating model for facilities, auditors and buyers — designed to make every decision traceable." />
          <div className="steps-layout" data-testid="how-it-works-steps">
            <div className="steps-list">{howItWorks.map((step, index) => { const StepIcon = step.icon; return <button className={activeStep === index ? "step-row active" : "step-row"} onClick={() => setActiveStep(index)} key={step.number} data-testid={`how-step-${index}`}><span className="step-number">{step.number}</span><span className="step-icon"><StepIcon size={18} /></span><span className="step-title">{step.title}</span><ArrowRight size={17} className="step-arrow" /></button>; })}</div>
            <div className="step-detail" data-testid="how-step-detail"><span className="detail-kicker">Now exploring · {howItWorks[activeStep].number}</span><h3>{howItWorks[activeStep].title}</h3><p>{howItWorks[activeStep].detail}</p><div className="detail-rule" /><div className="detail-tag"><span className="status-dot" /> {howItWorks[activeStep].description}</div></div>
          </div>
        </div>
      </section>

      <section id="demo" className="section-shell demo-section" data-testid="demo-section">
        <div className="section-topline"><span>04 / Product demo</span><span>Mock data · deterministic simulation</span></div>
        <div className="demo-heading-row"><SectionHeading eyebrow="Interactive Demo" title="See your energy savings become value." copy="A guided facility view for Sharma Steel Rolling Mills, Jaipur. Investigate a real signal, implement an action and watch verified savings move into the wallet." /><div className="demo-facility-meta" data-testid="demo-facility-meta"><span className="status-dot" /> Facility online<strong>Sharma Steel Rolling Mills</strong><small>Jaipur · UDYAM-RJ-17-0043291</small></div></div>
        <Card className="demo-console" data-testid="demo-console">
          <div className="console-topbar"><div><span className="console-label">FACILITY CONTROL ROOM</span><h3>Sharma Steel <span>Rolling Mills</span></h3></div><div className="console-actions"><Badge data-testid="demo-online-badge"><span className="status-dot" /> 98.4% data quality</Badge><span className="console-live">LIVE SIMULATION</span></div></div>
          <div className="metric-grid" data-testid="demo-metrics">
            {[{ label: "Today's Consumption", value: improvementApplied ? "11,420" : "12,086", unit: "kWh", icon: Bolt }, { label: "Monthly Consumption", value: improvementApplied ? "286,390" : "298,390", unit: "kWh", icon: BarChart3 }, { label: "Energy Saved", value: energySaved.toLocaleString("en-IN"), unit: "kWh", icon: TrendingDown }, { label: "Savings Target", value: "32,000", unit: "kWh", icon: Target }, { label: "UEC Earned", value: uecEarned.toString(), unit: "UEC", icon: CircleDollarSign }, { label: "Green Wallet", value: formatLakhs(walletValue), unit: "capex", icon: Wallet }].map(({ label, value, unit, icon: MetricIcon }, index) => <div className={index === 4 || index === 5 ? "metric-card highlight" : "metric-card"} key={label} data-testid={`demo-metric-${index}`}><span className="metric-icon"><MetricIcon size={16} /></span><span className="metric-label">{label}</span><strong>{value}</strong><small>{unit}</small></div>)}
          </div>
          <div className="console-main-grid">
            <div className="chart-panel" data-testid="demo-consumption-chart"><div className="panel-heading"><div><span className="console-label">ENERGY PERFORMANCE</span><h4>Actual consumption vs baseline</h4></div><div className="chart-legend"><span><i className="legend-line baseline-line" /> Baseline</span><span><i className="legend-line actual-line" /> Actual</span></div></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}><CartesianGrid stroke="#d6e1dc" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="day" tick={{ fill: "#789087", fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: "#789087", fontSize: 10 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #d6e1dc", fontSize: 12 }} /><Line type="monotone" dataKey="baseline" stroke="#7c9a8d" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="actual" stroke="#0f9f6e" strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer></div><div className="chart-footer"><span><TrendingDown size={14} /> 8.8% below baseline after last action</span><span>Last 30 days</span></div></div>
            <div className={investigating ? "alert-panel investigating" : "alert-panel"} data-testid="demo-alert-panel"><div className="alert-top"><span className="alert-pulse"><span /></span><span className="console-label">ANOMALY DETECTED</span><Badge variant="destructive" data-testid="demo-anomaly-badge">Needs review</Badge></div><h4>Line 2 compressor drawing <strong>34% above baseline</strong></h4><p>Potential compressed-air leak detected from machine-aware comparison.</p>{!investigating ? <Button variant="outline" className="investigate-button" onClick={() => setInvestigating(true)} data-testid="demo-investigate-button">Investigate <Search size={15} /></Button> : <div className="investigation-detail" data-testid="demo-investigation-detail"><div className="investigation-grid"><span>Machine<strong>Compressor Line 2</strong></span><span>Current load<strong>76 kW</strong></span><span>Expected load<strong>42 kW</strong></span><span>Excess consumption<strong>34 kW</strong></span><span>Annual loss<strong>9,100 kWh</strong></span></div><div className="recommendation"><span className="mini-kicker">RECOMMENDED ACTION</span><strong>Fix compressed-air leaks on Line 2</strong><small>Estimated saving: <b>9,100 kWh/year</b> · Payback: <b>2 months</b></small><Button className={improvementApplied ? "improvement-button applied" : "improvement-button"} onClick={handleImprovement} disabled={improvementApplied} data-testid="demo-implement-improvement-button">{improvementApplied ? <><Check size={15} /> Improvement implemented</> : <>Implement Improvement <ArrowRight size={15} /></>}</Button></div></div>}</div>
          </div>
          <div className={improvementApplied ? "verification-banner visible" : "verification-banner"} data-testid="demo-verification-banner"><div className="verification-icon"><Check size={18} /></div><div><strong>Energy saving verified</strong><span>12,000 kWh added to the evidence trail</span></div><span className="verified-pill">+12 UEC VERIFIED</span></div>
          <div className="demo-progress-row"><div><span>Target progress</span><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div><strong>{progress}% <small>of 32,000 kWh</small></strong></div>
        </Card>
        <div className="demo-bottom-cta"><p><span className="status-dot" /> Demo state updates instantly — no hardware connection required.</p><Button variant="outline" onClick={() => scrollToId("wallet")} data-testid="open-green-wallet-button">Open Green Wallet <ArrowRight size={16} /></Button></div>
        <div className="demo-micro-tools" data-testid="demo-micro-tools"><section className="credit-calculator" data-testid="credit-calculator"><div className="micro-tool-heading"><div><span className="mini-kicker">MINI CALCULATOR · PROTOTYPE</span><h3>Estimate URJA Credits</h3></div><CircleDollarSign size={20} /></div><label htmlFor="energy-saved-input">Energy Saved (kWh)</label><input id="energy-saved-input" type="number" min="0" step="1" value={creditInput} onChange={(event) => setCreditInput(event.target.value)} data-testid="energy-saved-input" /><div className="calculator-result" data-testid="credit-calculator-result"><span>URJA Credits</span><strong>{calculatorCredits.toLocaleString("en-IN")}</strong></div><p>Credits are awarded for verified energy savings.</p><small>Prototype conversion: 1 kWh saved = 1 URJA Credit.</small></section><section className="before-after-card" data-testid="before-after-comparison"><div className="micro-tool-heading"><div><span className="mini-kicker">VERIFIED SAVING · DEMO</span><h3>Before vs after</h3></div><strong>{reductionPercentage}% reduction</strong></div><div className="comparison-bars"><div><span>Baseline<strong>120 kWh</strong></span><i><b style={{ width: "100%" }} /></i></div><div><span>Optimized<strong>{optimizedKwh} kWh</strong></span><i><b className="optimized-bar" style={{ width: `${(optimizedKwh / 120) * 100}%` }} /></i></div></div><label htmlFor="optimized-consumption">Adjust optimized consumption</label><input id="optimized-consumption" type="range" min="70" max="119" value={optimizedKwh} onChange={(event) => setOptimizedKwh(Number(event.target.value))} data-testid="optimized-consumption-slider" /><p>Values represent verified savings after optimization using prototype/demo data.</p></section></div>
      </section>

      <section id="wallet" className="dark-section wallet-section" data-testid="wallet-section"><div className="section-shell"><div className="section-topline dark-line"><span>05 / Green wallet</span><span>Value that stays in motion</span></div><div className="wallet-grid"><div><SectionHeading light eyebrow="Green Wallet" title="Reinvest the proof." copy="Verified savings become a balance for the next improvement — keeping capital, confidence and energy efficiency moving in the same direction." /><div className="wallet-balance" data-testid="wallet-balance"><span>GREEN CAPEX BALANCE</span><strong>{formatLakhs(Math.max(0, walletValue))}</strong><small>available for efficiency upgrades</small><div className="wallet-balance-line"><span><CircleDollarSign size={15} /> {walletUec} UEC</span><span>+12.4% this month <TrendingUp size={13} /></span></div></div></div><div className="wallet-history" data-testid="wallet-transaction-history"><div className="wallet-history-heading"><span className="console-label">TRANSACTION TIMELINE</span><span className="status-dot" /></div>{transactions.slice(0, 4).map((transaction, index) => <div className="transaction-row" key={`${transaction.title}-${transaction.date}-${index}`} data-testid={`wallet-transaction-${index}`}><span className={transaction.positive ? "transaction-icon positive" : "transaction-icon negative"}>{transaction.positive ? <TrendingUp size={15} /> : <ArrowDownRight size={15} />}</span><span><strong>{transaction.title}</strong><small>{transaction.date}</small></span><b className={transaction.positive ? "transaction-positive" : "transaction-negative"}>{transaction.amount}</b></div>)}<div className="wallet-use"><span className="mini-kicker">USE BALANCE FOR</span><div>{["IE4 motors", "Variable-frequency drives", "LED retrofits", "Rooftop solar", "Waste-heat recovery", "Metering hardware", "Energy audits", "Efficiency loans"].map((use) => <span key={use}>{use}</span>)}</div></div></div></div></div></section>

      <section className="achievement-section" data-testid="achievement-section"><div className="achievement-inner"><div className="achievement-heading"><span className="mini-kicker">FACILITY ACHIEVEMENTS · DEMO</span><h3>Progress worth recognizing.</h3></div><div className="achievement-grid">{achievementBadges.map((badge, index) => <div className={badge.unlocked ? "achievement-badge unlocked" : "achievement-badge locked"} title={badge.copy} key={badge.title} data-testid={`achievement-badge-${index}`}><span className="achievement-emoji" aria-hidden="true">{badge.icon}</span><span><strong>{badge.title}</strong><small>{badge.copy}</small></span><b>{badge.unlocked ? "Unlocked" : "Locked"}</b></div>)}</div></div></section>

      <section id="marketplace" className="section-shell marketplace-section" data-testid="marketplace-section"><div className="section-topline"><span>06 / Credit market</span><span>Trade what you can prove</span></div><div className="market-heading-row"><SectionHeading eyebrow="UEC Marketplace" title="Turn verified savings into tradable value." copy="Sellers are facilities that exceed their targets. Buyers are facilities missing targets, plus voluntary buyers meeting green procurement or ESG commitments." /><div className="market-balance" data-testid="market-balance"><span>YOUR HOLDING</span><strong>{walletUec} <small>UEC</small></strong><span className="market-balance-value">{formatLakhs(walletValue)} wallet value</span></div></div><div className="market-content"><div className="listing-table" data-testid="marketplace-listings"><div className="listing-header"><span>FACILITY / POOL</span><span>AVAILABLE</span><span>INDICATIVE RATE</span><span /></div>{[{ name: "Sharma Steel Rolling Mills", location: "Jaipur · verified facility", amount: 142, rate: "₹900 / UEC" }, { name: "Jaipur Textile Cluster", location: "Jaipur · pooled MSME block", amount: 86, rate: "₹875 / UEC" }, { name: "Rajasthan MSME Pool", location: "Rajasthan · aggregated", amount: 320, rate: "₹820 / UEC" }].map((listing, index) => <div className="listing-row" key={listing.name} data-testid={`marketplace-listing-${index}`}><div><span className="listing-logo"><Factory size={15} /></span><span><strong>{listing.name}</strong><small>{listing.location}</small></span></div><b>{listing.amount} <small>UEC</small></b><span>{listing.rate}</span><Button variant="outline" size="sm" onClick={() => handleTrade("buy")} data-testid={`marketplace-buy-button-${index}`}>Buy UEC <ArrowRight size={13} /></Button></div>)}</div><div className="trade-card" data-testid="marketplace-trade-card"><span className="mini-kicker">SIMULATE SETTLEMENT</span><h3>Put your verified balance to work.</h3><p>Execute a mock trade to see UEC leave the holding and capital return to the Green Wallet.</p><div className="trade-actions"><Button className="primary-cta" onClick={() => handleTrade("sell")} data-testid="marketplace-sell-button">Sell 20 UEC <ArrowDownRight size={15} /></Button><Button variant="outline" onClick={() => handleTrade("buy")} data-testid="marketplace-buy-button">Buy 20 UEC <ArrowRight size={15} /></Button></div><div className="trade-message" data-testid="marketplace-trade-message"><span className="status-dot" /> {marketMessage}</div></div></div></section>

      <section id="technology" className="dark-section technology-section" data-testid="technology-section"><div className="section-shell"><div className="section-topline dark-line"><span>07 / Prototype architecture</span><span>Proposed technical architecture · not a deployed national system</span></div><SectionHeading light eyebrow="Technology" title="A stack that turns electricity into evidence." copy="A proposed prototype architecture for reliable data, explainable intelligence and a marketplace-ready application layer." /><div className="architecture-stack" data-testid="architecture-stack">{architecture.map(({ label, tech, copy, icon: ArchitectureIcon }, index) => <div className="architecture-layer" key={label} data-testid={`architecture-layer-${index}`}><span className="architecture-index">0{index + 1}</span><span className="architecture-icon"><ArchitectureIcon size={18} /></span><div><strong>{label}</strong><span>{tech}</span></div><p>{copy}</p><ArrowRight size={17} className="architecture-arrow" /></div>)}</div><div className="architecture-note"><span className="status-dot" /> Prototype architecture · subject to validation and deployment choices</div></div></section>

      <section id="intelligence" className="section-shell intelligence-section" data-testid="intelligence-section"><div className="section-topline"><span>08 / Intelligence</span><span>From raw data to actionable decisions</span></div><SectionHeading eyebrow="Intelligence" title="The system learns what normal looks like." copy="Baseline intelligence adds context to every reading, so an operator sees the decision behind the number — not another noisy chart." /><div className="intelligence-grid"><div className="ai-card-list" data-testid="intelligence-cards">{[{ title: "Baseline Intelligence", copy: "Learns expected energy consumption from machinery, production and operating conditions.", icon: LineChartIcon }, { title: "Forecasting", copy: "Predicts expected future consumption and highlights where the plan is drifting.", icon: BrainCircuit }, { title: "Anomaly Detection", copy: "Identifies idle loads, equipment drift, unusual consumption and potential tampering.", icon: Search }].map(({ title, copy, icon: AiIcon }, index) => <button className={aiMode === index ? "ai-card active" : "ai-card"} key={title} onClick={() => setAiMode(index)} data-testid={`intelligence-card-${index}`}><span className="ai-icon"><AiIcon size={18} /></span><span><strong>{title}</strong><small>{copy}</small></span><ArrowRight size={16} /></button>)}</div><div className="ai-chart-panel" data-testid="anomaly-chart"><div className="panel-heading"><div><span className="console-label">AI SIGNAL · {aiMode === 0 ? "BASELINE" : aiMode === 1 ? "FORECAST" : "ANOMALY"}</span><h4>{aiMode === 2 ? "Anomaly detected at 14:00" : aiMode === 1 ? "Expected load next shift" : "Machine-aware baseline"}</h4></div><Badge variant="outline"><span className="status-dot" /> Model confidence 94%</Badge></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><LineChart data={anomalyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}><CartesianGrid stroke="#d6e1dc" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="hour" tick={{ fill: "#789087", fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: "#789087", fontSize: 10 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #d6e1dc", fontSize: 12 }} /><Line type="monotone" dataKey="expected" stroke="#7c9a8d" strokeWidth={2} strokeDasharray="5 5" dot={false} /><Line type="monotone" dataKey="load" stroke={aiMode === 2 ? "#e25d4b" : "#0f9f6e"} strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer></div><div className="ai-chart-foot"><span><i className="legend-line actual-line" /> Observed load</span><strong>{aiMode === 2 ? "34% above expected" : "Signal within expected range"}</strong></div></div></div></section>

      <section id="improvements" className="section-shell improvements-section" data-testid="improvements-section"><div className="section-topline"><span>09 / Action queue</span><span>Recommended for this facility</span></div><div className="improvements-heading"><SectionHeading eyebrow="Improvements" title="Where can you save?" copy="A ranked action queue turns the next best watt into a concrete operating decision." /><div className="sort-controls" data-testid="recommendation-sort-controls"><span>Sort by</span>{[{ value: "savings", label: "Highest Savings" }, { value: "payback", label: "Fastest Payback" }, { value: "priority", label: "Priority" }].map(({ value, label }) => <button className={sortMode === value ? "sort-button active" : "sort-button"} key={value} onClick={() => setSortMode(value)} data-testid={`sort-recommendations-${value}`}>{label}</button>)}</div></div><div className="recommendations-grid" data-testid="recommendations-list">{sortedRecommendations.map(({ title, savings, payback, label, icon: RecommendationIcon }, index) => <Card className="recommendation-card" key={title} data-testid={`recommendation-card-${index}`}><div className="recommendation-top"><span className="recommendation-icon"><RecommendationIcon size={19} /></span><Badge variant="outline">{label}</Badge></div><h3>{title}</h3><div className="recommendation-stats"><span><strong>{savings.toLocaleString("en-IN")}</strong><small>kWh / year</small></span><span><strong>{payback === 0 ? "Immediate" : `${payback} mo`}</strong><small>payback</small></span></div><div className="recommendation-bar"><span style={{ width: `${Math.min(95, savings / 200)}%` }} /></div><Button variant="ghost" onClick={() => scrollToId("demo")} data-testid={`recommendation-review-button-${index}`}>Review action <ArrowRight size={15} /></Button></Card>)}</div></section>

      <section id="impact" className="impact-section" data-testid="impact-section"><div className="section-shell"><div className="section-topline dark-line"><span>10 / The impact</span><span>Designed for the next scale of efficiency</span></div><div className="impact-heading"><SectionHeading light eyebrow="Impact" title="Make the invisible measurable — at the speed of a grid." copy="The proposed platform aims to make verified energy savings more frequent, more accessible and more useful to the network around them." /><div className="impact-statement" data-testid="impact-statement"><span>From</span><strong>3 years</strong><ArrowRight size={24} /><span>toward</span><strong>15 minutes</strong></div></div><div className="impact-grid"><div className="impact-card"><span className="impact-card-index">01</span><strong>3 years → 15 minutes</strong><p>Reduce long verification cycles toward frequent monitoring and a clear, near-real-time evidence trail.</p></div><div className="impact-card"><span className="impact-card-index">02</span><strong>Thousands → Lakhs</strong><p>Expand access to energy-credit mechanisms beyond designated consumers and into the long tail of facilities.</p></div><div className="impact-card"><span className="impact-card-index">03</span><strong>Grid impact</strong><p>Peak shaving across many facilities could reduce grid stress and defer additional generation capacity.</p></div></div><div className="impact-counter-strip" data-testid="impact-counter-section"><AnimatedCounter target={1000} suffix=" kWh" label="Verified Savings" index={0} /><AnimatedCounter target={250} suffix=" kg" label="CO₂ Avoided" index={1} /><AnimatedCounter target={125} suffix="" label="Active Users" index={2} /></div><div className="sdg-row" data-testid="sdg-alignment"><span>Alignment</span>{["SDG 7 · Clean Energy", "SDG 9 · Industry & Innovation", "SDG 12 · Responsible Consumption", "SDG 13 · Climate Action"].map((sdg) => <span key={sdg}><Check size={13} /> {sdg}</span>)}<span>Energy Conservation Act framework</span></div></div></section>

      <section id="about" className="section-shell future-section" data-testid="about-section"><div className="section-topline"><span>11 / Future expansion</span><span>Start focused. Scale intentionally.</span></div><SectionHeading eyebrow="Future Expansion" title="A common language for every place energy moves." copy="Begin where the signal is clear, then expand the registry as more facilities and use cases connect to the same value loop." /><div className="future-timeline" data-testid="future-timeline">{[{ phase: "PHASE 1", title: "Manufacturing & MSMEs" }, { phase: "PHASE 2", title: "Commercial Buildings" }, { phase: "PHASE 3", title: "Institutional Campuses" }, { phase: "PHASE 4", title: "Cold Chain / Warehousing / Data Centres" }, { phase: "PHASE 5", title: "Housing Societies & Agriculture" }, { phase: "FUTURE", title: "Interoperability with carbon-credit systems" }].map(({ phase, title }, index) => <div className="future-node" key={phase} data-testid={`future-phase-${index}`}><span>{phase}</span><i /><strong>{title}</strong></div>)}</div></section>

      <section className="section-shell faq-section" data-testid="faq-section"><div className="section-topline"><span>12 / FAQ</span><span>Prototype questions, clearly answered</span></div><div className="faq-layout"><SectionHeading eyebrow="Frequently Asked Questions" title="Understand the loop in plain language." copy="Short answers for facilities, judges and future participants exploring the URJA-CHAKRA prototype." /><div className="faq-list">{faqs.map((faq, index) => <div className={openFaq === index ? "faq-item open" : "faq-item"} key={faq.question} data-testid={`faq-item-${index}`}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index} data-testid={`faq-toggle-${index}`}><span>{faq.question}</span>{openFaq === index ? <ChevronUp size={17} /> : <ChevronDown size={17} />}</button>{openFaq === index && <p data-testid={`faq-answer-${index}`}>{faq.answer}</p>}</div>)}</div></div></section>

      <section className="closing-section" data-testid="final-cta"><div className="closing-orb" /><div className="section-shell closing-inner"><span className="mini-kicker">THE NEXT UNIT COUNTS</span><h2>Every unit saved<br /><em>should count.</em></h2><p>Measure energy. Reduce waste. Earn value. Build a cleaner future.</p><Button className="primary-cta" onClick={() => navigate("/demo")} data-testid="final-launch-demo-button">Launch URJA-CHAKRA Demo <ArrowRight size={17} /></Button></div></section>

      <footer className="site-footer" data-testid="site-footer"><div className="footer-main"><div><LogoPlaceholder small /><p>Unified Registry for Joule Accounting</p><span className="footer-event">Smart India Hackathon 2026</span></div><div className="footer-links"><span>Explore</span><a href="#home" data-testid="footer-home-link">Home</a><a href="#solution" data-testid="footer-solution-link">Solution</a><a href="#technology" data-testid="footer-technology-link">Technology</a><a href="#impact" data-testid="footer-impact-link">Impact</a><a href="#demo" data-testid="footer-demo-link">Demo</a></div><div className="footer-note"><Globe2 size={17} /><span>Account for every watt.</span><small>Prototype concept · mock/demo data</small></div></div><div className="footer-bottom"><span>© 2026 URJA-CHAKRA</span><span>ऊर्जा चक्र</span><span>Built for a cleaner, more accountable energy future.</span></div></footer>
    </main>
  );
}

export default Home;