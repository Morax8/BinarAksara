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

| Rubrik | Bukti |
| --- | --- |
| Fungsionalitas | Placeholder — belum tersedia |
| Aksesibilitas | Placeholder — hasil pengujian akan dicatat di `TESTING.md` dan `docs/testing/` |
| Pengalaman pengguna | Placeholder — belum tersedia |
| Kualitas kode dan pengujian | Placeholder — laporan verifikasi akan ditambahkan |
| Dokumentasi | Placeholder — dokumentasi implementasi akan dilengkapi |
