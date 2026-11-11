// Quantum Krump & KrumpRobot — Academic Research & Project Showcase UX Module

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

const GATE_CUES = {
  H: "STOMP · Hadamard H — Grounded strike (>3.8× BW) launches |0⟩ ↔ balanced equatorial superposition (|0⟩+|1⟩)/√2.",
  X: "JAB · Pauli-X — Ballistic linear arm strike flips |0⟩ (LIVE) ↔ |1⟩ (BUCK) across the X axis.",
  Z: "CHEST POP · Pauli-Z — Sudden thoracic expansion (sub-20 ms arrest) inverts azimuthal phase (+1 → −1).",
  RX: "ARM SWING · Rx(π/2) — Centrifugal whip arc rotates state smoothly by 90° around the forward +X axis.",
  S: "BUCK HOP · Phase S = Rz(π/2) — Grounded quarter-turn hop advances azimuthal facing φ by +90°.",
  COLLAPSE: "HIT! · Projective Measurement — Audience/partner cue collapses |ψ⟩ probabilistically onto |0⟩ or |1⟩.",
  RESET: "Reset |0⟩ — Return dancer to upright chest-lifted LIVE eigenstate (+Z north pole)."
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
    short: "1. η_D Cap",
    title: "Layer 1 · Entanglement Cap η_D : I → D ⊗ D",
    circuit: "Ket(0, 0) >> (H @ Id(1)) >> CX",
    desc: "From an empty silent stage I, two partners initialize a maximally entangled Bell state |Φ+⟩ = (|00⟩ + |11⟩)/√2 without visual cues."
  },
  {
    short: "2. Z ⊗ X",
    title: "Layer 2 · Parallel Foundations (CHEST POP ⊗ JAB)",
    circuit: "Z @ X",
    desc: "Dancer A executes a sudden thoracic CHEST POP (Pauli Z) simultaneously while Dancer B fires a linear JAB (Pauli X), mapping |Φ+⟩ → (|01⟩ − |10⟩)/√2."
  },
  {
    short: "3. σ Swap",
    title: "Layer 3 · Collision-Free Stage Crossing σ_{D,D}",
    circuit: "SWAP(0, 1)",
    desc: "Symmetric monoidal swap σ_{D,D} : D ⊗ D → D ⊗ D exchanges partner positions across the session circle (σ ∘ σ = id), preparing |Ψ−⟩ / |Ψ+⟩."
  },
  {
    short: "4. Rx ⊗ S",
    title: "Layer 4 · Continuous Foil (ARM SWING ⊗ BUCK HOP)",
    circuit: "Rx(π/2) @ Rz(π/2)",
    desc: "Centrifugal ARM SWING (Rx(π/2)) on wire 0 composes in parallel with grounded BUCK HOP (S = Rz(π/2)) on wire 1, verified via bifunctorial interchange."
  },
  {
    short: "5. ε_D Climax",
    title: "Layer 5 · Joint Climax Cup ε_D & Helios-1E-lite Readout",
    circuit: "CX >> (H @ Id(1)) >> Measure  [1,018 / 1,024 shots = 99.41%]",
    desc: "Uncomputing Layer 4 before the terminal Bell analyzer projects deterministically onto |01⟩, achieving 99.41% fidelity on Quantinuum Nexus Helios-1E-lite (Job a411dac7; 0 physical QPU shots)."
  }
];

const VIDEO_MODES = {
  full138: {
    src: "motion/full_session_1m38.mp4",
    poster: "motion/full_session_poster.jpg",
    caption: "Full 1:38 Source Session (98.5 s · 2,955 frames @ 30 fps · 140 BPM Audio): Synchronized across all 6 choreographic phrases."
  },
  matrix4: {
    src: "motion/compare.mp4",
    poster: "motion/compare_preview.png",
    caption: "Uncropped 4-Panel Verification Sample (812 × 1440 · 10.0 s clip): Source Performer · 2D Keypoints · 3D MotionBERT Pose · Retargeted Mixamo Y-Bot."
  },
  ybot: {
    src: "motion/mixamo_character.mp4",
    poster: "motion/mixamo_character_preview.png",
    caption: "Skinned Mixamo Y-Bot Render (10.0 s clip): Rest-relative quaternion retargeting (8.765 × 10⁻¹¹ m FK precision, 0.0% ground penetration)."
  }
};

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

// ── Toast Helper ──
let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

function fmtTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

// ── 0. Navigation, Scroll Progress, Scroll-Spy & Mobile Drawer ──
function initNavigationUX() {
  const progress = document.getElementById("scroll-progress");
  const backTop = document.getElementById("back-to-top");
  const menuBtn = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("primary-nav");
  const links = Array.from(document.querySelectorAll(".nav-links a[href^='#']"));
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);

  menuBtn?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.textContent = isOpen ? "✕ Close" : "☰ Sections";
  });

  links.forEach((a) => {
    a.addEventListener("click", () => {
      navLinks?.classList.remove("open");
      if (menuBtn) {
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.textContent = "☰ Sections";
      }
    });
  });

  function onScroll() {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? Math.min(100, Math.max(0, (window.scrollY / docH) * 100)) : 0;
    if (progress) progress.style.width = `${pct.toFixed(1)}%`;
    if (backTop) backTop.classList.toggle("visible", window.scrollY > 520);

    // Active section highlight
    const probeY = window.scrollY + 130;
    let currentId = "";
    for (const sec of sections) {
      if (sec.offsetTop <= probeY) currentId = `#${sec.id}`;
    }
    links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === currentId));
  }

  backTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// ── 1. Multilingual Preprint Selector + In-Page PDF Preview Modal ──
function initPreprintAndModals() {
  const container = document.getElementById("lang-pills");
  const titleEl = document.getElementById("active-lang-title");
  const absEl = document.getElementById("active-lang-abstract");
  const dlBtn = document.getElementById("active-lang-download");
  const prevBtn = document.getElementById("active-lang-preview");

  const pdfModal = document.getElementById("pdf-modal");
  const pdfIframe = document.getElementById("pdf-iframe");
  const pdfModalTitle = document.getElementById("pdf-modal-title");
  const pdfModalDl = document.getElementById("pdf-modal-download");
  const pdfModalNewTab = document.getElementById("pdf-modal-newtab");
  const pdfModalClose = document.getElementById("pdf-modal-close");

  function openPdfPreview(url, title) {
    if (!pdfModal || !pdfIframe) return;
    pdfModalTitle.textContent = title;
    pdfIframe.src = url;
    pdfModalDl.href = url;
    pdfModalNewTab.href = url;
    pdfModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closePdfPreview() {
    if (!pdfModal || !pdfIframe) return;
    pdfModal.classList.remove("open");
    pdfIframe.src = "about:blank";
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-preview-pdf]").forEach((btn) => {
    btn.addEventListener("click", () => {
      openPdfPreview(btn.dataset.previewPdf, btn.dataset.previewTitle || "PDF Preview");
    });
  });

  pdfModalClose?.addEventListener("click", closePdfPreview);
  pdfModal?.addEventListener("click", (e) => {
    if (e.target === pdfModal) closePdfPreview();
  });

  // Figure Lightbox
  const imgModal = document.getElementById("img-lightbox");
  const imgTarget = document.getElementById("lightbox-img");
  const imgCap = document.getElementById("lightbox-caption");
  const imgClose = document.getElementById("lightbox-close");

  document.querySelectorAll(".fig-card").forEach((card) => {
    card.addEventListener("click", () => {
      const img = card.querySelector("img");
      const cap = card.querySelector("figcaption");
      if (!img || !imgModal) return;
      imgTarget.src = img.src;
      imgTarget.alt = img.alt;
      imgCap.textContent = cap ? cap.textContent.trim() : img.alt;
      imgModal.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  function closeLightbox() {
    if (!imgModal) return;
    imgModal.classList.remove("open");
    document.body.style.overflow = "";
  }
  imgClose?.addEventListener("click", closeLightbox);
  imgModal?.addEventListener("click", (e) => {
    if (e.target === imgModal) closeLightbox();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closePdfPreview();
      closeLightbox();
    }
  });

  if (!container || !titleEl || !absEl || !dlBtn) return;

  let active = "en";
  const render = () => {
    const item = PREPRINTS[active];
    titleEl.textContent = item.title;
    absEl.textContent = item.abstract;
    dlBtn.setAttribute("href", item.file);
    dlBtn.setAttribute("download", item.filename);
    dlBtn.textContent = `⬇ Download ${item.label} PDF`;
    if (prevBtn) {
      prevBtn.onclick = () => openPdfPreview(item.file, item.title);
    }
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

// ── 2. Interactive 3D Bloch Kinesphere (With Smooth Animated Gate Transitions) ──
function initBlochSphere() {
  const wrap = document.getElementById("bloch-canvas-wrap");
  const thetaSlider = document.getElementById("theta-slider");
  const phiSlider = document.getElementById("phi-slider");
  const thetaVal = document.getElementById("theta-val");
  const phiVal = document.getElementById("phi-val");
  const ketEl = document.getElementById("ket-readout");
  const cueEl = document.getElementById("bloch-gate-cue");
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

  let theta = Math.PI / 3;
  let phi = Math.PI / 4;
  let yaw = -0.62;
  let pitch = 0.32;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let animId = null;

  function resize() {
    const rect = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(280, Math.floor(rect.width * dpr));
    canvas.height = Math.max(260, Math.floor(rect.height * dpr));
    draw();
  }

  function project([x, y, z], cx, cy, R) {
    const vx = y, vy = z, vz = x;
    const cyaw = Math.cos(yaw), syaw = Math.sin(yaw);
    const x1 = vx * cyaw + vz * syaw;
    const z1 = -vx * syaw + vz * cyaw;
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    const y2 = vy * cp - z1 * sp;
    const z2 = vy * sp + z1 * cp;
    const persp = 3.6 / (3.6 - z2 * 0.55);
    return { sx: cx + x1 * R * persp, sy: cy - y2 * R * persp };
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
      ketEl.textContent = `|ψ⟩ = ${c.toFixed(3)}|0⟩ + e^(i·${degP}°)·${s.toFixed(3)}|1⟩  ·  ${levelTag}`;
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
    const cy = h * 0.55; // Slight offset so +Z label sits comfortably below overlay badge
    const R = Math.min(w, h) * 0.31;

    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.015, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(158, 183, 180, 0.24)";
    ctx.lineWidth = 1.5 * dpr;
    ctx.stroke();

    drawRing((a) => [Math.cos(a), Math.sin(a), 0], cx, cy, R, "rgba(56, 214, 196, 0.52)", false);
    drawRing((a) => [Math.cos(a), 0, Math.sin(a)], cx, cy, R, "rgba(158, 183, 180, 0.2)", true);
    drawRing((a) => [0, Math.cos(a), Math.sin(a)], cx, cy, R, "rgba(158, 183, 180, 0.2)", true);

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

    const bx = Math.sin(theta) * Math.cos(phi);
    const by = Math.sin(theta) * Math.sin(phi);
    const bz = Math.cos(theta);

    const origin = project([0, 0, 0], cx, cy, R);
    const eqProj = project([bx, by, 0], cx, cy, R);
    const tip = project([bx, by, bz], cx, cy, R);

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

  function animateTo(targetTheta, targetPhi) {
    cancelAnimationFrame(animId);
    const sTheta = theta;
    const sPhi = phi;
    let dPhi = targetPhi - sPhi;
    if (dPhi > Math.PI) dPhi -= Math.PI * 2;
    if (dPhi < -Math.PI) dPhi += Math.PI * 2;
    const t0 = performance.now();
    const dur = 260;

    function tick(now) {
      const u = Math.min(1, (now - t0) / dur);
      const ease = 1 - Math.pow(1 - u, 3);
      theta = sTheta + (targetTheta - sTheta) * ease;
      phi = (sPhi + dPhi * ease + Math.PI * 2) % (Math.PI * 2);
      draw();
      if (u < 1) animId = requestAnimationFrame(tick);
    }
    animId = requestAnimationFrame(tick);
  }

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
    cancelAnimationFrame(animId);
    theta = (Number(e.target.value) * Math.PI) / 180;
    draw();
  });
  phiSlider?.addEventListener("input", (e) => {
    cancelAnimationFrame(animId);
    phi = (Number(e.target.value) * Math.PI) / 180;
    draw();
  });

  function applyBlochMatrix(fn) {
    const bx = Math.sin(theta) * Math.cos(phi);
    const by = Math.sin(theta) * Math.sin(phi);
    const bz = Math.cos(theta);
    const [nx, ny, nz] = fn(bx, by, bz);
    const nextTheta = Math.acos(Math.max(-1, Math.min(1, nz)));
    const nextPhi = Math.hypot(nx, ny) > 1e-5 ? (Math.atan2(ny, nx) + Math.PI * 2) % (Math.PI * 2) : phi;
    animateTo(nextTheta, nextPhi);
  }

  const gateButtons = document.querySelectorAll("[data-bloch-gate]");
  gateButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const g = btn.dataset.blochGate;
      gateButtons.forEach((b) => b.classList.toggle("active-gate", b === btn));
      if (cueEl && GATE_CUES[g]) cueEl.textContent = GATE_CUES[g];

      if (g === "H") applyBlochMatrix((x, y, z) => [z, -y, x]);
      else if (g === "X") applyBlochMatrix((x, y, z) => [x, -y, -z]);
      else if (g === "Z") applyBlochMatrix((x, y, z) => [-x, -y, z]);
      else if (g === "RX") applyBlochMatrix((x, y, z) => [x, -z, y]);
      else if (g === "S") applyBlochMatrix((x, y, z) => [-y, x, z]);
      else if (g === "COLLAPSE") {
        const p0 = Math.cos(theta / 2) ** 2;
        animateTo(Math.random() < p0 ? 0 : Math.PI, phi);
      } else if (g === "RESET") {
        animateTo(0, 0);
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
      <span class="lkq-op" style="text-align:right;font-size:0.82rem;color:var(--signal)">${row.quantum}</span>
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
        listEl.querySelectorAll(".lkq-item").forEach((el) => el.classList.remove("active"));
        effortWrap.querySelectorAll(".effort-chip").forEach((c) => c.classList.toggle("active", c === chip));
        detailEl.textContent = text;
      });
      effortWrap.appendChild(chip);
    });
  }
}

// ── 4. DisCoPy String-Diagram Stepper (With Direct Layer Pills + Auto-Play) ──
function initDiscopyStepper() {
  const nextBtn = document.getElementById("discopy-next");
  const autoBtn = document.getElementById("discopy-autoplay");
  const pillsWrap = document.getElementById("discopy-pills");
  const titleEl = document.getElementById("discopy-step-title");
  const circEl = document.getElementById("discopy-step-circuit");
  const descEl = document.getElementById("discopy-step-desc");
  if (!titleEl || !circEl || !descEl) return;

  let step = 4;
  let autoTimer = null;

  const pillBtns = DISCOPY_STEPS.map((s, idx) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "step-pill";
    b.textContent = s.short;
    b.addEventListener("click", () => {
      stopAuto();
      step = idx;
      render();
    });
    pillsWrap?.appendChild(b);
    return b;
  });

  function render() {
    const info = DISCOPY_STEPS[step];
    titleEl.textContent = info.title;
    circEl.textContent = info.circuit;
    descEl.textContent = info.desc;
    pillBtns.forEach((b, i) => b.classList.toggle("active", i === step));
    for (let i = 0; i < 5; i++) {
      const layer = document.getElementById(`dc-layer-${i}`);
      if (!layer) continue;
      layer.classList.toggle("lit", i <= step);
      layer.classList.toggle("current", i === step);
    }
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
      if (autoBtn) autoBtn.textContent = "▶ Auto-Play";
    }
  }

  nextBtn?.addEventListener("click", () => {
    stopAuto();
    step = (step + 1) % DISCOPY_STEPS.length;
    render();
  });

  autoBtn?.addEventListener("click", () => {
    if (autoTimer) {
      stopAuto();
    } else {
      step = 0;
      render();
      autoBtn.textContent = "⏸ Pause";
      autoTimer = setInterval(() => {
        step = (step + 1) % DISCOPY_STEPS.length;
        render();
      }, 1900);
    }
  });

  for (let i = 0; i < 5; i++) {
    const layer = document.getElementById(`dc-layer-${i}`);
    if (layer) {
      layer.style.cursor = "pointer";
      layer.addEventListener("click", () => {
        stopAuto();
        step = i;
        render();
      });
    }
  }
  render();
}

// ── 5. KrumpRobot Multi-View Stage + Custom Dark 140 BPM Audio Scrubber ──
function initKrumpRobotTimeline() {
  const wrap = document.getElementById("phrase-timeline");
  const video = document.getElementById("compare-video");
  const videoCap = document.getElementById("video-stage-caption");
  const audio = document.getElementById("krump-audio");
  const descBox = document.getElementById("phrase-active-desc");

  const playBtn = document.getElementById("audio-play-btn");
  const seekSlider = document.getElementById("audio-seek");
  const timeReadout = document.getElementById("audio-time-readout");
  const beatLed = document.getElementById("beat-led");
  const muteBtn = document.getElementById("audio-mute-btn");
  if (!wrap) return;

  let activeMode = "matrix4";
  const modeBtns = document.querySelectorAll("[data-video-mode]");

  function setVideoMode(mode, seekTo = null, autoPlay = false) {
    if (!VIDEO_MODES[mode] || !video) return;
    const changed = activeMode !== mode;
    activeMode = mode;
    modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.videoMode === mode));
    if (videoCap) videoCap.textContent = VIDEO_MODES[mode].caption;

    if (changed) {
      video.src = VIDEO_MODES[mode].src;
      video.poster = VIDEO_MODES[mode].poster;
      video.load();
    }

    const applySeek = () => {
      if (seekTo !== null) {
        video.currentTime = Math.min(seekTo, video.duration || seekTo);
      }
      if (autoPlay) {
        // Pause standalone soundtrack if full138 video (which has master audio) plays
        if (mode === "full138" && audio && !audio.paused) audio.pause();
        video.play().catch(() => {});
      }
    };

    if (changed && seekTo !== null) {
      video.addEventListener("loadedmetadata", applySeek, { once: true });
    } else {
      applySeek();
    }
  }

  modeBtns.forEach((b) => {
    b.addEventListener("click", () => setVideoMode(b.dataset.videoMode, null, false));
  });

  // Custom Dark Audio Player Controls
  playBtn?.addEventListener("click", () => {
    if (!audio) return;
    if (audio.paused) {
      if (activeMode === "full138" && video && !video.paused) video.pause();
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  });

  audio?.addEventListener("play", () => {
    if (playBtn) playBtn.textContent = "⏸";
    beatLed?.classList.add("playing");
  });
  audio?.addEventListener("pause", () => {
    if (playBtn) playBtn.textContent = "▶";
    beatLed?.classList.remove("playing");
  });
  audio?.addEventListener("ended", () => {
    if (playBtn) playBtn.textContent = "▶";
    beatLed?.classList.remove("playing");
  });

  seekSlider?.addEventListener("input", (e) => {
    const val = Number(e.target.value);
    if (audio) audio.currentTime = val;
    if (activeMode === "full138" && video) video.currentTime = val;
    syncByTime(val);
  });

  muteBtn?.addEventListener("click", () => {
    if (!audio) return;
    audio.muted = !audio.muted;
    muteBtn.textContent = audio.muted ? "🔇" : "🔊";
  });

  // 6-Phrase Timeline Buttons
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
      // Switch to full 1:38 video automatically so phrases 2..6 (0:14..1:38) play seamlessly!
      setVideoMode("full138", p.start, true);
      if (audio) {
        audio.currentTime = p.start;
        if (seekSlider) seekSlider.value = String(p.start);
        if (timeReadout) timeReadout.textContent = `${fmtTime(p.start)} / 1:38`;
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

  video?.addEventListener("timeupdate", () => {
    if (activeMode === "full138") {
      syncByTime(video.currentTime);
      if (audio?.paused) {
        if (seekSlider) seekSlider.value = String(video.currentTime);
        if (timeReadout) timeReadout.textContent = `${fmtTime(video.currentTime)} / 1:38`;
      }
    }
  });

  audio?.addEventListener("timeupdate", () => {
    const cur = audio.currentTime;
    const dur = audio.duration || 98.46;
    if (seekSlider) seekSlider.value = String(cur);
    if (timeReadout) timeReadout.textContent = `${fmtTime(cur)} / ${fmtTime(dur)}`;
    syncByTime(cur);
  });
}

// ── 6. BibTeX Tabs, Download .bib & Copy Utilities ──
function initBibtexAndCopy() {
  const pre = document.getElementById("bibtex-code");
  const copyBibBtn = document.getElementById("copy-bibtex-btn");
  const dlBibBtn = document.getElementById("download-bibtex-btn");
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
      showToast(`✓ Copied ${activeKey} BibTeX to clipboard`);
    } catch {}
  });

  dlBibBtn?.addEventListener("click", () => {
    const blob = new Blob([BIBTEX[activeKey] + "\n"], { type: "application/x-bibtex;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quantum-krump-${activeKey}.bib`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`⬇ Downloaded quantum-krump-${activeKey}.bib`);
  });

  document.querySelectorAll("[data-copy-target]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const target = document.getElementById(btn.dataset.copyTarget);
      if (!target) return;
      try {
        await navigator.clipboard.writeText(target.textContent.trim());
        showToast("✓ Copied to clipboard");
      } catch {}
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNavigationUX();
  initPreprintAndModals();
  initBlochSphere();
  initLkqMapper();
  initDiscopyStepper();
  initKrumpRobotTimeline();
  initBibtexAndCopy();
});
