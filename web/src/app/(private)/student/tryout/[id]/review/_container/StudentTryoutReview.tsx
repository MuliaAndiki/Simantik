'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { useApi } from '@/hooks/useApi';

export default function StudentTryoutReview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get('attemptId');
  const { evaluation } = useApi();

  const { data: attemptReview, isLoading } = evaluation.query.attemptReview(attemptId || '', {
    enabled: Boolean(attemptId),
  });

  if (isLoading) return <div className="p-8 text-center text-slate-500">Memuat pembahasan...</div>;
  if (!attemptReview)
    return <div className="p-8 text-center text-red-500">Simulasi tidak ditemukan.</div>;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 py-8 px-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Pembahasan: {attemptReview.tryout_title}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
          <div className="bg-slate-100 px-3 py-1 rounded-full">
            Nilai: {Math.round(attemptReview.score)}
          </div>
          <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-100">
            Benar: {attemptReview.correct_answers}
          </div>
          <div className="bg-red-50 text-red-700 px-3 py-1 rounded-full border border-red-100">
            Salah: {attemptReview.incorrect_answers}
          </div>
          <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-100">
            Kosong: {attemptReview.unanswered}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {attemptReview.questions.map((q, i) => (
          <div
            key={q.question_id}
            className={`bg-white rounded-2xl p-6 shadow-sm border-2 ${q.is_correct ? 'border-teal-200' : 'border-red-200'}`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full text-sm">
                Soal #{q.question_number}
              </span>
              <span
                className={`text-sm font-bold px-3 py-1 rounded-full ${q.is_correct ? 'bg-teal-100 text-teal-800' : 'bg-red-100 text-red-800'}`}
              >
                {q.is_correct ? 'Benar' : 'Salah'}
              </span>
            </div>

            <div
              className="prose prose-sm max-w-none text-slate-800 mb-6"
              dangerouslySetInnerHTML={{ __html: q.question_text }}
            />

            <div className="space-y-3 mb-6">
              {q.options.map((opt, idx) => {
                const isSelected = q.selected_option_id === opt.id;
                const isCorrectOption = opt.is_correct;
                let bgClass = 'bg-white border-slate-200 text-slate-700';

                if (isCorrectOption) {
                  bgClass =
                    'bg-teal-50 border-teal-500 text-teal-900 font-bold ring-1 ring-teal-500';
                } else if (isSelected && !isCorrectOption) {
                  bgClass = 'bg-red-50 border-red-500 text-red-900 ring-1 ring-red-500';
                }

                return (
                  <div key={opt.id} className={`flex p-4 rounded-xl border ${bgClass}`}>
                    <span className="w-8 shrink-0 font-bold">{String.fromCharCode(65 + idx)}.</span>
                    <span dangerouslySetInnerHTML={{ __html: opt.option_text }} />
                  </div>
                );
              })}
            </div>

            {(q.explanation || q.answering_tips) && (
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mt-4">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-xs">
                    i
                  </span>
                  Pembahasan Singkat
                </h4>
                {q.explanation && (
                  <div
                    className="text-sm text-slate-700 prose prose-sm"
                    dangerouslySetInnerHTML={{ __html: q.explanation }}
                  />
                )}
                {q.answering_tips && (
                  <div className="text-sm text-slate-600 mt-3 pt-3 border-t border-slate-200">
                    <strong className="text-slate-800">Tips:</strong> {q.answering_tips}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={() => router.push('/student/dashboard')}
          className="px-8 py-3 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800"
        >
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}
