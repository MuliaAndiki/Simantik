import { useAdmin } from "./useService/admin/useAdmin";
import { useAuth } from "./useService/auth/useAuth";
import { useContent } from "./useService/content/useContent";
import { useEvaluation } from "./useService/evaluation/useEvaluation";
import { useLearning } from "./useService/learning/useLearning";
import { useNotification } from "./useService/notification/useNotification";
import { useQuestion } from "./useService/question/useQuestion";
import { useRecommendation } from "./useService/recommendation/useRecommendation";
import { useReporting } from "./useService/reporting/useReporting";
import { useTryout } from "./useService/tryout/useTryout";
import { useUser } from "./useService/user/useUser";

export function useApi() {
  return {
    admin: useAdmin(),
    auth: useAuth(),
    content: useContent(),
    evaluation: useEvaluation(),
    learning: useLearning(),
    notification: useNotification(),
    question: useQuestion(),
    recommendation: useRecommendation(),
    reporting: useReporting(),
    tryout: useTryout(),
    user: useUser(),
  };
}

export default useApi;
