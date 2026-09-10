import { Api } from '@/api/api-entry';
import type { TResponse } from '@/api/types/response.types';
import { EndpointEntry } from '@/configs/endpoints/EndpointEntry';
import type {
  AdminOverviewAnalyticsResponse,
  CompetencyAnalyticsResponse,
  DifficultyAnalyticsResponse,
  QuestionItemAnalysisResponse,
  StudentReportCardResponse,
  TryoutAnalyticsResponse,
} from '@/types/service';
import { toServiceResponse } from '@/utils/service.respone';

const getHttp = () => (typeof window === 'undefined' ? Api().server : Api().client);

class ReportingService {
  public async GetStudentReportCardService(): Promise<TResponse<StudentReportCardResponse>> {
    const res = await getHttp().GetResponse<StudentReportCardResponse>(
      EndpointEntry.reporting.studentReportCard
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetAdminOverviewService(): Promise<TResponse<AdminOverviewAnalyticsResponse>> {
    const res = await getHttp().GetResponse<AdminOverviewAnalyticsResponse>(
      EndpointEntry.reporting.adminOverview
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetTryoutAnalyticsService(id: string): Promise<TResponse<TryoutAnalyticsResponse>> {
    const res = await getHttp().GetResponse<TryoutAnalyticsResponse>(
      EndpointEntry.reporting.tryoutAnalytics(id)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetQuestionAnalyticsService(
    id: string
  ): Promise<TResponse<QuestionItemAnalysisResponse>> {
    const res = await getHttp().GetResponse<QuestionItemAnalysisResponse>(
      EndpointEntry.reporting.questionAnalytics(id)
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetCompetenciesAnalyticsService(): Promise<TResponse<CompetencyAnalyticsResponse>> {
    const res = await getHttp().GetResponse<CompetencyAnalyticsResponse>(
      EndpointEntry.reporting.competencyAnalytics
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }

  public async GetDifficultyAnalyticsService(): Promise<TResponse<DifficultyAnalyticsResponse>> {
    const res = await getHttp().GetResponse<DifficultyAnalyticsResponse>(
      EndpointEntry.reporting.difficultyAnalytics
    );
    return toServiceResponse(res, {
      message: res.message,
    });
  }
}

export default new ReportingService();
