import {
  BrainCircuit,
  CheckCircle2,
  Clock,
  GraduationCap,
  Info,
  Layers,
  Sparkles,
} from 'lucide-react';
import React from 'react';
import { JenjangBadge } from '@/components/molecules/table';
import type { TryoutPackageResultsResponse } from '@/types/service';

export interface TryoutMetadataAndCognitiveCardProps {
  packageData: TryoutPackageResultsResponse | null;
}

export const TryoutMetadataAndCognitiveCard: React.FC<TryoutMetadataAndCognitiveCardProps> = ({
  packageData,
}) => {
  const isPublished = (packageData?.status || 'draft').toLowerCase() === 'published';
  const duration = packageData?.duration_minutes ?? 75;
  const totalPool = packageData?.total_pool_questions ?? 0;
  const sessionQuestions = totalPool >= 5 ? Math.round(totalPool / 5) : totalPool;

  const cb = packageData?.cognitive_breakdown ?? {
    c1_count: 0,
    c2_count: 0,
    c3_count: 0,
    c4_count: 0,
    c5_count: 0,
  };

  const poolSum =
    cb.c1_count + cb.c2_count + cb.c3_count + cb.c4_count + cb.c5_count || totalPool || 1;
  const c1Percent = Math.round((cb.c1_count / poolSum) * 100);
  const c2Percent = Math.round((cb.c2_count / poolSum) * 100);
  const c3Percent = Math.round((cb.c3_count / poolSum) * 100);
  const c4Percent = Math.round((cb.c4_count / poolSum) * 100);
  const c5Percent = 100 - (c1Percent + c2Percent + c3Percent + c4Percent);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left Card: Informasi Paket TryOut (5 cols) */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-800">
              <Info className="w-5 h-5 text-cyan-700" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Informasi Paket TryOut
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                Konfigurasi umum & kuota pengerjaan
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Jenjang Pendidikan
              </p>
              <div className="mt-1">
                <JenjangBadge value={packageData?.jenjang || 'SMA'} />
              </div>
            </div>

            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Durasi Ujian
              </p>
              <p className="mt-1 text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-700" />
                <span>{duration} Menit</span>
              </p>
            </div>

            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Total Soal Sesi
              </p>
              <p className="mt-1 text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                <span>{sessionQuestions} Butir Soal</span>
              </p>
            </div>

            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Total Bank Soal
              </p>
              <p className="mt-1 text-xs sm:text-sm font-bold text-cyan-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-700" />
                <span>{totalPool} Butir (Pool 5x)</span>
              </p>
            </div>

            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Status Akses
              </p>
              <span
                className={`inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  isPublished
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>{isPublished ? 'Publikasi Aktif' : 'Draft Tertutup'}</span>
              </span>
            </div>

            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Terakhir Diperbarui
              </p>
              <p className="mt-1 text-[11px] font-semibold text-slate-600">
                {packageData?.formatted_updated_at || '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Card: Distribusi Bank Soal (Tingkat Kognitif) (7 cols) */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                <BrainCircuit className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Distribusi Bank Soal (Tingkat Kognitif)
                </h2>
                <p className="text-[11px] text-slate-400 font-medium">
                  Alokasi kuota adaptif taksonomi C1–C5
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              {totalPool} Butir Soal Adaptif
            </span>
          </div>

          {/* Progress Stacked Bar */}
          <div className="pt-4 space-y-2">
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${Math.max(c1Percent, 0)}%` }}
                className="bg-emerald-500 h-full transition-all duration-500"
                title={`C1 Mengingat: ${cb.c1_count} Soal`}
              />
              <div
                style={{ width: `${Math.max(c2Percent, 0)}%` }}
                className="bg-blue-500 h-full transition-all duration-500"
                title={`C2 Memahami: ${cb.c2_count} Soal`}
              />
              <div
                style={{ width: `${Math.max(c3Percent, 0)}%` }}
                className="bg-amber-500 h-full transition-all duration-500"
                title={`C3 Mengaplikasikan: ${cb.c3_count} Soal`}
              />
              <div
                style={{ width: `${Math.max(c4Percent, 0)}%` }}
                className="bg-violet-500 h-full transition-all duration-500"
                title={`C4 Menganalisis: ${cb.c4_count} Soal`}
              />
              <div
                style={{ width: `${Math.max(c5Percent, 0)}%` }}
                className="bg-rose-500 h-full transition-all duration-500"
                title={`C5 Mengevaluasi: ${cb.c5_count} Soal`}
              />
            </div>
          </div>

          {/* 5 Cognitive Stat Boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-4">
            {/* C1 */}
            <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-emerald-700 uppercase">C1</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="mt-1">
                <p className="text-base font-black text-emerald-900">{cb.c1_count}</p>
                <p className="text-[10px] font-semibold text-emerald-700 leading-tight">
                  Mengingat
                </p>
              </div>
            </div>

            {/* C2 */}
            <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-200/80 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-blue-700 uppercase">C2</span>
                <span className="w-2 h-2 rounded-full bg-blue-500" />
              </div>
              <div className="mt-1">
                <p className="text-base font-black text-blue-900">{cb.c2_count}</p>
                <p className="text-[10px] font-semibold text-blue-700 leading-tight">Memahami</p>
              </div>
            </div>

            {/* C3 */}
            <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-amber-700 uppercase">C3</span>
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              </div>
              <div className="mt-1">
                <p className="text-base font-black text-amber-900">{cb.c3_count}</p>
                <p className="text-[10px] font-semibold text-amber-700 leading-tight">
                  Mengaplikasikan
                </p>
              </div>
            </div>

            {/* C4 */}
            <div className="p-2.5 rounded-xl bg-violet-50/60 border border-violet-200/80 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-violet-700 uppercase">C4</span>
                <span className="w-2 h-2 rounded-full bg-violet-500" />
              </div>
              <div className="mt-1">
                <p className="text-base font-black text-violet-900">{cb.c4_count}</p>
                <p className="text-[10px] font-semibold text-violet-700 leading-tight">
                  Menganalisis
                </p>
              </div>
            </div>

            {/* C5 */}
            <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-200/80 flex flex-col justify-between col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-rose-700 uppercase">C5</span>
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              </div>
              <div className="mt-1">
                <p className="text-base font-black text-rose-900">{cb.c5_count}</p>
                <p className="text-[10px] font-semibold text-rose-700 leading-tight">
                  Mengevaluasi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryoutMetadataAndCognitiveCard;
