import React from 'react';
import { cn } from '@/utils/classname';
import { isHtml, sanitizeRichHtml } from '@/utils/wacana';

export interface RichHtmlProps {
  html?: string | null;
  className?: string;
  as?: 'div' | 'span';
}

// Paper render yang sama dengan halaman review/pembahasan:
// HTML dari RichTextEditor dirender sebagai HTML, teks polos tetap sebagai teks.
export const RichHtml: React.FC<RichHtmlProps> = ({ html, className, as: Component = 'div' }) => {
  if (!html) return null;
  const cleanContent = sanitizeRichHtml(html);
  if (!cleanContent) return null;

  if (!isHtml(cleanContent)) {
    return (
      <Component
        className={cn(
          'prose prose-slate prose-sm max-w-full break-words [overflow-wrap:anywhere] whitespace-pre-line leading-relaxed',
          className
        )}
      >
        {cleanContent}
      </Component>
    );
  }
  return (
    <Component
      className={cn(
        'prose prose-slate prose-sm max-w-full break-words [overflow-wrap:anywhere]',
        className
      )}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: rich text editor output, by design
      dangerouslySetInnerHTML={{ __html: cleanContent }}
    />
  );
};

export default RichHtml;
