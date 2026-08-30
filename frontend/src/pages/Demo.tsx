import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Building2,
  Check,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Download,
  FileText,
  Gauge,
  LayoutDashboard,
  MoreHorizontal,
  Moon,
  Play,
  Search,
  Settings2,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Target,
  Sun,
  WalletCards,
  X,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const EXACT_LOGO_URL = "https://customer-assets-wrfwihn1.emergentagent.net/job_verified-savings-app/artifacts/w26ga0fs_image.png";

type ViewName = "Dashboard" | "Machinery" | "Energy Targets" | "Improvements" | "Alerts" | "Credit Wallet" | "Marketplace" | "Reports" | "Facility Profile";
type IconType = typeof LayoutDashboard;

interface NavItem {
  label: ViewName;
  icon: IconType;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Machinery", icon: SlidersHorizontal },
  { label: "Energy Targets", icon: Target },
  { label: "Improvements", icon: Sparkles },
  { label: "Alerts", icon: Bell, badge: "1" },
  { label: "Credit Wallet", icon: WalletCards },
  { label: "Marketplace", icon: ShoppingCart },
  { label: "Reports", icon: FileText },
  { label: "Facility Profile", icon: Building2 },
];

const presenterSteps = [
  { label: "01 / Alert", title: "Start with the waste signal", copy: "Open the alert center first. The compressor is drawing 34% above its expected baseline — a clear, actionable reason to investigate." },
  { label: "02 / Action", title: "Simulate the saving", copy: "The walkthrough now runs the recommended intervention. Consumption drops and the verified saving moves into the evidence trail." },
  { label: "03 / Value", title: "Show verified UEC", copy: "Close on the proof: +12 UEC is now visible in the Credits Earned card and the Green Wallet is ready to reinvest." },
];

const telemetry = [
  { day: "18 Aug", actual: 8.1, baseline: 8.8 },
  { day: "19 Aug", actual: 8.4, baseline: 8.9 },
  { day: "20 Aug", actual: 8.5, baseline: 8.9 },
  { day: "21 Aug", actual: 8.0, baseline: 8.8 },
  { day: "22 Aug", actual: 8.7, baseline: 9.0 },
  { day: "23 Aug", actual: 9.2, baseline: 9.1 },
  { day: "24 Aug", actual: 8.3, baseline: 8.9 },
  { day: "25 Aug", actual: 8.0, baseline: 8.8 },
  { day: "26 Aug", actual: 8.3, baseline: 8.8 },
  { day: "27 Aug", actual: 8.1, baseline: 8.7 },
  { day: "28 Aug", actual: 7.9, baseline: 8.6 },
  { day: "29 Aug", actual: 8.2, baseline: 8.6 },
  { day: "30 Aug", actual: 7.8, baseline: 8.5 },
  { day: "31 Aug", actual: 7.4, baseline: 8.4 },
];

const machines = [
  { name: "Rolling Line 1", type: "Primary rolling mill", load: "84 kW", status: "Within baseline", tone: "ok" },
  { name: "Compressor Line 2", type: "Compressed air", load: "76 kW", status: "34% above baseline", tone: "alert" },
  { name: "Furnace Preheat", type: "Thermal process", load: "122 kW", status: "Peak window active", tone: "watch" },
  { name: "Cooling Tower", type: "Auxiliary equipment", load: "38 kW", status: "Within baseline", tone: "ok" },
];

const walletTransactions = [
  { title: "Energy saving verified", meta: "Just now · Line 2", amount: "+12 UEC", positive: true },
  { title: "Verified Energy Saving", meta: "Yesterday · 16:20", amount: "+18 UEC", positive: true },
  { title: "Credit Trade", meta: "28 Aug · 11:08", amount: "−12 UEC", positive: false },
];

function formatLakhs(value: number) {
  return `₹${(value / 100000).toFixed(2)}L`;
}

function Demo() {
  const { theme, toggleTheme } = useTheme();
  const [activeView, setActiveView] = useState<ViewName>("Dashboard");
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [range, setRange] = useState("14 days");
  const [simulated, setSimulated] = useState(false);
  const [targetInfo, setTargetInfo] = useState(false);
  const [activeMachine, setActiveMachine] = useState<string | null>(null);
  const [walletUec, setWalletUec] = useState(154);
  const [walletBalance, setWalletBalance] = useState(139000);
  const [toast, setToast] = useState("Data synced");
  const [reportGenerated, setReportGenerated] = useState(false);
  const [profileEditing, setProfileEditing] = useState(false);
  const [presenterMode, setPresenterMode] = useState(false);
  const [presenterStep, setPresenterStep] = useState(0);

  const dailyConsumption = simulated ? "4,112 kWh" : "4,508 kWh";
  const monthlyConsumption = simulated ? "121.6 MWh" : "126.8 MWh";
  const earnedUec = simulated ? 166 : walletUec;
  const savedKwh = simulated ? "219,500 kWh" : "207,500 kWh";
  const achievement = simulated ? 88 : 83;

  const simulateSaving = () => {
    setSimulated(true);
    setWalletUec((value) => value + 12);
    setWalletBalance((value) => value + 12000);
    setToast("Energy saving verified · +12 UEC added");
  };

  const handleTrade = (type: "buy" | "sell") => {
    if (type === "sell") {
      setWalletUec((value) => Math.max(0, value - 20));
      setWalletBalance((value) => value + 18000);
      setToast("20 UEC sold · ₹18,000 added to Green Wallet");
    } else {
      setWalletUec((value) => value + 20);
      setWalletBalance((value) => Math.max(0, value - 18000));
      setToast("20 UEC bought · holding updated");
    }
  };

  const selectView = (view: ViewName) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setToast(`${view} view opened`);
  };

  const startPresenterMode = () => {
    setPresenterStep(0);
    setPresenterMode(true);
    selectView("Alerts");
    setToast("Presenter mode started · alert signal ready");
  };

  const advancePresenter = () => {
    if (presenterStep >= presenterSteps.length - 1) {
      setPresenterMode(false);
      setToast("Presenter mode complete · demo ready");
      return;
    }
    setPresenterStep((value) => value + 1);
  };

  useEffect(() => {
    if (!presenterMode) return;
    if (presenterStep === 0) selectView("Alerts");
    if (presenterStep === 1) {
      selectView("Dashboard");
      if (!simulated) simulateSaving();
    }
    if (presenterStep === 2) selectView("Dashboard");
    const timer = window.setTimeout(() => {
      if (presenterStep < presenterSteps.length - 1) setPresenterStep((value) => value + 1);
      else setPresenterMode(false);
    }, 5200);
    return () => window.clearTimeout(timer);
  }, [presenterMode, presenterStep]);

  const renderMetric = (label: string, value: string, note: string, icon: IconType, tone: string, index: number) => {
    const MetricIcon = icon;
    return (
      <div className={`command-metric command-metric-${tone} ${presenterMode && presenterStep === 2 && index === 2 ? "presenter-highlight" : ""}`} data-testid={`command-metric-${index}`}>
        <div className="command-metric-top"><span className="command-metric-icon"><MetricIcon size={17} /></span><button onClick={() => setToast(`${label} options opened`)} aria-label={`${label} options`} data-testid={`command-metric-options-${index}`}><MoreHorizontal size={18} /></button></div>
        <span className="command-metric-label">{label}</span>
        <strong>{value}</strong>
        <small><ArrowDownRight size={13} /> {note}</small>
      </div>
    );
  };

  const renderDashboard = () => (
    <>
      <div className="command-metrics" data-testid="command-metrics">
        {renderMetric("Today’s consumption", dailyConsumption, "12% below baseline", Zap, "green", 0)}
        {renderMetric("This month", monthlyConsumption, "9% below baseline", BarChart3, "orange", 1)}
        {renderMetric("Credits earned", `${earnedUec} UEC`, "+12 this cycle", CircleCheck, "blue", 2)}
        {renderMetric("Green wallet", formatLakhs(walletBalance), "Available for green capex", WalletCards, "violet", 3)}
      </div>
      <div className="command-dashboard-grid">
        <section className="command-panel telemetry-panel" data-testid="command-telemetry-panel">
          <div className="command-panel-header"><div><span className="command-kicker">CONSUMPTION TELEMETRY</span><h3>Consumption vs baseline</h3></div><div className="range-tabs" data-testid="telemetry-range-tabs">{["7 days", "14 days", "30 days"].map((item) => <button className={range === item ? "active" : ""} onClick={() => { setRange(item); setToast(`${item} telemetry loaded`); }} key={item} data-testid={`telemetry-range-${item.replace(" ", "-")}`}>{item}</button>)}</div></div>
          <div className="chart-legend command-legend"><span><i className="legend-line actual-line" /> Actual consumption</span><span><i className="legend-line command-baseline-line" /> Expected baseline</span><b><ArrowDownRight size={13} /> 8.7% below baseline</b></div>
          <div className="command-chart command-chart-large"><ResponsiveContainer width="100%" height="100%"><AreaChart data={telemetry} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}><defs><linearGradient id="commandArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#16a579" stopOpacity={0.2} /><stop offset="100%" stopColor="#16a579" stopOpacity={0.02} /></linearGradient></defs><CartesianGrid stroke="#e2ebe7" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="day" tick={{ fill: "#82968d", fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: "#82968d", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value} MWh`} /><Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #d8e6e0", fontSize: 11 }} /><Area type="monotone" dataKey="actual" stroke="#0c9668" fill="url(#commandArea)" strokeWidth={3} /><Line type="monotone" dataKey="baseline" stroke="#a6b3ad" strokeDasharray="5 5" strokeWidth={2} dot={false} /></AreaChart></ResponsiveContainer></div>
          <div className="telemetry-foot"><span>{range} · 18 Aug – 31 Aug 2026</span><button onClick={() => setToast("Telemetry export prepared")} data-testid="telemetry-export-button"><Download size={13} /> Export data</button></div>
        </section>
        <section className="command-panel target-panel" data-testid="command-target-panel"><div className="command-panel-header"><div><span className="command-kicker">ANNUAL COMMITMENT</span><h3>Target achievement</h3></div><Target size={21} className="target-icon" /></div><div className="target-summary"><div className="target-ring" style={{ background: `conic-gradient(#0c9d6d ${achievement}%, #dfeae5 0)` }}><div><strong>{achievement}<sup>%</sup></strong><small>on track</small></div></div><div><strong>{achievement === 88 ? "264,000" : "250,000"}<small> kWh</small></strong><p>Annual energy saving target</p></div></div><div className="target-progress"><div style={{ width: `${achievement}%` }} /></div><div className="target-foot"><span>Actual savings<strong>{savedKwh}</strong></span><span>Days remaining<strong>{simulated ? "108" : "121"} days</strong></span></div><button className="methodology-link" onClick={() => setTargetInfo((value) => !value)} data-testid="target-methodology-button">{targetInfo ? "Hide target methodology" : "View target methodology"} <ChevronRight size={15} /></button>{targetInfo && <div className="target-info" data-testid="target-methodology-detail"><CircleCheck size={15} /> Baseline uses registered machinery, production context and verified operating hours.</div>}</section>
      </div>
    </>
  );

  const renderMachinery = () => <section className="command-view-panel" data-testid="machinery-view"><div className="view-heading"><div><span className="command-kicker">ASSET REGISTER</span><h3>Machinery performance</h3><p>Machine-aware load signals, operating state and baseline variance.</p></div><button className="command-outline-button" onClick={() => setToast("Machine registration form opened")} data-testid="add-machine-button"><Settings2 size={15} /> Register machine</button></div><div className="machine-list">{machines.map((machine, index) => <div className="machine-row" key={machine.name} data-testid={`machine-row-${index}`}><span className="machine-icon"><Gauge size={17} /></span><div><strong>{machine.name}</strong><small>{machine.type}</small></div><b>{machine.load}</b><span className={`machine-status ${machine.tone}`}><i /> {machine.status}</span><button onClick={() => { setActiveMachine(machine.name); setToast(`${machine.name} details opened`); }} data-testid={`machine-investigate-${index}`}>{activeMachine === machine.name ? "Selected" : "Investigate"} <ArrowRight size={14} /></button></div>)}</div>{activeMachine && <div className="machine-detail" data-testid="machine-detail"><span className="command-kicker">SELECTED MACHINE</span><h4>{activeMachine}</h4><p>Live load, baseline expectation and recent operating context are ready for review.</p><button onClick={simulateSaving} data-testid="machine-apply-improvement">Implement recommended improvement <ArrowRight size={14} /></button></div>}</section>;

  const renderTargets = () => <section className="command-view-panel" data-testid="targets-view"><div className="view-heading"><div><span className="command-kicker">ENERGY TARGETS</span><h3>Annual commitment plan</h3><p>Track facility-level progress toward the 250,000 kWh verified saving target.</p></div><span className="synced-chip"><CircleCheck size={14} /> On track</span></div><div className="targets-view-grid"><div className="large-target-card"><div className="target-ring large" style={{ background: `conic-gradient(#0c9d6d ${achievement}%, #dfeae5 0)` }}><div><strong>{achievement}%</strong><small>achieved</small></div></div><div><span className="command-kicker">VERIFIED SAVINGS</span><h4>{savedKwh}</h4><p>of 250,000 kWh annual target</p><div className="target-progress"><div style={{ width: `${achievement}%` }} /></div></div></div><div className="target-checklist"><strong>Milestones</strong>{["Baseline established", "Line 2 improvement verified", "Quarterly review scheduled"].map((item, index) => <button key={item} onClick={() => setToast(`${item} marked complete`)} data-testid={`target-milestone-${index}`}><CircleCheck size={16} /> {item}<ChevronRight size={14} /></button>)}</div></div></section>;

  const renderImprovements = () => <section className="command-view-panel" data-testid="improvements-view"><div className="view-heading"><div><span className="command-kicker">ACTION QUEUE</span><h3>Where can Sharma Steel save?</h3><p>Prioritised actions ranked by expected savings and payback.</p></div><button className="command-outline-button" onClick={() => setToast("Recommendation list refreshed")} data-testid="refresh-improvements-button"><Activity size={15} /> Refresh queue</button></div><div className="improvement-view-grid">{[{ title: "Compressed-Air Leak", saving: "9,100 kWh/yr", payback: "2 months", tone: "high" }, { title: "IE4 Motor Upgrade", saving: "18,400 kWh/yr", payback: "11 months", tone: "strategic" }, { title: "Off-Peak Furnace Preheat", saving: "6,750 kWh/yr", payback: "Immediate", tone: "quick" }].map((item, index) => <div className="improvement-view-card" key={item.title} data-testid={`improvement-view-card-${index}`}><span className={`improvement-label ${item.tone}`}>{item.tone === "quick" ? "Quick win" : item.tone === "high" ? "High impact" : "Strategic"}</span><h4>{item.title}</h4><strong>{item.saving}</strong><small>Estimated payback · {item.payback}</small><button onClick={simulateSaving} data-testid={`improvement-apply-${index}`}>Implement improvement <ArrowRight size={14} /></button></div>)}</div></section>;

  const renderAlerts = () => <section className={`command-view-panel ${presenterMode && presenterStep === 0 ? "presenter-highlight" : ""}`} data-testid="alerts-view"><div className="view-heading"><div><span className="command-kicker">ALERT CENTER</span><h3>Signals that need attention</h3><p>Review exceptions before they become monthly surprises.</p></div><span className="alert-count-chip"><CircleAlert size={14} /> 1 open alert</span></div><div className="alert-detail-card"><div className="alert-detail-icon"><AlertTriangle size={22} /></div><div><span className="command-kicker">HIGH PRIORITY · LINE 2</span><h4>Compressor drawing 34% above baseline</h4><p>Potential compressed-air leak detected from machine-aware comparison. Current load 76 kW vs expected load 42 kW.</p><div className="alert-detail-actions"><button onClick={() => { setActiveMachine("Compressor Line 2"); setToast("Compressor Line 2 investigation opened"); }} data-testid="alert-investigate-button">Investigate machine <ArrowRight size={14} /></button><button className="command-text-button" onClick={() => { setToast("Alert marked as reviewed"); selectView("Dashboard"); }} data-testid="alert-resolve-button">Mark reviewed <Check size={14} /></button></div></div></div></section>;

  const renderWallet = () => <section className="command-view-panel" data-testid="wallet-view"><div className="view-heading"><div><span className="command-kicker">CREDIT WALLET</span><h3>Green capital, ready to reinvest.</h3><p>Verified savings and credit trades settle into one facility balance.</p></div><button className="command-outline-button" onClick={() => selectView("Marketplace")} data-testid="wallet-open-marketplace-button"><ShoppingCart size={15} /> Open marketplace</button></div><div className="wallet-view-grid"><div className="wallet-view-balance"><span>GREEN CAPEX BALANCE</span><strong>{formatLakhs(walletBalance)}</strong><small>{walletUec} UEC available</small><button onClick={simulateSaving} data-testid="wallet-verify-saving-button">Verify next saving <ArrowUpRight size={14} /></button></div><div className="wallet-view-history"><span className="command-kicker">RECENT ACTIVITY</span>{walletTransactions.map((transaction, index) => <div className="wallet-view-row" key={`${transaction.title}-${index}`} data-testid={`wallet-activity-${index}`}><span className={transaction.positive ? "wallet-arrow positive" : "wallet-arrow negative"}>{transaction.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}</span><span><strong>{transaction.title}</strong><small>{transaction.meta}</small></span><b className={transaction.positive ? "positive-text" : "negative-text"}>{transaction.amount}</b></div>)}</div></div></section>;

  const renderMarketplace = () => <section className="command-view-panel" data-testid="marketplace-view"><div className="view-heading"><div><span className="command-kicker">UEC MARKET</span><h3>Trade verified value.</h3><p>Simulate a UEC settlement and watch the facility wallet update.</p></div><span className="market-holding"><WalletCards size={15} /> {walletUec} UEC held</span></div><div className="market-view-grid"><div className="market-view-list">{[{ name: "Jaipur Textile Cluster", amount: "86 UEC", rate: "₹875 / UEC" }, { name: "Rajasthan MSME Pool", amount: "320 UEC", rate: "₹820 / UEC" }, { name: "North India Efficiency Pool", amount: "214 UEC", rate: "₹845 / UEC" }].map((listing, index) => <div className="market-view-row" key={listing.name} data-testid={`market-view-row-${index}`}><span className="machine-icon"><Building2 size={16} /></span><span><strong>{listing.name}</strong><small>{listing.amount} · {listing.rate}</small></span><button onClick={() => handleTrade("buy")} data-testid={`market-buy-${index}`}>Buy UEC <ArrowRight size={14} /></button></div>)}</div><div className="market-trade-box"><span className="command-kicker">YOUR FACILITY</span><strong>{walletUec} UEC</strong><p>Sell verified credits above your savings target or buy to close a commitment gap.</p><button onClick={() => handleTrade("sell")} data-testid="market-sell-button">Sell 20 UEC <ArrowDownRight size={14} /></button><button className="command-outline-button" onClick={() => handleTrade("buy")} data-testid="market-buy-button">Buy 20 UEC <ArrowRight size={14} /></button></div></div></section>;

  const renderReports = () => <section className="command-view-panel" data-testid="reports-view"><div className="view-heading"><div><span className="command-kicker">EVIDENCE ROOM</span><h3>Reports ready for review.</h3><p>Export facility performance, verified savings and the audit trail.</p></div><button className="command-primary-button" onClick={() => { setReportGenerated(true); setToast("Monthly evidence report generated"); }} data-testid="generate-report-button"><Download size={15} /> Generate report</button></div><div className="report-view-grid">{["Monthly energy performance", "UEC verification ledger", "Machinery anomaly summary"].map((report, index) => <button className="report-view-card" onClick={() => setToast(`${report} opened`)} key={report} data-testid={`report-card-${index}`}><span className="report-file-icon"><FileText size={19} /></span><span><strong>{report}</strong><small>Updated 31 Aug 2026 · PDF</small></span><ArrowRight size={15} /></button>)}</div>{reportGenerated && <div className="report-success" data-testid="report-success"><CircleCheck size={17} /> Monthly evidence report generated and ready to download.</div>}</section>;

  const renderProfile = () => <section className="command-view-panel" data-testid="profile-view"><div className="view-heading"><div><span className="command-kicker">FACILITY PROFILE</span><h3>Sharma Steel Rolling Mills</h3><p>Keep the context behind every baseline current.</p></div><button className="command-outline-button" onClick={() => { setProfileEditing((value) => !value); setToast(profileEditing ? "Facility profile saved" : "Facility profile editing enabled"); }} data-testid="edit-profile-button">{profileEditing ? <><Check size={15} /> Save profile</> : <><Settings2 size={15} /> Edit profile</>}</button></div><div className="profile-view-grid"><div><span className="profile-label">UDYAM REGISTRATION</span><strong>UDYAM-RJ-17-0043291</strong></div><div><span className="profile-label">LOCATION</span><strong>Jaipur, Rajasthan</strong></div><div><span className="profile-label">SECTOR</span><strong>Steel rolling & fabrication</strong></div><div><span className="profile-label">REGISTERED MACHINES</span><strong>18 connected assets</strong></div></div>{profileEditing && <div className="profile-edit-note" data-testid="profile-edit-note"><CircleCheck size={15} /> Profile fields are unlocked for this mock demo.</div>}</section>;

  const renderWorkspace = () => {
    if (activeView === "Dashboard") return renderDashboard();
    if (activeView === "Machinery") return renderMachinery();
    if (activeView === "Energy Targets") return renderTargets();
    if (activeView === "Improvements") return renderImprovements();
    if (activeView === "Alerts") return renderAlerts();
    if (activeView === "Credit Wallet") return renderWallet();
    if (activeView === "Marketplace") return renderMarketplace();
    if (activeView === "Reports") return renderReports();
    return renderProfile();
  };

  const presenterCard = presenterSteps[presenterStep];

  return (
    <main className="command-shell" data-testid="command-center-screen">
      <aside className="command-sidebar" data-testid="command-sidebar">
        <Link to="/" className="command-brand" data-testid="command-brand-home"><span className="command-brand-logo"><img src={EXACT_LOGO_URL} alt="URJA-CHAKRA logo" /></span><span><strong>URJA-CHAKRA</strong><small>ऊर्जा चक्र · OFFICIAL LOGO</small></span></Link>
        <span className="sidebar-section-label">WORKSPACE</span>
        <nav className="command-nav" data-testid="command-navigation">{navItems.map((item) => { const NavIcon = item.icon; return <button className={activeView === item.label ? "active" : ""} onClick={() => selectView(item.label)} key={item.label} data-testid={`command-nav-${item.label.toLowerCase().replaceAll(" ", "-")}`}><NavIcon size={18} /><span>{item.label}</span>{item.badge && <b>{item.badge}</b>}</button>; })}</nav>
        <div className="sidebar-bottom"><button className="command-facility-switcher" onClick={() => setToast("Facility switcher opened")} data-testid="facility-switcher"><span className="facility-switcher-icon"><Building2 size={18} /></span><span><strong>Sharma Steel</strong><small>UDYAM-RJ-17-0043291</small></span><MoreHorizontal size={16} /></button><button className="command-profile" onClick={() => setProfileOpen((value) => !value)} data-testid="command-profile-menu"><span className="profile-avatar">SS</span><span><strong>Facility admin</strong><small>Administrator</small></span><MoreHorizontal size={16} /></button>{profileOpen && <div className="profile-popover" data-testid="profile-popover"><button onClick={() => setToast("Account settings opened")} data-testid="account-settings-button"><Settings2 size={14} /> Account settings</button><Link to="/" data-testid="command-logout-link">Return to website</Link></div>}</div>
      </aside>
      <div className="command-content-shell">
        <header className="command-topbar" data-testid="command-topbar"><div><span className="command-breadcrumb">FACILITY / <b>SHARMA STEEL ROLLING MILLS</b></span><h1>Good evening, Sharma Steel Mills</h1></div><div className="command-top-actions"><button className="presenter-launch-button" onClick={startPresenterMode} data-testid="presenter-mode-button"><Play size={14} /> {presenterMode ? "Walkthrough active" : "Presenter mode"}</button><button className="demo-theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} data-testid="demo-theme-toggle">{theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}<span>{theme === "dark" ? "Light" : "Dark"}</span></button><button className="demo-mode-chip" onClick={() => { setIsDemoMode((value) => !value); setToast(isDemoMode ? "Demo mode paused" : "Demo mode enabled"); }} data-testid="demo-mode-toggle"><span className="status-dot" /> {isDemoMode ? "Demo mode" : "Live preview"}</button><div className="command-search-wrap">{showSearch && <input autoFocus placeholder="Search facility data" onChange={(event) => setToast(event.target.value ? `Searching for ${event.target.value}` : "Search ready")} data-testid="command-search-input" />}<button className="command-icon-button" onClick={() => setShowSearch((value) => !value)} aria-label="Search" data-testid="command-search-button"><Search size={20} /></button></div><button className="command-icon-button notification-button" onClick={() => setShowNotifications((value) => !value)} aria-label="Notifications" data-testid="command-notifications-button"><Bell size={20} /><i /></button><button className={`command-primary-button top-simulate-button ${presenterMode && presenterStep === 1 ? "presenter-highlight" : ""}`} onClick={simulateSaving} data-testid="top-simulate-saving-button"><Zap size={16} /> Simulate saving</button><button className="command-warning-button" onClick={() => selectView("Alerts")} aria-label="Open alerts" data-testid="top-alerts-button"><AlertTriangle size={18} /></button></div>{showNotifications && <div className="notification-popover" data-testid="notification-popover"><span className="command-kicker">NOTIFICATIONS</span><strong>Line 2 compressor is above baseline</strong><small>Tap Alerts to investigate the recommended action.</small><button onClick={() => { setShowNotifications(false); selectView("Alerts"); }} data-testid="notification-open-alert-button">Open alert <ArrowRight size={14} /></button></div>}</header>
        <section className="command-main" data-testid="command-main-content"><div className="command-overview"><div><span className="command-kicker">OVERVIEW · 31 AUG 2026</span><h2>{activeView === "Dashboard" ? "Energy command center" : activeView}</h2><p>{activeView === "Dashboard" ? "Measure performance, catch waste and turn every verified saving into value." : "A live workspace for the Sharma Steel Rolling Mills demo facility."}</p></div><div className="sync-status"><span className="synced-chip"><CircleCheck size={14} /> {toast}</span><small>Last meter input · 08:42 IST</small></div></div>{renderWorkspace()}</section>
      </div>
      {presenterMode && <aside className="presenter-guide" data-testid="presenter-guide"><div className="presenter-guide-top"><span>{presenterCard.label}</span><button onClick={() => setPresenterMode(false)} aria-label="Exit presenter mode" data-testid="presenter-exit-button"><X size={15} /></button></div><div className="presenter-progress"><span style={{ width: `${((presenterStep + 1) / presenterSteps.length) * 100}%` }} /></div><h3>{presenterCard.title}</h3><p>{presenterCard.copy}</p><div className="presenter-guide-actions"><span>{presenterStep + 1} of {presenterSteps.length}</span><button onClick={advancePresenter} data-testid="presenter-next-button">{presenterStep === presenterSteps.length - 1 ? "Finish walkthrough" : "Next moment"} <ArrowRight size={14} /></button></div></aside>}
    </main>
  );
}

export default Demo;