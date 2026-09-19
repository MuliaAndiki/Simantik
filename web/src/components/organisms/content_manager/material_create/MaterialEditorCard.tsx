import React from 'react';
import { RichTextEditor } from '@/components/molecules/editor';
import { cn } from '@/utils/classname';

export interface MaterialEditorCardProps {
  content?: string;
  onChange?: (content: string) => void;
  onWordCountChange?: (count: number) => void;
  className?: string;
}

export const MaterialEditorCard: React.FC<MaterialEditorCardProps> = ({
  content,
  onChange,
  onWordCountChange,
  className,
}) => {
  return (
    <div className={cn('w-full', className)}>
      <RichTextEditor value={content} onChange={onChange} onWordCountChange={onWordCountChange} />
    </div>
  );
};

export default MaterialEditorCard;
