'use client';

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Cloud,
  Code2,
  FileText,
  Highlighter,
  Image as ImageIcon,
  Indent,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Maximize2,
  Minimize2,
  Minus,
  Outdent,
  Palette,
  Plus,
  RemoveFormatting,
  RotateCcw,
  RotateCw,
  Table as TableIcon,
  Trash2,
  Underline,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/classname';

export interface RichTextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  onUploadImage?: (file: File) => Promise<string>;
  onDeleteImage?: (url: string) => Promise<void>;
  apiKey?: string;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  onWordCountChange?: (count: number) => void;
  documentTitle?: string;
  documentSubtitle?: string;
  variant?: 'full' | 'compact';
  minHeight?: string;
}

export const DEFAULT_DOCUMENT_HTML = `
<div class="space-y-6 text-slate-800 leading-relaxed font-normal">
  <div>
    <p class="text-xs font-bold text-sky-700 tracking-wider uppercase mb-2">
      MODUL PEMBELAJARAN TKA BAHASA INDONESIA
    </p>
    <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
      Memahami Teks Eksplanasi: Ciri, Kaidah Kebahasaan, dan Struktur Analisis
    </h1>
    <p class="text-xs text-slate-400 font-medium mt-2">
      Jenjang: SMA / MA Fase F &nbsp;&bull;&nbsp; Pilar: Literasi &amp; Pemahaman Tekstual &nbsp;&bull;&nbsp; Penulis: Rian Pratama, M.Pd.
    </p>
  </div>

  <div class="border-t border-slate-100 pt-5">
    <h2 class="text-base sm:text-lg font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
      A. Definisi dan Karakteristik Utama
    </h2>
    <p class="text-sm text-slate-700 leading-relaxed">
      <strong>Teks eksplanasi</strong> adalah teks yang berisi penjelasan mengenai proses mengapa dan bagaimana peristiwa alam, sosial, ilmu pengetahuan, budaya, dan fenomena lainnya dapat terjadi. Sebuah peristiwa baik alam maupun sosial yang terjadi di sekitar kita senantiasa memiliki hubungan kausalitas (sebab-akibat) serta kronologis (urutan waktu).
    </p>
    
    <div class="my-4 p-4 rounded-r-xl border-l-4 border-cyan-500 bg-cyan-50/60 text-xs sm:text-sm text-slate-800 leading-relaxed">
      <strong>Prinsip Utama:</strong> Fokus penulisan eksplanasi bukan pada opini subjektif, melainkan pengungkapan fakta faktual yang dapat diuji kebenarannya secara rasional dan ilmiah.
    </div>
  </div>

  <div>
    <h2 class="text-base sm:text-lg font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
      B. Struktur Baku Teks Eksplanasi
    </h2>
    <p class="text-sm text-slate-700 leading-relaxed mb-3">
      Secara umum, teks eksplanasi memuat tiga komponen struktur logis yang tidak dapat dipertukarkan posisinya:
    </p>
    <div class="space-y-2.5 text-sm text-slate-700 pl-4 border-l-2 border-slate-200">
      <p>
        <strong>Pernyataan Umum (General Statement):</strong> Pengenalan awal mengenai fenomena yang dibahas serta latar belakang mengapa topik tersebut penting untuk diurai.
      </p>
      <p>
        <strong>Rangkaian Penjelas (Deretan Penjelas / Sequence):</strong> Uraian terperinci mengenai tahapan peristiwa, hubungan interaksi antar-unsur, dan mekanisme sebab akibat secara logis.
      </p>
      <p>
        <strong>Interpretasi (Penutup / Review):</strong> Kesimpulan, simpulan evaluatif, atau implikasi peristiwa tersebut terhadap lingkungan manusia.
      </p>
    </div>
  </div>

  <div>
    <h2 class="text-base sm:text-lg font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
      C. Kaidah Kebahasaan yang Dominan
    </h2>
    <ul class="list-disc list-inside space-y-1.5 text-sm text-slate-700 pl-2">
      <li>Menggunakan kata kerja material dan relasional (misal: menyebabkan, bertransformasi).</li>
      <li>Memanfaatkan konjungsi kausalitas (sebab, karena, oleh karena itu, sehingga).</li>
      <li>Memanfaatkan konjungsi kronologis (kemudian, setelah itu, pada akhirnya).</li>
      <li>Dominan menggunakan istilah teknis/ilmiah sesuai dengan bidang tema fenomena.</li>
    </ul>
  </div>
</div>
`;

function countWords(html: string): number {
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return 0;
  return text.split(' ').filter(Boolean).length;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  onUploadImage,
  onDeleteImage,
  placeholder = 'Mulai menulis materi...',
  readOnly = false,
  className,
  onWordCountChange,
  variant = 'full',
  minHeight,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState<number>(16);
  const [fontFamily, setFontFamily] = useState<string>('Poppins');
  const [headingStyle, setHeadingStyle] = useState<string>('Teks Normal');
  const [wordCount, setWordCount] = useState<number>(384);
  const [scale, setScale] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSavedCloud, setIsSavedCloud] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [selectedImageRect, setSelectedImageRect] = useState<DOMRect | null>(null);
  const [isTableMenuOpen, setIsTableMenuOpen] = useState<boolean>(false);
  const [tableSize, setTableSize] = useState<{ rows: number; cols: number }>({
    rows: 0,
    cols: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pendingDeletions = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const isReplacingContentRef = useRef<boolean>(false);

  // Sync initial content
  useEffect(() => {
    if (editorRef.current) {
      const nextHtml = value !== undefined ? value : DEFAULT_DOCUMENT_HTML;
      if (editorRef.current.innerHTML !== nextHtml) {
        isReplacingContentRef.current = true;
        editorRef.current.innerHTML = nextHtml;
        setTimeout(() => {
          isReplacingContentRef.current = false;
        }, 50);
      }
      const words = countWords(nextHtml);
      setWordCount(words);
      onWordCountChange?.(words);
    }
  }, [value, onWordCountChange]);

  // Observe node removal to delete images
  useEffect(() => {
    if (!editorRef.current || !onDeleteImage) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Cancel deletion if image is added back (e.g. Undo)
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            const checkAndCancel = (element: HTMLElement) => {
              if (element.nodeName === 'IMG') {
                const src = (element as HTMLImageElement).src;
                if (pendingDeletions.current.has(src)) {
                  clearTimeout(pendingDeletions.current.get(src)!);
                  pendingDeletions.current.delete(src);
                }
              }
              if (element.querySelectorAll) {
                const imgs = element.querySelectorAll('img');
                imgs.forEach((img) => {
                  if (pendingDeletions.current.has(img.src)) {
                    clearTimeout(pendingDeletions.current.get(img.src)!);
                    pendingDeletions.current.delete(img.src);
                  }
                });
              }
            };
            checkAndCancel(node);
          }
        });

        // Skip deletion if replacing the entire editor content
        if (isReplacingContentRef.current) return;

        // Schedule deletion for removed images
        mutation.removedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            const checkAndQueue = (element: HTMLElement) => {
              if (element.nodeName === 'IMG') {
                const src = (element as HTMLImageElement).src;
                if (!pendingDeletions.current.has(src)) {
                  const timer = setTimeout(() => {
                    onDeleteImage(src).catch(console.error);
                    pendingDeletions.current.delete(src);
                  }, 5000); // 5s delay
                  pendingDeletions.current.set(src, timer);
                }
              }
              if (element.querySelectorAll) {
                const imgs = element.querySelectorAll('img');
                imgs.forEach((img) => {
                  if (!pendingDeletions.current.has(img.src)) {
                    const timer = setTimeout(() => {
                      onDeleteImage(img.src).catch(console.error);
                      pendingDeletions.current.delete(img.src);
                    }, 5000); // 5s delay
                    pendingDeletions.current.set(img.src, timer);
                  }
                });
              }
            };
            checkAndQueue(node);
          }
        });
      });
    });

    observer.observe(editorRef.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [onDeleteImage]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const count = countWords(html);
      setWordCount(count);
      onWordCountChange?.(count);
      onChange?.(html);
      setIsSavedCloud(false);
      const timer = setTimeout(() => setIsSavedCloud(true), 800);
      return () => clearTimeout(timer);
    }
  }, [onChange, onWordCountChange]);

  const executeCommand = (command: string, arg?: string) => {
    if (readOnly) return;
    document.execCommand(command, false, arg);
    editorRef.current?.focus();
    handleInput();
  };

  const handleHeadingChange = (format: string) => {
    setHeadingStyle(format);
    if (format === 'H1') executeCommand('formatBlock', '<h1>');
    else if (format === 'H2') executeCommand('formatBlock', '<h2>');
    else if (format === 'H3') executeCommand('formatBlock', '<h3>');
    else if (format === 'Kutipan') executeCommand('formatBlock', '<blockquote>');
    else executeCommand('formatBlock', '<p>');
  };

  const handleFontSizeChange = (delta: number) => {
    const next = Math.max(10, Math.min(36, fontSize + delta));
    setFontSize(next);
    executeCommand('fontSize', next > 20 ? '5' : next > 16 ? '4' : '3');
  };

  const handleInsertLink = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      alert('Pilih teks terlebih dahulu sebelum menyisipkan tautan.');
      return;
    }
    const url = prompt('Masukkan URL tautan:');
    if (url) executeCommand('createLink', url);
  };

  const handleInsertImage = () => {
    if (onUploadImage) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        setSavedSelection(selection.getRangeAt(0));
      }
      fileInputRef.current?.click();
    } else {
      const url = prompt('Masukkan URL Gambar:');
      if (url) {
        const imgHtml = `<img src="${url}" alt="image" class="max-w-full h-auto rounded-xl my-4" />`;
        executeCommand('insertHTML', imgHtml);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadImage) return;

    // Optional validation (can also be done on the server/hook)
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar (JPG, PNG, WEBP, dll)');
      return;
    }

    try {
      setIsUploading(true);
      const url = await onUploadImage(file);

      // Restore selection before inserting
      if (savedSelection) {
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(savedSelection);
      } else {
        editorRef.current?.focus();
      }

      const imgHtml = `<img src="${url}" alt="${file.name}" class="max-w-full h-auto rounded-xl my-4" />`;
      executeCommand('insertHTML', imgHtml);
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setIsUploading(false);
      setSavedSelection(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const buildTableHtml = (rows: number, cols: number): string => {
    const headerCells = Array.from(
      { length: cols },
      (_, c) => `<th class="border border-slate-200 p-2 font-bold text-left">Kolom ${c + 1}</th>`
    ).join('');
    const bodyRows = Array.from(
      { length: Math.max(0, rows - 1) },
      (_, r) =>
        `<tr>${Array.from(
          { length: cols },
          (_, c) => `<td class="border border-slate-200 p-2">Baris ${r + 1} Kolom ${c + 1}</td>`
        ).join('')}</tr>`
    ).join('');

    return `
      <table class="w-full border-collapse border border-slate-200 my-4 text-xs">
        <thead>
          <tr class="bg-slate-50">${headerCells}</tr>
        </thead>
        <tbody>${bodyRows}</tbody>
      </table>
    `;
  };

  const handleInsertTable = (rows: number, cols: number) => {
    executeCommand('insertHTML', buildTableHtml(rows, cols));
    setIsTableMenuOpen(false);
    setTableSize({ rows: 0, cols: 0 });
  };

  const clearImageSelection = () => {
    if (selectedImage) {
      selectedImage.style.outline = '';
      selectedImage.style.outlineOffset = '';
    }
    setSelectedImage(null);
    setSelectedImageRect(null);
  };

  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readOnly) return;
    const target = e.target as HTMLElement;
    if (target instanceof HTMLImageElement) {
      if (selectedImage && selectedImage !== target) {
        selectedImage.style.outline = '';
        selectedImage.style.outlineOffset = '';
      }
      target.style.outline = '2px solid #0EA5E9';
      target.style.outlineOffset = '2px';
      setSelectedImage(target);
      setSelectedImageRect(target.getBoundingClientRect());
    } else {
      clearImageSelection();
    }
  };

  const handleDeleteSelectedImage = () => {
    if (selectedImage) {
      selectedImage.remove();
      clearImageSelection();
      handleInput();
    }
  };

  useEffect(() => {
    if (!selectedImage) return;
    const hide = () => {
      selectedImage.style.outline = '';
      setSelectedImage(null);
      setSelectedImageRect(null);
    };
    window.addEventListener('scroll', hide, true);
    return () => window.removeEventListener('scroll', hide, true);
  }, [selectedImage]);

  return (
    <div
      className={cn(
        'w-full bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden flex flex-col transition-all duration-300',
        isFullscreen && 'fixed inset-0 z-50 rounded-none h-screen bg-slate-100',
        className
      )}
    >
      {/* 1. Top Menubar Row */}
      {variant !== 'compact' && (
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-slate-100 bg-white select-none">
          <div className="flex items-center gap-5 text-xs font-semibold text-slate-600">
            <button type="button" className="hover:text-slate-900 transition cursor-pointer">
              Berkas
            </button>
            <button type="button" className="hover:text-slate-900 transition cursor-pointer">
              Edit
            </button>
            <button type="button" className="hover:text-slate-900 transition cursor-pointer">
              Sisipkan
            </button>
            <button type="button" className="hover:text-slate-900 transition cursor-pointer">
              Format
            </button>
            <button type="button" className="hover:text-slate-900 transition cursor-pointer">
              Alat
            </button>
          </div>

          {/* Cloud Sync Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-bold">
            <Cloud className="w-3.5 h-3.5" />
            <span>{isSavedCloud ? 'Tersimpan ' : 'Menyimpan...'}</span>
          </div>
        </div>
      )}

      {/* 2. Full Word/Docs Toolbar Controls */}
      <div className="flex items-center flex-wrap gap-1 px-4 sm:px-6 py-2 border-b border-slate-100 bg-[#FAFCFF] text-slate-700 select-none">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            title="Undo"
            onClick={() => executeCommand('undo')}
            className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-600 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Redo"
            onClick={() => executeCommand('redo')}
            className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-600 transition cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        <div className="h-5 w-px bg-slate-200 mx-1.5" />

        {/* Heading Style Dropdown */}
        <div className="relative inline-block">
          <select
            value={headingStyle}
            onChange={(e) => handleHeadingChange(e.target.value)}
            className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 cursor-pointer appearance-none pr-7 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="Teks Normal">Teks Normal</option>
            <option value="H1">Judul Besar (H1)</option>
            <option value="H2">Sub-Judul (H2)</option>
            <option value="H3">Heading 3 (H3)</option>
            <option value="Kutipan">Blok Kutipan</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
        </div>

        {/* Font Family Dropdown */}
        <div className="relative inline-block ml-1">
          <select
            value={fontFamily}
            onChange={(e) => {
              setFontFamily(e.target.value);
              executeCommand('fontName', e.target.value);
            }}
            className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 cursor-pointer appearance-none pr-7 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="Poppins">Poppins</option>
            <option value="Inter">Inter</option>
            <option value="Geist">Geist</option>
            <option value="Arial">Arial</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
        </div>

        {/* Font Size Counter */}
        <div className="flex items-center bg-white border border-slate-200 rounded-lg ml-1 px-1 py-0.5 text-xs font-bold text-slate-700">
          <button
            type="button"
            onClick={() => handleFontSizeChange(-1)}
            className="p-1 hover:bg-slate-100 rounded cursor-pointer"
            title="Perkecil teks"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-6 text-center text-xs">{fontSize}</span>
          <button
            type="button"
            onClick={() => handleFontSizeChange(1)}
            className="p-1 hover:bg-slate-100 rounded cursor-pointer"
            title="Perbesar teks"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <div className="h-5 w-px bg-slate-200 mx-1.5" />

        {/* Inline Formatting: B, I, U, Color, Highlight */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            title="Bold (Ctrl+B)"
            onClick={() => executeCommand('bold')}
            className="px-2 py-1 rounded-lg font-black hover:bg-slate-200/70 text-slate-800 text-xs transition cursor-pointer"
          >
            B
          </button>
          <button
            type="button"
            title="Italic (Ctrl+I)"
            onClick={() => executeCommand('italic')}
            className="px-2 py-1 rounded-lg italic font-serif hover:bg-slate-200/70 text-slate-800 text-xs transition cursor-pointer"
          >
            I
          </button>
          <button
            type="button"
            title="Underline (Ctrl+U)"
            onClick={() => executeCommand('underline')}
            className="px-2 py-1 rounded-lg underline hover:bg-slate-200/70 text-slate-800 text-xs transition cursor-pointer"
          >
            U
          </button>
          <button
            type="button"
            title="Warna Teks"
            onClick={() => {
              const color = prompt('Kode warna hex (misal: #0284c7):', '#0284c7');
              if (color) executeCommand('foreColor', color);
            }}
            className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-700 transition flex items-center cursor-pointer"
          >
            <div className="flex flex-col items-center">
              <span className="font-bold text-xs leading-none">A</span>
              <span className="w-3 h-0.5 bg-sky-600 mt-0.5 rounded-full" />
            </div>
          </button>
          <button
            type="button"
            title="Highlight Kuning"
            onClick={() => executeCommand('hiliteColor', '#fef08a')}
            className="p-1.5 rounded-lg hover:bg-slate-200/70 text-amber-500 transition cursor-pointer"
          >
            <Highlighter className="w-4 h-4" />
          </button>
        </div>

        <div className="h-5 w-px bg-slate-200 mx-1.5" />

        {/* Alignments */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            title="Rata Kiri"
            onClick={() => executeCommand('justifyLeft')}
            className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-600 transition cursor-pointer"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Rata Tengah"
            onClick={() => executeCommand('justifyCenter')}
            className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-600 transition cursor-pointer"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Rata Kanan"
            onClick={() => executeCommand('justifyRight')}
            className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-600 transition cursor-pointer"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Rata Kanan Kiri (Justify)"
            onClick={() => executeCommand('justifyFull')}
            className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-600 transition cursor-pointer"
          >
            <AlignJustify className="w-4 h-4" />
          </button>
        </div>

        <div className="h-5 w-px bg-slate-200 mx-1.5" />

        {/* Lists & Indentation */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            title="Daftar Bullet"
            onClick={() => executeCommand('insertUnorderedList')}
            className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-600 transition cursor-pointer"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Daftar Angka"
            onClick={() => executeCommand('insertOrderedList')}
            className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-600 transition cursor-pointer"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Kurangi Indent"
            onClick={() => executeCommand('outdent')}
            className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-600 transition cursor-pointer"
          >
            <Outdent className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Tambah Indent"
            onClick={() => executeCommand('indent')}
            className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-600 transition cursor-pointer"
          >
            <Indent className="w-4 h-4" />
          </button>
        </div>

        <div className="h-5 w-px bg-slate-200 mx-1.5" />

        {/* Insertions */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            title="Sisipkan Tautan"
            onClick={handleInsertLink}
            onMouseDown={(e) => e.preventDefault()}
            className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-600 transition cursor-pointer"
          >
            <Link2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Sisipkan Gambar"
            onClick={handleInsertImage}
            disabled={isUploading}
            onMouseDown={(e) => e.preventDefault()}
            className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ImageIcon className="w-4 h-4" />
            )}
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="relative">
            <button
              type="button"
              title="Sisipkan Tabel"
              onClick={() => setIsTableMenuOpen((open) => !open)}
              onMouseDown={(e) => e.preventDefault()}
              className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-600 transition cursor-pointer"
            >
              <TableIcon className="w-4 h-4" />
            </button>

            {isTableMenuOpen && (
              <>
                <button
                  type="button"
                  aria-label="Tutup pemilih ukuran tabel"
                  className="fixed inset-0 z-40 w-full h-full cursor-default border-0 bg-transparent"
                  onClick={() => setIsTableMenuOpen(false)}
                />
                <div className="absolute z-50 top-full left-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl p-3">
                  <p className="text-xs font-semibold text-slate-600 mb-2 text-center">
                    {tableSize.rows > 0
                      ? `${tableSize.rows} × ${tableSize.cols} tabel`
                      : 'Pilih ukuran tabel'}
                  </p>
                  <div className="grid grid-cols-6 gap-1">
                    {Array.from({ length: 36 }, (_, i) => {
                      const row = Math.floor(i / 6) + 1;
                      const col = (i % 6) + 1;
                      const isActive = row <= tableSize.rows && col <= tableSize.cols;
                      return (
                        <button
                          type="button"
                          key={i}
                          aria-label={`${row} baris ${col} kolom`}
                          onMouseEnter={() => setTableSize({ rows: row, cols: col })}
                          onClick={() => handleInsertTable(row, col)}
                          className={cn(
                            'w-5 h-5 rounded border cursor-pointer transition-colors',
                            isActive ? 'bg-sky-400 border-sky-500' : 'bg-slate-100 border-slate-200'
                          )}
                        />
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
          <button
            type="button"
            title="Blok Kode"
            onClick={() => executeCommand('formatBlock', '<pre>')}
            className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-600 transition cursor-pointer"
          >
            <Code2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Hapus Pemformatan"
            onClick={() => executeCommand('removeFormat')}
            className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-600 transition cursor-pointer"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Document Canvas Area */}
      {variant === 'compact' ? (
        <div className="p-3 sm:p-4 bg-white overflow-auto">
          {/* biome-ignore lint/a11y/noStaticElementInteractions: editor contentEditable, klik hanya untuk seleksi gambar */}
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: editor contentEditable, keyboard ditangani native */}
          <div
            ref={editorRef}
            contentEditable={!readOnly}
            onInput={handleInput}
            onClick={handleEditorClick}
            suppressContentEditableWarning
            className={cn(
              'prose prose-slate max-w-none focus:outline-none text-xs sm:text-sm leading-relaxed text-slate-800 empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none',
              minHeight || 'min-h-[120px]'
            )}
            data-placeholder={placeholder}
          />
        </div>
      ) : (
        <div className="flex-1 bg-[#F4F7FA] p-4 sm:p-8 md:p-10 overflow-auto flex justify-center items-start min-h-[560px]">
          {/* Document Paper Sheet */}
          <div
            style={{ transform: `scale(${scale / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-200/70 p-6 sm:p-12 md:p-16 min-h-[640px] focus:outline-none transition-transform duration-200"
          >
            {/* biome-ignore lint/a11y/noStaticElementInteractions: editor contentEditable, klik hanya untuk seleksi gambar */}
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: editor contentEditable, keyboard ditangani native */}
            <div
              ref={editorRef}
              contentEditable={!readOnly}
              onInput={handleInput}
              onClick={handleEditorClick}
              suppressContentEditableWarning
              className={cn(
                'prose prose-slate max-w-none focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none',
                minHeight || 'min-h-[500px]'
              )}
              data-placeholder={placeholder}
            />
          </div>
        </div>
      )}

      {/* 4. Bottom Document Status Footer Bar */}
      {variant !== 'compact' && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-white select-none text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>{wordCount} kata</span>
            </div>
            <span className="text-slate-300">&bull;</span>
            <div className="flex items-center gap-1.5 text-teal-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span>Status Dokumen: Valid</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Skala Dokumen:</span>
              <select
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value={75}>75%</option>
                <option value={90}>90%</option>
                <option value={100}>100%</option>
                <option value={110}>110%</option>
                <option value={125}>125%</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-slate-700" />
              ) : (
                <Maximize2 className="w-4 h-4 text-slate-700" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Floating delete button for selected image */}
      {!readOnly && selectedImage && selectedImageRect && (
        <button
          type="button"
          onClick={handleDeleteSelectedImage}
          title="Hapus gambar"
          className="fixed z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold shadow-lg hover:bg-rose-700 transition cursor-pointer"
          style={{
            top: selectedImageRect.top + selectedImageRect.height / 2,
            left: selectedImageRect.left - 8,
            transform: 'translate(-100%, -50%)',
          }}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Hapus</span>
        </button>
      )}
    </div>
  );
};

export default RichTextEditor;
