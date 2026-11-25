export default function ReaderView() {
  return (
    <article
      aria-labelledby="reader-title"
      className="ba-reader w-full rounded-2xl border border-[var(--ba-border)] p-6 md:p-8"
    >
      <h2 id="reader-title" className="mb-5 text-[1.35em] font-bold">
        Fotosintesis
      </h2>
      <p className="mb-5">
        Fotosintesis adalah proses ketika tumbuhan menggunakan energi cahaya,
        air, dan karbon dioksida untuk membentuk glukosa serta melepaskan
        oksigen. Proses ini terutama berlangsung di kloroplas pada sel daun,
        dengan bantuan pigmen hijau yang disebut klorofil.
      </p>
      <p className="mb-5">
        Pada reaksi terang di membran tilakoid, energi cahaya digunakan untuk
        menghasilkan ATP dan NADPH. Air diuraikan dalam rangkaian reaksi ini,
        sehingga oksigen terbentuk sebagai hasil samping. ATP dan NADPH kemudian
        menyediakan energi serta kemampuan mereduksi untuk tahap berikutnya.
      </p>
      <p>
        Pada siklus Calvin di stroma kloroplas, karbon dioksida diikat dan diubah
        menjadi senyawa gula dengan bantuan ATP dan NADPH. Gula yang terbentuk
        dapat digunakan sebagai sumber energi, disimpan dalam bentuk pati, atau
        menjadi bahan untuk membangun jaringan tumbuhan.
      </p>
    </article>
  );
}
