import { useMutation } from '@tanstack/react-query';
import type { TResponse } from '@/api/types/response.types';
import { queryKey } from '@/configs/query-key';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/props.service';
import type {
  CreateDocumentationRequest,
  CreateNewsRequest,
  CreateTestimonialRequest,
  DocumentationResponse,
  NewsResponse,
  TestimonialResponse,
  UpdateDocumentationRequest,
  UpdateDocumentationStatusRequest,
  UpdateNewsRequest,
  UpdateNewsStatusRequest,
  UpdateTestimonialStatusRequest,
} from '@/types/service';
import { type ContentCacheContext, readContentSnapshot } from '@/utils/cache/content.cache';
import { ResponseTitles } from '@/utils/response-titles';

export function useCreateNews() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<NewsResponse>, Error, CreateNewsRequest, ContentCacheContext>({
    mutationFn: (body: CreateNewsRequest) => Api.content.CreateNewsService(body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.contentRoot(),
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: queryKey.contentRoot(),
      });
      const previousNews = readContentSnapshot(ns);
      return { previousNews };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useUpdateNews() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<NewsResponse>,
    Error,
    { id: string; body: UpdateNewsRequest },
    ContentCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateNewsRequest }) =>
      Api.content.UpdateNewsService(id, body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.contentRoot(),
      });
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useUpdateNewsStatus() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<NewsResponse>,
    Error,
    { id: string; body: UpdateNewsStatusRequest },
    ContentCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateNewsStatusRequest }) =>
      Api.content.UpdateNewsStatusService(id, body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.contentRoot(),
      });
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useDeleteNews() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<null>, Error, string, ContentCacheContext>({
    mutationFn: (id: string) => Api.content.DeleteNewsService(id),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.contentRoot(),
      });
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useCreateDocumentation() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<DocumentationResponse>,
    Error,
    CreateDocumentationRequest,
    ContentCacheContext
  >({
    mutationFn: (body: CreateDocumentationRequest) => Api.content.CreateDocumentationService(body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.contentRoot(),
      });
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useUpdateDocumentation() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<DocumentationResponse>,
    Error,
    { id: string; body: UpdateDocumentationRequest },
    ContentCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateDocumentationRequest }) =>
      Api.content.UpdateDocumentationService(id, body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.contentRoot(),
      });
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useUpdateDocumentationStatus() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<DocumentationResponse>,
    Error,
    { id: string; body: UpdateDocumentationStatusRequest },
    ContentCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateDocumentationStatusRequest }) =>
      Api.content.UpdateDocumentationStatusService(id, body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.contentRoot(),
      });
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useDeleteDocumentation() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<null>, Error, string, ContentCacheContext>({
    mutationFn: (id: string) => Api.content.DeleteDocumentationService(id),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.contentRoot(),
      });
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useUpdateTestimonialStatus() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<TestimonialResponse>,
    Error,
    { id: string; body: UpdateTestimonialStatusRequest },
    ContentCacheContext
  >({
    mutationFn: ({ id, body }: { id: string; body: UpdateTestimonialStatusRequest }) =>
      Api.content.UpdateTestimonialStatusService(id, body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.contentRoot(),
      });
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useDeleteTestimonial() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<null>, Error, string, ContentCacheContext>({
    mutationFn: (id: string) => Api.content.DeleteTestimonialService(id),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.contentRoot(),
      });
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useCreateTestimonial() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<TestimonialResponse>,
    Error,
    CreateTestimonialRequest,
    ContentCacheContext
  >({
    mutationFn: (body: CreateTestimonialRequest) => Api.content.CreateTestimonialService(body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.contentRoot(),
      });
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}
