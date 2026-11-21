# REVIEW — Knee Support Elastic v4 (9:16, gaya POV, tanpa VO)

Versi ringkas yang **ikut caption dalam gambar rujukan sahaja**: 7 shot, satu bagi setiap tangkapan skrin rujukan, mengikut susunan gambar. Tiada VO, tiada caption perkataan.

Format dikekalkan: 1080×1920, 60fps, Hyperframes, tiada muzik, bunyi footage pada −56.0 LUFS (had +12 dB, `scripts/levels.txt`), zoom masuk + kilatan putih setiap potongan, SFX sintesis (perlahan), intro satu shot laju asal.

## Teks

- **Banner POV (hook)** dari frame 0 hingga akhir: "POV: Cuti sekolah nak pergi travel, / standby knee support ni" — kotak kelabu gelap, Montserrat 600, dua baris (susun atur tangkapan skrin yang diluluskan).
- **Callout** (Montserrat italic putih, bayang gelap, dua baris) — teks tepat dari gambar rujukan.

## Potongan (7 klip, 23.2 s)

| # | Masa | Footage | Callout (dari rujukan) |
| --- | --- | --- | --- |
| 1 | 0.0–3.6 | lv151319 0 s — menyarung kedua-dua support | (banner POV sahaja) |
| 2 | 3.6–6.8 | lv151319 11.5 s — tangan menekan lutut | Ada silicone bentuk bulat, / Bagi cushion dan lock lutut! |
| 3 | 6.8–10.0 | lv151319 8 s — tangan di lutut | Bahagian kiri & kanan ada elastic band, / Kurang lenguh sewaktu melangkah |
| 4 | 10.0–13.2 | v154525 0.6 s — produk dilipat di depan muka | Bila lipat, dia bouncy kan? / Naik turun tangga, lutut steady je! |
| 5 | 13.2–16.4 | lv151319 16.2 s — kaki + tin semburan | Kain nampak tebal, / tapi sangat breathable! |
| 6 | 16.4–19.6 | lv151319 19.4 s — kaki + tin semburan | Pakai seharian pun / tak rasa panas berkuap! |
| 7 | 19.6–23.2 | lv151319 28 s — squat di trek | Sesuai untuk travel, / daily commute & sukan |

Setiap callout dipegang ~2.8 s (cukup masa baca), keluar sebelum potongan; callout terakhir kekal hingga frame akhir.

## Semakan

- `hyperframes check`: 0 ralat.
- Snapshot setiap babak + frame akhir disemak.
- Projek boleh dihidupkan semula dengan VO: `WITH_VO = true` dalam `scripts/build.mjs` (perlu EDL ikut VO semula).

## Hasil render (diukur)

- `v4/renders/knee-support-elastic-v4_1080x1920_60fps.mp4`: H.264 1080×1920, 60/1 fps, 23.20 s, **60.1 MB** (20 Mb/s, di bawah had 70 MB).
- Audio: tiada VO, tiada muzik; SFX + bunyi footage −56 LUFS → keseluruhan −37.0 LUFS, puncak −18.0 dBFS. Diukur, bukan didengar.
- Frame dari fail render (0, 3.65 kilatan, 5.2, 8.4, 11.6, 14.8, 18.0, 23.18 akhir) disemak.
- Amaran dikekalkan: callout panjang ("Bahagian kiri & kanan ada elastic band,", "Naik turun tangga, lutut steady je!") sedikit melepasi tepi kanan zon selamat Shorts/TikTok — dikekalkan dua baris seperti rujukan.
