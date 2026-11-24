# Font self-host

BinarAksara akan menyediakan **Lexend** dan **Atkinson Hyperlegible** secara lokal agar tidak bergantung pada layanan font pihak ketiga saat pengguna membuka aplikasi.

## Berkas yang perlu ditambahkan

1. Unduh keluarga font dari repositori resminya:
   - Lexend: https://github.com/googlefonts/lexend
   - Atkinson Hyperlegible: https://github.com/googlefonts/atkinson-hyperlegible
2. Salin berkas font yang diperlukan ke direktori ini, sebaiknya dalam format WOFF2 untuk web.
3. Sertakan salinan lisensi **SIL Open Font License (OFL)** masing-masing font di direktori ini.
4. Integrasikan font melalui `next/font/local` hanya di `src/app/layout.tsx` saat tahap implementasi.

Jangan mengubah atau mendistribusikan ulang font tanpa mengikuti ketentuan OFL, termasuk mempertahankan pemberitahuan hak cipta dan lisensinya.
