import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tentang BinarAksara",
  description: "Cara kerja, privasi, profil baca, dan batasan BinarAksara.",
};

const sections = [
  {
    title: "Masalah dan tujuan",
    content: <><p>Satu materi dapat disajikan dalam beberapa cara membaca. BinarAksara membantu pelajar dan mahasiswa dengan disleksia, ADHD, atau low vision menyesuaikan tampilan materi, serta membantu guru, dosen, dan pendamping menyiapkan alternatif dari teks yang sama.</p><p>Pilihan tampilan bersifat individual; aplikasi tidak menentukan kebutuhan pengguna.</p></>,
  },
  {
    title: "Cara kerja",
    content: <><p>Pemrosesan berjalan di browser dengan aturan deterministik; tidak ada pretrained AI:</p><ol className="mt-3 list-decimal space-y-2 pl-6"><li>Pemisahan kalimat menjaga singkatan dan format angka umum.</li><li>Kalimat dikelompokkan menjadi kartu berisi 1–3 kalimat.</li><li>Teks dipecah menjadi token dan kata kunci diurutkan dengan frekuensi term (TF).</li><li>Skor heuristik membandingkan kompleksitas teks sebelum dan sesudah.</li><li>Kuis dibuat dari kata kunci dengan seed agar pilihan deterministik.</li></ol></>,
  },
  {
    title: "Empat profil baca",
    content: <><dl className="mt-3 grid gap-3 sm:grid-cols-2"><div><dt className="font-bold">Standar</dt><dd>Tipografi seimbang untuk titik awal membaca umum.</dd></div><div><dt className="font-bold">Disleksia</dt><dd>Spasi huruf dan kata lebih lega dengan latar krem.</dd></div><div><dt className="font-bold">ADHD</dt><dd>Kolom lebih ringkas dan spasi baris yang dapat disesuaikan.</dd></div><div><dt className="font-bold">Low Vision</dt><dd>Teks lebih besar dan kontras tinggi pada layar.</dd></div></dl><p className="mt-4">Profil adalah preset tampilan, bukan rekomendasi medis dan tidak dijamin sesuai untuk semua orang. Semua pengaturan tetap dapat diubah.</p></>,
  },
  {
    title: "Text-to-speech hybrid",
    content: <><p>TTS memakai voice lokal maupun online yang tersedia melalui browser dan sistem operasi, sehingga pilihan serta kualitasnya beragam. BinarAksara tidak memiliki backend atau API TTS sendiri. Highlight mengikuti event batas kata bila tersedia; jika tidak, posisinya bergerak dengan estimasi durasi dan mungkin tidak sinkron. Aplikasi menampilkan peringatan bila voice Bahasa Indonesia tidak tersedia dan dapat memakai voice bawaan sistem.</p><p className="mt-3">Saat pengguna mengaktifkan TTS dengan voice online, browser atau sistem operasi dapat mengirim teks ke penyedia voice sesuai implementasinya. Aplikasi tidak mengontrol proses tersebut, dan tidak semua voice menggunakan jaringan. Untuk materi sensitif, pilih voice lokal (localService=true bila informasi itu tersedia) atau tidak menggunakan TTS.</p></>,
  },
  {
    title: "Cognitive Load Meter",
    content: <p>Meter adalah indikator kompleksitas teks berdasarkan heuristik seperti panjang kalimat, kata panjang, dan klausa. Ini bukan diagnosis, pengukuran kemampuan pengguna, atau penilaian kualitas materi.</p>,
  },
  {
    title: "Kuis",
    content: <p>Jawaban dan pengecoh berasal dari kata kunci yang difilter, bukan pemahaman semantik. Kuis dapat membantu latihan mengingat istilah, tetapi tidak membuktikan pemahaman. Soal dari materi arbitrer perlu ditinjau pengajar atau pengguna.</p>,
  },
  {
    title: "Privasi",
    content: <p>BinarAksara tidak memiliki backend sendiri. Materi tempel, jawaban, dan skor hanya berada dalam memori selama sesi; materi tempel tidak disimpan ke localStorage. Hanya preferensi tampilan dan TTS yang disimpan di localStorage perangkat. Penggunaan voice online oleh TTS dapat melibatkan pengiriman teks oleh browser atau sistem operasi seperti dijelaskan di atas. Cetak atau simpan PDF dilakukan melalui dialog browser tanpa upload oleh aplikasi.</p>,
  },
  {
    title: "Batasan",
    content: <ul className="list-disc space-y-2 pl-6"><li>Pemisah kalimat dan heuristik tidak sempurna, terutama untuk format atau bahasa yang tidak umum.</li><li>Dukungan TTS, voice, dan event batas kata berbeda antar-browser dan perangkat.</li><li>Belum ada akun, backend, atau sinkronisasi antarperangkat.</li><li>Evaluasi pengguna dan aksesibilitas hanya sejauh yang didokumentasikan di TESTING.md; belum merupakan validasi universal.</li></ul>,
  },
  {
    title: "Ilustrasi penerapan",
    content: <p>Seorang dosen dapat menempelkan materi kuliah, lalu mahasiswa memilih tampilan dan mencetak seluruh materi adaptif. Konteks Universitas Multimedia Nusantara pada contoh proyek hanyalah ilustrasi penerapan, bukan afiliasi, dukungan, penggunaan resmi, atau hasil uji resmi institusi.</p>,
  },
  {
    title: "Teknologi",
    content: <p>BinarAksara menggunakan Next.js App Router dengan static export, React, TypeScript, Tailwind CSS v4, dan Vitest. Lexend dan Atkinson Hyperlegible disimpan lokal dengan lisensi SIL OFL; font sistem tetap tersedia sebagai pilihan.</p>,
  },
];

export default function Tentang() {
  return (
    <main id="konten-utama" className="min-h-full bg-[var(--ba-bg)] text-[var(--ba-fg)]">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-8 md:py-12">
        <Link href="/" className="inline-flex min-h-11 items-center font-semibold text-[var(--ba-accent)] underline underline-offset-4">Kembali ke sandbox</Link>
        <header className="mt-5 border-b border-[var(--ba-border)] pb-7">
          <p className="font-bold text-[var(--ba-accent)]">Satu materi, banyak cara membaca</p>
          <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">Tentang BinarAksara</h1>
          <p className="mt-3 max-w-2xl text-lg text-[var(--ba-muted)]">Penjelasan cara kerja, pilihan aksesibilitas, privasi, dan batas penggunaan.</p>
        </header>
        <div className="mt-8 grid gap-6">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-[var(--ba-border)] bg-[var(--ba-surface)] p-6 md:p-7" aria-labelledby={`section-${section.title.toLowerCase().replaceAll(" ", "-")}`}>
              <h2 id={`section-${section.title.toLowerCase().replaceAll(" ", "-")}`} className="text-xl font-bold">{section.title}</h2>
              <div className="mt-3 leading-relaxed">{section.content}</div>
            </section>
          ))}
        </div>
        <Link href="/" className="mt-8 inline-flex min-h-11 items-center rounded-lg border-2 border-[var(--ba-border-ui)] px-4 py-2 font-bold">Kembali ke sandbox</Link>
      </div>
    </main>
  );
}
