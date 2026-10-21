import { useAdmin } from './useService/admin/useAdmin';
import { useAuth } from './useService/auth/useAuth';
import { useContent } from './useService/content/useContent';
import { useEvaluation } from './useService/evaluation/useEvaluation';
import { useLearning } from './useService/learning/useLearning';
import { useNotification } from './useService/notification/useNotification';
import { usePractice } from './useService/practice/usePractice';
import { useQuestion } from './useService/question/useQuestion';
import { useRecommendation } from './useService/recommendation/useRecommendation';
import { useReporting } from './useService/reporting/useReporting';
import { useSchool } from './useService/school/useSchool';
import { useStimulus } from './useService/stimulus/useStimulus';
import { useTryout } from './useService/tryout/useTryout';
import { useUser } from './useService/user/useUser';

export function useApi() {
  return {
    admin: useAdmin(),
    auth: useAuth(),
    content: useContent(),
    evaluation: useEvaluation(),
    learning: useLearning(),
    notification: useNotification(),
    practice: usePractice(),
    question: useQuestion(),
    recommendation: useRecommendation(),
    reporting: useReporting(),
    school: useSchool(),
    stimulus: useStimulus(),
    tryout: useTryout(),
    user: useUser(),
  };
}

export default useApi;
