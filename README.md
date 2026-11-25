# BinarAksara

BinarAksara adalah pendamping belajar adaptif 100% client-side untuk siswa berkebutuhan khusus, termasuk siswa dengan disleksia, ADHD, dan low vision. Aplikasi ini dirancang untuk mengubah teks materi pelajaran menjadi modul belajar multisensori.

## Latar belakang

Materi pelajaran berbasis teks sering belum sesuai dengan kebutuhan membaca dan pemrosesan informasi setiap siswa. BinarAksara bertujuan menyediakan pengalaman belajar yang dapat disesuaikan tanpa mengirim materi pengguna ke server.

## Tujuan

- Menyediakan tampilan bacaan yang dapat disesuaikan dengan profil pengguna.
- Memecah materi menjadi bentuk belajar yang lebih mudah diikuti.
- Mendukung pengalaman multisensori melalui teks dan text-to-speech.
- Menjaga data tetap berada di perangkat pengguna, tanpa backend atau database.

## Fitur

Seluruh fitur berikut berstatus **rencana**; struktur awalnya tersedia, tetapi logika fitur belum diimplementasikan.

| Fitur | Status |
| --- | --- |
| Preset profil standar, disleksia, ADHD, dan low vision | Rencana |
| Pengaturan tipografi dan reading ruler | Rencana |
| Pemecahan kalimat dan suku kata | Rencana |
| Kartu belajar, kata kunci, dan latihan rumpang | Rencana |
| Text-to-speech dengan fallback waktu | Rencana |
| Estimasi beban kognitif | Rencana |
| Ekspor dan tampilan cetak | Rencana |
| Penyimpanan preferensi lokal | Rencana |

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
| Fungsi dan Konten Website | 20% | Preset profil, pengaturan tipografi manual, penyimpanan preferensi, dan pratinjau tiga paragraf fotosintesis tersedia; fitur di luar tahap ini belum diimplementasikan. | `src/components/sandbox/Sandbox.tsx` dan `src/components/reader/ReaderView.tsx`; pengujian fungsional end-to-end belum tersedia. |
| Desain dan Aksesibilitas | 15% | Radiogroup native, label permanen, fokus terlihat, dukungan reduced motion, serta disclosure mobile dengan `aria-expanded` dan `aria-controls`. | Audit aksesibilitas dan pengujian bersama pengguna belum tersedia. |
| Kualitas Teknis dan Pengujian | 15% | Validasi dan sanitasi preferensi lokal, tipisnya batas client-side, serta unit test untuk preset dan storage. | `src/__tests__/profiles.test.ts` dan `src/__tests__/storage.test.ts`; hasil pemeriksaan akhir dilaporkan bersama perubahan. |
