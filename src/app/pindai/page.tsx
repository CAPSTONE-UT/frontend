import Link from 'next/link';

export default function PindaiPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10 text-slate-900">
      <section className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
        <p className="text-sm font-medium text-slate-500">InvenSMK</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Pemindaian belum tersedia</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Kontrak API saat ini belum menyediakan endpoint barcode atau data inventaris. Halaman ini belum dapat mencari barang atau mencatat peminjaman.</p>
        <Link href="/dashboard" className="mt-6 inline-flex rounded-lg bg-[#18345b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#244978]">Kembali ke profil</Link>
      </section>
    </main>
  );
}
