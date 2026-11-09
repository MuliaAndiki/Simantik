import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  HelpCircle,
  MessageCircle,
  Share2,
  ShieldCheck,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { RichHtml } from '@/components/atoms/rich-html';
import NavLayout from '@/core/layouts/nav.layout';
import type { DocArticleItem } from '@/types/ui';
import { cn } from '@/utils/classname';

export interface DocDetailTemplateProps {
  article: DocArticleItem;
  relatedArticles?: DocArticleItem[];
}

export function DocDetailTemplate({ article, relatedArticles = [] }: DocDetailTemplateProps) {
  return (
    <NavLayout themeVariant="dark">
      <div className="bg-slate-50/60 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumbs & Back Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Link href="/home" className="hover:text-slate-800 transition-colors">
                Beranda
              </Link>
              <span>/</span>
              <Link href="/documentation" className="hover:text-slate-800 transition-colors">
                Dokumentasi
              </Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-xs">
                {article.title}
              </span>
            </div>

            <Link
              href="/documentation"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-950 transition-colors shrink-0 w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Semua Dokumentasi</span>
            </Link>
          </div>

          {/* Main Article Header Banner */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 shadow-2xs space-y-5 text-left">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-bold border',
                  article.categoryColorClass || 'bg-cyan-50 text-teal-800 border-cyan-200'
                )}
              >
                {article.category}
              </span>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readTimeMinutes} menit baca</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>Diperbarui {article.publishedDate}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-3xl">
                {article.excerpt}
              </p>
            )}

            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-teal-800">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Dokumen Panduan Resmi • Tim Kurikulum &amp; Asesmen SIMANTIK UNP</span>
            </div>
          </div>

          {/* Article Body & Sidebar Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
            {/* Left Content Area (Col 8) */}
            <main className="lg:col-span-8 space-y-6">
              <article className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 shadow-2xs">
                {article.content ? (
                  <RichHtml
                    html={article.content}
                    className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-h3:text-lg sm:prose-h3:text-xl prose-p:text-sm sm:prose-p:text-base prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-sm sm:prose-li:text-base prose-li:text-slate-700"
                  />
                ) : (
                  <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                    <p>{article.excerpt}</p>
                    <p>
                      Materi panduan teknis lengkap untuk topik ini telah dikalibrasi oleh tim
                      kurikulum SIMANTIK. Silakan ikuti instruksi langkah demi langkah di atas untuk
                      memaksimalkan hasil pengerjaan.
                    </p>
                  </div>
                )}

                {/* Helpful Checkmark Box */}
                <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Panduan ini diperbarui secara berkala sesuai regulasi TKA terbaru.</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/help"
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                    >
                      Buka Pusat Bantuan
                    </Link>
                  </div>
                </div>
              </article>
            </main>

            {/* Right Sidebar Area (Col 4) */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Related Articles Card */}
              {relatedArticles.length > 0 && (
                <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <BookOpen className="w-4 h-4 text-teal-700" />
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                      Dokumentasi Terkait
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {relatedArticles.map((rel) => (
                      <Link
                        key={rel.id}
                        href={rel.href}
                        className="group block p-3.5 rounded-2xl bg-slate-50/70 hover:bg-teal-50/50 border border-slate-200/60 hover:border-teal-200 transition-all space-y-1"
                      >
                        <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wide">
                          {rel.category}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-900 transition-colors leading-snug line-clamp-2">
                          {rel.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Tutorials Promo Card */}
              <div className="rounded-3xl bg-linear-to-br from-teal-900 to-[#134653] p-6 text-white shadow-xs space-y-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-400/30">
                  <Video className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-black text-white leading-tight">
                    Lebih Suka Belajar Lewat Video?
                  </h3>
                  <p className="text-xs text-teal-100/80 leading-relaxed font-normal">
                    Tonton video tutorial interaktif berdurasi singkat yang memandu langkah demi
                    langkah penggunaan SIMANTIK.
                  </p>
                </div>
                <Link
                  href="/tutorials"
                  className="inline-flex items-center gap-2 text-xs font-black px-4 py-2.5 rounded-xl bg-[#F5B731] hover:bg-[#E5A721] text-slate-900 transition-all shadow-sm w-full justify-center"
                >
                  <span>Buka Video Tutorial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Help & Support Card */}
              <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-2xs space-y-3 text-center">
                <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-50 text-teal-800 flex items-center justify-center border border-cyan-100">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-slate-900">Masih Memiliki Pertanyaan?</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Kunjungi pusat bantuan kami untuk rincian FAQ atau hubungi tim bantuan kurikulum
                  kami.
                </p>
                <Link
                  href="/help"
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-950 pt-1"
                >
                  <span>Pusat Bantuan &amp; FAQ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </NavLayout>
  );
}

export default DocDetailTemplate;
