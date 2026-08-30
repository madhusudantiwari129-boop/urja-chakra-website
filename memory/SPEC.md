# URJA-CHAKRA living spec

## Product
Single-page SIH 2026 concept website for URJA-CHAKRA (ऊर्जा चक्र), a proposed unified energy accounting platform. The narrative is Problem → Measure → Analyze → Save → Verify → Earn UEC → Trade → Reinvest.

## Key flows
- Sticky anchor navigation across Home, Problem, Solution, How It Works, Technology, Impact, Demo and About.
- Deterministic mock facility demo for Sharma Steel Rolling Mills, Jaipur (UDYAM-RJ-17-0043291).
- Investigate Line 2 compressor anomaly, implement improvement, then update consumption, verified savings, UEC and wallet state.
- Green Wallet transaction history updates from verified savings and simulated marketplace buy/sell actions.
- Solution loop, six method steps, architecture layers, AI signal modes and recommendation sorting are interactive.
- Launch Demo opens a dedicated command-center screen at `/demo` with functional workspace navigation, telemetry range controls, simulate-saving action, alert investigation, machinery, target, improvement, wallet, marketplace, report and facility-profile views.
- Presenter Mode auto-walks judges through the alert signal, saving simulation and verified UEC outcome with timed highlights and manual next/finish controls.
- A persisted light/dark theme toggle is available in both the marketing header and command-center top bar; the chosen theme survives route navigation and reloads.
- Lightweight marketing interactions include categorized rotating energy tips for Office, Factory, Campus and Household use, a prototype 1 kWh = 1 URJA Credit calculator, an adjustable before/after comparison, demo achievement badges, clickable hero energy-flow explanations, viewport-animated demo impact counters and a single-open FAQ accordion.

## Data model
- Demo state: energySaved, uecEarned, walletUec, walletValue, improvementApplied.
- Mock transactions: title, amount, date, positive.
- UEC rule shown in product: 1 UEC = 1,000 kWh of verified electricity saved; improvement simulation verifies 12,000 kWh and adds 12 UEC.

## Auth and integrations
No authentication, external API, government API, IoT connection or API key is required. All product data is MOCK/DEMO data held in React state.

## Branding note
The exact supplied PNG logo asset is used in the marketing header, hero, command-center sidebar and footer. It is placed inside circular frames and a subtle 3D rotating hero treatment. A non-destructive CSS colour grade adjusts saturation, contrast and theme-aware glow for visual integration; the source image is not redrawn, retyped or proportionally altered.