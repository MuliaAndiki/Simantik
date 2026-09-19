import { HelpCircle } from 'lucide-react';
import type React from 'react';
import { QuestionEditor } from '@/components/molecules/editor';

export interface PracticeStemSectionProps {
  questionText: string;
  onQuestionTextChange: (text: string) => void;
  onUploadImage?: (file: File) => Promise<string>;
  onDeleteImage?: (url: string) => Promise<void>;
}

export const PracticeStemSection: React.FC<PracticeStemSectionProps> = ({
  questionText,
  onQuestionTextChange,
  onUploadImage,
  onDeleteImage,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <HelpCircle className="w-4 h-4 text-slate-500" />
        <h3 className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide">
          Section 2: Pertanyaan (Stem Soal) <span className="text-rose-500">*</span>
        </h3>
      </div>

      <QuestionEditor
        value={questionText}
        onChange={onQuestionTextChange}
        onUploadImage={onUploadImage}
        onDeleteImage={onDeleteImage}
        placeholder="Tuliskan pokok pertanyaan atau instruksi soal di sini..."
        minHeight="min-h-[120px]"
      />
    </div>
  );
};

export default PracticeStemSection;
