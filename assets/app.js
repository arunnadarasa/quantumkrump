// Quantum Krump — Academic Research & Project Showcase Interactive Module

const PREPRINTS = {
  en: {
    label: "English",
    file: "downloads/quantum-krump-preprint.pdf",
    filename: "quantum-krump-preprint.pdf",
    title: "Master Monograph (English · 55 Pages)",
    abstract:
      "We present Quantum Krump, a body-first movement curriculum, categorical formalism, theatrical staging framework, and Physical AI research ecosystem introducing superposition, entanglement, and relative phase interference through South Central Los Angeles Krump street dance, Laban Movement Analysis (LMA), and DisCoPy Frobenius monoidal string diagrams. Validated across 18 computational lanes including Quantinuum Nexus Helios-1E-lite emulation (2,048 emulator shots; 0 physical QPU shots claimed; 99.41% duet fidelity), OpenJij QUBO stage routing (E0 = -7.3569), Modal 10-qubit barren-plateau mitigation (5.9x variance retention), QKMLM variational classification (98.60% test accuracy), Motion2MixamoRig 3D recovery (8.765e-11 FK precision), and KrumpRobot 1.01M-parameter causal GRU humanoid control (2.32 deg geodesic error, 2.70 ms latency)."
  },
  fr: {
    label: "Français",
    file: "downloads/quantum-krump-preprint-fr.pdf",
    filename: "quantum-krump-preprint-fr.pdf",
    title: "Monographie de référence (Français · 51 Pages)",
    abstract:
      "Nous présentons Quantum Krump, un atelier pédagogique incarné par le corps, un cadre formel DisCoPy en catégories monoïdales dagger-compactes de Frobenius, la création théâtrale 11th Quantum Dimension (1 heure, 20 danseurs, avec Dakota Simao) et la chaîne Physical AI Motion2MixamoRig / KrumpRobot. Validation complète sur l'émulateur Quantinuum Nexus Helios-1E-lite (2 048 tirs d'émulateur ; 0 tir physique QPU revendiqué ; fidélité de duo 99,41%), ordonnancement QUBO OpenJij (E0 = -7,3569), classificateur QKMLM sur Modal Cloud (98,60%) et contrôle humanoïde temps réel (erreur géodésique 2,32°, latence 2,70 ms)."
  },
  de: {
    label: "Deutsch",
    file: "downloads/quantum-krump-preprint-de.pdf",
    filename: "quantum-krump-preprint-de.pdf",
    title: "Referenzmonografie (Deutsch)",
    abstract:
      "Wir präsentieren Quantum Krump: ein körperbasiertes Lehr- und Forschungsökosystem, das Superposition, Verschränkung und Phaseninterferenz durch Krump Street Dance, Laban-Bewegungsanalyse (LMA) und angewandte Kategorientheorie (DisCoPy Frobenius-Stringdiagramme) vermittelt — einschließlich der einstündigen Bühnenproduktion 11th Quantum Dimension, verifizierter Quantinuum-Helios-1E-lite-Emulation (2.048 Emulator-Shots, 0 physische QPU-Shots, 99,41% Duett-Fidelität) sowie Motion2MixamoRig & KrumpRobot Physical AI."
  },
  nl: {
    label: "Nederlands",
    file: "downloads/quantum-krump-preprint-nl.pdf",
    filename: "quantum-krump-preprint-nl.pdf",
    title: "Referentiemonografie (Nederlands)",
    abstract:
      "Wij presenteren Quantum Krump, een belichaamd onderwijscurriculum, DisCoPy-categorische formalisering, het 60-minuten theaterwerk 11th Quantum Dimension met Dakota Simao, en het Motion2MixamoRig / KrumpRobot Physical AI-raamwerk — gevalideerd over 18 computationele benchmarks waaronder Quantinuum Nexus Helios-1E-lite-emulatie (99,41% duetgetrouwheid; 0 fysieke QPU-shots) en Modal Cloud."
  },
  ja: {
    label: "日本語",
    file: "downloads/quantum-krump-preprint-ja.pdf",
    filename: "quantum-krump-preprint-ja.pdf",
    title: "マスター学術モノグラフ（日本語版）",
    abstract:
      "本研究は、サウス・セントラル・ロサンゼルス発祥のストリートダンス「Krump」、ラバン動作解析（LMA）、および応用圏論（DisCoPyフロベニウス弦図）を通じて重ね合わせ・量子もつれ・位相干渉を体現する『Quantum Krump』を提示する。Dakota Simaoとの60分舞台作品『11th Quantum Dimension』、Quantinuum Helios-1E-liteエミュレータ検証（2,048ショット、実機QPU 0ショット明記、デュエット忠実度99.41%）、Modal Cloud上のQKMLMおよび単眼3D復元・ヒューマノイド制御モデルKrumpRobot（測地線誤差2.32°、推論遅延2.70 ms）を統合する。"
  },
  ko: {
    label: "한국어",
    file: "downloads/quantum-krump-preprint-ko.pdf",
    filename: "quantum-krump-preprint-ko.pdf",
    title: "마스터 학술 모노그래프 (한국어판)",
    abstract:
      "본 논문은 크럼프(Krump) 스트리트 댄스, 라반 동작 분석(LMA), DisCoPy 프로베니우스 모노이달 범주론을 결합하여 중첩·얽힘·위상 간섭을 교육하는 신체화 프레임워크 『Quantum Krump』를 제시한다. 다코타 시마오와의 60분 무대 작품 『제11 양자 차원』, Quantinuum Helios-1E-lite 에뮬레이터 검증(2,048샷, 물리 QPU 0샷 명시, 99.41% 충실도), Modal 기반 QKMLM 및 휴머노이드 제어 정책 KrumpRobot(오차 2.32°, 지연 2.70 ms)의 전 과정을 검증한다."
  },
  zh: {
    label: "中文",
    file: "downloads/quantum-krump-preprint-zh.pdf",
    filename: "quantum-krump-preprint-zh.pdf",
    title: "完整学术专著预印本（中文版）",
    abstract:
      "本文提出《量子克朗普》(Quantum Krump)，结合洛杉矶南区街舞 Krump、拉班动作分析 (LMA) 与应用范畴论 (DisCoPy 弗罗贝尼乌斯弦图)，具身化讲授量子叠加、纠缠与相位干涉。体系涵盖与 Dakota Simao 共创的 60 分钟剧场作品《第 11 量子维度》、Quantinuum Helios-1E-lite 模拟器验证（2,048 次模拟采样，明确声明 0 次真实物理 QPU 采样，双人舞保真度 99.41%）、Modal 云端 10 量子比特贫瘠高原缓解（5.9× 方差保持）以及 Motion2MixamoRig 与 KrumpRobot 具身人形机器人控制策略（测地误差 2.32°，中位延迟 2.70 ms）。"
  },
  fil: {
    label: "Filipino",
    file: "downloads/quantum-krump-preprint-fil.pdf",
    filename: "quantum-krump-preprint-fil.pdf",
    title: "Master Preprint Monograph (Filipino)",
    abstract:
      "Inilalahad namin ang Quantum Krump, isang body-first na kurikulum, pormalismong kategoryal sa DisCoPy, produksyong pang-entablado na 11th Quantum Dimension kasama si Dakota Simao, at Physical AI pipeline para sa Motion2MixamoRig at KrumpRobot — napatunayan sa Quantinuum Nexus Helios-1E-lite emulator (2,048 shots; 0 pisikal na QPU shots; 99.41% duet fidelity) at Modal Cloud."
  },
  hi: {
    label: "हिन्दी",
    file: "downloads/quantum-krump-preprint-hi.pdf",
    filename: "quantum-krump-preprint-hi.pdf",
    title: "मुख्य शोध मोनोग्राफ (हिन्दी संस्करण)",
    abstract:
      "हम Quantum Krump प्रस्तुत करते हैं — लॉस एंजेलिस के Krump स्ट्रीट डांस, लाबान मूवमेंट एनालिसिस (LMA) और DisCoPy श्रेणी सिद्धांत के माध्यम से अध्यारोपण (superposition), उलझाव (entanglement) और व्यतिकरण (interference) सिखाने की शरीर-प्रथम कार्यशाला, 11th Quantum Dimension रंगमंच प्रस्तुति, Quantinuum Helios-1E-lite एमुलेटर सत्यापन (99.41% युगल निष्ठा, 0 भौतिक QPU शॉट्स) तथा Motion2MixamoRig / KrumpRobot ह्यूमनॉइड फिजिकल AI प्रणाली।"
  },
  ta: {
    label: "தமிழ்",
    file: "downloads/quantum-krump-preprint-ta.pdf",
    filename: "quantum-krump-preprint-ta.pdf",
    title: "முதன்மை ஆராய்ச்சி நூல் (தமிழ் பதிப்பு)",
    abstract:
      "தெற்கு லாஸ் ஏஞ்சல்ஸின் Krump நடனம், லாபன் இயக்கப் பகுப்பாய்வு (LMA), மற்றும் DisCoPy வகைப்பாட்டுக் கோட்பாட்டின் வழி மேற்பொருத்தம், பிணைப்பு, குறுக்கீடு ஆகியவற்றை உடல்வழி கற்பிக்கும் Quantum Krump கட்டமைப்பை வழங்குகிறோம் — இதில் 11th Quantum Dimension நாடக ஆக்கம், Quantinuum Helios-1E-lite எமுலேட்டர் சரிபார்ப்பு (99.41% இரட்டையர் துல்லியம்; 0 இயற்பியல் QPU shots), மற்றும் KrumpRobot மனிதஉருவ Physical AI ஆகியவை அடங்கும்."
  }
};

const LKQ_DATA = [
  {
    factor: "Weight (Strong ↔ Light)",
    move: "STOMP",
    quantum: "Hadamard H / Projective Collapse",
    detail:
      "Grounded downward foot strike (> 3.8× bodyweight). In phrase compilation (F_DisCo), initial STOMP acts as Hadamard H launching |0⟩ into balanced kinespheric superposition (|0⟩+|1⟩)/√2; on a partner cue ('HIT!'), percussive floor impact models projective measurement."
  },
  {
    factor: "Space (Direct ↔ Indirect)",
    move: "JAB",
    quantum: "Pauli-X Bit Flip / Entangled Basis",
    detail:
      "Ballistic linear upper-limb strike along a targeted vector. Compiles to Pauli-X state inversion (|0⟩ ↔ |1⟩) and anchors equatorial X-basis measurements during multi-basis entangled partner drills."
  },
  {
    factor: "Time (Sudden ↔ Sustained)",
    move: "CHEST POP",
    quantum: "Pauli-Z Phase Flip / Interference",
    detail:
      "Explosive anterior-superior thoracic expansion (θ_pop = 102.9°, sub-20 ms arrest). Compiles to Pauli-Z relative phase inversion (+1 → −1), driving constructive amplification (Δφ = 0) or destructive stillness (Δφ = π)."
  },
  {
    factor: "Flow (Bound ↔ Free)",
    move: "ARM SWING",
    quantum: "Continuous Rx(π/2) Rotation",
    detail:
      "Wide centrifugal upper-limb whip arc with 32 ms distal wrist lag. Compiles to continuous coherent Bloch rotation Rx(π/2), sweeping amplitudes smoothly across vertical levels prior to measurement."
  }
];

const EFFORT_ACTIONS = {
  Punch: "Punch (Strong · Sudden · Direct) → Direct Jab / Heavy Stomp: Projective von Neumann collapse onto a single basis state on the beat.",
  Slash: "Slash (Strong · Sudden · Indirect) → Wide Whip Strike: Abrupt collapse from a broad equatorial superposition.",
  Press: "Press (Strong · Sustained · Direct) → Grounded BUCK Push: Controlled unitary Ry(θ) rotation toward the south pole |1⟩.",
  Wring: "Wring (Strong · Sustained · Indirect) → Opposing Torso/Pelvis Twist: Coupled internal degrees of freedom illustrating two-register entanglement.",
  Dab: "Dab (Light · Sudden · Direct) → Crisp Wrist/Foot Tap: Weak ancilla probe / mid-circuit parity check without full reset.",
  Flick: "Flick (Light · Sudden · Indirect) → Rapid Finger/Shoulder Scatter: Multi-axis relative phase dispersion across the kinesphere.",
  Glide: "Glide (Light · Sustained · Direct) → Smooth Stage Travel: Adiabatic state transport preserving eigenstate coherence.",
  Float: "Float (Light · Sustained · Indirect) → Suspended Mid-Level Groove: Unperturbed balanced superposition prior to observation."
};

const DISCOPY_STEPS = [
  {
    title: "Layer 1 · Entanglement Cap η_D : I → D ⊗ D",
    circuit: "Ket(0, 0) >> (H @ Id(1)) >> CX",
    desc: "From an empty silent stage I, two partners initialize a maximally entangled Bell state |Φ+⟩ = (|00⟩ + |11⟩)/√2 without visual cues."
  },
  {
    title: "Layer 2 · Parallel Foundations (CHEST POP ⊗ JAB)",
    circuit: "Z @ X",
    desc: "Dancer A executes a sudden thoracic CHEST POP (Pauli Z) simultaneously while Dancer B fires a linear JAB (Pauli X), mapping |Φ+⟩ → (|01⟩ − |10⟩)/√2."
  },
  {
    title: "Layer 3 · Collision-Free Stage Crossing σ_{D,D}",
    circuit: "SWAP(0, 1)",
    desc: "Symmetric monoidal swap σ_{D,D} : D ⊗ D → D ⊗ D exchanges partner positions across the session circle (σ ∘ σ = id), preparing |Ψ−⟩ / |Ψ+⟩."
  },
  {
    title: "Layer 4 · Continuous Foil (ARM SWING ⊗ BUCK HOP)",
    circuit: "Rx(π/2) @ Rz(π/2)",
    desc: "Centrifugal ARM SWING (Rx(π/2)) on wire 0 composes in parallel with grounded BUCK HOP (S = Rz(π/2)) on wire 1, verified via bifunctorial interchange."
  },
  {
    title: "Layer 5 · Joint Climax Cup ε_D & Helios-1E-lite Readout",
    circuit: "CX >> (H @ Id(1)) >> Measure  [1,018 / 1,024 shots = 99.41%]",
    desc: "Uncomputing Layer 4 before the terminal Bell analyzer projects deterministically onto |01⟩, achieving 99.41% fidelity on Quantinuum Nexus Helios-1E-lite (Job a411dac7; 0 physical QPU shots)."
  }
];

const KRUMP_PHRASES = [
  { start: 0, end: 14, bars: "Bars 1–8", time: "0:00–0:14", name: "1. Session Intro", desc: "Grounded wide BUCK stance, 140 BPM baseline pelvis groove bounce, pre-strike torque buildup." },
  { start: 14, end: 35, bars: "Bars 9–20", time: "0:14–0:35", name: "2. Stomp Drop", desc: "Alternating heavy floor STOMPs every 2 bars (3.82× BW vertical spikes, 24.5 ms rise time)." },
  { start: 35, end: 52, bars: "Bars 21–30", time: "0:35–0:52", name: "3. Jab Combos", desc: "Ballistic linear JAB flurries, opposing thoracic counter-rotation, and crisp forearm recoil." },
  { start: 52, end: 72, bars: "Bars 31–42", time: "0:52–1:12", name: "4. Power Swings", desc: "Wide centrifugal ARM SWING whip arcs with 32 ms distal wrist lag and figure-8 pelvic transfer." },
  { start: 72, end: 88, bars: "Bars 43–52", time: "1:12–1:28", name: "5. Chest Climax", desc: "Peak session energy (E = 1.25), rapid sternum CHEST POPs (18.2 ms arrest, 1,420 rad/s³ peak jerk)." },
  { start: 88, end: 99, bars: "Bars 53–58", time: "1:28–1:38.5", name: "6. Kill-Off Freeze", desc: "Decelerated tension drop locking into an asymmetrical terminal KILL-OFF stance (ZMP = 4.2 cm)." }
];

const BIBTEX = {
  monograph: `@article{nadarasa2026quantumkrump,
  title   = {Quantum Krump: Teaching Superposition, Entanglement and Interference through Krump, Laban Movement Analysis and Applied Category Theory},
  author  = {Nadarasa, Arun and Simao, Dakota},
  year    = {2026},
  month   = {November},
  note    = {55-page Master Reference Monograph in 10 languages; Quantinuum Nexus Helios-1E-lite, DisCoPy, Modal Cloud, and KrumpRobot},
  url     = {https://arunnadarasa.github.io/quantumkrump/downloads/quantum-krump-preprint.pdf}
}`,
  pedagogy: `@article{nadarasa2026pedagogy,
  title   = {Quantum Krump: Embodied Quantum Information Pedagogy through Street Dance, Laban Movement Analysis, and String Diagrams},
  author  = {Nadarasa, Arun and Simao, Dakota},
  year    = {2026},
  month   = {November},
  note    = {15-page Focused Embodied Pedagogy Companion Preprint},
  url     = {https://arunnadarasa.github.io/quantumkrump/downloads/quantum-krump-pedagogy-paper.pdf}
}`,
  krumprobot: `@article{nadarasa2026krumprobot,
  title   = {KrumpRobot: High-Jerk Expressive Humanoid Dance Generation via Monocular 3D Motion Recovery, Rest-Relative Retargeting, and Phase-Conditioned Neural Control},
  author  = {Nadarasa, Arun},
  year    = {2026},
  month   = {November},
  note    = {11-page Standalone Physical AI \\& Humanoid Robotics Preprint},
  url     = {https://arunnadarasa.github.io/quantumkrump/downloads/krumprobot-physical-ai-paper.pdf}
}`
};

// ── 1. Multilingual Preprint Selector ──
function initPreprintSelector() {
  const container = document.getElementById("lang-pills");
  const titleEl = document.getElementById("active-lang-title");
  const absEl = document.getElementById("active-lang-abstract");
  const dlBtn = document.getElementById("active-lang-download");
  if (!container || !titleEl || !absEl || !dlBtn) return;

  let active = "en";
  const render = () => {
    const item = PREPRINTS[active];
    titleEl.textContent = item.title;
    absEl.textContent = item.abstract;
    dlBtn.setAttribute("href", item.file);
    dlBtn.setAttribute("download", item.filename);
    dlBtn.innerHTML = `⬇ Download ${item.label} PDF`;
    container.querySelectorAll("button").forEach((b) => {
      b.classList.toggle("active", b.dataset.lang === active);
    });
  };

  Object.entries(PREPRINTS).forEach(([code, info]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lang-btn";
    btn.dataset.lang = code;
    btn.textContent = info.label;
    btn.addEventListener("click", () => {
      active = code;
      render();
    });
    container.appendChild(btn);
  });
  render();
}

// ── 2. Interactive 3D Bloch Kinesphere (Canvas 3D Renderer — Zero External Failure Points) ──
function initBlochSphere() {
  const wrap = document.getElementById("bloch-canvas-wrap");
  const thetaSlider = document.getElementById("theta-slider");
  const phiSlider = document.getElementById("phi-slider");
  const thetaVal = document.getElementById("theta-val");
  const phiVal = document.getElementById("phi-val");
  const ketEl = document.getElementById("ket-readout");
  const p0Fill = document.getElementById("p0-fill");
  const p1Fill = document.getElementById("p1-fill");
  const p0Txt = document.getElementById("p0-txt");
  const p1Txt = document.getElementById("p1-txt");
  if (!wrap) return;

  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  wrap.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  let theta = Math.PI / 3; // 60 deg
  let phi = Math.PI / 4;   // 45 deg
  let yaw = -0.62;
  let pitch = 0.34;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  function resize() {
    const rect = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(300, Math.floor(rect.width * dpr));
    canvas.height = Math.max(260, Math.floor(rect.height * dpr));
    draw();
  }

  function project([x, y, z], cx, cy, R) {
    // Bloch Z is vertical (+up = y_screen negative), X forward, Y right
    // Convert Bloch (bx, by, bz) -> 3D viewer coords (vx=by, vy=bz, vz=bx)
    const vx = y;
    const vy = z;
    const vz = x;

    const cyaw = Math.cos(yaw), syaw = Math.sin(yaw);
    const x1 = vx * cyaw + vz * syaw;
    const z1 = -vx * syaw + vz * cyaw;

    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    const y2 = vy * cp - z1 * sp;
    const z2 = vy * sp + z1 * cp;

    const persp = 3.6 / (3.6 - z2 * 0.55);
    return {
      sx: cx + x1 * R * persp,
      sy: cy - y2 * R * persp,
      depth: z2
    };
  }

  function updateReadout() {
    const degT = Math.round((theta * 180) / Math.PI);
    const degP = Math.round(((phi * 180) / Math.PI + 360) % 360);
    if (thetaSlider) thetaSlider.value = String(degT);
    if (phiSlider) phiSlider.value = String(degP);
    if (thetaVal) thetaVal.textContent = `${degT}°`;
    if (phiVal) phiVal.textContent = `${degP}°`;

    const c = Math.cos(theta / 2);
    const s = Math.sin(theta / 2);
    const p0 = c * c;
    const p1 = s * s;
    const levelTag = p0 > 0.72 ? "LIVE (Up)" : p1 > 0.72 ? "BUCK (Low)" : "KRUMP (Mid Superposition)";

    if (ketEl) {
      ketEl.textContent = `|ψ⟩ = ${c.toFixed(3)}|0⟩ + e^(i·${degP}°)·${s.toFixed(3)}|1⟩   ·   ${levelTag}`;
    }
    if (p0Fill) p0Fill.style.width = `${(p0 * 100).toFixed(1)}%`;
    if (p1Fill) p1Fill.style.width = `${(p1 * 100).toFixed(1)}%`;
    if (p0Txt) p0Txt.textContent = `${(p0 * 100).toFixed(1)}%`;
    if (p1Txt) p1Txt.textContent = `${(p1 * 100).toFixed(1)}%`;
  }

  function drawRing(fnPoint, cx, cy, R, stroke, dashed = false) {
    ctx.save();
    ctx.beginPath();
    if (dashed) ctx.setLineDash([5, 5]);
    for (let i = 0; i <= 72; i++) {
      const a = (i / 72) * Math.PI * 2;
      const p = project(fnPoint(a), cx, cy, R);
      if (i === 0) ctx.moveTo(p.sx, p.sy);
      else ctx.lineTo(p.sx, p.sy);
    }
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.35 * (window.devicePixelRatio || 1);
    ctx.stroke();
    ctx.restore();
  }

  function draw() {
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w * 0.5;
    const cy = h * 0.52;
    const R = Math.min(w, h) * 0.33;

    // Outer unit sphere silhouette
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.015, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(157, 181, 178, 0.25)";
    ctx.lineWidth = 1.5 * dpr;
    ctx.stroke();

    // Meridians & KRUMP Equator
    drawRing((a) => [Math.cos(a), Math.sin(a), 0], cx, cy, R, "rgba(56, 214, 196, 0.52)", false);
    drawRing((a) => [Math.cos(a), 0, Math.sin(a)], cx, cy, R, "rgba(157, 181, 178, 0.2)", true);
    drawRing((a) => [0, Math.cos(a), Math.sin(a)], cx, cy, R, "rgba(157, 181, 178, 0.2)", true);

    // Coordinate Axes
    const axes = [
      { from: [0, 0, -1], to: [0, 0, 1], labelPos: [0, 0, 1.18], negPos: [0, 0, -1.18], posTxt: "|0⟩ LIVE (+Z)", negTxt: "|1⟩ BUCK (-Z)", color: "rgba(238,247,245,0.55)" },
      { from: [-1, 0, 0], to: [1, 0, 0], labelPos: [1.22, 0, 0], negPos: [-1.22, 0, 0], posTxt: "|+⟩ Fwd (+X)", negTxt: "|−⟩ Back", color: "rgba(56,214,196,0.4)" },
      { from: [0, -1, 0], to: [0, 1, 0], labelPos: [0, 1.22, 0], negPos: [0, -1.22, 0], posTxt: "|+i⟩ (+Y)", negTxt: "|−i⟩ (-Y)", color: "rgba(56,214,196,0.4)" }
    ];

    ctx.font = `600 ${Math.round(11 * dpr)}px "JetBrains Mono", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    axes.forEach((ax) => {
      const pA = project(ax.from, cx, cy, R);
      const pB = project(ax.to, cx, cy, R);
      ctx.beginPath();
      ctx.moveTo(pA.sx, pA.sy);
      ctx.lineTo(pB.sx, pB.sy);
      ctx.strokeStyle = ax.color;
      ctx.lineWidth = 1.1 * dpr;
      ctx.stroke();

      const lp = project(ax.labelPos, cx, cy, R);
      const np = project(ax.negPos, cx, cy, R);
      ctx.fillStyle = "#eef7f5";
      ctx.fillText(ax.posTxt, lp.sx, lp.sy);
      ctx.fillStyle = "#8ca8a5";
      ctx.fillText(ax.negTxt, np.sx, np.sy);
    });

    // State vector |ψ⟩
    const bx = Math.sin(theta) * Math.cos(phi);
    const by = Math.sin(theta) * Math.sin(phi);
    const bz = Math.cos(theta);

    const origin = project([0, 0, 0], cx, cy, R);
    const eqProj = project([bx, by, 0], cx, cy, R);
    const tip = project([bx, by, bz], cx, cy, R);

    // Azimuthal shadow drop line
    ctx.save();
    ctx.setLineDash([3 * dpr, 3 * dpr]);
    ctx.beginPath();
    ctx.moveTo(origin.sx, origin.sy);
    ctx.lineTo(eqProj.sx, eqProj.sy);
    ctx.lineTo(tip.sx, tip.sy);
    ctx.strokeStyle = "rgba(244, 174, 66, 0.42)";
    ctx.lineWidth = 1.2 * dpr;
    ctx.stroke();
    ctx.restore();

    // Main golden vector
    ctx.beginPath();
    ctx.moveTo(origin.sx, origin.sy);
    ctx.lineTo(tip.sx, tip.sy);
    ctx.strokeStyle = "#f4ae42";
    ctx.lineWidth = 3.2 * dpr;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(tip.sx, tip.sy, 6.5 * dpr, 0, Math.PI * 2);
    ctx.fillStyle = "#f4ae42";
    ctx.shadowColor = "rgba(244, 174, 66, 0.85)";
    ctx.shadowBlur = 12 * dpr;
    ctx.fill();
    ctx.shadowBlur = 0;

    updateReadout();
  }

  // Pointer orbit controls
  wrap.addEventListener("pointerdown", (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    wrap.setPointerCapture(e.pointerId);
  });
  wrap.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    yaw += dx * 0.009;
    pitch = Math.max(-1.2, Math.min(1.2, pitch + dy * 0.009));
    draw();
  });
  wrap.addEventListener("pointerup", () => { dragging = false; });

  thetaSlider?.addEventListener("input", (e) => {
    theta = (Number(e.target.value) * Math.PI) / 180;
    draw();
  });
  phiSlider?.addEventListener("input", (e) => {
    phi = (Number(e.target.value) * Math.PI) / 180;
    draw();
  });

  // Quantum Krump Gate Presets acting on current Bloch vector (bx, by, bz)
  function applyBlochMatrix(fn) {
    const bx = Math.sin(theta) * Math.cos(phi);
    const by = Math.sin(theta) * Math.sin(phi);
    const bz = Math.cos(theta);
    const [nx, ny, nz] = fn(bx, by, bz);
    const clampedZ = Math.max(-1, Math.min(1, nz));
    theta = Math.acos(clampedZ);
    if (Math.hypot(nx, ny) > 1e-5) {
      phi = (Math.atan2(ny, nx) + Math.PI * 2) % (Math.PI * 2);
    }
    draw();
  }

  document.querySelectorAll("[data-bloch-gate]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const g = btn.dataset.blochGate;
      if (g === "H") applyBlochMatrix((x, y, z) => [z, -y, x]); // STOMP · Hadamard
      else if (g === "X") applyBlochMatrix((x, y, z) => [x, -y, -z]); // JAB · Pauli X
      else if (g === "Z") applyBlochMatrix((x, y, z) => [-x, -y, z]); // CHEST POP · Pauli Z
      else if (g === "RX") applyBlochMatrix((x, y, z) => [x, -z, y]); // ARM SWING · Rx(π/2)
      else if (g === "S") applyBlochMatrix((x, y, z) => [-y, x, z]); // BUCK HOP · Rz(π/2)
      else if (g === "COLLAPSE") {
        const p0 = Math.cos(theta / 2) ** 2;
        theta = Math.random() < p0 ? 0 : Math.PI;
        draw();
      } else if (g === "RESET") {
        theta = 0;
        phi = 0;
        draw();
      }
    });
  });

  window.addEventListener("resize", resize);
  resize();
}

// ── 3. Laban × Krump × Quantum Interactive Mapper ──
function initLkqMapper() {
  const listEl = document.getElementById("lkq-list");
  const detailEl = document.getElementById("lkq-detail");
  const effortWrap = document.getElementById("effort-chips");
  if (!listEl || !detailEl) return;

  let activeIdx = 0;
  LKQ_DATA.forEach((row, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `lkq-item ${idx === 0 ? "active" : ""}`;
    btn.innerHTML = `
      <span><strong>${row.factor.split(" ")[0]}</strong><br><small style="color:var(--ink-muted)">${row.factor}</small></span>
      <span class="lkq-move">${row.move}</span>
      <span style="text-align:right;font-size:0.84rem;color:var(--signal)">${row.quantum}</span>
    `;
    btn.addEventListener("click", () => {
      activeIdx = idx;
      listEl.querySelectorAll(".lkq-item").forEach((el, i) => el.classList.toggle("active", i === activeIdx));
      effortWrap?.querySelectorAll(".effort-chip").forEach((el) => el.classList.remove("active"));
      detailEl.textContent = row.detail;
    });
    listEl.appendChild(btn);
  });
  detailEl.textContent = LKQ_DATA[0].detail;

  if (effortWrap) {
    Object.entries(EFFORT_ACTIONS).forEach(([name, text]) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "effort-chip";
      chip.textContent = name;
      chip.addEventListener("click", () => {
        effortWrap.querySelectorAll(".effort-chip").forEach((c) => c.classList.toggle("active", c === chip));
        detailEl.textContent = text;
      });
      effortWrap.appendChild(chip);
    });
  }
}

// ── 4. DisCoPy String-Diagram Stepper ──
function initDiscopyStepper() {
  const nextBtn = document.getElementById("discopy-next");
  const resetBtn = document.getElementById("discopy-reset");
  const titleEl = document.getElementById("discopy-step-title");
  const circEl = document.getElementById("discopy-step-circuit");
  const descEl = document.getElementById("discopy-step-desc");
  if (!titleEl || !circEl || !descEl) return;

  let step = 4; // Show full verified 5-layer diagram initially

  function render() {
    const info = DISCOPY_STEPS[step];
    titleEl.textContent = info.title;
    circEl.textContent = info.circuit;
    descEl.textContent = info.desc;
    for (let i = 0; i < 5; i++) {
      const layer = document.getElementById(`dc-layer-${i}`);
      if (!layer) continue;
      layer.classList.toggle("lit", i <= step);
      layer.classList.toggle("current", i === step);
    }
  }

  nextBtn?.addEventListener("click", () => {
    step = (step + 1) % DISCOPY_STEPS.length;
    render();
  });
  resetBtn?.addEventListener("click", () => {
    step = 0;
    render();
  });
  for (let i = 0; i < 5; i++) {
    const layer = document.getElementById(`dc-layer-${i}`);
    if (layer) {
      layer.style.cursor = "pointer";
      layer.addEventListener("click", () => {
        step = i;
        render();
      });
    }
  }
  render();
}

// ── 5. KrumpRobot 6-Phrase 1:38 Audio & Video Synchronizer ──
function initKrumpRobotTimeline() {
  const wrap = document.getElementById("phrase-timeline");
  const video = document.getElementById("compare-video");
  const audio = document.getElementById("krump-audio");
  const descBox = document.getElementById("phrase-active-desc");
  if (!wrap) return;

  const buttons = KRUMP_PHRASES.map((p, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `phrase-btn ${idx === 0 ? "active" : ""}`;
    btn.innerHTML = `
      <span class="phrase-time">${p.time}</span>
      <span><strong>${p.name}</strong></span>
      <span class="phrase-bars">${p.bars}</span>
    `;
    btn.addEventListener("click", () => {
      if (video) {
        video.currentTime = p.start;
        video.play().catch(() => {});
      }
      if (audio && !audio.paused) {
        audio.currentTime = p.start;
      }
      setActive(idx);
    });
    wrap.appendChild(btn);
    return btn;
  });

  function setActive(idx) {
    buttons.forEach((b, i) => b.classList.toggle("active", i === idx));
    if (descBox && KRUMP_PHRASES[idx]) {
      descBox.textContent = `${KRUMP_PHRASES[idx].name} (${KRUMP_PHRASES[idx].bars} · ${KRUMP_PHRASES[idx].time}): ${KRUMP_PHRASES[idx].desc}`;
    }
  }
  setActive(0);

  function syncByTime(t) {
    const idx = KRUMP_PHRASES.findIndex((p) => t >= p.start && t < p.end);
    if (idx !== -1) setActive(idx);
  }
  video?.addEventListener("timeupdate", () => syncByTime(video.currentTime));
  audio?.addEventListener("timeupdate", () => syncByTime(audio.currentTime));
}

// ── 6. BibTeX Tabs & Copy Utilities ──
function initBibtexAndCopy() {
  const pre = document.getElementById("bibtex-code");
  const copyBibBtn = document.getElementById("copy-bibtex-btn");
  let activeKey = "monograph";

  document.querySelectorAll("[data-bib-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeKey = btn.dataset.bibTab;
      document.querySelectorAll("[data-bib-tab]").forEach((b) => b.classList.toggle("active", b === btn));
      if (pre) pre.textContent = BIBTEX[activeKey];
    });
  });
  if (pre) pre.textContent = BIBTEX[activeKey];

  copyBibBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(BIBTEX[activeKey]);
      const prev = copyBibBtn.textContent;
      copyBibBtn.textContent = "✓ Copied BibTeX!";
      setTimeout(() => { copyBibBtn.textContent = prev; }, 1800);
    } catch {}
  });

  document.querySelectorAll("[data-copy-target]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const target = document.getElementById(btn.dataset.copyTarget);
      if (!target) return;
      try {
        await navigator.clipboard.writeText(target.textContent.trim());
        const prev = btn.textContent;
        btn.textContent = "✓ Copied!";
        setTimeout(() => { btn.textContent = prev; }, 1800);
      } catch {}
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initPreprintSelector();
  initBlochSphere();
  initLkqMapper();
  initDiscopyStepper();
  initKrumpRobotTimeline();
  initBibtexAndCopy();
});
