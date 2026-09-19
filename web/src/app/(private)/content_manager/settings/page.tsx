import { Settings } from 'lucide-react';

export default function ContentManagerSettingsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-2xs p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Pengaturan Content Manager</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Kelola preferensi akun kurator, integrasi bank soal, dan audit log sistem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
