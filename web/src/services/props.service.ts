import { WrapApi } from '@/utils/wrapApi';
import AdminService from './api/AdminService';
import AuthService from './api/AuthService';
import ContentService from './api/ContentService';
import EvaluationService from './api/EvaluationService';
import LearningService from './api/LearningService';
import NotificationService from './api/NotificationService';
import QuestionService from './api/QuestionService';
import RecommendationService from './api/RecommendationService';
import ReportingService from './api/ReportingService';
import SchoolService from './api/SchoolService';
import TryoutService from './api/TryoutService';
import UserService from './api/UserService';

const wrappedAuth = WrapApi(AuthService);
const wrappedUser = WrapApi(UserService);
const wrappedAdmin = WrapApi(AdminService);
const wrappedQuestion = WrapApi(QuestionService);
const wrappedTryout = WrapApi(TryoutService);
const wrappedEvaluation = WrapApi(EvaluationService);
const wrappedRecommendation = WrapApi(RecommendationService);
const wrappedLearning = WrapApi(LearningService);
const wrappedContent = WrapApi(ContentService);
const wrappedNotification = WrapApi(NotificationService);
const wrappedReporting = WrapApi(ReportingService);
const wrappedSchool = WrapApi(SchoolService);

export const Api = {
  auth: wrappedAuth,
  user: wrappedUser,
  admin: wrappedAdmin,
  question: wrappedQuestion,
  tryout: wrappedTryout,
  evaluation: wrappedEvaluation,
  recommendation: wrappedRecommendation,
  learning: wrappedLearning,
  content: wrappedContent,
  notification: wrappedNotification,
  reporting: wrappedReporting,
  school: wrappedSchool,

  Auth: wrappedAuth,
  User: wrappedUser,
  Admin: wrappedAdmin,
  Question: wrappedQuestion,
  Tryout: wrappedTryout,
  Evaluation: wrappedEvaluation,
  Recommendation: wrappedRecommendation,
  Learning: wrappedLearning,
  Content: wrappedContent,
  Notification: wrappedNotification,
  Reporting: wrappedReporting,
  School: wrappedSchool,
};

export default Api;
