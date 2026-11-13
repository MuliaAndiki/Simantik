import type { PreviewDocumentStructure } from './material-manager.types';

export interface MaterialMetadata {
  judulMateri: string;
  competencyId?: string;
  kategoriPembelajaran: string;
  deskripsiRingkas: string;
  idDokumen: string;
}

export interface LearningObjectiveItem {
  id: string;
  text: string;
}

export interface RelevantTopicTag {
  id: string;
  label: string;
}

export type DocumentSaveStatus = 'saving' | 'saved' | 'error' | 'idle';

export interface MaterialEditorFormState {
  metadata: MaterialMetadata;
  content: string;
  objectives: LearningObjectiveItem[];
  structureItems: PreviewDocumentStructure[];
  topics: RelevantTopicTag[];
  saveStatus: DocumentSaveStatus;
  wordCount: number;
  documentScale: number;
}
