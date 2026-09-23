import { useQuery } from '@tanstack/react-query';
import { queryKey } from '@/configs/query-key';
import Api from '@/services/props.service';
import type {
  ListDocumentationFilter,
  ListNewsFilter,
  ListTestimonialFilter,
} from '@/types/service';

export function useCmsNewsList(query?: ListNewsFilter, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.content.cmsNews(query),
    queryFn: async () => {
      const res = await Api.content.ListNewsAdminService(query);
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function useCmsNewsDetail(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.content.cmsNewsDetail(id),
    queryFn: async () => {
      const res = await Api.content.GetNewsByIdService(id);
      return res.data;
    },
    enabled: !!id && (options?.enabled ?? true),
  });
}

export function useCmsDocumentationList(
  query?: ListDocumentationFilter,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKey.content.cmsDocumentation(query),
    queryFn: async () => {
      const res = await Api.content.ListDocumentationAdminService(query);
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function useCmsDocumentationDetail(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.content.cmsDocumentationDetail(id),
    queryFn: async () => {
      const res = await Api.content.GetDocumentationByIdService(id);
      return res.data;
    },
    enabled: !!id && (options?.enabled ?? true),
  });
}

export function useCmsTestimonialsList(
  query?: ListTestimonialFilter,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKey.content.cmsTestimonials(query),
    queryFn: async () => {
      const res = await Api.content.ListTestimonialsAdminService(query);
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function usePublicNewsList(query?: ListNewsFilter, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.content.news(query),
    queryFn: async () => {
      const res = await Api.content.ListNewsPublicService(query);
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function usePublicNewsBySlug(slug: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.content.newsBySlug(slug),
    queryFn: async () => {
      const res = await Api.content.GetNewsBySlugService(slug);
      return res.data;
    },
    enabled: !!slug && (options?.enabled ?? true),
  });
}

export function usePublicDocumentationList(
  query?: ListDocumentationFilter,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKey.content.documentation(query),
    queryFn: async () => {
      const res = await Api.content.ListDocumentationPublicService(query);
      return res.data;
    },
    enabled: options?.enabled,
  });
}

export function usePublicDocumentationBySlug(slug: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.content.documentationBySlug(slug),
    queryFn: async () => {
      const res = await Api.content.GetDocumentationBySlugService(slug);
      return res.data;
    },
    enabled: !!slug && (options?.enabled ?? true),
  });
}

export function usePublicTestimonialsList(
  query?: ListTestimonialFilter,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKey.content.testimonials(query),
    queryFn: async () => {
      const res = await Api.content.ListTestimonialsPublicService(query);
      return res.data;
    },
    enabled: options?.enabled,
  });
}
