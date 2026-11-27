import type { SampleMaterial } from "@/types";

export const SAMPLES: SampleMaterial[] = [
  {
    id: "fotosintesis-sma",
    title: "Fotosintesis",
    subject: "Biologi · SMA",
    content:
      "Fotosintesis adalah proses tumbuhan mengubah energi cahaya menjadi energi kimia, dan berlangsung di kloroplas. Klorofil menyerap cahaya untuk menggerakkan rangkaian reaksi tersebut. Air dan karbon dioksida digunakan sebagai bahan untuk menghasilkan glukosa dan oksigen. Reaksi terang berlangsung di membran tilakoid, menghasilkan ATP dan NADPH serta melepaskan oksigen dari pemecahan air. Energi yang tersimpan dalam ATP dan NADPH kemudian digunakan pada siklus Calvin di stroma. Siklus Calvin mengikat karbon dioksida dan membentuk senyawa gula melalui serangkaian reaksi enzimatis. Glukosa yang dihasilkan dapat digunakan sebagai sumber energi atau disimpan dalam bentuk pati. Jadi, glukosa bukan berasal dari air saja, karena karbonnya berasal dari karbon dioksida.",
  },
  {
    id: "aksesibilitas-wcag-kuliah",
    title: "Prinsip Aksesibilitas Antarmuka",
    subject: "Interaksi Manusia dan Komputer · Perguruan Tinggi",
    content:
      "Prinsip aksesibilitas antarmuka dalam WCAG dikelompokkan menjadi empat prinsip. Perceivable berarti informasi dapat ditangkap pengguna, misalnya gambar bermakna memiliki teks alternatif untuk pembaca layar. Operable berarti fungsi antarmuka dapat dioperasikan, termasuk seluruh navigasi utama melalui keyboard tanpa jebakan fokus. Understandable berarti isi dan interaksi mudah dipahami, seperti label formulir yang jelas dan pesan kesalahan yang menjelaskan perbaikan. Robust berarti konten cukup andal untuk beragam teknologi, termasuk kompatibilitas dengan teknologi bantu melalui struktur dan kode yang tepat. Keempat prinsip ini saling melengkapi. Evaluasi aksesibilitas perlu memeriksa penerapan nyata pada konten dan interaksi, bukan hanya melihat daftar fitur yang tersedia.",
  },
  {
    id: "kompleksitas-waktu-kuliah",
    title: "Kompleksitas Waktu",
    subject: "Algoritma dan Pemrograman · Perguruan Tinggi",
    content:
      "Kompleksitas waktu menjelaskan bagaimana kebutuhan langkah algoritma berubah terhadap ukuran input. Notasi Big-O menyatakan batas atas pertumbuhan kebutuhan langkah terhadap ukuran input, bukan waktu eksekusi pasti dalam detik; karena itu, notasi ini membantu membandingkan algoritma tanpa bergantung pada kecepatan komputer tertentu, tetapi konstanta, struktur data, dan kondisi perangkat tetap memengaruhi waktu nyata. O(1) berarti jumlah langkah tetap, misalnya membaca elemen pertama array. O(log n) muncul ketika ruang pencarian menyusut secara berulang, seperti pencarian biner pada data terurut, sedangkan O(n) berarti langkah tumbuh sebanding dengan input, misalnya memeriksa setiap elemen satu kali; perbedaan ini membantu membandingkan algoritma ketika input membesar. O(n^2) sering muncul ketika setiap elemen dibandingkan dengan elemen lain melalui dua perulangan bersarang.",
  },
];
