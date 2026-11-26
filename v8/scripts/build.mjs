// Generates index.html (root: footage, VO, SFX, scene hosts) and
// compositions/captions.html from the edit decision list below.
// Run: node scripts/build.mjs
import fs from "node:fs";

const W = 1080, H = 1920, FPS = 60;
const DURATION = 40.4;           // VO ends 38.823 s; last card holds ~1.6 s after it
const VO_LEN = 38.823;

// ── Edit decision list (10 clips). Cuts sit in the VO's silences. ─────────
// vol = gain that lands each clip's own sound at VO − 27 LU (−56.5 LUFS),
// capped at +12 dB (see scripts/levels.txt).
const clips = [
  { id: "c01", src: "c01-pain",   start: 0.00,  end: 2.60,  vol: 0.1245, g: "g-hook"   },
  { id: "c02", src: "c02-reveal", start: 2.60,  end: 4.60,  vol: 0.0104, g: "g-reveal" },
  { id: "c03", src: "c03-versi",  start: 4.60,  end: 7.95,  vol: 3.9811, g: "g-versi"  },
  { id: "c04", src: "c04-band",   start: 7.95,  end: 10.70, vol: 0.5370, g: "g-band"   },
  { id: "c05", src: "c05-step",   start: 10.70, end: 14.40, vol: 0.0750, g: "g-boost"  },
  { id: "c06", src: "c06-jump",   start: 14.40, end: 18.30, vol: 0.0902, g: "g-floors" },
  { id: "c07", src: "c07-wear",   start: 18.30, end: 22.20, vol: 0.0479, g: "g-fabric" },
  { id: "c08", src: "c08-spray",  start: 22.20, end: 26.30, vol: 0.0174, g: "g-breath" },
  { id: "c09", src: "c09-walk",   start: 26.30, end: 32.35, vol: 0.0178, g: "g-use"    },
  { id: "c10", src: "c10-cta",    start: 32.35, end: DURATION, vol: 0.4027, g: "g-cta" },
];

// ── Sound effects (synthesised, ../scripts/synth_sfx.py). Kept well under the VO.
// whoosh peaks ~0.2 s after its start, so it starts 0.2 s before the cut.
const W_A = "whoosh-a", W_B = "whoosh-b";
const sfx = [
  ["impact", 0.02, 0.20], ["pop", 0.40, 0.10], ["pop", 0.55, 0.10], ["pop", 0.70, 0.10], ["pop", 0.85, 0.10], ["pop", 1.00, 0.12], ["zap", 1.88, 0.12],
  [W_A, 2.40, 0.13], ["pop", 3.42, 0.16],
  [W_B, 4.40, 0.13], ["ding", 5.24, 0.11], ["pop", 6.84, 0.15],
  [W_A, 7.75, 0.13], ["pop", 8.66, 0.15], ["whoosh-b", 9.50, 0.10],
  [W_B, 10.50, 0.13], ["riser", 11.70, 0.10], ["impact", 12.86, 0.16],
  [W_A, 14.20, 0.13], ["pop", 15.78, 0.15], ["pop", 15.88, 0.15], ["ding", 17.38, 0.11],
  [W_B, 18.10, 0.13], ["pop", 20.28, 0.16], ["pop", 21.26, 0.16],
  [W_A, 22.00, 0.13], ["pop", 22.52, 0.16], ["pop", 23.44, 0.16], ["pop", 24.60, 0.16],
  [W_B, 26.10, 0.13], ["pop", 27.22, 0.16], ["pop", 28.74, 0.16], ["pop", 30.74, 0.16],
  [W_A, 32.15, 0.13], ["impact", 33.20, 0.14],
  [W_B, 35.50, 0.12], ["pop", 36.86, 0.16], ["whoosh-a", 37.40, 0.12], ["ding", 37.96, 0.10],
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
      // hook: a short jolt on "longgar"
      [1.88].forEach((t) => {
        tl.fromTo("#w01", { x: 0 }, { keyframes: [{ x: -14, duration: 0.04 }, { x: 12, duration: 0.04 }, { x: -8, duration: 0.04 }, { x: 5, duration: 0.04 }, { x: 0, duration: 0.05 }], immediateRender: false }, t);
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
  [0.00, 2.40],   // "Baru naik lima anak tangga pun, lutut dah rasa longgar" → hook
  [4.60, 5.84],   // "Sebab version terbaru ni" → VERSION TERBARU
  [5.92, 7.52],   // "bukan setakat bagi compression je" → sub-headline
  [8.26, 10.38],  // "tapi dia ada elastic band dekat belah kiri dan kanan ni" → ELASTIC BAND
  [12.30, 14.02], // "dia akan bagi boost pada lutut korang tau" → BOOST
  [15.50, 17.92], // "nak naik dua tiga tingkat pun, memang tak lenguh lutut dah" → floors
  [19.30, 21.82], // "material kain dia tak gatal dan tak bergulung tau" → chips
  [22.10, 26.06], // "Sangat breathable, sangat selesa, tak rasa panas walaupun korang pakai lama" → chips
  [26.70, 32.06], // "Nak pakai untuk bersukan boleh … travel pun memang sesuai sangat" → cards
  [32.20, 34.90], // "So kalau korang sayang lutut tu, nak pakai lama kan" → SAYANG LUTUT
  [35.64, 37.30], // "korang boleh dapatkan support ni dekat link bawah" → CTA
  [37.28, 38.56], // "Korang rujuk je sizing chart ni" → sizing overlay
];
const KEY = new Set(["LUTUT", "LONGGAR", "KNEE", "SUPPORT", "TANGGA", "RISAU"]);
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
    .cap { position: absolute; left: 0; width: ${W}px; top: 1277px; text-align: center; overflow: visible; }
    .cap .in { display: inline-block; font-family: "Anton", sans-serif; font-size: 40px; line-height: 1.15;
      text-transform: uppercase; color: #fff; letter-spacing: 1px;
      -webkit-text-stroke: 6px #000; paint-order: stroke fill;
      text-shadow: 0 3px 0 rgba(0,0,0,.55); }
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
