// ponytail: single regex shared by student practice/tryout + content_manager parsers.
// Format saved by editors: `[WACANA: <title>]\n<stimulus HTML>\n\n<question HTML>`
const WACANA_REGEX = /^\[WACANA:\s*(.*?)\]\n([\s\S]*?)\n\n([\s\S]*)$/;

export interface ParsedWacana {
  hasStimulus: boolean;
  stimulusTitle?: string;
  stimulusHtml?: string;
  bodyHtml: string;
}

export function parseWacanaQuestion(raw?: string | null): ParsedWacana {
  const text = raw ?? '';
  const match = text.match(WACANA_REGEX);
  if (!match) return { hasStimulus: false, bodyHtml: text };
  return {
    hasStimulus: true,
    stimulusTitle: match[1]?.trim() || undefined,
    stimulusHtml: match[2]?.trim() || undefined,
    bodyHtml: (match[3] ?? '').trim(),
  };
}

export function isHtml(value?: string | null): boolean {
  if (!value) return false;
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

// Marker kunci matriks yang ditanam content_manager di option_text,
// mis. "adsasd [KUNCI: SETUJU]". Sama dengan deteksi di TryoutQuestionContainer.
const KUNCI_REGEX =
  /^(.*?)\s*\[KUNCI:\s*(BENAR|SALAH|TEPAT|TIDAK[ _]?TEPAT|SETUJU|TIDAK[ _]?SETUJU)\]\s*$/i;

export type MatrixKind = 'benar-salah' | 'tepat-tidak-tepat' | 'setuju-tidak-setuju';

export interface ParsedMatrixStatement {
  id: string;
  label: string;
  statement: string;
  // Kunci ternormalisasi: BENAR/SALAH/TEPAT/TIDAK_TEPAT/SETUJU/TIDAK_SETUJU ('' bila tanpa marker)
  key: string;
}

export interface ParsedMatrix {
  kind: MatrixKind;
  statements: ParsedMatrixStatement[];
}

export function parseMatrixOptions(
  options: { id?: string; option_label?: string; option_text?: string }[] | undefined | null
): ParsedMatrix | null {
  if (!options || options.length === 0) return null;
  if (!options.some((o) => KUNCI_REGEX.test(o.option_text ?? ''))) return null;

  const statements: ParsedMatrixStatement[] = options.map((o, idx) => {
    const match = (o.option_text ?? '').match(KUNCI_REGEX);
    return {
      id: o.id || `m-${idx + 1}`,
      label: o.option_label || String.fromCharCode(65 + idx),
      statement:
        (match ? match[1].trim() : (o.option_text ?? '').trim()) || `Pernyataan ${idx + 1}`,
      key: match ? match[2].toUpperCase().replace(/\s+/g, '_') : '',
    };
  });

  const keys = options.map((o) => {
    const match = (o.option_text ?? '').match(KUNCI_REGEX);
    return (match?.[2] ?? 'BENAR').toUpperCase().replace(/\s+/g, '_');
  });

  let kind: MatrixKind = 'benar-salah';
  if (keys.some((k) => k === 'TEPAT' || k === 'TIDAK_TEPAT')) kind = 'tepat-tidak-tepat';
  else if (keys.some((k) => k === 'SETUJU' || k === 'TIDAK_SETUJU')) kind = 'setuju-tidak-setuju';

  return { kind, statements };
}
