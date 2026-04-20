import { useState, useEffect } from "react";

const BRAND = {
  navy: "#05407B",
  skyBlue: "#0199D5",
  navyLight: "#0758A9",
  skyLight: "#02AFF4",
  grey: "#EDEDED",
  greyMid: "#DADADA",
  white: "#FFFFFF",
  black: "#000000",
};

const domains = [
  { id: "financial", label: "Financial Infrastructure", icon: "▣" },
  { id: "operational", label: "Operational Systems & Data", icon: "◈" },
  { id: "people", label: "People Infrastructure", icon: "◉" },
  { id: "procurement", label: "Procurement & Vendor Governance", icon: "◇" },
  { id: "compliance", label: "Compliance & Risk", icon: "◎" },
  { id: "technology", label: "Technology & Integration", icon: "⬡" },
];

const questions = [
  // Financial Infrastructure
  {
    id: "q1", domain: "financial", type: "yesno",
    text: "Does your company use an ERP system (e.g. SAP, Oracle, NetSuite, Microsoft Dynamics)?",
    weight: 2,
  },
  {
    id: "q2", domain: "financial", type: "scale",
    text: "How frequently do you produce formal financial statements for leadership review?",
    options: ["Ad hoc or annually", "Quarterly", "Monthly or more frequently"],
    weight: 2,
  },
  {
    id: "q3", domain: "financial", type: "scale",
    text: "Financial reporting to leadership follows a set cadence with a consistent owner.",
    options: ["Not in place", "Partially in place", "Fully in place"],
    weight: 1, behavior: true,
  },

  // Operational Systems & Data
  {
    id: "q4", domain: "operational", type: "yesno",
    text: "Do you have a designated owner or function responsible for master data management?",
    weight: 2,
  },
  {
    id: "q5", domain: "operational", type: "scale",
    text: "How many formalized enterprise vendor agreements does your company maintain?",
    options: ["Fewer than 5", "5–20", "More than 20"],
    weight: 1,
  },
  {
    id: "q6", domain: "operational", type: "scale",
    text: "When a process breaks down, your team reaches for a documented procedure — not a person.",
    options: ["Not in place", "Partially in place", "Fully in place"],
    weight: 2, behavior: true,
  },

  // People Infrastructure
  {
    id: "q7", domain: "people", type: "yesno",
    text: "Does your company have a structured, documented performance management process?",
    weight: 2,
  },
  {
    id: "q8", domain: "people", type: "yesno",
    text: "Do you run formal employee engagement surveys on a regular cadence?",
    weight: 1,
  },
  {
    id: "q9", domain: "people", type: "yesno",
    text: "Do you have a formalized leadership development program?",
    weight: 1,
  },
  {
    id: "q10", domain: "people", type: "scale",
    text: "Promotions and advancement decisions are based on documented criteria — not relationships or tenure.",
    options: ["Not in place", "Partially in place", "Fully in place"],
    weight: 2, behavior: true,
  },

  // Procurement & Vendor Governance
  {
    id: "q11", domain: "procurement", type: "yesno",
    text: "Do you have a procurement function or a designated procurement owner?",
    weight: 2,
  },
  {
    id: "q12", domain: "procurement", type: "scale",
    text: "Contract authority — who can commit the company to a vendor agreement — is clearly defined and documented.",
    options: ["Not in place", "Partially in place", "Fully in place"],
    weight: 2, behavior: true,
  },

  // Compliance & Risk
  {
    id: "q13", domain: "compliance", type: "yesno",
    text: "Does your company conduct annual IT security training for all employees?",
    weight: 2,
  },
  {
    id: "q14", domain: "compliance", type: "yesno",
    text: "Does your company conduct annual antitrust and anti-bribery training?",
    weight: 2,
  },
  {
    id: "q15", domain: "compliance", type: "scale",
    text: "Compliance obligations show up in how decisions are made — not just as a box checked once a year.",
    options: ["Not in place", "Partially in place", "Fully in place"],
    weight: 1, behavior: true,
  },

  // Technology & Integration
  {
    id: "q16", domain: "technology", type: "scale",
    text: "How connected are your core business systems (ERP, CRM, HRIS, finance)?",
    options: ["Managed separately / manual transfers", "Partially integrated", "Connected and sharing data automatically"],
    weight: 2,
  },
  {
    id: "q17", domain: "technology", type: "yesno",
    text: "Does your company have a defined technology roadmap or IT strategy?",
    weight: 2,
  },
  {
    id: "q18", domain: "technology", type: "scale",
    text: "When your team needs cross-functional data, they pull a system report — not a manually built spreadsheet.",
    options: ["Not in place", "Partially in place", "Fully in place"],
    weight: 2, behavior: true,
  },
];

function scoreAnswer(q, answer) {
  if (q.type === "yesno") return answer === "yes" ? q.weight * 2 : 0;
  if (q.type === "scale") return answer * q.weight;
  return 0;
}

function maxScore(q) {
  if (q.type === "yesno") return q.weight * 2;
  if (q.type === "scale") return 2 * q.weight;
  return 0;
}

function getStage(pct) {
  if (pct < 40) return { label: "People-Powered", color: BRAND.skyBlue, desc: "Your business runs on the knowledge, relationships, and decisions of key individuals. This is common at this stage — and a clear signal of where systemization creates the most leverage." };
  if (pct < 72) return { label: "Logic-Led", color: BRAND.navyLight, desc: "Your processes are rule-based and structured — the logic exists. You've moved beyond intuition into frameworks. The next step is getting that logic embedded into integrated systems." };
  return { label: "Enterprise-Ready", color: BRAND.navy, desc: "Formal systems, documented governance, and scalable processes are in place. Your operational infrastructure is built to grow with you." };
}

function getDomainScore(domainId, answers) {
  const qs = questions.filter(q => q.domain === domainId);
  const earned = qs.reduce((sum, q) => sum + (answers[q.id] !== undefined ? scoreAnswer(q, answers[q.id]) : 0), 0);
  const max = qs.reduce((sum, q) => sum + maxScore(q), 0);
  return max > 0 ? Math.round((earned / max) * 100) : 0;
}

function getOverallScore(answers) {
  const earned = questions.reduce((sum, q) => sum + (answers[q.id] !== undefined ? scoreAnswer(q, answers[q.id]) : 0), 0);
  const max = questions.reduce((sum, q) => sum + maxScore(q), 0);
  return Math.round((earned / max) * 100);
}

// ── Arc gauge SVG ──────────────────────────────────────────────────
function ArcGauge({ pct, stage }) {
  const r = 80, cx = 110, cy = 110;
  const startAngle = -210, endAngle = 30;
  const totalDeg = endAngle - startAngle;
  const toRad = d => (d * Math.PI) / 180;
  const arcPath = (a1, a2, radius) => {
    const x1 = cx + radius * Math.cos(toRad(a1));
    const y1 = cy + radius * Math.sin(toRad(a1));
    const x2 = cx + radius * Math.cos(toRad(a2));
    const y2 = cy + radius * Math.sin(toRad(a2));
    const large = a2 - a1 > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
  };
  const fillEnd = startAngle + (pct / 100) * totalDeg;

  return (
    <svg width="220" height="150" viewBox="0 0 220 150">
      <path d={arcPath(startAngle, endAngle, r)} fill="none" stroke={BRAND.greyMid} strokeWidth="12" strokeLinecap="round" />
      {pct > 0 && (
        <path d={arcPath(startAngle, fillEnd, r)} fill="none" stroke={stage.color} strokeWidth="12" strokeLinecap="round" />
      )}
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="28" fontWeight="700" fill={BRAND.navy} fontFamily="Montserrat, sans-serif">{pct}%</text>
      <text x={cx} y={cy + 30} textAnchor="middle" fontSize="11" fill="#666" fontFamily="Montserrat, sans-serif">OVERALL</text>
    </svg>
  );
}

// ── Domain bar ─────────────────────────────────────────────────────
function DomainBar({ label, pct, animate }) {
  const stage = getStage(pct);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: BRAND.navy, fontWeight: 600, fontFamily: "Montserrat, sans-serif" }}>{label}</span>
        <span style={{ fontSize: 12, color: stage.color, fontWeight: 700, fontFamily: "Montserrat, sans-serif" }}>{pct}%</span>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: BRAND.grey, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${BRAND.skyBlue}, ${stage.color})`,
          width: animate ? `${pct}%` : "0%",
          transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
    </div>
  );
}

export default function EnterpriseReadinessIndex() {
  const [screen, setScreen] = useState("intro"); // intro | question | summary | gate | results
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [animateBars, setAnimateBars] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const q = questions[current];
  const progress = Math.round((current / questions.length) * 100);
  const overallPct = getOverallScore(answers);
  const stage = getStage(overallPct);

  useEffect(() => {
    if (screen === "results") setTimeout(() => setAnimateBars(true), 300);
  }, [screen]);

  function handleAnswer(val) {
    setSelected(val);
    // Auto-advance after 400ms so the selection is visible before moving on
    setTimeout(() => {
      const newAnswers = { ...answers, [q.id]: val };
      setAnswers(newAnswers);
      setSelected(null);
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
      } else {
        setScreen("summary");
      }
    }, 400);
  }

  function handleNext() {
    if (selected === null) return;
    const newAnswers = { ...answers, [q.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setScreen("summary");
    }
  }

  async function handleEmailSubmit() {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setSubmitted(true);

    // ── Kit API via serverless proxy ────────────────────────────
    try {
      await fetch("https://enterprise-readiness-index.vercel.app/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          stage: stage.label,
          score: `${overallPct}%`,
        }),
      });
    } catch (err) {
      // Fail silently — never block user from seeing results
      console.error("Subscribe error:", err);
    }

    setScreen("results");
  }

  // ── Styles ──────────────────────────────────────────────────────
  const wrap = {
    minHeight: "100vh", background: "#F5F7FA",
    fontFamily: "'Montserrat', 'Metropolis', sans-serif",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "24px 16px",
  };
  const card = {
    background: BRAND.white, borderRadius: 16, maxWidth: 620, width: "100%",
    boxShadow: "0 8px 40px rgba(5,64,123,0.10)",
    overflow: "hidden",
  };
  const header = {
    background: BRAND.navy, padding: "28px 36px 24px",
    borderBottom: `4px solid ${BRAND.skyBlue}`,
  };
  const body = { padding: "36px 36px 40px" };
  const btnPrimary = {
    background: BRAND.skyBlue, color: BRAND.white,
    border: "none", borderRadius: 8, padding: "14px 32px",
    fontSize: 15, fontWeight: 700, cursor: "pointer",
    fontFamily: "inherit", letterSpacing: "0.5px",
    transition: "background 0.2s",
  };
  const btnOutline = {
    background: "transparent", color: BRAND.navy,
    border: `2px solid ${BRAND.navy}`, borderRadius: 8, padding: "12px 28px",
    fontSize: 14, fontWeight: 600, cursor: "pointer",
    fontFamily: "inherit",
  };

  // ── INTRO ────────────────────────────────────────────────────────
  if (screen === "intro") return (
    <div style={wrap}>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <div style={card}>
        <div style={header}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: BRAND.skyBlue, fontWeight: 700, marginBottom: 8, textTransform: "uppercase" }}>Brightpoint Operations</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: BRAND.white, lineHeight: 1.2, marginBottom: 8 }}>Enterprise Readiness Index</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>How built is your business — really?</div>
        </div>
        <div style={body}>
          <p style={{ fontSize: 15, color: "#333", lineHeight: 1.7, marginBottom: 20 }}>
            Most mid-market companies have outgrown their startup roots, but are just starting the infrastructure of a true enterprise. This is a natural stage within a growing business.
          </p>
          <p style={{ fontSize: 15, color: "#333", lineHeight: 1.7, marginBottom: 28 }}>
            This assessment maps your operational readiness across <strong style={{ color: BRAND.navy }}>six domains</strong> in under 10 minutes. You'll see exactly where your infrastructure is solid, and where it's still living in people's heads.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
            {domains.map(d => (
              <div key={d.id} style={{ background: BRAND.grey, borderRadius: 20, padding: "6px 14px", fontSize: 12, color: BRAND.navy, fontWeight: 600 }}>
                {d.label}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <button style={btnPrimary} onClick={() => setScreen("question")}>Start the Assessment →</button>
            <span style={{ fontSize: 12, color: "#999" }}>18 questions · ~8 minutes</span>
          </div>
        </div>
      </div>
    </div>
  );

  // ── QUESTION ─────────────────────────────────────────────────────
  if (screen === "question") {
    const domainInfo = domains.find(d => d.id === q.domain);
    const domainQs = questions.filter(qq => qq.domain === q.domain);
    const domainIndex = domainQs.findIndex(qq => qq.id === q.id) + 1;

    return (
      <div style={wrap}>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <div style={card}>
          <div style={header}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color: BRAND.skyBlue, fontWeight: 700, textTransform: "uppercase" }}>Enterprise Readiness Index</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{current + 1} / {questions.length}</div>
            </div>
            {/* Progress bar */}
            <div style={{ height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: BRAND.skyBlue, borderRadius: 2, transition: "width 0.4s ease" }} />
            </div>
          </div>
          <div style={body}>
            {/* Domain label */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <div style={{ width: 3, height: 20, background: BRAND.skyBlue, borderRadius: 2 }} />
              <span style={{ fontSize: 12, color: BRAND.skyBlue, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
                {domainInfo.label} · {domainIndex}/{domainQs.length}
              </span>
              {q.behavior && (
                <span style={{ background: `${BRAND.skyBlue}18`, color: BRAND.skyBlue, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, letterSpacing: 0.5 }}>BEHAVIOUR</span>
              )}
            </div>

            <p style={{ fontSize: 17, color: BRAND.navy, fontWeight: 700, lineHeight: 1.5, marginBottom: 28 }}>{q.text}</p>

            {/* Yes/No */}
            {q.type === "yesno" && (
              <div style={{ display: "flex", gap: 12 }}>
                {["yes", "no"].map(v => (
                  <button key={v} onClick={() => handleAnswer(v)} style={{
                    flex: 1, padding: "16px 0", borderRadius: 10, fontSize: 15, fontWeight: 700,
                    fontFamily: "inherit", cursor: "pointer", transition: "all 0.15s",
                    border: selected === v ? `2px solid ${BRAND.skyBlue}` : `2px solid ${BRAND.greyMid}`,
                    background: selected === v ? `${BRAND.skyBlue}12` : BRAND.white,
                    color: selected === v ? BRAND.skyBlue : "#555",
                  }}>{v === "yes" ? "Yes" : "No"}</button>
                ))}
              </div>
            )}

            {/* Scale */}
            {q.type === "scale" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {q.options.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(i)} style={{
                    padding: "14px 18px", borderRadius: 10, textAlign: "left",
                    fontSize: 14, fontWeight: selected === i ? 700 : 500,
                    fontFamily: "inherit", cursor: "pointer", transition: "all 0.15s",
                    border: selected === i ? `2px solid ${BRAND.skyBlue}` : `2px solid ${BRAND.greyMid}`,
                    background: selected === i ? `${BRAND.skyBlue}12` : BRAND.white,
                    color: selected === i ? BRAND.skyBlue : "#444",
                  }}>
                    <span style={{ marginRight: 10, opacity: 0.4 }}>{["○", "◑", "●"][i]}</span>
                    {opt}
                  </button>
                ))}
              </div>
            )}

            <div style={{ marginTop: 28, display: "flex", gap: 12, alignItems: "center" }}>
              <button style={{ ...btnPrimary, opacity: selected === null ? 0.45 : 1 }} onClick={handleNext} disabled={selected === null}>
                {current + 1 === questions.length ? "See My Results →" : "Next →"}
              </button>
              {current > 0 && (
                <button style={btnOutline} onClick={() => { setCurrent(current - 1); setSelected(answers[questions[current - 1].id] ?? null); }}>← Back</button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── SUMMARY (pre-gate) ────────────────────────────────────────────
  if (screen === "summary") return (
    <div style={wrap}>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ ...card, maxWidth: 680 }}>
        <div style={{ ...header, textAlign: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: BRAND.skyBlue, fontWeight: 700, marginBottom: 8, textTransform: "uppercase" }}>Your Results Are Ready</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: BRAND.white }}>Enterprise Readiness Index</div>
        </div>
        <div style={{ ...body }}>

          {/* Two-column: gauge + blurred preview */}
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap" }}>

            {/* Left: gauge + stage */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 200 }}>
              <ArcGauge pct={overallPct} stage={stage} />
              <div style={{ fontSize: 20, fontWeight: 800, color: stage.color, marginTop: 4, textAlign: "center" }}>{stage.label}</div>
              <p style={{ fontSize: 12, color: "#666", lineHeight: 1.6, textAlign: "center", marginTop: 8, maxWidth: 190 }}>{stage.desc}</p>
            </div>

            {/* Right: blurred domain preview */}
            <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: BRAND.navy, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Domain Breakdown</div>

              {/* Blurred bars */}
              <div style={{ filter: "blur(4px)", userSelect: "none", pointerEvents: "none", opacity: 0.85 }}>
                {domains.map((d, i) => {
                  const fakePct = getDomainScore(d.id, answers);
                  const fakeStage = getStage(fakePct);
                  return (
                    <div key={d.id} style={{ marginBottom: 13 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: BRAND.navy, fontWeight: 600, fontFamily: "Montserrat, sans-serif" }}>{d.label}</span>
                        <span style={{ fontSize: 11, color: fakeStage.color, fontWeight: 700 }}>{fakePct}%</span>
                      </div>
                      <div style={{ height: 7, borderRadius: 4, background: BRAND.grey, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: 4,
                          background: `linear-gradient(90deg, ${BRAND.skyBlue}, ${fakeStage.color})`,
                          width: `${fakePct}%`,
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Frosted overlay with lock message */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(160deg, rgba(245,247,250,0.55) 0%, rgba(245,247,250,0.75) 100%)",
                backdropFilter: "blur(1px)",
                borderRadius: 8,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 6,
              }}>
                <div style={{ fontSize: 22, opacity: 0.4 }}>🔒</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: BRAND.navy, textAlign: "center", lineHeight: 1.5 }}>
                  Enter your email to<br />unlock your full breakdown
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: BRAND.greyMid, marginBottom: 24 }} />

          {/* Email capture */}
          <div style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.navy, marginBottom: 4 }}>Unlock your domain breakdown</div>
            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 14 }}>See your score across all six operational domains — and see exactly where to focus first.</div>
            <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <input
                type="email" placeholder="your@email.com" value={email}
                onChange={e => { setEmail(e.target.value); setEmailError(""); }}
                onKeyDown={e => e.key === "Enter" && handleEmailSubmit()}
                style={{
                  flex: 1, padding: "13px 16px", borderRadius: 8, fontSize: 14,
                  border: `2px solid ${emailError ? "#e53e3e" : BRAND.greyMid}`,
                  fontFamily: "inherit", outline: "none", color: BRAND.navy,
                }}
              />
              <button style={btnPrimary} onClick={handleEmailSubmit}>Unlock →</button>
            </div>
            {emailError && <div style={{ color: "#e53e3e", fontSize: 12 }}>{emailError}</div>}
            <div style={{ fontSize: 11, color: "#aaa" }}>No spam. Just your results and occasional operational insights from Brightpoint.</div>
          </div>

        </div>
      </div>
    </div>
  );

  // ── FULL RESULTS ──────────────────────────────────────────────────
  if (screen === "results") return (
    <div style={wrap}>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ ...card, maxWidth: 680 }}>
        <div style={header}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: BRAND.skyBlue, fontWeight: 700, marginBottom: 6, textTransform: "uppercase" }}>Brightpoint Operations</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: BRAND.white, marginBottom: 2 }}>Enterprise Readiness Index</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Full Domain Breakdown</div>
        </div>
        <div style={body}>
          {/* Overall */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32, flexWrap: "wrap" }}>
            <div style={{ flexShrink: 0 }}>
              <ArcGauge pct={overallPct} stage={stage} />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 11, color: BRAND.skyBlue, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Operational Stage</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: stage.color, marginBottom: 10, lineHeight: 1.1 }}>{stage.label}</div>
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, margin: 0 }}>{stage.desc}</p>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 2, background: `linear-gradient(90deg, ${BRAND.skyBlue}, transparent)`, marginBottom: 28 }} />

          {/* Domain scores */}
          <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.navy, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Domain Breakdown</div>
          {domains.map(d => (
            <DomainBar key={d.id} label={d.label} pct={getDomainScore(d.id, answers)} animate={animateBars} />
          ))}

          {/* Stage legend */}
          <div style={{ marginTop: 28, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { label: "People-Powered", color: BRAND.skyBlue },
              { label: "Logic-Led", color: BRAND.navyLight },
              { label: "Enterprise-Ready", color: BRAND.navy },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />
                <span style={{ fontSize: 11, color: "#666", fontWeight: 600 }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ marginTop: 32, background: BRAND.navy, borderRadius: 12, padding: "24px 28px", display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: BRAND.white, marginBottom: 4 }}>Ready to close the gaps?</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>Brightpoint Operations works with founders and CEOs to build the operational infrastructure that scales with you.</div>
            </div>
            <a href="https://www.brightpointoperations.com" target="_blank" rel="noopener noreferrer" style={{ ...btnPrimary, textDecoration: "none", whiteSpace: "nowrap" }}>
              Let's Talk →
            </a>
          </div>

          <div style={{ marginTop: 20, textAlign: "center", fontSize: 11, color: "#bbb" }}>
            brightpointoperations.com · connect@brightpointoperations.com
          </div>
        </div>
      </div>
    </div>
  );
}
