import { Activity, Calendar } from 'lucide-react';
import type React from 'react';
import { cn } from '@/utils/classname';

export interface AdminStudentAuditEvaluationCardProps {
  evaluationTitle?: string;
  evaluationDate?: string;
  resultStatus?: string; // 'Hasil: Baik' | 'Hasil: Cukup' | 'Perlu Perbaikan'
  testDomain?: string;
  testMode?: string;
  className?: string;
}

export const AdminStudentAuditEvaluationCard: React.FC<AdminStudentAuditEvaluationCardProps> = ({
  evaluationTitle = 'Pemahaman Inferensial & Hubungan Gagasan',
  evaluationDate = '18 September 2026',
  resultStatus = 'Hasil: Baik',
  testDomain = 'Bahasa Indonesia: Literasi Wacana',
  testMode = 'Mandiri Berwaktu (TKA Standar)',
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full bg-white rounded-2xl border border-slate-100 shadow-2xs p-6 space-y-4',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Audit Evaluasi Terakhir</h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Catatan diagnostik hasil pengerjaan instruksional
          </p>
        </div>

        {/* Result Badge */}
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-cyan-100/90 text-teal-800 shrink-0">
          {resultStatus}
        </span>
      </div>

      {/* Detail Container Card */}
      <div className="bg-[#f4fafd] rounded-2xl p-5 border border-sky-50/90 space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[11px] font-bold text-teal-700 flex-wrap">
            <span className="tracking-wider uppercase">Latihan Terakhir</span>
            <span>•</span>
            <div className="flex items-center gap-1 text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{evaluationDate}</span>
            </div>
          </div>
          <h4 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
            {evaluationTitle}
          </h4>
        </div>

        {/* 2 sub-boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="bg-white rounded-xl p-3 border border-sky-100/80 space-y-0.5 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Domain Pengujian
            </span>
            <p className="text-xs font-bold text-slate-800 leading-tight">{testDomain}</p>
          </div>

          <div className="bg-white rounded-xl p-3 border border-sky-100/80 space-y-0.5 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Mode Pengerjaan
            </span>
            <p className="text-xs font-bold text-slate-800 leading-tight">{testMode}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentAuditEvaluationCard;
