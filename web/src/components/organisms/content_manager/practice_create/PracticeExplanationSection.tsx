import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Image as ImageIcon,
  Italic,
  Lightbulb,
  Link as LinkIcon,
  List,
  ListOrdered,
  Underline,
} from 'lucide-react';
import type React from 'react';

export interface PracticeExplanationSectionProps {
  explanation: string;
  answeringTips?: string;
  onExplanationChange: (text: string) => void;
  onAnsweringTipsChange?: (text: string) => void;
}

export const PracticeExplanationSection: React.FC<PracticeExplanationSectionProps> = ({
  explanation,
  onExplanationChange,
}) => {
  return (
    <div className="space-y-2.5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-amber-500" />
        <h3 className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide">
          Section 5: Pembahasan Soal
        </h3>
      </div>

      {/* Editor Box */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden focus-within:border-cyan-600 focus-within:ring-2 focus-within:ring-cyan-500/20 transition">
        {/* Mini Formatting Toolbar */}
        <div className="flex items-center gap-0.5 p-2 bg-slate-50/80 border-b border-slate-100 text-slate-600">
          <button
            type="button"
            className="p-1.5 hover:bg-white rounded-lg transition text-slate-700 font-bold cursor-pointer"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 hover:bg-white rounded-lg transition text-slate-700 cursor-pointer"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 hover:bg-white rounded-lg transition text-slate-700 cursor-pointer"
            title="Underline"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-slate-200 mx-1" />

          <button
            type="button"
            className="p-1.5 hover:bg-white rounded-lg transition text-slate-600 cursor-pointer"
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 hover:bg-white rounded-lg transition text-slate-600 cursor-pointer"
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 hover:bg-white rounded-lg transition text-slate-600 cursor-pointer"
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-slate-200 mx-1" />

          <button
            type="button"
            className="p-1.5 hover:bg-white rounded-lg transition text-slate-600 cursor-pointer"
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 hover:bg-white rounded-lg transition text-slate-600 cursor-pointer"
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 hover:bg-white rounded-lg transition text-slate-600 cursor-pointer"
            title="Link"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 hover:bg-white rounded-lg transition text-slate-600 cursor-pointer"
            title="Image"
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Text Area */}
        <textarea
          rows={5}
          value={explanation}
          onChange={(e) => onExplanationChange(e.target.value)}
          placeholder="Tuliskan telaah kunci jawaban, penalaran logis, dan pembahasan akademik terperinci di sini..."
          className="w-full p-4 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed placeholder:text-slate-400 focus:outline-none resize-none"
        />
      </div>
    </div>
  );
};

export default PracticeExplanationSection;
