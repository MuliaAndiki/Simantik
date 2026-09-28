'use client';

import { Camera, Check, Image as ImageIcon, Trash2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import type * as React from 'react';
import { useId, useRef, useState } from 'react';
import { Button, DialogClose, Input } from '@/components/atoms';
import { AmberDialogActions, ManagerFormDialogShell } from '@/components/molecules/dialog';
import { cn } from '@/utils/classname';

export interface ChangeAvatarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAvatarURL?: string;
  onSubmit: (avatar: string | File) => Promise<void> | void;
  isSubmitting?: boolean;
}

const PRESET_AVATARS = [
  '/avatars/1.png',
  '/avatars/2.png',
  '/avatars/3.png',
  '/avatars/4.png',
  '/avatars/5.png',
  '/avatars/6.png',
  '/avatars/7.png',
  '/avatars/8.png',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function ChangeAvatarModal({
  open,
  onOpenChange,
  currentAvatarURL = '/avatars/1.png',
  onSubmit,
  isSubmitting = false,
}: ChangeAvatarModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const customUrlId = useId();

  const [activeTab, setActiveTab] = useState<'upload' | 'preset'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>(currentAvatarURL);
  const [customURL, setCustomURL] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File) => {
    setErrorMessage(null);
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Format file harus berupa gambar (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('Ukuran file maksimal adalah 5MB.');
      return;
    }

    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setFilePreview(previewUrl);
    setCustomURL('');
  };

  const handleRemoveFile = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSelectPreset = (url: string) => {
    setSelectedPreset(url);
    setCustomURL('');
    handleRemoveFile();
  };

  const handleCustomURLChange = (val: string) => {
    setCustomURL(val);
    handleRemoveFile();
  };

  const handleClose = () => {
    handleRemoveFile();
    setErrorMessage(null);
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      if (activeTab === 'upload' && selectedFile) {
        await onSubmit(selectedFile);
      } else if (customURL.trim() !== '') {
        await onSubmit(customURL.trim());
      } else if (selectedPreset) {
        await onSubmit(selectedPreset);
      }
      handleClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Terjadi kesalahan saat mengunggah foto profil.';
      setErrorMessage(msg);
    }
  };

  const canSubmit =
    (activeTab === 'upload' && selectedFile !== null) ||
    (activeTab === 'preset' && (selectedPreset !== '' || customURL.trim() !== ''));

  return (
    <ManagerFormDialogShell
      open={open}
      onOpenChange={onOpenChange}
      icon={<Camera className="size-5 text-teal-600 stroke-[2.2]" />}
      iconBoxClassName="bg-[#EAF6F6] text-teal-600 border-teal-100/60"
      headerExtra={
        <DialogClose asChild>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="size-5" />
          </button>
        </DialogClose>
      }
      title="Ubah Foto Profil"
      description="Unggah foto kamu ke Cloudflare R2 atau gunakan pilihan avatar karakter SIMANTIK."
      error={errorMessage}
      onSubmit={handleSubmit}
      formClassName="mt-5 space-y-4 text-left"
    >
      {/* Mode Selector Tabs */}
      <div className="flex rounded-xl bg-gray-100/80 p-1 mt-5">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={cn(
            'flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer',
            activeTab === 'upload'
              ? 'bg-white text-gray-900 shadow-2xs'
              : 'text-gray-500 hover:text-gray-800'
          )}
        >
          Unggah Foto
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preset')}
          className={cn(
            'flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer',
            activeTab === 'preset'
              ? 'bg-white text-gray-900 shadow-2xs'
              : 'text-gray-500 hover:text-gray-800'
          )}
        >
          Avatar Karakter
        </button>
      </div>

      {activeTab === 'upload' ? (
        /* Upload File Area */
        <div className="space-y-3">
          {filePreview ? (
            /* Selected File Preview Box */
            <div className="p-4 rounded-2xl border border-teal-200 bg-[#F0FDFA] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative size-14 rounded-full overflow-hidden border-2 border-teal-500 shadow-xs shrink-0">
                  <Image
                    src={filePreview}
                    alt="Preview Foto Baru"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-800 truncate">{selectedFile?.name}</p>
                  <p className="text-[11px] text-teal-700 font-medium">
                    {selectedFile ? (selectedFile.size / 1024).toFixed(1) : 0} KB
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                className="h-8 w-8 p-0 rounded-full text-gray-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                title="Hapus foto terpilih"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ) : (
            /* Drag & Drop Input Zone */
            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                'border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors block',
                isDragging
                  ? 'border-teal-500 bg-teal-50/50'
                  : 'border-gray-200 hover:border-teal-400 bg-gray-50/50'
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />

              <div className="size-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100 mb-2.5 mx-auto">
                <Upload className="size-5 stroke-[2.2]" />
              </div>

              <p className="text-xs font-semibold text-gray-800">
                Klik untuk memilih foto atau seret ke sini
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                Format: JPG, PNG, atau WEBP (Maksimal 5MB)
              </p>
            </label>
          )}
        </div>
      ) : (
        /* Preset Avatars & Custom URL */
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-700">
              Pilihan Avatar Karakter
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {PRESET_AVATARS.map((avatarPath) => {
                const isSelected = selectedPreset === avatarPath && !customURL;
                return (
                  <button
                    key={avatarPath}
                    type="button"
                    onClick={() => handleSelectPreset(avatarPath)}
                    className={cn(
                      'relative aspect-square rounded-2xl p-1.5 border-2 transition-all cursor-pointer bg-[#F0FDFA]',
                      isSelected
                        ? 'border-teal-600 ring-2 ring-teal-500/30 scale-105'
                        : 'border-transparent hover:border-teal-200'
                    )}
                  >
                    <div className="relative size-full overflow-hidden rounded-xl">
                      <Image
                        src={avatarPath}
                        alt="Preset Avatar"
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    {isSelected && (
                      <div className="absolute top-1 right-1 size-4 bg-teal-600 rounded-full flex items-center justify-center text-white">
                        <Check className="size-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom URL Field */}
          <div className="space-y-1.5">
            <label htmlFor={customUrlId} className="block text-xs font-semibold text-gray-700">
              Atau Gunakan URL Gambar Eksternal
            </label>
            <div className="relative">
              <Input
                id={customUrlId}
                type="url"
                value={customURL}
                onChange={(e) => handleCustomURLChange(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="pr-10 h-10 rounded-xl border-gray-200 bg-white text-xs focus-visible:ring-teal-500/30"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <ImageIcon className="size-4" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <AmberDialogActions
        onCancel={handleClose}
        submitDisabled={!canSubmit}
        isSubmitting={isSubmitting}
        submitLabel={activeTab === 'upload' ? 'Unggah & Simpan' : 'Simpan Foto'}
        submittingLabel={activeTab === 'upload' ? 'Mengunggah ke R2...' : 'Menyimpan...'}
        cancelClassName="border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium shadow-2xs"
      />
    </ManagerFormDialogShell>
  );
}

export default ChangeAvatarModal;
