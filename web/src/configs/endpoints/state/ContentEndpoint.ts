import { mountEntry } from '@/utils/mount.entry';

export const ContentEndpoint = {
  cmsNews: `${mountEntry.cms}/news`,
  cmsNewsDetail: (id: string) => `${mountEntry.cms}/news/${id}`,
  cmsNewsStatus: (id: string) => `${mountEntry.cms}/news/${id}/status`,
  cmsDocumentation: `${mountEntry.cms}/documentation`,
  cmsDocumentationDetail: (id: string) => `${mountEntry.cms}/documentation/${id}`,
  cmsDocumentationStatus: (id: string) => `${mountEntry.cms}/documentation/${id}/status`,
  cmsTutorials: `${mountEntry.cms}/tutorials`,
  cmsTutorialDetail: (id: string) => `${mountEntry.cms}/tutorials/${id}`,
  tutorialStatus: (id: string) => `${mountEntry.cms}/tutorials/${id}/status`,
  cmsTestimonials: `${mountEntry.cms}/testimonials`,
  cmsTestimonialStatus: (id: string) => `${mountEntry.cms}/testimonials/${id}/status`,
  cmsTestimonialDelete: (id: string) => `${mountEntry.cms}/testimonials/${id}`,
  news: `${mountEntry.news}`,
  newsBySlug: (slug: string) => `${mountEntry.news}/${slug}`,
  documentation: `${mountEntry.documentation}`,
  documentationBySlug: (slug: string) => `${mountEntry.documentation}/${slug}`,
  tutorials: `${mountEntry.tutorials}`,
  tutorialBySlug: (slug: string) => `${mountEntry.tutorials}/${slug}`,
  testimonials: `${mountEntry.testimonials}`,
} as const;
