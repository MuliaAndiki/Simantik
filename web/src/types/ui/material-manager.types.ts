import type { CreateLearningModuleRequest } from '@/types/service';

export type MaterialStatusType = 'PUBLISHED' | 'IN_REVIEW' | 'DRAFT';

export type InspectorViewMode = 'module_materials' | 'material_detail';

export interface ModuleItem {
  id: string;
  number: string;
  title: string;
  description: string;
  materialsCount: number;
  status: MaterialStatusType;
  updatedAt: string;
}

export interface MaterialObjectivePoint {
  id: number;
  title: string;
  desc: string;
}

export interface PreviewDocumentStructure {
  label: string;
  text: string;
}

export interface PreviewDocumentData {
  categoryBadge: string;
  chapterInfo: string;
  title: string;
  contentParagraph: string;
  structureTitle: string;
  structureItems: PreviewDocumentStructure[];
  curatorTip: string;
}

export interface CuratorAuditInfo {
  createdByName: string;
  curatorId: string;
  lastUpdated: string;
  documentVersion: string;
}

export interface MaterialItem {
  id: string;
  number: string;
  code: string;
  fase: string;
  title: string;
  pagesInfo: string;
  category: string;
  status: MaterialStatusType;
  updatedAt: string;
  learningObjectives: MaterialObjectivePoint[];
  previewDocument: PreviewDocumentData;
  auditInfo: CuratorAuditInfo;
}

export interface MaterialStats {
  totalMaterials: number;
  draftCount: number;
  reviewCount: number;
  publishedCount: number;
}

export interface MaterialFilterState {
  search: string;
  category: string;
  status: string;
  page: number;
  perPage: number;
}

export type ModuleDialogForm = CreateLearningModuleRequest & {
  id?: string;
  description: string;
  label: string;
  status: MaterialStatusType;
};
