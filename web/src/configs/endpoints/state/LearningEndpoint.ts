import { mountEntry } from '@/utils/mount.entry';

export const LearningEndpoint = {
  modules: `${mountEntry.learningModules}`,
  moduleLabels: `${mountEntry.learningModules}/labels`,
  moduleDetail: (id: string) => `${mountEntry.learningModules}/${id}`,
  moduleStatus: (id: string) => `${mountEntry.learningModules}/${id}/status`,
  moduleProgress: (id: string) => `${mountEntry.learningModules}/${id}/progress`,
  materials: `${mountEntry.materials}`,
  materialDetail: (id: string) => `${mountEntry.materials}/${id}`,
  materialStatus: (id: string) => `${mountEntry.materials}/${id}/status`,
  materialProgress: (id: string) => `${mountEntry.materials}/${id}/progress`,
  myProgress: `${mountEntry.learningProgress}`,
} as const;
