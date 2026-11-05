'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/auth';
import { getApiErrorCode, getApiErrorMessage } from '@/lib/api/errors';
import type { UserProfile } from '@/types/api';

type ApiStatus = 'loading' | 'online' | 'offline';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [apiStatus, setApiStatus] = useState<ApiStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      router.replace('/login');
      return;
    }

    let active = true;

    authService.getProfile()
      .then((response) => {
        if (!active) return;
        if (response.data.success && response.data.data) setProfile(response.data.data);
        else setErrorMessage('Profil tidak ditemukan pada respons API.');
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (getApiErrorCode(error) === 'AUTHENTICATION_ERROR') {
          localStorage.removeItem('access_token');
          router.replace('/login');
          return;
        }
        setErrorMessage(getApiErrorMessage(error, 'Profil tidak dapat dimuat. Coba lagi nanti.'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    authService.checkHealth()
      .then((response) => {
        if (active) setApiStatus(response.data.data?.status === 'ok' ? 'online' : 'offline');
      })
      .catch(() => {
        if (active) setApiStatus('offline');
      });

    return () => { active = false; };
  }, [router]);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await authService.logout();
    } catch {
      // Token tetap dihapus di browser jika API logout tidak dapat dijangkau.
    } finally {
      localStorage.removeItem('access_token');
      router.replace('/login');
    }
  };

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-600">Memuat profil...</main>;

  const profileFields = [
    { label: 'Nama lengkap', value: profile?.full_name },
    { label: 'Email', value: profile?.email },
    { label: 'ID staf', value: profile?.staff_id },
    { label: 'Unit sekolah', value: profile?.school_unit },
    { label: 'Peran', value: profile?.role },
    { label: 'Status akun', value: profile?.account_status },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="border-b border-slate-200 px-6 py-5">
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-[#18345b]">InvenSMK</Link>
        </div>
        <nav aria-label="Navigasi utama" className="flex-1 p-3">
          <Link href="/dashboard" aria-current="page" className="block rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-900">Profil akun</Link>
        </nav>
        <div className="border-t border-slate-200 p-4">
          <p className="truncate text-sm font-medium">{profile?.full_name || 'Akun staf'}</p>
          <p className="mt-0.5 text-xs capitalize text-slate-500">{profile?.role?.replaceAll('_', ' ') || 'Profil'}</p>
          <button onClick={handleLogout} disabled={loggingOut} className="mt-4 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:cursor-wait disabled:opacity-60">{loggingOut ? 'Keluar...' : 'Keluar'}</button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 md:px-8">
          <Link href="/dashboard" className="text-base font-semibold tracking-tight text-[#18345b] md:hidden">InvenSMK</Link>
          <p className="hidden text-sm text-slate-500 md:block">Akun <span className="px-2 text-slate-300">/</span><span className="text-slate-900">Profil</span></p>
          <button onClick={handleLogout} disabled={loggingOut} className="text-sm font-medium text-slate-600 hover:text-slate-900 disabled:cursor-wait disabled:opacity-60 md:hidden">{loggingOut ? 'Keluar...' : 'Keluar'}</button>
        </header>

        <div className="mx-auto max-w-5xl p-5 md:p-8">
          <div className="mb-7">
            <p className="text-sm text-slate-500">Akun staf</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Profil</h1>
            <p className="mt-2 text-sm text-slate-600">Informasi akun yang diterima dari layanan sekolah.</p>
          </div>

          {errorMessage && <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{errorMessage}</p>}

          {profile && (
            <section aria-label="Data profil" className="grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
              {profileFields.map((field) => (
                <div key={field.label} className="bg-white p-5">
                  <h2 className="text-xs font-medium uppercase tracking-wide text-slate-500">{field.label}</h2>
                  <p className="mt-2 break-words text-sm font-medium capitalize text-slate-900">{field.value || '—'}</p>
                </div>
              ))}
            </section>
          )}

          <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">Koneksi API</h2>
                <p className="mt-1 text-sm text-slate-600">Pemeriksaan menggunakan endpoint /health.</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${apiStatus === 'online' ? 'bg-green-50 text-green-800' : apiStatus === 'offline' ? 'bg-red-50 text-red-800' : 'bg-slate-100 text-slate-600'}`}>
                {apiStatus === 'online' ? 'Terhubung' : apiStatus === 'offline' ? 'Tidak terhubung' : 'Memeriksa...'}
              </span>
            </div>
          </section>

          <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="font-semibold">Fitur inventaris</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Kontrak API saat ini menyediakan autentikasi dan profil akun. Endpoint data barang, peminjaman, pengembalian, dan pemindaian barcode belum tersedia.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
