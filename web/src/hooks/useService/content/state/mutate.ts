import { queryKey } from '@/configs/query-key';
import { useAppMutation } from '@/hooks/_shared/useAppMutation';
import Api from '@/services/props.service';
import type {
  CreateDocumentationRequest,
  CreateNewsRequest,
  CreateTestimonialRequest,
  CreateTutorialRequest,
  DocumentationResponse,
  NewsResponse,
  TestimonialResponse,
  TutorialResponse,
  UpdateDocumentationRequest,
  UpdateDocumentationStatusRequest,
  UpdateNewsRequest,
  UpdateNewsStatusRequest,
  UpdateTestimonialStatusRequest,
  UpdateTutorialRequest,
  UpdateTutorialStatusRequest,
} from '@/types/service';
import { type ContentCacheContext, readContentSnapshot } from '@/utils/cache/content.cache';

export function useCreateNews() {
  return useAppMutation<NewsResponse, CreateNewsRequest, ContentCacheContext>({
    mutationFn: (body: CreateNewsRequest) => Api.content.CreateNewsService(body),
    invalidateKeys: [queryKey.contentRoot()],
    optimistic: (ns) => ({ previousNews: readContentSnapshot(ns) }),
  });
}

export function useUpdateNews() {
  return useAppMutation<NewsResponse, { id: string; body: UpdateNewsRequest }, ContentCacheContext>(
    {
      mutationFn: ({ id, body }: { id: string; body: UpdateNewsRequest }) =>
        Api.content.UpdateNewsService(id, body),
      invalidateKeys: [queryKey.contentRoot()],
    }
  );
}

export function useUpdateNewsStatus() {
  return useAppMutation<
    NewsResponse,
    { id: string; body: UpdateNewsStatusRequest },
    ContentCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateNewsStatusRequest }) =>
      Api.content.UpdateNewsStatusService(id, body),
    invalidateKeys: [queryKey.contentRoot()],
  });
}

export function useDeleteNews() {
  return useAppMutation<null, string, ContentCacheContext>({
    mutationFn: (id: string) => Api.content.DeleteNewsService(id),
    invalidateKeys: [queryKey.contentRoot()],
  });
}

export function useCreateDocumentation() {
  return useAppMutation<DocumentationResponse, CreateDocumentationRequest, ContentCacheContext>({
    mutationFn: (body: CreateDocumentationRequest) => Api.content.CreateDocumentationService(body),
    invalidateKeys: [queryKey.contentRoot()],
  });
}

export function useUpdateDocumentation() {
  return useAppMutation<
    DocumentationResponse,
    { id: string; body: UpdateDocumentationRequest },
    ContentCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateDocumentationRequest }) =>
      Api.content.UpdateDocumentationService(id, body),
    invalidateKeys: [queryKey.contentRoot()],
  });
}

export function useUpdateDocumentationStatus() {
  return useAppMutation<
    DocumentationResponse,
    { id: string; body: UpdateDocumentationStatusRequest },
    ContentCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateDocumentationStatusRequest }) =>
      Api.content.UpdateDocumentationStatusService(id, body),
    invalidateKeys: [queryKey.contentRoot()],
  });
}

export function useDeleteDocumentation() {
  return useAppMutation<null, string, ContentCacheContext>({
    mutationFn: (id: string) => Api.content.DeleteDocumentationService(id),
    invalidateKeys: [queryKey.contentRoot()],
  });
}

export function useCreateTutorial() {
  return useAppMutation<TutorialResponse, CreateTutorialRequest, ContentCacheContext>({
    mutationFn: (body: CreateTutorialRequest) => Api.content.CreateTutorialService(body),
    invalidateKeys: [queryKey.contentRoot()],
  });
}

export function useUpdateTutorial() {
  return useAppMutation<
    TutorialResponse,
    { id: string; body: UpdateTutorialRequest },
    ContentCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateTutorialRequest }) =>
      Api.content.UpdateTutorialService(id, body),
    invalidateKeys: [queryKey.contentRoot()],
  });
}

export function useUpdateTutorialStatus() {
  return useAppMutation<
    TutorialResponse,
    { id: string; body: UpdateTutorialStatusRequest },
    ContentCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateTutorialStatusRequest }) =>
      Api.content.UpdateTutorialStatusService(id, body),
    invalidateKeys: [queryKey.contentRoot()],
  });
}

export function useDeleteTutorial() {
  return useAppMutation<null, string, ContentCacheContext>({
    mutationFn: (id: string) => Api.content.DeleteTutorialService(id),
    invalidateKeys: [queryKey.contentRoot()],
  });
}

export function useUpdateTestimonialStatus() {
  return useAppMutation<
    TestimonialResponse,
    { id: string; body: UpdateTestimonialStatusRequest },
    ContentCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateTestimonialStatusRequest }) =>
      Api.content.UpdateTestimonialStatusService(id, body),
    invalidateKeys: [queryKey.contentRoot()],
  });
}

export function useDeleteTestimonial() {
  return useAppMutation<null, string, ContentCacheContext>({
    mutationFn: (id: string) => Api.content.DeleteTestimonialService(id),
    invalidateKeys: [queryKey.contentRoot()],
  });
}

export function useCreateTestimonial() {
  return useAppMutation<TestimonialResponse, CreateTestimonialRequest, ContentCacheContext>({
    mutationFn: (body: CreateTestimonialRequest) => Api.content.CreateTestimonialService(body),
    invalidateKeys: [queryKey.contentRoot()],
  });
}
