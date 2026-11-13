export const DEFAULT_COMPETENCY_FALLBACK = 'Umum';
export const ALL_COMPETENCY_FILTER_VALUE = 'Semua Kompetensi';
export const UNCATEGORIZED_COMPETENCY_FILTER_VALUE = 'uncategorized';

export interface CompetencyOptionItem {
  id: string;
  code?: string;
  name: string;
  description?: string;
}

export interface CreateCompetencyInput {
  name: string;
  code?: string;
  description?: string;
}

/** Resolves a nullable/empty competency name to the shared neutral fallback label. */
export function resolveCompetencyName(
  name?: string | null,
  fallback = DEFAULT_COMPETENCY_FALLBACK
): string {
  const trimmed = name?.trim();
  return trimmed ? trimmed : fallback;
}

/** Maps a UI competency filter value into API filter params (`competency_id` or `uncategorized`). */
export function mapCompetencyFilterValue(filterValue?: string | null): {
  competency_id?: string;
  uncategorized?: boolean;
} {
  if (!filterValue || filterValue === ALL_COMPETENCY_FILTER_VALUE || filterValue === 'all') {
    return {};
  }
  if (filterValue === UNCATEGORIZED_COMPETENCY_FILTER_VALUE) {
    return { uncategorized: true };
  }
  return { competency_id: filterValue };
}

/** Returns fallback if the active competency ID matches a newly deleted competency ID. */
export function resetIdIfDeleted(
  currentId: string | null | undefined,
  deletedId: string,
  fallback = ''
): string {
  if (!currentId || currentId === deletedId) {
    return currentId === deletedId ? fallback : '';
  }
  return currentId;
}

/** Clears deleted competency references across an array of question items without altering content. */
export function clearDeletedCompetencyFromQuestions<T extends { competencyId?: string }>(
  questions: T[],
  deletedId: string
): T[] {
  return questions.map((item) =>
    item.competencyId === deletedId ? { ...item, competencyId: '' } : item
  );
}

/** Finds a competency option by its ID safely. */
export function findCompetencyById(
  competencies: CompetencyOptionItem[],
  id?: string | null
): CompetencyOptionItem | undefined {
  if (!id) return undefined;
  return competencies.find((item) => item.id === id);
}
