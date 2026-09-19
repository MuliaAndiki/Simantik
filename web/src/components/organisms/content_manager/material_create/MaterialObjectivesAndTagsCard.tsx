import { Plus, Share2, SlidersHorizontal, X } from 'lucide-react';
import React from 'react';
import type { LearningObjectiveItem, RelevantTopicTag } from '@/types/ui';
import { cn } from '@/utils/classname';

export interface MaterialObjectivesAndTagsCardProps {
  objectives?: LearningObjectiveItem[];
  topics?: RelevantTopicTag[];
  isAddingTopic?: boolean;
  newTopicInput?: string;
  onNewTopicInputChange?: (val: string) => void;
  onStartAddTopic?: () => void;
  onCancelAddTopic?: () => void;
  onConfirmAddTopic?: () => void;
  onRemoveTopic?: (id: string) => void;
  className?: string;
}

const DEFAULT_OBJECTIVES: LearningObjectiveItem[] = [
  {
    id: '1',
    text: 'Peserta didik mampu mengidentifikasi struktur teks eksplanasi dengan tingkat akurasi 85%.',
  },
  {
    id: '2',
    text: 'Peserta didik mampu menganalisis hubungan kausalitas dan kronologi dalam wacana faktual.',
  },
  {
    id: '3',
    text: 'Peserta didik mampu membedakan konjungsi waktu dengan konjungsi sebab-akibat.',
  },
];

const DEFAULT_TOPICS: RelevantTopicTag[] = [
  { id: '1', label: 'Teks Prosedur Kompleks' },
  { id: '2', label: 'Konjungsi Subordinatif' },
  { id: '3', label: 'Paragraf Sebab-Akibat' },
  { id: '4', label: 'Fase F SMA' },
];

export const MaterialObjectivesAndTagsCard: React.FC<MaterialObjectivesAndTagsCardProps> = ({
  objectives = DEFAULT_OBJECTIVES,
  topics = DEFAULT_TOPICS,
  isAddingTopic = false,
  newTopicInput = '',
  onNewTopicInputChange,
  onStartAddTopic,
  onCancelAddTopic,
  onConfirmAddTopic,
  onRemoveTopic,
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-2xs space-y-6 select-none',
        className
      )}
    >
      {/* 1. Tujuan Pembelajaran */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-700" />
          <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-wider uppercase">
            Tujuan Pembelajaran
          </h3>
        </div>

        <div className="bg-[#F4F9FD] border border-sky-100/80 rounded-2xl p-5 space-y-2.5">
          {objectives.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-2 shrink-0" />
              <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Materi Terkait (Topik Relevan) */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
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
          {topics.map((tag) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaterialObjectivesAndTagsCard;
