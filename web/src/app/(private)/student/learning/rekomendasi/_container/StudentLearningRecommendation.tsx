'use client';

import { BookOpen, PenTool, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { RecommendationBanner } from '@/components/organisms/student/RecommendationBanner';
import { useApi } from '@/hooks/useApi';

export default function StudentLearningRecommendation() {
  const router = useRouter();
  const { recommendation } = useApi();
  const { data, isLoading } = recommendation.query.list({ limit: 10 });

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Memuat rekomendasi...</div>;
  }

  const recs = data?.recommendations || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Sparkles className="size-6 text-teal-600" />
        <h1 className="text-2xl font-black text-slate-900">Rekomendasi Belajar</h1>
      </div>
      <div>
        <p className="text-sm text-slate-600 mb-6">
          Sistem analitik cerdas kami telah menyiapkan rekomendasi berdasarkan hasil tryout dan
          latihan terakhir Anda. Kerjakan materi dan latihan berikut untuk memaksimalkan potensi.
        </p>
      </div>

      {recs.length === 0 ? (
        <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-500">
          Belum ada rekomendasi. Selesaikan lebih banyak Tryout atau Latihan untuk mendapatkan
          insight khusus!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recs.map((r) => {
            const isMaterial = !!r.material_id;
            return (
              <div
                key={r.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl ${isMaterial ? 'bg-blue-50 text-blue-600' : 'bg-teal-50 text-teal-600'}`}
                  >
                    {isMaterial ? <BookOpen className="size-6" /> : <PenTool className="size-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 text-lg">
                        {r.material_title || r.competency_name}
                      </h3>
                      {(r.priority === 'high' || r.priority === 'medium') && (
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            r.priority === 'high'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {r.priority === 'high' ? 'Prioritas' : 'Disarankan'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                      {r.recommendation_text}
                    </p>
                    <button
                      onClick={() => {
                        if (isMaterial) {
                          router.push(`/student/learning/material/${r.material_id}`);
                        } else {
                          // latihan untuk kompetensi ini (filter katalog via query param)
                          router.push(
                            `/student/practice?competency=${encodeURIComponent(r.competency_code || r.competency_id)}`
                          );
                        }
                      }}
                      className={`text-sm font-bold px-4 py-2 rounded-full cursor-pointer transition ${isMaterial ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-teal-600 hover:bg-teal-700 text-white'}`}
                    >
                      {isMaterial ? 'Mulai Belajar' : 'Mulai Latihan'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
