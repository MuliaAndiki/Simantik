import {
  useCreateDocumentation,
  useCreateNews,
  useCreateTestimonial,
  useDeleteDocumentation,
  useDeleteNews,
  useDeleteTestimonial,
  useUpdateDocumentation,
  useUpdateDocumentationStatus,
  useUpdateNews,
  useUpdateNewsStatus,
  useUpdateTestimonialStatus,
} from './state/mutate';
import {
  useCmsDocumentationDetail,
  useCmsDocumentationList,
  useCmsNewsDetail,
  useCmsNewsList,
  useCmsTestimonialsList,
  usePublicDocumentationBySlug,
  usePublicDocumentationList,
  usePublicNewsBySlug,
  usePublicNewsList,
  usePublicTestimonialsList,
} from './state/query';

export const useContent = () => {
  return {
    query: {
      cmsNews: useCmsNewsList,
      cmsNewsDetail: useCmsNewsDetail,
      cmsDocumentation: useCmsDocumentationList,
      cmsDocumentationDetail: useCmsDocumentationDetail,
      cmsTestimonials: useCmsTestimonialsList,
      news: usePublicNewsList,
      newsBySlug: usePublicNewsBySlug,
      documentation: usePublicDocumentationList,
      documentationBySlug: usePublicDocumentationBySlug,
      testimonials: usePublicTestimonialsList,
    },
    mutate: {
      createNews: useCreateNews,
      updateNews: useUpdateNews,
      updateNewsStatus: useUpdateNewsStatus,
      deleteNews: useDeleteNews,
      createDocumentation: useCreateDocumentation,
      updateDocumentation: useUpdateDocumentation,
      updateDocumentationStatus: useUpdateDocumentationStatus,
      deleteDocumentation: useDeleteDocumentation,
      updateTestimonialStatus: useUpdateTestimonialStatus,
      deleteTestimonial: useDeleteTestimonial,
      createTestimonial: useCreateTestimonial,
    },
  };
};

export default useContent;
