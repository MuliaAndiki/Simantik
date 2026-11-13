import { AdminEndpoint } from './state/AdminEndpoint';
import { AuthEndpoint } from './state/AuthEndpoint';
import { ContentEndpoint } from './state/ContentEndpoint';
import { EvaluationEndpoint } from './state/EvaluationEndpoint';
import { GeoEndpoint } from './state/GeoEndpoint';
import { LearningEndpoint } from './state/LearningEndpoint';
import { NotificationEndpoint } from './state/NotificationEndpoint';
import { PracticeEndpoint } from './state/PracticeEndpoint';
import { QuestionEndpoint } from './state/QuestionEndpoint';
import { RecommendationEndpoint } from './state/RecommendationEndpoint';
import { ReportingEndpoint } from './state/ReportingEndpoint';
import { SchoolEndpoint } from './state/SchoolEndpoint';
import { StimulusEndpoint } from './state/StimulusEndpoint';
import { TryoutEndpoint } from './state/TryoutEndpoint';
import { UserEndpoint } from './state/UserEndpoint';

export const EndpointEntry = {
  admin: AdminEndpoint,
  auth: AuthEndpoint,
  content: ContentEndpoint,
  evaluation: EvaluationEndpoint,
  geo: GeoEndpoint,
  learning: LearningEndpoint,
  notification: NotificationEndpoint,
  practice: PracticeEndpoint,
  question: QuestionEndpoint,
  recommendation: RecommendationEndpoint,
  reporting: ReportingEndpoint,
  school: SchoolEndpoint,
  stimulus: StimulusEndpoint,
  tryout: TryoutEndpoint,
  user: UserEndpoint,
} as const;
