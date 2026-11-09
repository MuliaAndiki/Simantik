import { describe, expect, it } from 'bun:test';
import { isHtml, parseWacanaQuestion, sanitizeRichHtml } from './wacana';

describe('wacana utilities', () => {
  it('detects html strings correctly', () => {
    expect(isHtml('<p>Teks</p>')).toBe(true);
    expect(isHtml('<div><span>Teks</span></div>')).toBe(true);
    expect(isHtml('Teks polos tanpa tag')).toBe(false);
    expect(isHtml('')).toBe(false);
    expect(isHtml(null)).toBe(false);
  });

  it('parses wacana question with stimulus', () => {
    const raw = '[WACANA: Laut Kita]\n<p>Paragraf stimulus.</p>\n\n<p>Pertanyaan ini?</p>';
    const parsed = parseWacanaQuestion(raw);
    expect(parsed.hasStimulus).toBe(true);
    expect(parsed.stimulusTitle).toBe('Laut Kita');
    expect(parsed.stimulusHtml).toBe('<p>Paragraf stimulus.</p>');
    expect(parsed.bodyHtml).toBe('<p>Pertanyaan ini?</p>');
  });

  it('sanitizes dirty Word html with line-height: 1.15px and font tags', () => {
    const dirty =
      '<ol type="A" style="color: rgb(0, 0, 0); font-size: medium;"><li><p style="line-height: 1.15px; margin-bottom: 0in; direction: ltr;"><font color="#000000"><font face="Aptos, serif">Sampah plastik di laut akan lebih banyak daripada jumlah ikan.</font></font></p></li></ol>';

    const cleaned = sanitizeRichHtml(dirty);
    expect(cleaned).not.toContain('line-height: 1.15px');
    expect(cleaned).not.toContain('<font');
    expect(cleaned).not.toContain('</font>');
    expect(cleaned).not.toContain('<ol');
    expect(cleaned).toContain('Sampah plastik di laut akan lebih banyak daripada jumlah ikan.');
  });
});
