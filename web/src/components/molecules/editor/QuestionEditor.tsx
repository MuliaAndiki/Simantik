'use client';

import { Bold, Image as ImageIcon, Italic, Loader2, Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/classname';

export interface QuestionEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  onUploadImage?: (file: File) => Promise<string>;
  onDeleteImage?: (url: string) => Promise<void>;
  placeholder?: string;
  minHeight?: string;
  className?: string;
  readOnly?: boolean;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  value = '',
  onChange,
  onUploadImage,
  onDeleteImage,
  placeholder = 'Tuliskan teks di sini...',
  minHeight = 'min-h-[100px]',
  className,
  readOnly = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isReplacingRef = useRef<boolean>(false);
  const savedSelectionRef = useRef<Range | null>(null);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [selectedImageRect, setSelectedImageRect] = useState<DOMRect | null>(null);

  // Sync external value with editor innerHTML
  useEffect(() => {
    if (editorRef.current) {
      const nextHtml = value ?? '';
      if (editorRef.current.innerHTML !== nextHtml) {
        isReplacingRef.current = true;
        editorRef.current.innerHTML = nextHtml;
        setTimeout(() => {
          isReplacingRef.current = false;
        }, 50);
      }
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange?.(html);
    }
  }, [onChange]);

  const executeCommand = (command: string) => {
    if (readOnly) return;
    document.execCommand(command, false);
    editorRef.current?.focus();
    handleInput();
  };

  const handleImageButtonClick = () => {
    if (readOnly || isUploading) return;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelectionRef.current = selection.getRangeAt(0);
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadImage) return;

    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar (JPG, PNG, WEBP, dll)');
      return;
    }

    try {
      setIsUploading(true);
      const url = await onUploadImage(file);

      // Restore cursor selection if available
      if (savedSelectionRef.current) {
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(savedSelectionRef.current);
      } else {
        editorRef.current?.focus();
      }

      const imgHtml = `<img src="${url}" alt="${file.name}" class="max-w-full h-auto rounded-xl my-2" />`;
      document.execCommand('insertHTML', false, imgHtml);
      handleInput();
    } catch (err) {
      console.error('Gagal mengunggah gambar:', err);
    } finally {
      setIsUploading(false);
      savedSelectionRef.current = null;
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearSelection = () => {
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
      clearSelection();
    }
  };

  const handleDeleteSelectedImage = async () => {
    if (!selectedImage) return;
    const src = selectedImage.src;
    selectedImage.remove();
    clearSelection();
    handleInput();

    if (onDeleteImage && src) {
      try {
        await onDeleteImage(src);
      } catch (err) {
        console.error('Gagal menghapus gambar:', err);
      }
    }
  };

  useEffect(() => {
    if (!selectedImage) return;
    const handleScrollOrResize = () => {
      clearSelection();
    };
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [selectedImage]);

  return (
    <div
      className={cn(
        'w-full bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden focus-within:border-cyan-600 focus-within:ring-2 focus-within:ring-cyan-500/20 transition',
        className
      )}
    >
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Focused Toolbar: Bold, Italic, Upload Image */}
      {!readOnly && (
        <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-50/90 border-b border-slate-100 text-slate-600 select-none">
          <button
            type="button"
            onClick={() => executeCommand('bold')}
            className="p-1.5 hover:bg-white hover:text-slate-900 rounded-lg font-black text-xs transition cursor-pointer"
            title="Tebal (Bold)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('italic')}
            className="p-1.5 hover:bg-white hover:text-slate-900 rounded-lg italic font-serif text-xs transition cursor-pointer"
            title="Miring (Italic)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          <button
            type="button"
            onClick={handleImageButtonClick}
            disabled={isUploading}
            className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-slate-700 hover:text-cyan-700 hover:bg-white rounded-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Unggah Foto"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-600" />
                <span>Mengunggah...</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>Foto</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Editable Area */}
      <div className="p-3 sm:p-4">
        {/* biome-ignore lint/a11y/noStaticElementInteractions: contentEditable click to select images */}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: contentEditable handles keyboard typing */}
        <div
          ref={editorRef}
          contentEditable={!readOnly}
          onInput={handleInput}
          onClick={handleEditorClick}
          suppressContentEditableWarning
          className={cn(
            'focus:outline-none text-xs sm:text-sm text-slate-900 leading-relaxed empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none',
            minHeight
          )}
          data-placeholder={placeholder}
        />
      </div>

      {/* Floating Delete Button for Selected Image */}
      {!readOnly && selectedImage && selectedImageRect && (
        <button
          type="button"
          onClick={handleDeleteSelectedImage}
          title="Hapus gambar terpilih"
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

export default QuestionEditor;
