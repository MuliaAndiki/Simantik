import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Newspaper,
  ShieldCheck,
  User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { RichHtml } from '@/components/atoms/rich-html';
import NavLayout from '@/core/layouts/nav.layout';
import type { LandingNewsItem, NewsDetailArticleItem } from '@/types/ui';

export interface NewsDetailTemplateProps {
  article: NewsDetailArticleItem;
  relatedNews?: LandingNewsItem[];
}

export function NewsDetailTemplate({ article, relatedNews = [] }: NewsDetailTemplateProps) {
  return (
    <NavLayout themeVariant="dark">
      <div className="bg-slate-50/60 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumbs & Back Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium overflow-hidden">
              <Link href="/home" className="hover:text-slate-800 transition-colors shrink-0">
                Beranda
              </Link>
              <span>/</span>
              <Link href="/news" className="hover:text-slate-800 transition-colors shrink-0">
                Berita
              </Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-xs">
                {article.title}
              </span>
            </div>

            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-950 transition-colors shrink-0 w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Semua Berita</span>
            </Link>
          </div>

          {/* Article Header Card */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 shadow-2xs space-y-5 text-left">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-teal-800 border border-cyan-200 flex items-center gap-1.5">
                <Newspaper className="w-3.5 h-3.5" />
                <span>{article.tag || 'Berita Resmi'}</span>
              </span>

              {article.readTimeMinutes && (
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.readTimeMinutes} menit baca</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-700" />
                <span>Diterbitkan {article.date}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-teal-700" />
                <span>{article.author || 'Tim Redaksi SIMANTIK'}</span>
              </div>
            </div>
          </div>

          {/* Main Content & Sidebar Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
            {/* Left Content Area (Col 8) */}
            <main className="lg:col-span-8 space-y-6">
              <article className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 shadow-2xs space-y-8">
                {/* Hero Thumbnail */}
                {article.imageUrl && (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100">
                    {/* biome-ignore lint/performance/noImgElement: External and dynamic CMS images */}
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Rich HTML Content */}
                {article.content ? (
                  <RichHtml
                    html={article.content}
                    className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-h3:text-lg sm:prose-h3:text-xl prose-p:text-sm sm:prose-p:text-base prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-sm sm:prose-li:text-base prose-li:text-slate-700"
                  />
                ) : (
                  <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                    <p>{article.excerpt}</p>
                  </div>
                )}

                {/* Verification Badge Footer */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Warta dan pengumuman resmi terverifikasi platform SIMANTIK.</span>
                  </div>

                  <Link
                    href="/news"
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors shrink-0 text-center"
                  >
                    Jelajahi Berita Lainnya
                  </Link>
                </div>
              </article>
            </main>

            {/* Right Sidebar Area (Col 4) */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Related News Card */}
              {relatedNews.length > 0 && (
                <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Newspaper className="w-4 h-4 text-teal-700" />
                    <h3 className="text-sm font-black text-slate-900">Berita Terkait</h3>
                  </div>

                  <div className="space-y-4">
                    {relatedNews.map((rn) => (
                      <Link
                        key={rn.id}
                        href={`/news/${rn.slug}`}
                        className="group flex gap-3 items-start hover:bg-slate-50/80 p-2.5 rounded-2xl transition-colors"
                      >
                        {rn.imageUrl ? (
                          <div className="relative w-16 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                            {/* biome-ignore lint/performance/noImgElement: CMS dynamic thumbnail */}
                            <img
                              src={rn.imageUrl}
                              alt={rn.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : null}

                        <div className="space-y-1 min-w-0 flex-1">
                          <span className="text-[10px] font-bold text-teal-800 block">
                            {rn.tag}
                          </span>
                          <h4 className="text-xs font-bold text-slate-800 group-hover:text-teal-800 transition-colors line-clamp-2 leading-snug">
                            {rn.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 block">{rn.date}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* SIMANTIK Learning Promo CTA */}
              <div className="rounded-3xl bg-linear-to-br from-[#134653] to-teal-900 text-white p-6 shadow-md space-y-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center">
                  <Compass className="w-5 h-5 text-cyan-300" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-black">Asah Kemampuan Literasi Kamu</h3>
                  <p className="text-xs text-white/80 leading-relaxed font-normal">
                    Dapatkan akses ke ribuan bank soal TKA Bahasa Indonesia adaptif dan panduan
                    pembahasan komprehensif.
                  </p>
                </div>

                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-white text-teal-950 font-bold text-xs hover:bg-cyan-50 transition-colors shadow-xs"
                >
                  <span>Daftar Akun Siswa Gratis</span>
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

export default NewsDetailTemplate;
