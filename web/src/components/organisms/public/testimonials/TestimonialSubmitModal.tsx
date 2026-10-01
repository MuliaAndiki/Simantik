'use client';

import { Heart, Loader2, Send, Star, X } from 'lucide-react';
import React, { useState } from 'react';
import { cn } from '@/utils/classname';

export interface TestimonialSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    authorName: string;
    authorRole: string;
    content: string;
    rating: number;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function TestimonialSubmitModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: TestimonialSubmitModalProps) {
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) {
      setErrorMsg('Nama dan cerita pengalaman wajib diisi.');
      return;
    }
    setErrorMsg('');

    try {
      await onSubmit({
        authorName: authorName.trim(),
        authorRole: authorRole.trim() || 'Siswa SMA',
        content: content.trim(),
        rating,
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setAuthorName('');
        setAuthorRole('');
        setContent('');
        setRating(5);
        onClose();
      }, 2000);
    } catch {
      setErrorMsg('Gagal mengirim testimoni. Silakan coba beberapa saat lagi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden text-left">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <Heart className="w-7 h-7 fill-emerald-500" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Terima Kasih!</h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
              Cerita pengalaman belajarmu telah dikirimkan dan akan diverifikasi oleh tim kurator
              SIMANTIK.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-bold">
                <Heart className="w-3 h-3 text-rose-500" />
                <span>Testimoni Siswa &amp; Guru</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Bagikan Cerita Belajarmu
              </h3>
              <p className="text-xs text-slate-500">
                Ceritakan bagaimana SIMANTIK membantumu menghadapi persiapan ujian &amp; asesmen.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Rating Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Rating Pengalaman</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition cursor-pointer"
                      aria-label={`Beri rating ${star} bintang`}
                    >
                      <Star
                        className={cn(
                          'w-6 h-6 transition-colors',
                          isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        )}
                      />
                    </button>
                  );
                })}
                <span className="text-xs font-bold text-slate-600 ml-2">
                  {rating === 5
                    ? 'Sangat Membantu (5/5)'
                    : rating === 4
                      ? 'Bagus (4/5)'
                      : rating === 3
                        ? 'Cukup Baik (3/5)'
                        : `${rating}/5 Bintang`}
                </span>
              </div>
            </div>

            {/* Author Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700" htmlFor="authorName">
                Nama Lengkap <span className="text-rose-500">*</span>
              </label>
              <input
                id="authorName"
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Contoh: Anindya Putri Rahmadani"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Role & School */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700" htmlFor="authorRole">
                Peran / Asal Sekolah <span className="text-slate-400 font-normal">(Opsional)</span>
              </label>
              <input
                id="authorRole"
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="Contoh: Siswa SMAN 1 Jakarta • Kelas XII"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
            </div>

            {/* Content */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700" htmlFor="content">
                Cerita &amp; Ulasan Pengalaman <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="content"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tuliskan pengalamanmu, fitur yang paling membantumu, atau saran positif..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-transparent transition resize-none"
                required
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 rounded-full bg-[#F5B731] hover:bg-[#E5A721] text-slate-900 font-black text-xs sm:text-sm shadow-xs transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Testimoni</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default TestimonialSubmitModal;
