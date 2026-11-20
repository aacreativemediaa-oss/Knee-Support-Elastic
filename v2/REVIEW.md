# REVIEW — Knee Support Elastic v2 (9:16)

Format sama dengan v1 (lihat `../REVIEW.md`): 1080×1920, 60fps, Hyperframes, tiada muzik, VO asal 100 % tanpa potongan, footage diselaraskan ke VO − 27 LU (had +12 dB), maksimum 10 klip, zoom masuk + kilatan putih setiap potongan, Anton / Montserrat × 0.7, caption 60px.

## Transkrip (VO baru, 31.97 s, −28.3 LUFS)

> Kalau cepat lenguh lutut bila berjalan, especially yang badan overweight tu, korang kena hati-hati tau.
> Salah langkah sikit pun boleh injured ataupun terselioh tau.
> So kalau nak lebih safety, korang pakai je knee support macam ni. Senang sangat nak pakai. Tinggal sarung je.
> Dekat bahagian kiri dan kanan ni ada elastic band macam ni tau. So setiap kali korang bergerak tu, dia akan bagi sokongan penuh. Rasa lebih melekap tau.
> Kain pun sangat breathable, so korang nak pakai lama pun tak rasa panas dan tak rasa berkuap.
> Untuk sizing pula, korang ikut je sizing chart ni. Harga tengah murah sekarang tau. Rugi korang tak grab terus.
> Korang check out sekarang dekat beg kuning bawah ni.

Pembetulan whisper: "ni support" → *knee support*, "bagian" → *bahagian*, "sizing cat" → *sizing chart*, "bed kuning" → *beg kuning*.

## Potongan (10 klip) — shot baharu disesuaikan dengan VO

| # | Masa | Footage | VO | Grafik |
| --- | --- | --- | --- | --- |
| 1 | 0.00–4.47 | b102551 — lelaki **berjalan** ke kamera (4K, crop 1.35×) — satu shot, laju asal | Cepat lenguh… bila berjalan… overweight… hati-hati | Hook "CEPAT LENGUH LUTUT BILA BERJALAN?" di frame 0, lencana KG ↑, amaran |
| 2 | 4.47–7.42 | b114700 — melutut pegang **buku lali** | Salah langkah… injured / terselioh | Letupan sakit di buku lali + vignet merah + gegaran |
| 3 | 7.42–10.45 | v154525 5 s — tunjuk produk | Lebih safety… knee support | Pil perisai "LEBIH SAFETY", viewfinder |
| 4 | 10.45–12.68 | lv151319 0.8 s — **menyarung** ke lutut | Senang pakai, tinggal sarung | "SENANG PAKAI / TINGGAL SARUNG JE!" |
| 5 | 12.68–15.36 | lv202631 28.8 s — tangan **meregang sisi elastic band** | Kiri & kanan ada elastic band | "KIRI & KANAN / ELASTIC BAND", cip FLEKSIBEL + anak panah ↔ yang meregang dan melantun dua kali |
| 6 | 15.36–17.06 | lv151319 32.5 s — high-knees | Setiap kali bergerak | (caption sahaja) |
| 7 | 17.06–19.62 | lv151319 8.2 s — tangan meratakan support di lutut | Sokongan penuh, melekap | "SOKONGAN PENUH" + bar 100 % |
| 8 | 19.62–24.33 | lv202631 18.4 s — jari **menekan & meregang jalur elastik** (dekat) | Breathable, tak panas, tak berkuap | Cip BREATHABLE + senarai ✓ TAK PANAS ✓ TAK BERKUAP |
| 9 | 24.33–27.10 | v142805 — dua support dalam kereta | Sizing chart | Kad sizing chart sebenar |
| 10 | 27.10–33.60 | v144512 — produk dalam kereta | Harga murah, rugi, check out beg kuning | Tag "HARGA MURAH!" + syiling → CTA "GRAB SEKARANG!" + beg kuning + anak panah |

*Elastic band fleksibel* ditunjuk dalam dua shot sebenar: klip 5 (regang sisi) dan klip 8 (tekan/regang jalur, dekat), dengan grafik regangan di klip 5.

## Audio

- VO: strim AAC asal disalin (`-c:a copy`), volume 1.0.
- Footage: sasaran −55.3 LUFS (VO −28.3 − 27), gain per klip dalam `scripts/levels.txt`. Klip 9 memang senyap.
- SFX: fail sintesis yang sama seperti v1, 30 hits, volume 0.10–0.20.

## Semakan

- `hyperframes check`: 0 ralat. Amaran dikekalkan: tag harga/syiling hampir tepi kanan zon TikTok; klip 9 senyap; caption dalam satu fail.
- Snapshot setiap babak disemak; intro di-crop semula supaya pejalan kaki di tengah dan muka tidak dilindungi tajuk/lencana.

## Hasil render (diukur)

- `v2/renders/knee-support-elastic-v2_1080x1920_60fps.mp4`: H.264 1080×1920, 60/1 fps, 33.60 s, AAC 48 kHz stereo 192 kb/s, **65.3 MB**.
- VO vs asal: offset **0 sampel**, gain **0.9967 (−0.03 dB)** → selari & 100 %.
- Loudness: VO −28.3 LUFS (short-term maks −26.7); stem SFX + footage −35.9 LUFS (short-term maks −35.7) ≈ 9 dB di bawah VO.
- Frame dari fail render (0, 4.48 kilatan, 6.1, 11.9, 14.2, 17.07 kilatan, 18.6, 23.9, 26.0, 28.0, 33.58 CTA) disemak.
- Bunyi diukur, bukan didengar.
