# Token Desain Final — BinarAksara

Acuan implementasi. Diturunkan dari `DESIGN.md` hasil Stitch, tetapi angka kontras di
dokumen ini **diukur ulang dengan rumus WCAG**, bukan disalin dari klaim desain.
Klaim seperti "21:1", "9.8:1", atau "WCAG AAA" pada mockup Stitch TIDAK boleh
disalin ke UI, README, atau halaman Algoritma & Batasan.

## 1. Prinsip
- Satu materi, empat profil. Perubahan profil mengubah warna DAN tipografi.
- Tidak ada animasi pulsa/fade pada sorotan baca; perubahan bersifat snap.
- `prefers-reduced-motion: reduce` mematikan transisi, animasi, dan smooth scroll.
- Fokus selalu terlihat dan berbeda secara visual dari keadaan "dipilih".
- Status (benar/salah/aktif) tidak pernah hanya lewat warna: sertakan ikon + teks.
- Target interaktif: minimal 48px di mobile, 44px di desktop; jarak antar tombol >= 12px.
- Label input selalu terlihat di atas kontrol, tidak mengandalkan placeholder.
- Teks rata kiri, tidak justify. Ukuran teks baca minimal 18px; label minimal 14px.

## 2. Warna per profil

| Token | Standar | Disleksia | ADHD | Low Vision |
|---|---|---|---|---|
| `--ba-bg` (kanvas baca) | `#F8FAFC` | `#FBF8EE` | `#F4F6F8` | `#090D16` |
| `--ba-surface` (kartu) | `#FFFFFF` | `#F7F3E8` | `#FFFFFF` | `#111827` |
| `--ba-fg` (teks utama) | `#0F172A` | `#1E293B` | `#0F172A` | `#FFFFFF` |
| `--ba-muted` (teks sekunder) | `#334155` | `#334155` | `#334155` | `#D1D5DB` |
| `--ba-accent` (interaktif) | `#1E40AF` | `#1E40AF` | `#0F766E` | `#FACC15` |
| `--ba-accent-2` | `#0F766E` | `#0F766E` | `#1E40AF` | `#38BDF8` |
| `--ba-focus` (focus ring) | `#1D4ED8` | `#1D4ED8` | `#1D4ED8` | `#F59E0B` |
| `--ba-border` dekoratif | `#E2E8F0` | `#E2E8F0` | `#E2E8F0` | `#334155` |
| `--ba-border-ui` (kontrol) | `#64748B` | `#64748B` | `#64748B` | `#64748B` |
| `--ba-on-accent` (teks di atas aksen) | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` | `#000000` |

Sorotan kata aktif TTS (pill):
- Profil terang: latar `#FEF08A`, teks `#78350F` → 7.80:1 (AAA).
- Low Vision: latar `#FACC15`, teks `#000000` → 13.71:1 (AAA).
- Radius pill 4px, padding 2px 4px, tanpa animasi.

Umpan balik kuis:
- Benar: latar lembut hijau + ikon centang + teks "Jawaban benar".
- Salah: latar lembut merah + ikon silang + teks "Jawaban kurang tepat" + tampilkan
  jawaban yang benar. Warna mengikuti profil, tetapi ikon dan teks wajib ada.
- Fokus keyboard: hanya focus ring, tanpa fill yang menyerupai pilihan terpilih.

## 3. Rasio kontras terukur (rumus WCAG)

| Pasangan | Rasio | AA | AAA |
|---|---|---|---|
| Disleksia teks utama | 13.77:1 | lolos | lolos |
| Disleksia teks sekunder | 9.75:1 | lolos | lolos |
| Standar teks utama | 17.06:1 | lolos | lolos |
| Standar teks sekunder | 9.90:1 | lolos | lolos |
| Standar aksen biru | 8.34:1 | lolos | lolos |
| Low Vision teks utama | 19.43:1 | lolos | lolos |
| Low Vision aksen kuning | 12.69:1 | lolos | lolos |
| Low Vision aksen cyan | 9.07:1 | lolos | lolos |
| Low Vision teks sekunder (setelah koreksi) | 12.04:1 | lolos | lolos |
| ADHD sisa kata bionic (setelah koreksi) | 9.56:1 | lolos | lolos |
| ADHD aksen teal | 5.05:1 | lolos | TIDAK — jangan klaim AAA |
| Pill TTS profil terang | 7.80:1 | lolos | lolos |
| Border UI `#64748B` di kanvas gelap | 4.08:1 | non-teks >= 3:1 lolos | — |

Catatan: klaim aksesibilitas aplikasi mengikuti hasil pengujian di `TESTING.md`,
bukan tabel ini saja. Tabel ini hanya verifikasi token warna.

## 4. Tipografi
- Font bacaan: Lexend (self-host, OFL). Font UI/label: Atkinson Hyperlegible atau
  Atkinson Hyperlegible Next (pastikan lisensi OFL dari sumber resmi).
- Selama berkas font belum tersedia, gunakan stack fallback sistem; jangan memuat
  font dari Google Fonts CDN.
- Basis teks baca: 18px. `fontScale` adalah pengali terhadap basis ini.

| Profil | fontScale | line-height | letter-spacing | word-spacing | measure |
|---|---|---|---|---|---|
| Standar | 1.00 | 1.6 | 0em | 0em | 65ch |
| Disleksia | 1.10 | 1.8 | 0.03em | 0.16em | 60ch |
| ADHD | 1.10 | 1.75 | 0.01em | 0.02em | 55ch |
| Low Vision | 1.45 | 1.8 | 0.01em | 0.04em | 50ch |

Rentang kontrol manual: fontScale 0.9–2.0 (step 0.05), line-height 1.4–2.2
(step 0.05), letter-spacing 0–0.2em (step 0.01), word-spacing 0–0.3em (step 0.02).

## 5. Radius, spacing, elevasi
- Radius: kontrol 8px; kartu 16px; pill sorotan kata 4px.
- Grid dasar 8pt. Padding kartu: 24px mobile, 32px desktop.
- Kolom baca maksimal 720px atau sesuai `measure` profil, mana yang lebih kecil.
- Bayangan hanya untuk lapisan terlepas (popover/dialog). Tidak ada backdrop blur.

## 6. Aturan komponen yang sudah diputuskan
- **Mobile**: urutan awal = header ringkas → disclosure "Sesuaikan tampilan"
  (collapsed) → modul baca → navigasi → kuis → cetak. Dilarang menampilkan panel
  pengaturan terbuka sebelum bacaan.
- **Reading ruler**: pita selebar kolom teks, tinggi 1/2/3 baris sesuai pengaturan,
  dengan garis jangkar 2px di atas dan bawah. Boleh meredupkan baris lain, tetapi
  kontras teks yang diredupkan TIDAK boleh turun di bawah 4.5:1. Indikator jumlah
  baris harus selalu sama dengan tinggi pita yang tampil.
- **Ruler vs pill TTS**: berbeda geometri (pita penuh vs pill satu kata) dan beda
  lapisan. Keduanya tidak boleh tampak sebagai blok kuning yang sama.
- **Kuis**: kalimat rumpang dengan empat opsi; state wajib: belum dijawab, salah
  dengan koreksi, benar, dan fokus keyboard. Label status tidak boleh menimpa teks
  jawaban.
- **Konten**: akurasi sains dijaga. Contoh stem yang benar: "Dengan bantuan cahaya
  matahari dan zat hijau daun bernama ____, air dan karbon dioksida diubah menjadi
  glukosa dan oksigen." (Jangan menghilangkan karbon dioksida.)
- **Cetak**: label "Cetak modul adaptif" (browser print/save PDF), bukan janji
  unduh berkas. Warna latar gelap dipetakan ke versi terang saat mencetak;
  tipografi adaptif dipertahankan.

## 7. Referensi visual
Mockup Stitch disimpan sebagai referensi, bukan sumber kode. `code.html` hasil
Stitch memakai Tailwind CDN, font eksternal, dan gambar hotlink: TIDAK boleh
dimasukkan ke aplikasi.
