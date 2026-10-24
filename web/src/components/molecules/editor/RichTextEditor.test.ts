import { describe, expect, it } from 'bun:test';
import { cleanPastedHtml, formatTextToParagraphHtml } from './RichTextEditor';

describe('RichTextEditor Paragraph Processing', () => {
  it('converts multi-paragraph plain text into semantic <p> tags', () => {
    const rawText =
      'Paragraf pertama wacana bacaan.\n\nParagraf kedua wacana bacaan.\n\nParagraf ketiga kesimpulan.';
    const result = formatTextToParagraphHtml(rawText);

    expect(result).toBe(
      '<p>Paragraf pertama wacana bacaan.</p><p>Paragraf kedua wacana bacaan.</p><p>Paragraf ketiga kesimpulan.</p>'
    );
  });

  it('converts single line breaks within a paragraph to <br />', () => {
    const rawText =
      'Baris pertama dalam paragraf satu.\nBaris kedua dalam paragraf satu.\n\nParagraf kedua.';
    const result = formatTextToParagraphHtml(rawText);

    expect(result).toBe(
      '<p>Baris pertama dalam paragraf satu.<br />Baris kedua dalam paragraf satu.</p><p>Paragraf kedua.</p>'
    );
  });

  it('escapes HTML special characters when formatting plain text', () => {
    const rawText = 'Teks dengan <tag> & "kutipan".\n\nParagraf 2 > 1.';
    const result = formatTextToParagraphHtml(rawText);

    expect(result).toContain('&lt;tag&gt;');
    expect(result).toContain('&amp;');
    expect(result).toContain('&gt; 1.');
  });

  it('returns empty string for empty or whitespace-only text', () => {
    expect(formatTextToParagraphHtml('')).toBe('');
    expect(formatTextToParagraphHtml('   \n\n   ')).toBe('');
  });

  it('cleans inline styles from pasted HTML while preserving block structure', () => {
    const dirtyHtml =
      '<p style="margin-bottom:0pt;font-family:Arial;color:red;">Paragraf 1</p><p class="MsoNormal" style="line-height:1.2;">Paragraf 2</p>';
    const cleaned = cleanPastedHtml(dirtyHtml, 'Paragraf 1\n\nParagraf 2');

    expect(cleaned).toContain('<p>Paragraf 1</p>');
    expect(cleaned).toContain('<p>Paragraf 2</p>');
    expect(cleaned).not.toContain('margin-bottom');
    expect(cleaned).not.toContain('MsoNormal');
  });
});
