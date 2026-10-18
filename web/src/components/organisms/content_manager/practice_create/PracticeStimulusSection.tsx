'use client';

import {
  BookOpenText,
  Check,
  ChevronDown,
  Eye,
  FolderOpen,
  Info,
  Lock,
  PenLine,
  Plus,
  Trash2,
  Unlink,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { RichHtml } from '@/components/atoms/rich-html';
import { RichTextEditor } from '@/components/molecules/editor';
import type { QuestionStimulusForm } from '@/types/ui/practice-question-editor.types';
import { cn } from '@/utils/classname';

export interface SharedStimulusOption {
  id: string;
  title: string;
  content: string;
  questionCount: number;
  levelsCovered: number[];
  isFull: boolean;
  /** Menandakan apakah bacaan ini dimiliki paket lain */
  isForeign?: boolean;
}

/** Props bank bersama yang diteruskan template -> section. */
export interface SharedStimulusPickerProps {
  sharedStimuli?: SharedStimulusOption[];
  isLoadingSharedStimuli?: boolean;
  stimulusSearch?: string;
  onStimulusSearchChange?: (value: string) => void;
  onSelectSharedStimulus?: (id: string | null) => void;
  onSaveSharedStimulus?: () => void;
  isSavingSharedStimulus?: boolean;
  hasMoreSharedStimuli?: boolean;
  onLoadMoreSharedStimuli?: () => void;
  onDeleteSharedStimulus?: (id: string) => void;
}

export interface PracticeStimulusSectionProps extends SharedStimulusPickerProps {
  stimulus: QuestionStimulusForm;
  onStimulusChange: <K extends keyof QuestionStimulusForm>(
    field: K,
    value: QuestionStimulusForm[K]
  ) => void;
  onToggleStimulus: (hasStimulus: boolean) => void;
  onUploadImage?: (file: File) => Promise<string>;
  onDeleteImage?: (url: string) => Promise<void>;
  /** Bank stimulus bersama (opsional; bila absen, hanya mode tulis manual). */
  sharedStimuli?: SharedStimulusOption[];
  isLoadingSharedStimuli?: boolean;
  stimulusSearch?: string;
  onStimulusSearchChange?: (value: string) => void;
  onSelectSharedStimulus?: (id: string | null) => void;
  onDeleteSharedStimulus?: (id: string) => void;
}

/**
 * Komponen editor untuk Bacaan Bersama (Stimulus) pada Content Manager.
 * Memisahkan area bacaan bersama dari pertanyaan, memberikan helper text ramah awam,
 * dan menyediakan 2 aksi utama: "Buat Bacaan Baru" dan "Pilih Bacaan yang Sudah Ada".
 */
export const PracticeStimulusSection: React.FC<PracticeStimulusSectionProps> = ({
  stimulus,
  onStimulusChange,
  onToggleStimulus,
  onUploadImage,
  onDeleteImage,
  sharedStimuli,
  isLoadingSharedStimuli = false,
  stimulusSearch = '',
  onStimulusSearchChange,
  onSelectSharedStimulus,
  onSaveSharedStimulus,
  isSavingSharedStimulus = false,
  hasMoreSharedStimuli = false,
  onLoadMoreSharedStimuli,
  onDeleteSharedStimulus,
}) => {
  const [expandedStimulusId, setExpandedStimulusId] = useState<string | null>(null);
  const [isBodyOpen, setIsBodyOpen] = useState(stimulus.hasStimulus);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  // Tab mode aktif: 'new' (Buat Bacaan Baru) atau 'existing' (Pilih Bacaan yang Sudah Ada)
  const [activeTab, setActiveTab] = useState<'new' | 'existing'>(
    stimulus.stimulusId ? 'existing' : 'new'
  );

  useEffect(() => {
    if (stimulus.hasStimulus) {
      setIsBodyOpen(true);
    }
  }, [stimulus.hasStimulus]);

  useEffect(() => {
    if (stimulus.stimulusId) {
      setActiveTab('existing');
    }
  }, [stimulus.stimulusId]);

  // Cari bacaan yang sedang terhubung dari daftar bank
  const selectedSharedOption = sharedStimuli?.find((s) => s.id === stimulus.stimulusId);

  // Keadaan awal: belum menggunakan bacaan bersama
  if (!stimulus.hasStimulus) {
    return (
      <div className="bg-[#F8FCFB] border-2 border-dashed border-teal-300 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="size-11 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 shadow-2xs">
            <BookOpenText className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800">
                Bacaan Bersama / Teks Stimulus (Opsional)
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                Belum Digunakan
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Tambahkan teks wacana bacaan yang dapat digunakan khusus untuk soal ini atau digunakan
              bersama oleh hingga 3 soal.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleStimulus(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-teal-300 hover:border-teal-600 text-teal-900 font-bold text-xs sm:text-sm rounded-xl shadow-xs hover:shadow-sm transition cursor-pointer self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4 text-teal-700 stroke-[2.5]" />
          <span>Gunakan Bacaan Bersama</span>
        </button>
      </div>
    );
  }

  const isLinked = Boolean(stimulus.stimulusId);
  const summaryTitle = stimulus.title.trim() ? stimulus.title : 'Belum ada judul bacaan';

  return (
    <div className="rounded-2xl border border-teal-200/90 bg-[#F8FCFB] p-4 sm:p-5 space-y-4 shadow-2xs">
      {/* 1. Header Bagian Bacaan Bersama */}
      <div className="flex items-center justify-between gap-3 border-b border-teal-100/80 pb-3">
        <button
          type="button"
          onClick={() => setIsBodyOpen((v) => !v)}
          className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer"
          aria-expanded={isBodyOpen}
        >
          <div className="size-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
            <BookOpenText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide">
                Area Bacaan Bersama
              </h3>
              {isLinked ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                  <Check className="size-3" /> Terhubung
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                  Bacaan Baru
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate max-w-sm sm:max-w-md">
              {summaryTitle}
            </p>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${
              isBodyOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        <button
          type="button"
          onClick={() => onToggleStimulus(false)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Hapus Bacaan</span>
        </button>
      </div>

      {isBodyOpen && (
        <div className="space-y-4">
          {/* 2. Helper Text Sederhana & Ramah Awam */}
          <div className="rounded-xl border border-teal-200/80 bg-teal-50/70 p-3 sm:p-3.5 flex items-start gap-2.5 text-xs text-teal-900 leading-relaxed">
            <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-teal-950">Panduan Bacaan Bersama:</p>
              <p className="mt-0.5 opacity-90">
                Bacaan bersama adalah teks yang dapat digunakan untuk beberapa soal. Anda cukup
                membuat bacaan satu kali, lalu menghubungkannya ke soal yang membutuhkan bacaan
                tersebut. Satu bacaan dapat digunakan maksimal untuk 3 soal.
              </p>
            </div>
          </div>

          {/* 3. Dua Tindakan Utama: "Buat Bacaan Baru" vs "Pilih Bacaan yang Sudah Ada" */}
          {sharedStimuli !== undefined && onSelectSharedStimulus && (
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('new');
                  if (stimulus.stimulusId) {
                    onSelectSharedStimulus(null);
                  }
                }}
                className={cn(
                  'flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer',
                  activeTab === 'new' && !stimulus.stimulusId
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                <PenLine className="w-3.5 h-3.5" />
                <span>Buat Bacaan Baru</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('existing');
                  // Jika belum memilih dan ada stimulus di bank, pilih yang pertama jika belum ada pilihan
                  if (!stimulus.stimulusId && sharedStimuli.length > 0) {
                    onSelectSharedStimulus(sharedStimuli[0].id);
                  }
                }}
                className={cn(
                  'flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer',
                  activeTab === 'existing' || stimulus.stimulusId
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Pilih Bacaan yang Sudah Ada</span>
              </button>
            </div>
          )}

          {/* 4. MODE A: Pilih Bacaan yang Sudah Ada */}
          {activeTab === 'existing' && sharedStimuli !== undefined && onSelectSharedStimulus && (
            <div className="rounded-xl border border-teal-200 bg-white p-3.5 space-y-3.5 shadow-2xs">
              {/* Preview Bacaan Terpilih (Jika sudah memilih bacaan) */}
              {isLinked && (
                <div className="rounded-xl border-2 border-teal-500 bg-[#F0FDF9] p-3.5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
                          <Check className="size-3" /> Bacaan Terpilih
                        </span>
                        {selectedSharedOption && (
                          <span className="text-[11px] font-bold text-slate-600">
                            Digunakan oleh {selectedSharedOption.questionCount} soal (Maks. 3 soal)
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {stimulus.title || selectedSharedOption?.title || 'Bacaan Bersama'}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onSelectSharedStimulus(null)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:border-slate-300 transition cursor-pointer"
                      >
                        <Unlink className="w-3.5 h-3.5" />
                        <span>Lepas Tautan</span>
                      </button>

                      {onDeleteSharedStimulus &&
                        stimulus.stimulusId &&
                        !selectedSharedOption?.isForeign && (
                          <button
                            type="button"
                            onClick={() => onDeleteSharedStimulus(stimulus.stimulusId as string)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:text-rose-700 bg-white border border-rose-200 hover:border-rose-300 transition cursor-pointer"
                            title="Hapus bacaan ini dari bank"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Hapus</span>
                          </button>
                        )}
                    </div>
                  </div>

                  <p className="text-[11px] text-teal-900">
                    Teks bacaan ini dikunci karena terhubung dengan bank bacaan bersama. Perubahan
                    di bank bacaan akan memengaruhi seluruh soal terkait.
                  </p>

                  {/* Pratinjau Pembacaan Teks Stimulus Terpilih */}
                  {(stimulus.content || selectedSharedOption?.content) && (
                    <div className="pt-2 border-t border-teal-200/70">
                      <button
                        type="button"
                        onClick={() => setIsPreviewOpen((v) => !v)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-950 transition cursor-pointer"
                      >
                        <Eye className="size-3.5" />
                        <span>
                          {isPreviewOpen ? 'Sembunyikan Isi Bacaan' : 'Buka Pratinjau Isi Bacaan'}
                        </span>
                        <ChevronDown
                          className={cn(
                            'size-3.5 transition-transform',
                            isPreviewOpen && 'rotate-180'
                          )}
                        />
                      </button>

                      {isPreviewOpen && (
                        <div className="mt-2 max-h-56 overflow-y-auto rounded-xl bg-white border border-teal-200 p-3.5 text-xs text-slate-800 leading-relaxed shadow-2xs">
                          <RichHtml
                            html={stimulus.content || selectedSharedOption?.content || ''}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Pencarian Bacaan di Bank */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700">
                  Cari & Pilih Bacaan dari Bank:
                </label>
                <input
                  type="text"
                  value={stimulusSearch}
                  onChange={(e) => onStimulusSearchChange?.(e.target.value)}
                  placeholder="Ketik judul wacana untuk mencari..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-600 focus:bg-white"
                />
              </div>

              {/* Daftar Bacaan di Bank */}
              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {isLoadingSharedStimuli && sharedStimuli.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    Memuat daftar bacaan bersama...
                  </p>
                ) : sharedStimuli.length === 0 ? (
                  <div className="text-center py-4 px-2 space-y-1">
                    <p className="text-xs font-semibold text-slate-700">
                      Belum ada bacaan bersama yang tersimpan di paket ini.
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Pilih tab &quot;Buat Bacaan Baru&quot; untuk menulis wacana pertama.
                    </p>
                  </div>
                ) : (
                  sharedStimuli.map((opt) => {
                    const isSelected = stimulus.stimulusId === opt.id;
                    const isExpanded = expandedStimulusId === opt.id;
                    const isFull = opt.isFull;
                    const isForeign = opt.isForeign;

                    return (
                      <div
                        key={opt.id}
                        className={cn(
                          'w-full rounded-xl border transition-all',
                          isSelected
                            ? 'border-teal-600 bg-teal-50/60 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-teal-200'
                        )}
                      >
                        <div className="flex items-center gap-2 p-3">
                          <button
                            type="button"
                            disabled={isFull && !isSelected}
                            onClick={() => onSelectSharedStimulus(isSelected ? null : opt.id)}
                            className="flex-1 min-w-0 text-left cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {opt.title}
                              </span>

                              {isFull ? (
                                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full shrink-0">
                                  Sudah Penuh (3/3 soal)
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full shrink-0">
                                  Digunakan oleh {opt.questionCount} soal
                                </span>
                              )}
                            </div>

                            {/* Peringatan kepemilikan paket jika dari paket lain */}
                            {isForeign && (
                              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-amber-700">
                                <Lock className="size-3 shrink-0" />
                                <span>
                                  Bacaan ini sudah digunakan oleh paket lain dan tidak dapat diubah
                                  dari paket ini.
                                </span>
                              </div>
                            )}

                            {/* Level kesukaran soal yang tercakup */}
                            <div className="flex items-center gap-1 mt-1.5">
                              <span className="text-[10px] text-slate-400 mr-1">Level:</span>
                              {[1, 2, 3, 4, 5].map((lvl) => (
                                <span
                                  key={lvl}
                                  className={cn(
                                    'w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center',
                                    opt.levelsCovered.includes(lvl)
                                      ? 'bg-teal-600 text-white'
                                      : 'bg-slate-100 text-slate-400'
                                  )}
                                >
                                  {lvl}
                                </span>
                              ))}
                            </div>
                          </button>

                          {/* Tombol Hapus dari Bank */}
                          {onDeleteSharedStimulus && !isForeign && (
                            <button
                              type="button"
                              title="Hapus bacaan dari bank"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteSharedStimulus(opt.id);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Tombol Pratinjau Teks */}
                          <button
                            type="button"
                            title={isExpanded ? 'Tutup pratinjau' : 'Pratinjau isi bacaan'}
                            onClick={() => setExpandedStimulusId(isExpanded ? null : opt.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-teal-800 hover:bg-teal-50 transition shrink-0 cursor-pointer"
                          >
                            <ChevronDown
                              className={cn(
                                'w-4 h-4 transition-transform',
                                isExpanded && 'rotate-180'
                              )}
                            />
                          </button>
                        </div>

                        {/* Konten Pratinjau Lengkap */}
                        {isExpanded && (
                          <div className="mx-3 mb-3 max-h-40 overflow-y-auto rounded-lg bg-slate-50 border border-slate-200/80 p-3 text-xs text-slate-700 leading-relaxed">
                            <RichHtml html={opt.content} />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {hasMoreSharedStimuli && (
                <button
                  type="button"
                  onClick={() => onLoadMoreSharedStimuli?.()}
                  className="w-full py-2 rounded-xl text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition cursor-pointer"
                >
                  Muat bacaan lainnya
                </button>
              )}
            </div>
          )}

          {/* 5. MODE B: Buat / Tulis Bacaan Baru */}
          {activeTab === 'new' && (
            <div className="space-y-3.5">
              {/* Opsi Simpan ke Bank Bacaan Bersama */}
              {!stimulus.stimulusId && onSaveSharedStimulus && (
                <div className="rounded-xl border border-teal-200/80 bg-teal-50/60 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <span className="text-[11px] text-slate-600 font-medium">
                    Ingin menggunakan bacaan ini untuk soal lain? Simpan ke bank bacaan bersama.
                  </span>
                  <button
                    type="button"
                    disabled={
                      isSavingSharedStimulus ||
                      stimulus.title.trim() === '' ||
                      stimulus.content.trim() === ''
                    }
                    onClick={onSaveSharedStimulus}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    {isSavingSharedStimulus ? 'Menyimpan...' : 'Simpan ke Bank & Tautkan'}
                  </button>
                </div>
              )}

              {/* Form Input Judul Bacaan */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700">
                  Judul Wacana / Teks Bacaan (Opsional)
                </label>
                <input
                  type="text"
                  value={stimulus.title}
                  disabled={isLinked}
                  onChange={(e) => onStimulusChange('title', e.target.value)}
                  placeholder="Contoh: Konservasi Ekosistem Lahan Basah Nusantara"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal-600 transition disabled:opacity-60"
                />
              </div>

              {/* Form Input Isi Bacaan dengan RichTextEditor */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700">
                  Isi Teks Wacana Bacaan <span className="text-rose-500">*</span>
                </label>
                <div className="bg-white rounded-2xl border border-teal-200 overflow-hidden shadow-2xs">
                  <RichTextEditor
                    value={stimulus.content}
                    readOnly={isLinked}
                    variant="compact"
                    minHeight="160px"
                    onChange={(val) => onStimulusChange('content', val)}
                    onUploadImage={onUploadImage}
                    onDeleteImage={onDeleteImage}
                  />
                </div>
              </div>

              {/* Form Input Sumber Referensi Bacaan */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700">
                  Sumber / Referensi Wacana (Opsional)
                </label>
                <input
                  type="text"
                  value={stimulus.source}
                  disabled={isLinked}
                  onChange={(e) => onStimulusChange('source', e.target.value)}
                  placeholder="Contoh: Disadur dari Jurnal Sains Terapan & Bahasa, 2026"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-teal-600 disabled:opacity-60"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PracticeStimulusSection;
