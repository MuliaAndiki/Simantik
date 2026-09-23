import React from 'react';
import { RichTextEditor } from '@/components/molecules/editor';

interface NewsCreateEditorCardProps {
  content: string;
  onChange: (content: string) => void;
  onUploadImage: (file: File) => Promise<string>;
  onDeleteImage: (url: string) => Promise<void>;
}

export const NewsCreateEditorCard: React.FC<NewsCreateEditorCardProps> = ({
  content,
  onChange,
  onUploadImage,
  onDeleteImage,
}) => {
  return (
    <div className="w-full">
      <RichTextEditor
        value={content}
        onChange={onChange}
        onUploadImage={onUploadImage}
        onDeleteImage={onDeleteImage}
        variant="compact"
        placeholder="Mulai menulis isi berita..."
        minHeight="min-h-[320px]"
      />
    </div>
  );
};

export default NewsCreateEditorCard;
