import { AdminEndpoint } from './state/AdminEndpoint';
import { AuthEndpoint } from './state/AuthEndpoint';
import { ContentEndpoint } from './state/ContentEndpoint';
import { EvaluationEndpoint } from './state/EvaluationEndpoint';
import { LearningEndpoint } from './state/LearningEndpoint';
import { NotificationEndpoint } from './state/NotificationEndpoint';
import { QuestionEndpoint } from './state/QuestionEndpoint';
import { RecommendationEndpoint } from './state/RecommendationEndpoint';
import { ReportingEndpoint } from './state/ReportingEndpoint';
import { TryoutEndpoint } from './state/TryoutEndpoint';
import { UserEndpoint } from './state/UserEndpoint';

export const EndpointEntry = {
  admin: AdminEndpoint,
  auth: AuthEndpoint,
  content: ContentEndpoint,
  evaluation: EvaluationEndpoint,
  learning: LearningEndpoint,
  notification: NotificationEndpoint,
  question: QuestionEndpoint,
  recommendation: RecommendationEndpoint,
  reporting: ReportingEndpoint,
  tryout: TryoutEndpoint,
  user: UserEndpoint,
} as const;
