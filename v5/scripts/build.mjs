// Generates index.html (root: footage, VO, SFX, scene hosts) and
// compositions/captions.html from the edit decision list below.
// Run: node scripts/build.mjs
import fs from "node:fs";

const W = 1080, H = 1920, FPS = 60;
const DURATION = 42.6;           // VO ends 40.975 s; CTA holds ~1.8 s after it
const VO_LEN = 40.975;

// ── Edit decision list (10 clips). Cuts sit in the VO's silences. ─────────
// vol = gain that lands each clip's own sound at VO − 27 LU (−57.9 LUFS),
// capped at +12 dB (see scripts/levels.txt).
const clips = [
  { id: "c01", src: "c01-pain",   start: 0.00,  end: 5.70,  vol: 0.1318, g: "g-hook"   },
  { id: "c02", src: "c02-walk",   start: 5.70,  end: 8.78,  vol: 0.1318, g: "g-pain"   },
  { id: "c03", src: "c03-reveal", start: 8.78,  end: 12.42, vol: 0.0112, g: "g-reveal" },
  { id: "c04", src: "c04-versi",  start: 12.42, end: 13.72, vol: 3.9811, g: "g-versi"  },
  { id: "c05", src: "c05-flex",   start: 13.72, end: 18.02, vol: 0.7586, g: "g-flex"   },
  { id: "c06", src: "c06-step",   start: 18.02, end: 21.40, vol: 0.0741, g: "g-step"   },
  { id: "c07", src: "c07-fabric", start: 21.40, end: 26.75, vol: 0.2113, g: "g-fabric" },
  { id: "c08", src: "c08-sport",  start: 26.75, end: 29.85, vol: 0.0617, g: "g-use"    },
  { id: "c09", src: "c09-wear",   start: 29.85, end: 34.00, vol: 0.0407, g: "g-must"   },
  { id: "c10", src: "c10-cta",    start: 34.00, end: DURATION, vol: 0.3631, g: "g-cta" },
];

// ── Sound effects (synthesised, ../scripts/synth_sfx.py). Kept well under the VO.
// whoosh peaks ~0.2 s after its start, so it starts 0.2 s before the cut.
const W_A = "whoosh-a", W_B = "whoosh-b";
const sfx = [
  ["impact", 0.02, 0.20],
  [W_B, 2.86, 0.10], ["pop", 3.90, 0.16], ["pop", 5.04, 0.16],
  [W_A, 5.50, 0.13], ["zap", 8.14, 0.12],
  [W_B, 8.58, 0.13], ["pop", 9.10, 0.15], ["pop", 11.30, 0.16],
  [W_A, 12.22, 0.13], ["ding", 12.92, 0.12],
  [W_B, 13.52, 0.13], ["pop", 14.24, 0.15], ["whoosh-b", 15.70, 0.10], ["impact", 16.20, 0.14],
  [W_A, 17.82, 0.13], ["pop", 20.26, 0.16],
  [W_B, 21.20, 0.13], ["pop", 22.36, 0.16], ["pop", 23.06, 0.16], ["pop", 25.66, 0.16], ["pop", 26.30, 0.16],
  [W_A, 26.55, 0.13], ["pop", 27.54, 0.16], ["pop", 29.06, 0.16],
  [W_B, 29.65, 0.13], ["impact", 32.52, 0.18],
  [W_A, 33.80, 0.13],
  ["riser", 35.62, 0.12], ["impact", 36.82, 0.18], ["cha-ching", 37.56, 0.16], ["ding", 38.54, 0.10],
  [W_B, 39.06, 0.12], ["pop", 40.30, 0.16],
];
const sfxLen = { "whoosh-a": 0.42, "whoosh-b": 0.36, pop: 0.12, ding: 1.1, impact: 0.7, "cha-ching": 1.0, riser: 1.2, zap: 0.22 };

const r = (n) => +n.toFixed(3);
const cutTimes = clips.slice(1).map((c) => c.start);

// lanes: SFX that overlap go on a second lane
const sfxLanes = []; const laneEnd = [];
for (const [name, t] of sfx) {
  let lane = laneEnd.findIndex((e) => e <= t);
  if (lane < 0) { lane = laneEnd.length; laneEnd.push(0); }
  laneEnd[lane] = t + sfxLen[name]; sfxLanes.push(lane);
}

const videoTags = clips.map((c, i) => `      <div class="vw" id="w${c.id.slice(1)}">
        <video id="${c.id}" class="clip" src="assets/footage/${c.src}.mp4"
          data-start="${c.start}" data-duration="${r(c.end - c.start)}" data-media-start="0"
          data-track-index="0" data-has-audio="true" data-volume="${c.vol}" playsinline></video>
      </div>`).join("\n");

const sceneHosts = clips.filter((c) => c.g).map((c) => `      <div id="${c.g}" data-composition-id="${c.g}" data-composition-src="compositions/${c.g}.html"
        data-start="${c.start}" data-duration="${r(c.end - c.start)}" data-track-index="2"
        data-track-kind="graphics" data-width="${W}" data-height="${H}"></div>`).join("\n");

const sfxTags = sfx.map(([name, t, v], i) => `      <audio id="sfx${String(i + 1).padStart(2, "0")}" class="clip" src="assets/sfx/${name}.wav"
        data-start="${t}" data-duration="${sfxLen[name]}" data-track-index="${6 + sfxLanes[i]}" data-volume="${v}"></audio>`).join("\n");

const index = `<!doctype html>
<html lang="ms">
  <head>
    <meta charset="utf-8" />
    <title>Knee Support Elastic — 9:16</title>
    <script src="assets/vendor/gsap.min.js"></script>
    <style>
      html, body { margin: 0; background: #000; }
      #root { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; background: #000; }
      .vw { position: absolute; left: 0; top: 0; width: ${W}px; height: ${H}px; overflow: hidden; }
      .vw video { position: absolute; left: 0; top: 0; width: ${W}px; height: ${H}px; object-fit: cover; }
      #flash { position: absolute; left: 0; top: 0; width: ${W}px; height: ${H}px; background: #fff; opacity: 0; z-index: 40; pointer-events: none; }
      ${clips.map((c, i) => `#w${c.id.slice(1)} { z-index: ${i + 1}; }`).join(" ")}
      ${clips.filter((c) => c.g).map((c) => `#${c.g}`).join(", ")} { z-index: 50; }
      #captions { z-index: 60; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${DURATION}"
      data-width="${W}" data-height="${H}" data-fps="${FPS}">
      <!-- Footage: 10 clips, real product footage on every feature beat -->
${videoTags}
      <div id="flash" data-layout-ignore></div>

      <!-- Voiceover: original, untouched, 100 % -->
      <audio id="vo" class="clip" src="assets/audio/vo.m4a" data-start="0" data-duration="${VO_LEN}"
        data-track-index="4" data-volume="1"></audio>

      <!-- Motion graphics, one scene per clip -->
${sceneHosts}

      <!-- Captions -->
      <div id="captions" data-composition-id="captions" data-composition-src="compositions/captions.html"
        data-start="0" data-duration="${DURATION}" data-track-index="3" data-track-kind="captions"
        data-width="${W}" data-height="${H}"></div>

      <!-- Sound effects (synthesised) -->
${sfxTags}
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      const clips = ${JSON.stringify(clips.map((c) => ({ w: "#w" + c.id.slice(1), s: c.start })))};
      // every clip: brief zoom-in as it lands
      clips.forEach((c) => {
        tl.set(c.w, { scale: 1, transformOrigin: "50% 50%" }, 0);
        tl.fromTo(c.w, { scale: 1 }, { scale: 1.07, duration: 0.45, ease: "expo.out", immediateRender: false }, c.s);
      });
      // white flash on every cut
      tl.set("#flash", { opacity: 0 }, 0);
      ${JSON.stringify(cutTimes)}.forEach((t) => {
        tl.fromTo("#flash", { opacity: 0 }, { opacity: 0.85, duration: 0.05, ease: "none", immediateRender: false }, t - 0.05);
        tl.fromTo("#flash", { opacity: 0.85 }, { opacity: 0, duration: 0.24, ease: "power2.out", immediateRender: false }, t);
      });
      // pain beat: a short jolt on "sengal"
      [8.16].forEach((t) => {
        tl.fromTo("#w02", { x: 0 }, { keyframes: [{ x: -14, duration: 0.04 }, { x: 12, duration: 0.04 }, { x: -8, duration: 0.04 }, { x: 5, duration: 0.04 }, { x: 0, duration: 0.05 }], immediateRender: false }, t);
      });
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`;
fs.writeFileSync("index.html", index);

// ── Captions ───────────────────────────────────────────────────────────────
// Words come from the whisper large-v3 transcript (scripts/transcript.json),
// with recognition fixes applied there. Clauses whose words a graphic already
// shows on screen are hidden (hide ranges below, in VO seconds).
const words = JSON.parse(fs.readFileSync("scripts/transcript.json", "utf8"));
const hide = [
  [0.00, 1.96],   // "Kalau berdiri lama sikit dan lenguh lutut" → hook headline
  [12.40, 13.62], // "Yang ni version terbaru tau" → VERSION TERBARU
  [13.72, 15.74], // "Siap ada elastic band dekat belah kiri dan kanan" → ELASTIC BAND
  [15.78, 17.84], // "Lebih fleksibel berbanding yang version lama" → FLEKSIBEL
  [19.52, 21.30], // "dia akan bantu support pergerakan korang tau" → PERGERAKAN
  [21.40, 23.45], // "Dan kain dia pun sangat stretchable dan breathable" → chips
  [23.58, 26.70], // "Korang nak pakai lama pun, kulit korang tak rasa gatal ataupun berkuap" → checklist
  [26.80, 29.74], // "Nak pakai untuk bersukan boleh, nak pakai untuk pergi kerja pun boleh" → cards
  [31.90, 33.95], // "korang wajib standby knee support macam ni" → stamp
  [34.04, 36.62], // "Untuk size pula, korang boleh follow sizing chart ni" → sizing overlay
  [36.80, 37.98], // "Harga pun tengah murah tau" → price tag
  [39.24, 40.80], // "Korang grab terus beg kuning bawah ni" → CTA
];
const KEY = new Set(["LENGUH", "LUTUT", "BERAT", "NAIK", "HATI-HATI", "SENGAL", "KURANGKAN", "KNEE", "SUPPORT",
  "MELANGKAH", "BERBALOI", "WAJIB"]);
const isHidden = (w) => hide.some(([a, b]) => w.s >= a && w.e <= b + 0.001);
const vis = words.filter((w) => !isHidden(w));

// group: split into phrases at punctuation or a pause ≥ 0.15 s, then cut each
// phrase into 2–3 word groups, choosing the split whose widest group is shortest
const phrases = []; let cur = [];
vis.forEach((w, i) => {
  cur.push(w);
  const nxt = vis[i + 1];
  if (!nxt || /[.,?!]$/.test(w.w) || nxt.s - w.e >= 0.15) { phrases.push(cur); cur = []; }
});
const width = (g) => g.map((w) => w.w.replace(/[.,?!]/g, "")).join(" ").length;
function chunk(ws) {
  if (ws.length === 1 || (ws.length <= 3 && width(ws) <= 20)) return [ws];
  let bestSplit = [ws], bestScore = Infinity;
  (function rec(rest, acc) {
    if (!rest.length) {
      const score = Math.max(...acc.map(width)) + 3 * acc.length;
      if (score < bestScore) { bestScore = score; bestSplit = acc; }
      return;
    }
    for (const n of [2, 3]) if (rest.length >= n && !/^knee$/i.test(rest[n - 1].w)) rec(rest.slice(n), [...acc, rest.slice(0, n)]);
  })(ws, []);
  return bestSplit;
}
const groups = phrases.flatMap(chunk);

const clean = (t) => t.replace(/[.,?!]/g, "").toUpperCase();
let gid = 0; const gHtml = []; const gJs = [];
groups.forEach((g, i) => {
  const start = Math.max(0.1, g[0].s - 0.04);
  const next = groups[i + 1];
  let end = g[g.length - 1].e + 0.28;
  if (next) end = Math.min(end, Math.max(0.1, next[0].s - 0.04));
  // no caption across a cut flash: nothing to do, groups are short
  gid++;
  const id = `cap${String(gid).padStart(2, "0")}`;
  const spans = g.map((w, j) => {
    const t = clean(w.w);
    return `<span id="${id}w${j}" class="w${KEY.has(t) ? " k" : ""}">${t}</span>`;
  }).join(" ");
  gHtml.push(`    <div id="${id}" class="cap clip" data-start="${r(start)}" data-duration="${r(end - start)}"><div class="in" id="${id}i">${spans}</div></div>`);
  gJs.push({ id, s: r(start), words: g.map((w, j) => ({ el: `#${id}w${j}`, s: r(w.s), k: KEY.has(clean(w.w)) })) });
});

const captions = `<template>
  <style>
    @font-face { font-family: "Anton"; src: url("assets/fonts/anton-latin.woff2") format("woff2"); font-weight: 400; }
    #root { position: absolute; inset: 0; pointer-events: none; }
    .cap { position: absolute; left: 0; width: ${W}px; top: 1150px; text-align: center; overflow: visible; }
    .cap .in { display: inline-block; font-family: "Anton", sans-serif; font-size: 60px; line-height: 1.15;
      text-transform: uppercase; color: #fff; letter-spacing: 1px;
      -webkit-text-stroke: 9px #000; paint-order: stroke fill;
      text-shadow: 0 5px 0 rgba(0,0,0,.55); }
    .cap .w { display: inline-block; }
    .cap .w.k { color: #39ff14; }
  </style>
  <div id="root" data-composition-id="captions" data-width="${W}" data-height="${H}" data-layout-allow-caption-zone>
${gHtml.join("\n")}
  </div>
  <script>
    const tl = gsap.timeline({ paused: true });
    const groups = ${JSON.stringify(gJs)};
    groups.forEach((g) => {
      tl.fromTo("#" + g.id + "i", { scale: 0.82, y: 10 }, { scale: 1, y: 0, duration: 0.16, ease: "back.out(2)", immediateRender: false }, g.s);
      g.words.forEach((w, i) => {
        // active word: yellow (keywords stay neon green and get a small pop)
        if (w.k) {
          tl.fromTo(w.el, { scale: 1 }, { scale: 1.12, duration: 0.08, ease: "power2.out", immediateRender: false }, w.s);
          tl.to(w.el, { scale: 1, duration: 0.12, ease: "power2.in" }, w.s + 0.16);
        } else {
          tl.set(w.el, { color: "#ffe600" }, w.s);
          const nx = g.words[i + 1];
          if (nx) tl.set(w.el, { color: "#ffffff" }, nx.s);
        }
      });
    });
    window.__timelines["captions"] = tl;
  </script>
</template>
`;
fs.mkdirSync("compositions", { recursive: true });
fs.writeFileSync("compositions/captions.html", captions);
console.log(`index.html: ${clips.length} clips, ${sfx.length} sfx; captions: ${groups.length} groups`);
console.log(groups.map((g) => `${g[0].s.toFixed(2)} ${g.map((w) => clean(w.w)).join(" ")}`).join("\n"));
