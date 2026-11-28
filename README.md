# BinarAksara

BinarAksara adalah pendamping belajar adaptif 100% client-side untuk pelajar dan mahasiswa dengan disleksia, ADHD, dan low vision, serta dosen atau pendamping yang memiliki materi teks standar. Aplikasi ini mengubah teks materi menjadi kartu belajar yang dapat disesuaikan tanpa mengirim materi ke server.

## Latar belakang

Materi berbasis teks sering belum sesuai dengan kebutuhan membaca dan pemrosesan informasi setiap pelajar. BinarAksara membantu pengajar menyediakan bahan yang sama dalam potongan yang lebih teratur, sementara pelajar dapat memilih tampilan yang nyaman bagi dirinya.

## Tujuan

- Menyediakan tampilan bacaan yang dapat disesuaikan dengan profil pengguna.
- Memecah materi menjadi bentuk belajar yang lebih mudah diikuti.
- Mendukung pengalaman multisensori melalui teks dan text-to-speech.
- Menjaga data tetap berada di perangkat pengguna, tanpa backend atau database.

## Fitur

| Fitur | Status |
| --- | --- |
| Preset profil standar, disleksia, ADHD, dan low vision | Selesai |
| Pengaturan tipografi dan penyimpanan preferensi lokal | Selesai |
| Pemilihan materi contoh dan tempel teks dalam memori | Selesai |
| Teks utuh adaptif dan perbandingan dengan teks asli | Selesai |
| Kartu satu per layar, navigasi, dan mode fokus | Selesai |
| Reading ruler dengan pointer, keyboard, dan tinggi 1–3 baris | Selesai |
| Pemecahan kalimat berbasis aturan | Selesai |
| Kartu belajar, token, dan ekstraksi kata kunci TF | Selesai |
| Pemenggal suku kata | Rencana; `syllables` masih kosong |
| Latihan rumpang | Rencana; `createClozeItems` masih stub |
| Text-to-speech | Selesai; memakai Web Speech API browser, highlight kata, dan preferensi kecepatan |
| Estimasi beban teks heuristik | Selesai; bukan pengukuran medis/klinis |
| Modul dengan skor sebelum/sesudah berbobot jumlah kata | Selesai |
| Ekspor dan tampilan cetak | Rencana |

Pipeline NLP berjalan sepenuhnya di browser: pemisahan kalimat mempertahankan singkatan akademik dan format angka, kartu berisi 1–3 kalimat dengan batas sekitar 420 karakter, dan kata kunci diurutkan berdasarkan frekuensi lalu alfabet. Semua hasil bersifat deterministik. Skor beban hanya heuristik transparan untuk membandingkan teks, bukan diagnosis atau penilaian kemampuan pengguna.

## Kompatibilitas text-to-speech

TTS menggunakan `speechSynthesis` lokal yang disediakan browser dan sistem operasi; tidak ada API suara cloud, berkas audio, atau request jaringan. Tidak ada autoplay. Jika voice Bahasa Indonesia tidak tersedia, aplikasi dapat memakai voice bawaan sistem dan menampilkan peringatan eksplisit. Jika `speechSynthesis` tidak tersedia, kontrol suara dinonaktifkan dan materi tetap dapat dibaca; Chrome atau Edge dapat dicoba sebagai alternatif.

Highlight memakai event batas kata browser bila tersedia. Pada browser yang tidak memberikan event tersebut, sorotan tetap bergerak dengan **estimasi durasi** berbasis panjang kata, tanda baca, dan kecepatan—bukan sinkronisasi audio yang dijamin akurat. Dukungan event dan kualitas voice berbeda antar-browser/perangkat; kualitas audio belum diverifikasi secara auditori dalam pengujian otomatis.

## Skenario penerapan

Seorang dosen menempelkan materi kuliah ke BinarAksara. Mahasiswa kemudian memilih profil baca, materi diolah menjadi urutan kartu, dan modul dapat dicetak dalam tampilan adaptif ketika fitur cetak tersedia. Materi sekolah dapat mengikuti alur yang sama sehingga dosen, guru, dan pendamping tidak perlu menyiapkan salinan teks khusus untuk setiap profil.

Sebagai ilustrasi, alur tersebut dapat digunakan dalam lingkungan Universitas Multimedia Nusantara untuk materi Interaksi Manusia dan Komputer. Ini semata-mata **skenario penggunaan**, bukan klaim penggunaan resmi, kerja sama, atau hasil uji pengguna dengan institusi tersebut.

## Tech stack

- Next.js 16.4.6 dengan App Router
- React dan TypeScript
- Tailwind CSS v4
- Vitest
- Static export, tanpa backend, database, atau AI pretrained

## Cara menjalankan

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Pemeriksaan proyek:

```bash
npm run test:run
npm run typecheck
npm run lint
npm run build
```

Hasil build statis tersedia di direktori `out`.

## Rubrik dan bukti

| Kriteria | Bobot | Implementasi | Bukti |
| --- | --- | --- | --- |
| Kesesuaian Tema | 30% | Empat profil adaptif mengubah warna dan tipografi secara lokal tanpa backend, database, login, atau AI pretrained. | Implementasi tema pada `src/app/globals.css`, `src/lib/profiles.ts`, dan `src/hooks/usePreferences.ts`. |
| Tujuan dan Dampak Positif | 20% | Preferensi baca dapat disesuaikan dan disimpan di perangkat untuk mendukung kenyamanan membaca. | Evaluasi dampak bersama pengguna belum tersedia. |
| Fungsi dan Konten Website | 20% | Preset profil, pengaturan tipografi, penyimpanan preferensi, pipeline NLP deterministik, dan tiga materi sampel tersedia; fitur di luar tahap ini belum diimplementasikan. | `src/lib/nlp/`, `src/data/samples.ts`, dan unit test NLP; pengujian fungsional end-to-end belum tersedia. |
| Desain dan Aksesibilitas | 15% | Radiogroup native, label permanen, fokus terlihat, dukungan reduced motion, serta disclosure mobile dengan `aria-expanded` dan `aria-controls`. | Audit aksesibilitas dan pengujian bersama pengguna belum tersedia. |
| Kualitas Teknis dan Pengujian | 15% | Validasi dan sanitasi preferensi lokal, fungsi NLP murni, dan unit test untuk perilaku pemrosesan teks. | `src/__tests__/`; hasil pemeriksaan akhir dilaporkan bersama perubahan. |
