export interface MaterialMetadata {
  judulMateri: string;
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
  topics: RelevantTopicTag[];
  saveStatus: DocumentSaveStatus;
  wordCount: number;
  documentScale: number;
}
