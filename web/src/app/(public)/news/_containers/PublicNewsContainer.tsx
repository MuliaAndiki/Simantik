"use client";

import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import NavLayout from "@/core/layouts/nav.layout";
import { useApi } from "@/hooks/useApi";
import { useDebounce } from "@/hooks/useDebounce/useDebounce";

export function PublicNewsContainer() {
  const { content } = useApi();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [page, setPage] = useState(1);
  const limit = 9;

  const { data: newsPage, isLoading } = content.query.news({
    search: debouncedSearch || undefined,
    limit,
    offset: (page - 1) * limit,
  });

  const totalPages = newsPage
    ? Math.max(1, Math.ceil(newsPage.total / limit))
    : 1;

  // Hanya memetakan data resmi dari database backend
  const displayNews = (newsPage?.news ?? []).map((item, idx) => ({
    id: item.id || `news-${idx}`,
    title: item.title,
    excerpt: item.content
      ? `${item.content.replace(/<[^>]*>?/gm, "").substring(0, 140)}...`
      : "",
    date: item.createdAt
      ? new Date(item.createdAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Terbaru",
    slug: item.slug || item.id,
    imageUrl: item.thumbnailUrl || "/illustrations/student-learning.jpg",
    tag: "Berita Resmi",
  }));

  return (
    <NavLayout themeVariant="dark">
      <div className="bg-slate-50/60 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
            <div className="space-y-3 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Berita &amp; Pengumuman SIMANTIK
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                Temukan tips belajar efektif, kebijakan kurikulum terbaru, serta
                rilis fitur pembelajaran mandiri Bahasa Indonesia.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Cari artikel berita..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200/90 bg-white text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 transition-shadow shadow-2xs"
              />
            </div>
          </div>

          {/* News Grid or Skeletons */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`news-loading-${i}`}
                  className="rounded-3xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between"
                >
                  <div className="w-full h-48 bg-slate-100 animate-pulse" />
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="w-24 h-3.5 rounded-md bg-slate-200 animate-pulse" />
                      <div className="w-4/5 h-5 rounded-md bg-slate-200 animate-pulse" />
                      <div className="space-y-1.5 pt-1">
                        <div className="w-full h-3 rounded-md bg-slate-100 animate-pulse" />
                        <div className="w-5/6 h-3 rounded-md bg-slate-100 animate-pulse" />
                      </div>
                    </div>
                    <div className="w-28 h-4 rounded-md bg-slate-200 animate-pulse pt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {displayNews.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-cyan-50 text-teal-700">
                        <BookOpen className="w-8 h-8" />
                      </div>
                    )}

                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold shadow-xs">
                        {item.tag}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.date}</span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug group-hover:text-teal-800 transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-3">
                        {item.excerpt}
                      </p>
                    </div>

                    <Link
                      href={`/news/${item.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-teal-800 hover:text-teal-950 pt-2 border-t border-slate-100"
                    >
                      <span>Baca Selengkapnya</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center space-y-3 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-700">
                {debouncedSearch.trim() !== ""
                  ? "Tidak ada berita yang cocok"
                  : "Belum ada berita yang dipublikasikan"}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {debouncedSearch.trim() !== ""
                  ? "Silakan coba kata kunci pencarian yang lain untuk menemukan artikel wawasan."
                  : "Warta dan artikel berita terbaru dari tim kurikulum SIMANTIK akan ditampilkan di sini."}
              </p>
            </div>
          )}

          {/* Pagination */}
          {newsPage && newsPage.total > limit && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-6">
              <span className="text-xs text-slate-500 font-medium">
                Halaman {page} dari {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Sebelumnya</span>
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </NavLayout>
  );
}

export default PublicNewsContainer;
