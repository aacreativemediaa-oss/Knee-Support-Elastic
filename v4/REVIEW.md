# REVIEW — Knee Support Elastic v4 (9:16, gaya POV)

> **Kemas kini:** v4 kini **tanpa VO** (permintaan). Trek VO dan caption perkataan (transkrip VO) dibuang (`WITH_VO = false` dalam `scripts/build.mjs`). Banner POV, callout, grafik, SFX dan potongan kekal pada timing yang sama. Bunyi footage kekal pada aras sebelumnya (−56 LUFS), jadi audio kebanyakannya SFX.

VO sama dengan v3 (fail Drive yang sama, 34.32 s, −29.0 LUFS) — transkrip dalam `../v3/REVIEW.md`.
Format sama: 1080×1920, 60fps, Hyperframes, tiada muzik, VO asal 100 % tanpa potongan, footage diselaraskan ke VO − 27 LU (−56.0 LUFS, had +12 dB), 10 klip, zoom masuk + kilatan putih setiap potongan, caption Anton 60px (kuning aktif, hijau kata kunci, 2–3 perkataan), caption disembunyikan bila grafik tunjuk ayat sama, SFX sintesis.

## Apa yang berubah ikut gambar rujukan

- **Hook = banner POV** di atas, dari frame 0 hingga akhir: "POV: Cuti sekolah nak pergi travel, / standby knee support ni" (Montserrat 600, kotak kelabu gelap lut sinar, dua baris — seperti rujukan).
- **Shot** dipadankan dengan rujukan: kaki memakai support (tangan di lutut, menyarung, tin semburan), produk dilipat di depan muka, squat di trek.
- **Callout ciri** gaya rujukan (Montserrat italic putih, bayang gelap, dua baris): teks diambil dari rujukan.

## Potongan (10 klip)

| # | Masa | Footage | VO | Grafik |
| --- | --- | --- | --- | --- |
| 1 | 0.00–4.65 | lv151319 4 s — kaki memakai support, tangan di lutut — satu shot | Senang sakit lutut… overweight… hati-hati | Banner POV (hook), carta BMI dengan OVERWEIGHT diserlahkan, amaran |
| 2 | 4.65–7.35 | b114700 — pegang buku lali | Salah langkah… injured | Letupan sakit + vignet + gegaran |
| 3 | 7.35–10.20 | b091144 — berjalan | Kerja banyak berjalan / berdiri | Pil "YANG KERJA" + BANYAK BERJALAN / BERDIRI |
| 4 | 10.20–12.78 | v154525 — produk dilipat di depan muka | Nak lebih safety… knee support | Callout "Bila lipat, dia bouncy kan? / Naik turun tangga, lutut steady je!" |
| 5 | 12.78–14.62 | lv151319 0 s — menyarung support | Senang pakai, tinggal sarung | "SENANG PAKAI / TINGGAL SARUNG JE!" |
| 6 | 14.62–18.62 | lv151319 9.6 s — tangan di lutut | Kiri kanan elastic band | Callout "Bahagian kiri & kanan ada elastic band, / Kurang lenguh sewaktu melangkah" |
| 7 | 18.62–21.62 | lv151319 28 s — squat di trek | Bergerak… full support | Callout "Sesuai untuk travel, / daily commute & sukan" |
| 8 | 21.62–27.30 | lv151319 16.2 s — kaki + tin semburan | Breathable… tak berkuap / panas | Callout "Kain nampak tebal, / tapi sangat breathable!" → "Pakai seharian pun / tak rasa panas berkuap!" |
| 9 | 27.30–29.80 | v142805 | Sizing chart | Kad sizing chart sebenar |
| 10 | 29.80–36.00 | lv202631 7 s — produk depan | Harga murah, rugi, beg kuning | Tag "HARGA MURAH!" → CTA "GRAB SEKARANG!" + beg kuning + anak panah |

Semua grafik atas dialihkan ke bawah banner POV (y ≥ 440) supaya tidak bertindih.

## Semakan

- `hyperframes check`: 0 ralat. Amaran dikekalkan: banner POV & callout lebar sedikit melepasi tepi kanan zon selamat TikTok/Shorts (dikekalkan supaya dua baris seperti rujukan); klip 9 senyap; caption dalam satu fail.
- Snapshot setiap babak disemak.

## Nota format

Untuk v4, susun atur ikut tangkapan skrin yang diluluskan (banner POV kecil dua baris, callout italic dua baris, saiz tajuk asal ×0.7).
Format baharu **headline 150px / sub-headline 70px** disimpan untuk tugasan seterusnya (dicuba di commit f06894b, kemudian dipulihkan untuk v4 atas permintaan).

## Hasil render (diukur) — tanpa VO

- `v4/renders/knee-support-elastic-v4_1080x1920_60fps.mp4`: H.264 1080×1920, 60/1 fps, 36.00 s, **65.4 MB**.
- VO tiada dalam mix: korelasi dengan VO asal → gain 0.0011 (−58.9 dB), iaitu tiada.
- Audio keseluruhan (SFX + bunyi footage −56 LUFS, tiada muzik — format dikekalkan): −35.9 LUFS, puncak −18.0 dBFS.
- Frame dari fail render (1.2, 6.1, 11.9, 17.0, 23.5, 35.98) disemak — tiada caption, banner POV & callout kekal.
- Bunyi diukur, bukan didengar.
