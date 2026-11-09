'use client';

import { BookMarked, Plus, Share2, SlidersHorizontal, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import type { LearningObjectiveItem, PreviewDocumentStructure, RelevantTopicTag } from '@/types/ui';
import { cn } from '@/utils/classname';

export interface MaterialObjectivesAndTagsCardProps {
  objectives?: LearningObjectiveItem[];
  structureItems?: PreviewDocumentStructure[];
  topics?: RelevantTopicTag[];
  isAddingTopic?: boolean;
  newTopicInput?: string;
  onNewTopicInputChange?: (val: string) => void;
  onStartAddTopic?: () => void;
  onCancelAddTopic?: () => void;
  onConfirmAddTopic?: () => void;
  onRemoveTopic?: (id: string) => void;
  onAddObjective?: (text: string) => void;
  onRemoveObjective?: (id: string) => void;
  onAddStructureItem?: (label: string, text: string) => void;
  onRemoveStructureItem?: (index: number) => void;
  className?: string;
}

export const MaterialObjectivesAndTagsCard: React.FC<MaterialObjectivesAndTagsCardProps> = ({
  objectives = [],
  structureItems = [],
  topics = [],
  isAddingTopic = false,
  newTopicInput = '',
  onNewTopicInputChange,
  onStartAddTopic,
  onCancelAddTopic,
  onConfirmAddTopic,
  onRemoveTopic,
  onAddObjective,
  onRemoveObjective,
  onAddStructureItem,
  onRemoveStructureItem,
  className,
}) => {
  // Local state for adding an objective
  const [isAddingObjective, setIsAddingObjective] = useState(false);
  const [objectiveInput, setObjectiveInput] = useState('');

  // Local state for adding a structure item (Pokok Bahasan / Pendalaman)
  const [isAddingStructure, setIsAddingStructure] = useState(false);
  const [structureLabel, setStructureLabel] = useState('');
  const [structureText, setStructureText] = useState('');

  const handleStartAddStructure = () => {
    setIsAddingStructure(true);
    const nextIdx = structureItems.length + 1;
    setStructureLabel(`${nextIdx}. Pokok Bahasan:`);
    setStructureText('');
  };

  const handleConfirmObjective = () => {
    if (objectiveInput.trim()) {
      onAddObjective?.(objectiveInput.trim());
      setObjectiveInput('');
      setIsAddingObjective(false);
    }
  };

  const handleConfirmStructure = () => {
    if (structureLabel.trim() && structureText.trim()) {
      onAddStructureItem?.(structureLabel.trim(), structureText.trim());
      setStructureLabel('');
      setStructureText('');
      setIsAddingStructure(false);
    }
  };

  return (
    <div
      className={cn(
        'w-full bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-2xs space-y-7 select-none',
        className
      )}
    >
      {/* 1. Tujuan Pembelajaran */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-wider uppercase">
              Tujuan Pembelajaran (Capaian)
            </h3>
          </div>

          {!isAddingObjective && (
            <button
              type="button"
              onClick={() => setIsAddingObjective(true)}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Capaian</span>
            </button>
          )}
        </div>

        {/* Input Form for Objective */}
        {isAddingObjective && (
          <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-2.5">
            <textarea
              rows={2}
              value={objectiveInput}
              onChange={(e) => setObjectiveInput(e.target.value)}
              placeholder="Contoh: Peserta didik mampu mengidentifikasi struktur teks eksplanasi dengan akurat..."
              className="w-full text-xs bg-white border border-sky-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium text-slate-800 resize-none leading-relaxed"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddingObjective(false);
                  setObjectiveInput('');
                }}
                className="px-3 py-1.5 text-slate-500 hover:text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmObjective}
                disabled={!objectiveInput.trim()}
                className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                Simpan Capaian
              </button>
            </div>
          </div>
        )}

        {/* Objectives List */}
        <div className="bg-[#F4F9FD] border border-sky-100/80 rounded-2xl p-4 sm:p-5 space-y-2.5">
          {objectives.length === 0 ? (
            <p className="text-xs text-slate-400 italic">
              Belum ada tujuan pembelajaran. Klik "Tambah Capaian" untuk menambahkan butir capaian
              pembelajaran.
            </p>
          ) : (
            objectives.map((item, idx) => (
              <div
                key={item.id || idx}
                className="group flex items-start justify-between gap-3 p-2 rounded-xl hover:bg-white/70 transition"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-2 shrink-0" />
                  <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed break-words">
                    {item.text}
                  </p>
                </div>
                {onRemoveObjective && (
                  <button
                    type="button"
                    onClick={() => onRemoveObjective(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer shrink-0"
                    title="Hapus butir capaian"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. Struktur Modul Ajar (Pokok Bahasan & Pendalaman) */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-wider uppercase">
              Struktur Modul Ajar (Pokok Bahasan)
            </h3>
          </div>

          {!isAddingStructure && (
            <button
              type="button"
              onClick={handleStartAddStructure}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Pokok Bahasan</span>
            </button>
          )}
        </div>

        {/* Input Form for Structure Item */}
        {isAddingStructure && (
          <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-2.5">
            <div>
              <label className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block mb-1">
                Label Pokok Bahasan
              </label>
              <input
                type="text"
                value={structureLabel}
                onChange={(e) => setStructureLabel(e.target.value)}
                placeholder="Contoh: 1. Pokok Bahasan: atau 2. Pendalaman Materi:"
                className="w-full text-xs bg-white border border-teal-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-600 font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block mb-1">
                Uraian Pokok Bahasan
              </label>
              <textarea
                rows={2}
                value={structureText}
                onChange={(e) => setStructureText(e.target.value)}
                placeholder="Contoh: Konsep dasar dan analisis wacana komprehensif..."
                className="w-full text-xs bg-white border border-teal-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-teal-600 font-medium text-slate-800 resize-none leading-relaxed"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsAddingStructure(false);
                  setStructureLabel('');
                  setStructureText('');
                }}
                className="px-3 py-1.5 text-slate-500 hover:text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmStructure}
                disabled={!structureLabel.trim() || !structureText.trim()}
                className="px-3.5 py-1.5 bg-[#134653] hover:bg-[#0B2D38] text-white text-xs font-bold rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                Simpan Pokok Bahasan
              </button>
            </div>
          </div>
        )}

        {/* Structure Items List */}
        <div className="bg-[#FAFDFE] border border-teal-100 rounded-2xl p-4 sm:p-5 space-y-2.5">
          {structureItems.length === 0 ? (
            <p className="text-xs text-slate-400 italic">
              Belum ada pokok bahasan terdaftar. Klik "Tambah Pokok Bahasan" untuk menyusun pokok
              bahasan materi ini.
            </p>
          ) : (
            structureItems.map((item, idx) => (
              <div
                key={`${item.label}-${idx}`}
                className="group flex items-start justify-between gap-3 p-2 rounded-xl hover:bg-white/80 transition"
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-700 mt-2 shrink-0" />
                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <strong className="text-slate-900 font-bold">{item.label} </strong>
                    <span>{item.text}</span>
                  </div>
                </div>
                {onRemoveStructureItem && (
                  <button
                    type="button"
                    onClick={() => onRemoveStructureItem(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer shrink-0"
                    title="Hapus pokok bahasan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. Materi Terkait (Topik Relevan) */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-wider uppercase">
              Materi Terkait (Topik Relevan)
            </h3>
          </div>

          {!isAddingTopic && (
            <button
              type="button"
              onClick={onStartAddTopic}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Topik</span>
            </button>
          )}
        </div>

        {/* Input box when adding new topic */}
        {isAddingTopic && (
          <div className="flex items-center gap-2 pt-1 max-w-sm">
            <input
              type="text"
              value={newTopicInput}
              onChange={(e) => onNewTopicInputChange?.(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onConfirmAddTopic?.();
                } else if (e.key === 'Escape') {
                  onCancelAddTopic?.();
                }
              }}
              placeholder="Nama topik baru..."
              className="flex-1 text-xs bg-sky-50 border border-sky-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500 font-semibold text-slate-800"
            />
            <button
              type="button"
              onClick={onConfirmAddTopic}
              className="px-3 py-1.5 bg-sky-600 text-white text-xs font-bold rounded-xl hover:bg-sky-700 transition cursor-pointer"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={onCancelAddTopic}
              className="px-2 py-1.5 text-slate-400 hover:text-slate-600 text-xs transition cursor-pointer"
            >
              Batal
            </button>
          </div>
        )}

        {/* Tags List */}
        <div className="flex items-center flex-wrap gap-2.5">
          {topics.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Belum ada topik terkait.</p>
          ) : (
            topics.map((tag) => (
              <div
                key={tag.id}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F0F8FF] hover:bg-[#E2F0FE] border border-sky-200/80 text-sky-900 text-xs font-semibold transition"
              >
                <span>{tag.label}</span>
                <button
                  type="button"
                  onClick={() => onRemoveTopic?.(tag.id)}
                  className="text-sky-500 hover:text-rose-600 transition cursor-pointer p-0.5"
                  title={`Hapus ${tag.label}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialObjectivesAndTagsCard;
