import React from 'react';
import { cn } from '@/utils/classname';
import { isHtml } from '@/utils/wacana';

export interface RichHtmlProps {
  html?: string | null;
  className?: string;
}

// Paper render yang sama dengan halaman review/pembahasan:
// HTML dari RichTextEditor dirender sebagai HTML, teks polos tetap sebagai teks.
export const RichHtml: React.FC<RichHtmlProps> = ({ html, className }) => {
  if (!html) return null;
  if (!isHtml(html)) return <>{html}</>;
  return (
    <div
      className={cn('prose prose-slate prose-sm max-w-none break-words', className)}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: rich text editor output, by design
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default RichHtml;
