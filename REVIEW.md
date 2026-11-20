# REVIEW — Knee Support Elastic (9:16)

## Transkrip (VO asal, 38.3 s, whisper large-v3)

> Berdiri lama sikit dan lenguh lutut kan, itu tandanya berat korang tu dah makin naik tau. Korang kena hati-hati.
> Sebab tu bila korang jalan sikit je, lutut dah mula rasa sengal, mencucuk kan.
> So nak kurangkan lenguh tu, korang kena pakai knee support macam ni. Yang ni version terbaru tau.
> Dia ada elastic band dekat belah kiri dan kanan. So lebih fleksibel, setiap kali korang melangkah tu, dia akan bantu support pergerakan korang.
> Dan kain pun stretchable dan breathable tau. Korang pakai lama pun tak rasa gatal dan tak rasa berkuap. Memang selesa sangat.
> Nak pakai untuk bersukan boleh, untuk kerja pun boleh. So kalau nak kurangkan lenguh lutut tu, korang wajib standby knee support ni.
> Untuk sizing, korang boleh follow sizing chart ni. Harga pun tengah murah tau. Korang grab terus kat beg kuning bawah ni.

Pembetulan pada output whisper: "korang ke" → *kurangkan*, "ni support" → *knee support*, "pesukan" → *bersukan*, "backcone" → *beg kuning*.

## Potongan (10 klip, potong dalam senyap VO)

| # | Masa | Footage | Ayat VO | Grafik |
| --- | --- | --- | --- | --- |
| 1 | 0.00–5.40 | b091215 (lelaki bongkok pegang lutut) — **satu shot, laju asal** | Berdiri lama… hati-hati | Hook "BERDIRI LAMA SIKIT, LUTUT LENGUH?" di frame 0, lencana KG + anak panah naik, segitiga amaran |
| 2 | 5.40–9.45 | b091144 (berjalan di trek) | Sebab tu bila… mencucuk | Vignet merah + letupan "sakit" + gegaran pada *sengal* / *mencucuk* |
| 3 | 9.45–12.50 | v154525 (tunjuk produk) | So nak kurangkan… macam ni | Pil "SOLUSINYA", viewfinder hijau pada *knee support* |
| 4 | 12.50–13.85 | v225323 (baru vs lama, skrin belah) | Yang ni version terbaru | "VERSION TERBARU", tag BARU ✓ / LAMA, sisi lama dimalapkan |
| 5 | 13.85–15.85 | lv202631 31.8 s (pandangan sisi, jalur elastik) | Elastic band kiri kanan | Tajuk + anak panah KIRI / KANAN |
| 6 | 15.85–20.20 | lv151319 23.6 s (squat & lompat, dipakai) | Lebih fleksibel… pergerakan | "FLEKSIBEL" huruf melonjak |
| 7 | 20.20–22.50 | v144512 13.4 s (regang kain) | Stretchable & breathable | Dua cip STRETCHABLE / BREATHABLE |
| 8 | 22.50–26.50 | lv151319 6.0 s (lutut dipakai, dekat) | Pakai lama… selesa | "PAKAI LAMA PUN" ✓ TAK GATAL ✓ TAK BERKUAP |
| 9 | 26.50–32.80 | lv151319 30.4 s (squat → high-knees) | Sukan / kerja… wajib standby | Kad SUKAN / KERJA "BOLEH ✓", setem "WAJIB STANDBY!" |
| 10 | 32.80–40.00 | lv202631 11.0 s (produk depan) | Sizing… harga… grab | Kad sizing chart sebenar → tag "HARGA MURAH!" → CTA "GRAB SEKARANG!" + beg kuning + anak panah ke bakul |

Setiap klip: zoom masuk 1.00→1.07 dalam 0.45 s (expo.out) + kilatan putih 0.85 pada setiap potongan.
Bahagian tak perlu dibuang dari footage (pembungkusan, semburan tin, kuku kaki b093604, footage produk hijau lama kecuali sebagai perbandingan). VO **tidak dipotong**.

## Teks & caption

- Anton (tajuk, caption) + Montserrat 800 (label). Semua saiz tajuk/label = asas × **0.7** (`--k: 0.7` dalam setiap fail grafik).
- Caption 60px, huruf besar, stroke hitam, 2–3 perkataan, tengah bawah (y = 1150). Perkataan aktif kuning (#FFE600), kata kunci hijau neon (#39FF14).
- Caption disembunyikan untuk 11 klausa yang grafik sudah tunjuk (senarai `hide` dalam `scripts/build.mjs`).

## Audio

- VO: strim AAC asal disalin tanpa ubah (`-c:a copy`), volume 1.0, bermula 0.000 s.
- Footage: setiap klip diukur (EBU R128) dan diselaraskan ke VO − 27 LU = **−56.6 LUFS** (VO = −29.6 LUFS), had +12 dB. Lihat `scripts/levels.txt`. Klip 4, 5, 7 memang senyap dalam sumber (check: `audio_clip_silent`), jadi gain +12 dB / kecil tidak memberi kesan.
- SFX disintesis (`scripts/synth_sfx.py`), volume 0.10–0.20, satu atau dua lorong.
- Tiada muzik latar.

## Semakan

- `hyperframes check`: 0 ralat.
- Snapshot setiap babak & frame akhir setiap blok grafik disemak (termasuk CTA di 39.98 s).
- Amaran yang dikekalkan dengan sengaja:
  - `outside_safe_zone` (caption & "Grab sekarang!" di tepi kanan zon TikTok/Shorts) — caption diminta di tengah; zon kanan TikTok hanya ~780 px.
  - `audio_clip_silent` (klip 4/5/7) — sumber memang tiada bunyi.
  - `timeline_track_too_dense` — caption dalam satu fail supaya Studio tunjuk satu trek caption.
- Bunyi **diukur, bukan didengar**.
