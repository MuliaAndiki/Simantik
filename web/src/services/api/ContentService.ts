import { Api } from '@/api/api-entry';
import type { TResponse } from '@/api/types/response.types';
import { EndpointEntry } from '@/configs/endpoints/EndpointEntry';
import type {
  CreateDocumentationRequest,
  CreateNewsRequest,
  CreateTestimonialRequest,
  CreateTutorialRequest,
  DocumentationResponse,
  ListDocumentationFilter,
  ListNewsFilter,
  ListTestimonialFilter,
  ListTutorialFilter,
  NewsResponse,
  PaginatedDocumentationResponse,
  PaginatedNewsResponse,
  PaginatedTestimonialsResponse,
  PaginatedTutorialsResponse,
  TestimonialMyStatusResponse,
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
import { buildQueryString } from '@/utils/query-string.util';
import { toServiceResponse } from '@/utils/service.respone';

const getHttp = () => (typeof window === 'undefined' ? Api().server : Api().client);

class ContentService {
  // CMS News
  public async CreateNewsService(payload: CreateNewsRequest): Promise<TResponse<NewsResponse>> {
    const res = await getHttp().PostResponse<NewsResponse>(EndpointEntry.content.cmsNews, payload);
    return toServiceResponse(res, {
      message: res.message,
      statusCode: 201,
    });
  }

  public async ListNewsAdminService(
    filter?: ListNewsFilter
  ): Promise<TResponse<PaginatedNewsResponse>> {
    const url = buildQueryString(EndpointEntry.content.cmsNews, filter as Record<string, unknown>);
    const res = await getHttp().GetResponse<PaginatedNewsResponse>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetNewsByIdService(id: string): Promise<TResponse<NewsResponse>> {
    const res = await getHttp().GetResponse<NewsResponse>(EndpointEntry.content.cmsNewsDetail(id));
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async UpdateNewsService(
    id: string,
    payload: UpdateNewsRequest
  ): Promise<TResponse<NewsResponse>> {
    const res = await getHttp().PatchResponse<NewsResponse>(
      EndpointEntry.content.cmsNewsDetail(id),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async UpdateNewsStatusService(
    id: string,
    payload: UpdateNewsStatusRequest
  ): Promise<TResponse<NewsResponse>> {
    const res = await getHttp().PatchResponse<NewsResponse>(
      EndpointEntry.content.cmsNewsStatus(id),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async DeleteNewsService(id: string): Promise<TResponse<null>> {
    const res = await getHttp().DeleteResponse<null>(EndpointEntry.content.cmsNewsDetail(id));
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  // CMS Documentation
  public async CreateDocumentationService(
    payload: CreateDocumentationRequest
  ): Promise<TResponse<DocumentationResponse>> {
    const res = await getHttp().PostResponse<DocumentationResponse>(
      EndpointEntry.content.cmsDocumentation,
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
      statusCode: 201,
    });
  }

  public async ListDocumentationAdminService(
    filter?: ListDocumentationFilter
  ): Promise<TResponse<PaginatedDocumentationResponse>> {
    const url = buildQueryString(
      EndpointEntry.content.cmsDocumentation,
      filter as Record<string, unknown>
    );
    const res = await getHttp().GetResponse<PaginatedDocumentationResponse>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetDocumentationByIdService(id: string): Promise<TResponse<DocumentationResponse>> {
    const res = await getHttp().GetResponse<DocumentationResponse>(
      EndpointEntry.content.cmsDocumentationDetail(id)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async UpdateDocumentationService(
    id: string,
    payload: UpdateDocumentationRequest
  ): Promise<TResponse<DocumentationResponse>> {
    const res = await getHttp().PatchResponse<DocumentationResponse>(
      EndpointEntry.content.cmsDocumentationDetail(id),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async UpdateDocumentationStatusService(
    id: string,
    payload: UpdateDocumentationStatusRequest
  ): Promise<TResponse<DocumentationResponse>> {
    const res = await getHttp().PatchResponse<DocumentationResponse>(
      EndpointEntry.content.cmsDocumentationStatus(id),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async DeleteDocumentationService(id: string): Promise<TResponse<null>> {
    const res = await getHttp().DeleteResponse<null>(
      EndpointEntry.content.cmsDocumentationDetail(id)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetDocumentationCategoriesService(): Promise<TResponse<string[]>> {
    const res = await getHttp().GetResponse<string[]>(
      EndpointEntry.content.cmsDocumentationCategories
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  // CMS Tutorials
  public async CreateTutorialService(
    payload: CreateTutorialRequest
  ): Promise<TResponse<TutorialResponse>> {
    const res = await getHttp().PostResponse<TutorialResponse>(
      EndpointEntry.content.cmsTutorials,
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
      statusCode: 201,
    });
  }

  public async ListTutorialsCMSService(
    filter?: ListTutorialFilter
  ): Promise<TResponse<PaginatedTutorialsResponse>> {
    const url = buildQueryString(
      EndpointEntry.content.cmsTutorials,
      filter as Record<string, unknown>
    );
    const res = await getHttp().GetResponse<PaginatedTutorialsResponse>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetTutorialDetailService(id: string): Promise<TResponse<TutorialResponse>> {
    const res = await getHttp().GetResponse<TutorialResponse>(
      EndpointEntry.content.cmsTutorialDetail(id)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async UpdateTutorialService(
    id: string,
    payload: UpdateTutorialRequest
  ): Promise<TResponse<TutorialResponse>> {
    const res = await getHttp().PatchResponse<TutorialResponse>(
      EndpointEntry.content.cmsTutorialDetail(id),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async UpdateTutorialStatusService(
    id: string,
    payload: UpdateTutorialStatusRequest
  ): Promise<TResponse<TutorialResponse>> {
    const res = await getHttp().PatchResponse<TutorialResponse>(
      EndpointEntry.content.tutorialStatus(id),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async DeleteTutorialService(id: string): Promise<TResponse<null>> {
    const res = await getHttp().DeleteResponse<null>(EndpointEntry.content.cmsTutorialDetail(id));
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetTutorialCategoriesService(): Promise<TResponse<string[]>> {
    const res = await getHttp().GetResponse<string[]>(EndpointEntry.content.cmsTutorialCategories);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  // CMS Testimonials
  public async ListTestimonialsAdminService(
    filter?: ListTestimonialFilter
  ): Promise<TResponse<PaginatedTestimonialsResponse>> {
    const url = buildQueryString(
      EndpointEntry.content.cmsTestimonials,
      filter as Record<string, unknown>
    );
    const res = await getHttp().GetResponse<PaginatedTestimonialsResponse>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async UpdateTestimonialStatusService(
    id: string,
    payload: UpdateTestimonialStatusRequest
  ): Promise<TResponse<TestimonialResponse>> {
    const res = await getHttp().PatchResponse<TestimonialResponse>(
      EndpointEntry.content.cmsTestimonialStatus(id),
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async DeleteTestimonialService(id: string): Promise<TResponse<null>> {
    const res = await getHttp().DeleteResponse<null>(
      EndpointEntry.content.cmsTestimonialDelete(id)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  // Public Content
  public async ListNewsPublicService(
    filter?: ListNewsFilter
  ): Promise<TResponse<PaginatedNewsResponse>> {
    const url = buildQueryString(EndpointEntry.content.news, filter as Record<string, unknown>);
    const res = await getHttp().PublicGetResponse<PaginatedNewsResponse>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetNewsBySlugService(slug: string): Promise<TResponse<NewsResponse>> {
    const res = await getHttp().PublicGetResponse<NewsResponse>(
      EndpointEntry.content.newsBySlug(slug)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async ListDocumentationPublicService(
    filter?: ListDocumentationFilter
  ): Promise<TResponse<PaginatedDocumentationResponse>> {
    const url = buildQueryString(
      EndpointEntry.content.documentation,
      filter as Record<string, unknown>
    );
    const res = await getHttp().PublicGetResponse<PaginatedDocumentationResponse>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetDocumentationBySlugService(
    slug: string
  ): Promise<TResponse<DocumentationResponse>> {
    const res = await getHttp().PublicGetResponse<DocumentationResponse>(
      EndpointEntry.content.documentationBySlug(slug)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async ListTutorialsPublicService(
    filter?: ListTutorialFilter
  ): Promise<TResponse<PaginatedTutorialsResponse>> {
    const url = buildQueryString(
      EndpointEntry.content.tutorials,
      filter as Record<string, unknown>
    );
    const res = await getHttp().PublicGetResponse<PaginatedTutorialsResponse>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetTutorialBySlugService(slug: string): Promise<TResponse<TutorialResponse>> {
    const res = await getHttp().PublicGetResponse<TutorialResponse>(
      EndpointEntry.content.tutorialBySlug(slug)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async ListTestimonialsPublicService(
    filter?: ListTestimonialFilter
  ): Promise<TResponse<PaginatedTestimonialsResponse>> {
    const url = buildQueryString(
      EndpointEntry.content.testimonials,
      filter as Record<string, unknown>
    );
    const res = await getHttp().PublicGetResponse<PaginatedTestimonialsResponse>(url);
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async CreateTestimonialService(
    payload: CreateTestimonialRequest
  ): Promise<TResponse<TestimonialResponse>> {
    const res = await getHttp().PostResponse<TestimonialResponse>(
      EndpointEntry.content.testimonials,
      payload
    );
    return toServiceResponse(res, {
      message: res.message,
      statusCode: 201,
    });
  }

  public async GetMyTestimonialStatusService(): Promise<TResponse<TestimonialMyStatusResponse>> {
    const res = await getHttp().GetResponse<TestimonialMyStatusResponse>(
      EndpointEntry.content.myTestimonialStatus
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }
}

export default new ContentService();
