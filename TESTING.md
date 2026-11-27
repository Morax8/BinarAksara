# Pengujian BinarAksara

Dokumen ini mencatat pengujian manual, aksesibilitas, dan tindak lanjut bug.
Bagian yang belum dijalankan tetap ditulis **belum diuji**; tidak ada klaim pengujian
yang belum dilakukan.

## Ringkasan status

| Tanggal | Lingkup | Hasil |
| --- | --- | --- |
| 25 November 2026 | Theme engine (commit `e74319e`, kini `fca79bb`) | Lolos gate otomatis dan verifikasi browser di bawah |
| 27 November 2026 | Reader interaktif (sebelum commit) | 38 test lolos; alur browser lolos, lihat bagian reader |
| 25 November 2026 | axe, screen reader, Firefox/Safari, perangkat fisik | Belum diuji |

## Gate otomatis — 25 November 2026

Dijalankan ulang oleh auditor pada commit `e74319e`:

| Perintah | Hasil |
| --- | --- |
| `npm run test:run` | 13 passed, 5 todo |
| `npm run typecheck` | Lolos, tanpa error |
| `npm run lint` | Lolos, tanpa error |
| `npm run build` | Sukses; rute `/` dan `/tentang` tergenerate sebagai konten statis |

## Verifikasi browser — 25 November 2026

Lingkungan: Windows, browser berbasis Chromium, hasil static export `out/` yang
disajikan sebagai situs statis. Pemeriksaan dilakukan dengan membaca computed style,
DOM, localStorage, dan daftar request jaringan; bukan hanya melihat tangkapan layar.

| Pemeriksaan | Hasil terukur | Status |
| --- | --- | --- |
| Profil Low Vision diterapkan | `data-profile="lowVision"`; latar `rgb(9, 13, 22)` (`#090D16`); teks putih | Lolos |
| Tipografi Low Vision | 26.1px (= 18 × 1.45), line-height 46.98px, letter-spacing 0.261px, word-spacing 1.044px | Lolos |
| Persistensi setelah reload | Profil tetap `lowVision`, radio tetap terpilih, ukuran teks tetap 26.1px | Lolos |
| Slider ukuran teks | Berubah ke 28.8px dan nilai `1.6` tersimpan di localStorage | Lolos |
| Status "(disesuaikan)" | Muncul setelah slider digeser | Lolos |
| Tombol kembalikan preset | Nilai tipografi kembali ke preset dan label "(disesuaikan)" hilang | Lolos |
| Panel mobile 390px | `display: none`, `aria-expanded=false`; menjadi `true` setelah tombol dibuka | Lolos |
| Urutan mobile | Bacaan muncul sebelum panel pengaturan (reader y=209; tombol panel jauh di bawahnya) | Lolos |
| Request jaringan eksternal | 0 request di luar origin; tidak ada CDN/font eksternal | Lolos |
| Overlay error/hydration | Tidak ditemukan | Lolos |
| Navigasi keyboard lengkap dan skip link | Belum diuji menyeluruh; radio native dan atribut ARIA sudah diperiksa di kode | Sebagian |
| Kontras warna | Token diukur dengan rumus WCAG, lihat `docs/design/tokens.md`; audit axe belum dijalankan | Sebagian |

## Verifikasi reader interaktif — 27 November 2026

Lingkungan sama: static export pada Chromium, interaksi nyata dengan jeda render.
Materi uji: sampel Kompleksitas Waktu (9 kartu) dan teks tempel pengguna.

| Pemeriksaan | Hasil terukur | Status |
| --- | --- | --- |
| Pemilihan sampel | Reader menampilkan isi hasil pipeline; meter menampilkan before 64 · sedang | Lolos |
| Navigasi kartu | "Kartu 2 dari 9" menjadi "Kartu 3 dari 9"; Sebelumnya nonaktif di kartu pertama | Lolos |
| Fokus setelah pindah kartu | Fokus berpindah ke heading "Bagian 3" | Lolos |
| Isolasi mode fokus | Header, input panel, dan pengaturan tidak ada di DOM; fokus ke tombol kembali | Lolos |
| Keluar mode fokus | Panel kembali dan fokus kembali ke tombol "Mode fokus" | Lolos |
| Teks asli pada profil Low Vision | Tetap 18px, teks `rgb(15, 23, 42)` pada kartu putih, ruler tidak tampil | Lolos |
| Ruler dengan tombol | Tombol turun menggeser 46.98px (satu line-height); pointer-events `none` | Lolos |
| Tinggi ruler | 1 baris 50.98px; 3 baris 144.94px (= 3 × 46.98 + 4) | Lolos |
| Privasi teks tempel | Materi diterapkan ke reader; tidak tersimpan di localStorage; satu-satunya key adalah preferensi | Lolos |
| Request eksternal | 0 | Lolos |

## Matriks perangkat dan browser

| Perangkat | Sistem operasi | Browser | Status | Catatan |
| --- | --- | --- | --- | --- |
| Desktop (emulasi/browser automation) | Windows | Chromium | Sudah diuji | Verifikasi 25 November 2026 di atas |
| Desktop | Windows | Edge | Belum diuji | Target penting untuk TTS `id-ID` |
| Desktop | Belum diuji | Firefox | Belum diuji | Perlu cek fallback TTS |
| Mobile 390px (emulasi) | Windows/Chromium | Chromium | Sudah diuji | Panel collapsed dan urutan baca lolos |
| Mobile fisik | Android | Chrome | Belum diuji | Target pengujian berikutnya |
| Mobile fisik | iOS | Safari | Belum diuji | Jika perangkat tersedia |

## Checklist manual

- [ ] Belum diuji menyeluruh: navigasi keyboard dan skip link.
- [ ] Belum diuji: input materi dan pemilihan contoh.
- [x] Sudah diuji: preset profil, pengaturan manual, reset preset, persistensi lokal (25 November 2026).
- [ ] Belum diuji: tampilan reader dan reading ruler.
- [ ] Belum diuji: kontrol text-to-speech dan fallback.
- [ ] Belum diuji: ekspor dan tampilan cetak.
- [x] Sudah diuji: penyimpanan preferensi lokal, termasuk data rusak dan storage diblokir (unit test).

## Hasil axe per profil

| Profil | Halaman | Pelanggaran | Status | Bukti |
| --- | --- | --- | --- | --- |
| Standar | `/` | Belum diuji | Belum diuji | `docs/testing/` |
| Disleksia | `/` | Belum diuji | Belum diuji | `docs/testing/` |
| ADHD | `/` | Belum diuji | Belum diuji | `docs/testing/` |
| Low vision | `/` | Belum diuji | Belum diuji | `docs/testing/` |

## Bug, risiko, dan tindak lanjut

| ID | Temuan | Bukti/reproduksi | Rencana perbaikan | Status |
| --- | --- | --- | --- | --- |
| B-01 | Preferensi gelap diterapkan setelah effect, sehingga ada kedipan tema terang singkat saat reload | Terlihat dari urutan penerapan `data-profile` di `usePreferences` | Terapkan profil awal sebelum paint tanpa menyebabkan hydration mismatch | Backlog |
| B-02 | Belum ada test interaksi komponen untuk slider dan radiogroup | Hanya test unit storage/preset yang tersedia | Tambahkan test interaksi atau prosedur manual terdokumentasi | Backlog |
| B-03 | Audit axe per profil belum dijalankan | Belum ada laporan di `docs/testing/` | Jalankan pada 4 profil dan state utama | Backlog |

## Uji pengguna

Belum ada uji pengguna. Jika dilakukan, catat jumlah dan karakteristik partisipan
secara jujur, tugas yang diberikan, temuan, serta perbaikan yang benar-benar
dilakukan. Dilarang menulis klaim penggunaan resmi oleh institusi tanpa bukti.
